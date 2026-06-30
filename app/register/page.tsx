"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { authApi } from "@/app/_lib/api";

const tiers = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    features: ["1 brand tracked", "5 prompts", "3 competitors", "Weekly refresh"],
  },
  {
    id: "professional",
    name: "Professional",
    price: "$415/mo",
    yearly: "$4,980/yr",
    features: ["1 brand", "25 prompts", "10 competitors", "Daily refresh", "All report sections", "Email support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$1,040/mo",
    yearly: "$12,480/yr",
    features: ["5 brands", "100 prompts/brand", "Unlimited competitors", "Daily + on-demand refresh", "Multi-brand dashboard", "PDF export", "Priority support"],
  },
];

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [tier, setTier] = useState("starter");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.register(email, password, tier);
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create your Luminos account</CardTitle>
          <CardDescription>Start dominating AI search visibility</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
            </div>
            <div className="space-y-3 pt-2">
              <Label>Select your plan</Label>
              <div className="grid gap-3">
                {tiers.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setTier(t.id)}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      tier === t.id ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${tier === t.id ? "border-blue-600 bg-blue-600" : "border-gray-300"}`} />
                        <span className="font-medium text-gray-900">{t.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{t.price}</span>
                    </div>
                    <ul className="mt-2 ml-6 text-xs text-gray-600 space-y-0.5">
                      {t.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-600" />{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}