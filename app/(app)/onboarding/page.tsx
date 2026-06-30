"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2, Sparkles, ArrowRight, Check } from "lucide-react";
import { brandApi, authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import type { Brand } from "@/app/_lib/types";

const industries = ["B2B SaaS", "Cybersecurity", "Data Platforms", "MarTech", "Other"];

const tierLimits: Record<string, { maxPrompts: number; maxCompetitors: number }> = {
  starter: { maxPrompts: 5, maxCompetitors: 3 },
  professional: { maxPrompts: 25, maxCompetitors: 10 },
  enterprise: { maxPrompts: 100, maxCompetitors: Infinity },
};

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [brandName, setBrandName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [competitors, setCompetitors] = useState<{ name: string; website_url: string }[]>([]);
  const [newCompName, setNewCompName] = useState("");
  const [newCompUrl, setNewCompUrl] = useState("");
  const [prompts, setPrompts] = useState<string[]>([]);
  const [newPrompt, setNewPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, refresh } = useAuth();

  const limits = user ? tierLimits[user.tier] : tierLimits.starter;

  const canAddCompetitor = competitors.length < limits.maxCompetitors;
  const canAddPrompt = prompts.length < limits.maxPrompts;

  const addCompetitor = () => {
    if (newCompName && canAddCompetitor) {
      setCompetitors([...competitors, { name: newCompName, website_url: newCompUrl }]);
      setNewCompName("");
      setNewCompUrl("");
    }
  };

  const removeCompetitor = (idx: number) => {
    setCompetitors(competitors.filter((_, i) => i !== idx));
  };

  const addPrompt = () => {
    if (newPrompt.trim() && canAddPrompt) {
      setPrompts([...prompts, newPrompt.trim()]);
      setNewPrompt("");
    }
  };

  const removePrompt = (idx: number) => {
    setPrompts(prompts.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const brand = await brandApi.create({ name: brandName, website_url: websiteUrl, industry });
      for (const comp of competitors) {
        await brandApi.addCompetitor(brand.id, comp);
      }
      for (const p of prompts) {
        await brandApi.addPrompt(brand.id, p);
      }
      await refresh();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create brand");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900">Set up your brand</h2>
              <p className="text-gray-600 mt-2">Tell us about your company</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Brand name</Label>
                <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Acme Corp" required />
              </div>
              <div className="space-y-2">
                <Label>Website URL</Label>
                <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://acme.com" required />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full" onClick={() => setStep(2)} disabled={!brandName || !websiteUrl || !industry}>
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Add competitors</h2>
              <p className="text-gray-600 mt-2">Who are you benchmarking against?</p>
              <Badge variant="outline" className="mt-2">{competitors.length} / {limits.maxCompetitors}</Badge>
            </div>
            <div className="space-y-3">
              {competitors.map((comp, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{comp.name}</p>
                    <p className="text-sm text-gray-500">{comp.website_url}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeCompetitor(idx)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {canAddCompetitor && (
                <div className="grid gap-2">
                  <Input placeholder="Competitor name" value={newCompName} onChange={(e) => setNewCompName(e.target.value)} />
                  <Input placeholder="Website URL (optional)" value={newCompUrl} onChange={(e) => setNewCompUrl(e.target.value)} />
                  <Button variant="outline" onClick={addCompetitor} disabled={!newCompName}>
                    <Plus className="w-4 h-4 mr-2" /> Add competitor
                  </Button>
                </div>
              )}
              {!canAddCompetitor && (
                <p className="text-sm text-amber-600">Upgrade to add more competitors</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(3)}>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Add tracked prompts</h2>
              <p className="text-gray-600 mt-2">What searches do you want to monitor?</p>
              <Badge variant="outline" className="mt-2">{prompts.length} / {limits.maxPrompts}</Badge>
            </div>
            <div className="space-y-3">
              {prompts.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{p}</p>
                  <Button variant="ghost" size="icon" onClick={() => removePrompt(idx)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {canAddPrompt && (
                <div className="flex gap-2">
                  <Input placeholder='e.g., "best enterprise data platform"' value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPrompt())} />
                  <Button onClick={addPrompt} disabled={!newPrompt.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {!canAddPrompt && (
                <p className="text-sm text-amber-600">Upgrade to add more prompts</p>
              )}
            </div>
            <p className="text-sm text-gray-500">Add search queries where you want to see how your brand compares to competitors in AI results.</p>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={loading || prompts.length === 0}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Setting up...</> : <><Check className="w-4 h-4 mr-2" /> Complete setup</>}
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>{s}</div>
            ))}
          </div>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>
    </div>
  );
}