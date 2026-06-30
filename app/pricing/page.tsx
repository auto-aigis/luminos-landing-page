"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/app/_components/AuthProvider";
import { paymentApi } from "@/app/_lib/api";
import { Check, Crown, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    id: "starter",
    name: "Starter",
    monthly: 0,
    yearly: 0,
    description: "For individuals getting started",
    features: [
      "1 brand tracked",
      "5 tracked prompts",
      "3 competitor brands",
      "ChatGPT only",
      "Weekly refresh",
      "3 report sections",
    ],
    cta: "Get started",
    href: "/register",
  },
  {
    id: "professional",
    name: "Professional",
    monthly: 415,
    yearly: 4980,
    description: "For growing teams",
    features: [
      "1 brand tracked",
      "25 tracked prompts",
      "10 competitor brands",
      "ChatGPT + Perplexity",
      "Daily refresh",
      "All 7 report sections",
      "Email support",
    ],
    cta: "Subscribe",
    href: null,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: 1040,
    yearly: 12480,
    description: "For large organizations",
    features: [
      "5 brands tracked",
      "100 prompts per brand",
      "Unlimited competitors",
      "All AI models",
      "Daily + on-demand refresh",
      "All report sections",
      "Multi-brand dashboard",
      "PDF export",
      "Priority support",
    ],
    cta: "Subscribe",
    href: null,
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const { user, refresh } = useAuth();

  const handleSubscribe = async (tierId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(tierId);
    try {
      const interval = yearly ? "yearly" : "monthly";
      const { client_token, price_id } = await paymentApi.checkout(tierId, interval);
      
      const paddleWindow = window as unknown as { Paddle?: { Environment: { set: (env: string) => void }; Initialize: (options: { token: string; eventCallback?: (event: Record<string, unknown>) => void }) => void; Checkout: { open: (options: Record<string, unknown>) => void } } };
      
      if (paddleWindow.Paddle) {
        paddleWindow.Paddle.Environment.set("sandbox");
        
        const eventCallback = (event: Record<string, unknown>) => {
          const eventName = event.name as string;
          const eventData = event.data as { transaction_id?: string } | undefined;
          if (eventName === "checkout.completed") {
            window.location.href = `/dashboard?checkout=success&transaction_id=${eventData?.transaction_id || ""}`;
          }
        };

        paddleWindow.Paddle.Initialize({ token: client_token, eventCallback });
        paddleWindow.Paddle.Checkout.open({
          items: [{ priceId: price_id, quantity: 1 }],
          settings: { displayMode: "overlay" },
        });
      } else {
        console.error("Paddle not loaded");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  const currentTier = user?.tier;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-gray-600 mb-8">Choose the plan that fits your AI visibility needs</p>
          <div className="flex items-center justify-center gap-3">
            <span className={!yearly ? "font-medium text-gray-900" : "text-gray-500"}>Monthly</span>
            <Switch checked={yearly} onCheckedChange={setYearly} />
            <span className={yearly ? "font-medium text-gray-900" : "text-gray-500"}>Yearly</span>
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">Save 2 months</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <Card key={tier.id} className={`relative ${tier.id === "professional" ? "border-blue-600 ring-1 ring-blue-600" : ""}`}>
              {tier.id === "professional" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-blue-600">Most popular</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  {tier.id === "enterprise" && <Crown className="w-5 h-5 text-amber-500" />}
                  {tier.name}
                </CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {tier.monthly === 0 ? "Free" : `$${(yearly ? tier.yearly : tier.monthly).toLocaleString()}`}
                  </span>
                  {tier.monthly > 0 && <span className="text-gray-500">/{yearly ? "year" : "month"}</span>}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {tier.href ? (
                  <Button asChild className="w-full" variant={tier.id === "professional" ? "default" : "outline"}>
                    <Link href={tier.href}>{tier.cta}</Link>
                  </Button>
                ) : currentTier === tier.id ? (
                  <Button className="w-full" disabled variant="outline">Current plan</Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant={tier.id === "professional" ? "default" : "outline"}
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={loading === tier.id}
                  >
                    {loading === tier.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : tier.cta}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p>Questions? Contact us at{" "} <a href="mailto:support@luminos.ai" className="text-blue-600 hover:underline">support@luminos.ai</a>
          </p>
        </div>
      </div>
    </div>
  );
}