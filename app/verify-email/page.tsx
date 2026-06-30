"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useSearchParams, useRouter, useRouter as useNextRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import Link from "next/link";
import { Mail, Check, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refresh } = useAuth();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (token) {
      authApi.verifyEmail(token)
        .then(async () => {
          setStatus("success");
          await refresh();
          setTimeout(() => router.push("/onboarding"), 1500);
        })
        .catch((err) => {
          setStatus("error");
          setErrorMsg(err instanceof Error ? err.message : "Verification failed");
        });
    } else {
      setStatus("pending");
    }
  }, [token, router, refresh]);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await authApi.resendVerification(email);
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch {
      setErrorMsg("Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Verifying your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Check className="w-10 h-10 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-green-800">Email verified!</CardTitle>
            <CardDescription className="mt-2">Redirecting to onboarding...</CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-4" />
            <CardTitle className="text-red-800">Verification failed</CardTitle>
            <CardDescription className="mt-2">{errorMsg}</CardDescription>
            <Button asChild className="mt-4">
              <Link href="/register">Back to signup</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <CardTitle>Check your inbox</CardTitle>
          <CardDescription>We sent a verification link to {email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">Click the link in the email to verify your account.</p>
            <Button variant="outline" onClick={handleResend} disabled={resending}>
              {resending ? "Sending..." : resent ? "Email sent!" : "Resend verification email"}
            </Button>
          </div>
          <p className="text-center text-sm text-gray-600">
            Already verified?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}