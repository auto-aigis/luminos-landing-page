"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LucideIcon, TrendingUp, TrendingDown, Minus, AlertTriangle, BookOpen, Link2, Users, Search, Lightbulb, Lock } from "lucide-react";
import Link from "next/link";

interface ReportSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
  tierLocked?: boolean;
  tier?: string;
}

export function ReportSection({ title, description, icon: Icon, children, tierLocked, tier }: ReportSectionProps) {
  if (tierLocked) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center py-12">
          <Lock className="w-10 h-10 text-gray-400 mx-auto mb-4" />
          <CardTitle className="text-gray-700">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <Button asChild className="mt-4">
            <Link href="/pricing">Upgrade to unlock</Link>
          </Button>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function MetricCard({ label, value, subtext, trend }: { label: string; value: string | number; subtext?: string; trend?: "up" | "down" | "neutral" }) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-600">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {trend && <TrendIcon className={`w-4 h-4 ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-400"}`} />}
      </div>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
}

export function InsightBox({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warning" | "success" }) {
  const colors = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    success: "bg-green-50 border-green-200 text-green-800",
  };
  return <div className={`p-3 rounded-lg border text-sm ${colors[type]}`}>{children}</div>;
}

export function LockedPlaceholder() {
  return (
    <div className="text-center py-8 text-gray-500">
      <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
      <p>Upgrade to Professional or Enterprise to unlock</p>
    </div>
  );
}