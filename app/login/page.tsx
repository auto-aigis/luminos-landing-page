"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/app/_components/AuthProvider";
import { authApi } from "@/app/_lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const router = useRouter();
  const { refresh } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUnverified(false);
    setLoading(true);
    try {
      const user = await authApi.login(email, password);
      await refresh();
      router.push(user.onboarding_completed ? "/dashboard" : "/onboarding");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      if (msg === "email_not_verified") {
        setUnverified(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authApi.resendVerification(email);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch {
      setError("Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign in to Luminos</CardTitle>
          <CardDescription>Access your AI visibility dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {unverified && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">Please verify your email address.</p>
                <Button type="button" variant="link" className="h-auto p-0 text-amber-800" onClick={handleResend} disabled={resending}>
                  {resending ? "Sending..." : resent ? "Email sent!" : "Resend verification email"}
                </Button>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}