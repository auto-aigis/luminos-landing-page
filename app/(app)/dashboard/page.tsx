"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { brandApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import type { Brand, ReportData } from "@/app/_lib/types";
import { ReportSection, MetricCard, InsightBox } from "@/app/(app)/dashboard/_components/ReportSection";
import { Search, Users, BookOpen, Link2, BarChart3, Lightbulb, RefreshCw, Loader2, Crown, Sparkles } from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, refresh } = useAuth();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);

  const checkoutSuccess = searchParams.get("checkout") === "success";
  const transactionId = searchParams.get("transaction_id");

  useEffect(() => {
    async function loadData() {
      try {
        const brandList = await brandApi.list();
        if (brandList.length > 0) {
          const b = brandList[0];
          setBrand(b);
          const [rep, run] = await Promise.all([brandApi.getReport(b.id), brandApi.latestRun(b.id)]);
          setReport(rep);
          if (run.completed_at) setLastRun(run.completed_at);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (checkoutSuccess && transactionId && brand) {
      async function verify() {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/paddle/verify-transaction`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transaction_id: transactionId }),
          });
          await refresh();
          router.replace("/dashboard");
        } catch {}
      }
      verify();
    }
  }, [checkoutSuccess, transactionId, brand, router, refresh]);

  const handleRun = async () => {
    if (!brand) return;
    setRunning(true);
    try {
      await brandApi.triggerRun(brand.id);
      const run = await brandApi.latestRun(brand.id);
      if (run.completed_at) setLastRun(run.completed_at);
      const rep = await brandApi.getReport(brand.id);
      setReport(rep);
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  const tierLockedSections = report?.tier_locked_sections || [];
  const tier = user?.tier || "starter";

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <div className="grid md:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="text-center py-16">
        <Sparkles className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Luminos</h2>
        <p className="text-gray-600 mb-6">Set up your first brand to start tracking AI visibility</p>
        <Button asChild>
          <Link href="/onboarding">Add your brand</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{brand.name}</h1>
          <p className="text-gray-600">{brand.industry}</p>
        </div>
        <div className="flex items-center gap-3">
          {tier !== "starter" && <Crown className="w-5 h-5 text-amber-500" />}
          <Badge variant={tier === "enterprise" ? "default" : tier === "professional" ? "secondary" : "outline"}>
            {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </Badge>
          <Button onClick={handleRun} disabled={running}>
            {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {running ? "Running..." : "Refresh"}
          </Button>
        </div>
      </div>

      {lastRun && <p className="text-sm text-gray-500">Last updated: {new Date(lastRun).toLocaleString()}</p>}

      <div className="grid md:grid-cols-3 gap-4">
        <MetricCard label="AI Visibility Score" value={report?.visibility_score !== null ? `${report?.visibility_score}%` : "--"} subtext="Brand mentioned in AI responses" trend={report && report.visibility_score && report.visibility_score > 50 ? "up" : "neutral"} />
        <MetricCard label="Tracked Prompts" value={brand.prompts_count} subtext={`${report?.prompt_coverage?.mentioned?.length || 0} triggered mentions`} />
        <MetricCard label="Competitors" value={brand.competitors_count} />
      </div>

      <ReportSection title="Share of Voice" description="Brand vs. competitors across all tracked prompts" icon={Users} tierLocked={tierLockedSections.includes("share_of_voice")} tier={tier}>
        {report?.share_of_voice ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-gray-900">{brand.name}</span>
              <span className="text-xl font-bold text-blue-600">{report.share_of_voice.brand}%</span>
            </div>
            {Object.entries(report.share_of_voice.competitors).map(([name, pct]) => (
              <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">{name}</span>
                <span className="text-lg font-semibold text-gray-600">{pct}%</span>
              </div>
            ))}
            <InsightBox>Your brand has {report.share_of_voice.brand}% of all mentions. To improve, focus on prompts where you&apos;re under-represented.</InsightBox>
          </div>
        ) : (
          <p className="text-gray-500">Run your first query to see share of voice data.</p>
        )}
      </ReportSection>

      <ReportSection title="Prompt Coverage Analysis" description="Which prompts trigger brand mentions" icon={Search}>
        {report?.prompt_coverage ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-700 mb-2">Mentioned ({report.prompt_coverage.mentioned.length})</h4>
              <ul className="space-y-1">
                {report.prompt_coverage.mentioned.map((p) => (
                  <li key={p} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />{p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-amber-700 mb-2">Not mentioned ({report.prompt_coverage.not_mentioned.length})</h4>
              <ul className="space-y-1">
                {report.prompt_coverage.not_mentioned.map((p) => (
                  <li key={p} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />{p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Run queries to see prompt coverage.</p>
        )}
      </ReportSection>

      <ReportSection title="Brand Perception Summary" description="How AI describes your brand" icon={BookOpen} tierLocked={tierLockedSections.includes("brand_perception")} tier={tier}>
        {report?.brand_perception ? (
          <div>
            <p className="text-gray-700">{report.brand_perception}</p>
            <InsightBox type="info">This summary is based on how your brand is framed when mentioned in AI responses.</InsightBox>
          </div>
        ) : (
          <p className="text-gray-500">Run queries to see perception analysis.</p>
        )}
      </ReportSection>

      <ReportSection title="Citation Analysis" description="Sources AI cites when mentioning your brand" icon={Link2} tierLocked={tierLockedSections.includes("citation_analysis")} tier={tier}>
        {report?.citation_analysis ? (
          <div>
            <ul className="space-y-2">
              {report.citation_analysis.sources.map((src, i) => (
                <li key={i} className="text-sm">
                  <a href={src} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                    {src}
                  </a>
                </li>
              ))}
            </ul>
            <InsightBox>These are the sources most frequently cited when AI mentions your brand.</InsightBox>
          </div>
        ) : (
          <p className="text-gray-500">Run queries to see citation analysis.</p>
        )}
      </ReportSection>

      <ReportSection title="Competitor Visibility Comparison" description="Side-by-side share of voice" icon={BarChart3} tierLocked={tierLockedSections.includes("competitor_comparison")} tier={tier}>
        {report?.competitor_comparison ? (
          <div className="space-y-3">
            {[...report.competitor_comparison, { competitor: brand.name, visibility: report.share_of_voice?.brand || 0 }].sort((a, b) => b.visibility - a.visibility).map((c) => (
              <div key={c.competitor} className="flex items-center gap-3">
                <span className="w-32 text-sm text-gray-700">{c.competitor}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${c.competitor === brand.name ? "bg-blue-600" : "bg-gray-400"}`} style={{ width: `${c.visibility}%` }} />
                </div>
                <span className="w-12 text-sm text-gray-600 text-right">{c.visibility}%</span>
              </div>
            ))}
            <InsightBox>Compare your visibility against each competitor to identify gaps.</InsightBox>
          </div>
        ) : (
          <p className="text-gray-500">Run queries to see competitor comparison.</p>
        )}
      </ReportSection>

      <ReportSection title="Knowledge Gap Analysis" description="Opportunities where competitors appear but you don't" icon={Lightbulb} tierLocked={tierLockedSections.includes("knowledge_gaps")} tier={tier}>
        {report?.knowledge_gaps && report.knowledge_gaps.length > 0 ? (
          <div className="space-y-3">
            {report.knowledge_gaps.map((gap, i) => (
              <div key={i} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-medium text-gray-900 mb-1">{gap.prompt}</p>
                <p className="text-sm text-amber-700">Competitors mentioned: {gap.competitors_mentioned.join(", ")}</p>
              </div>
            ))}
            <InsightBox type="warning">These are high-value opportunities where you can capture demand by appearing in AI responses.</InsightBox>
          </div>
        ) : (
          <p className="text-gray-500">No knowledge gaps detected. Great job!</p>
        )}
      </ReportSection>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}