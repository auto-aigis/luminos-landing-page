"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Brain,
  TrendingUp,
  BarChart3,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Eye,
  Target,
  Layers,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FaqItem {
  question: string;
  answer: string;
}

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features: Feature[] = [
    {
      icon: <Eye className="h-6 w-6 text-indigo-500" />,
      title: "AI Visibility Tracking",
      description:
        "Monitor how your brand appears across ChatGPT, Perplexity, Claude, and other AI search engines in real-time.",
    },
    {
      icon: <Brain className="h-6 w-6 text-indigo-500" />,
      title: "Strategic Intelligence",
      description:
        "Get actionable recommendations to improve your positioning in AI-generated answers and citations.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-indigo-500" />,
      title: "Growth Analytics",
      description:
        "Track your AI search presence over time with detailed analytics and competitive benchmarking.",
    },
    {
      icon: <Target className="h-6 w-6 text-indigo-500" />,
      title: "Query Intelligence",
      description:
        "Discover which queries trigger AI mentions of your brand and identify new opportunities.",
    },
    {
      icon: <Layers className="h-6 w-6 text-indigo-500" />,
      title: "Multi-Platform Coverage",
      description:
        "One unified dashboard for all AI search platforms — no fragmented tools or manual checking.",
    },
    {
      icon: <Shield className="h-6 w-6 text-indigo-500" />,
      title: "Brand Protection",
      description:
        "Get alerted when AI systems misrepresent your brand or surface inaccurate information.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      title: "Connect Your Brand",
      description:
        "Set up your brand profile, competitors, and target queries in minutes. No technical integration required.",
      icon: <Zap className="h-8 w-8 text-indigo-500" />,
    },
    {
      number: "02",
      title: "Monitor AI Search",
      description:
        "Luminos continuously scans AI search engines, tracking when and how your brand is mentioned.",
      icon: <Search className="h-8 w-8 text-indigo-500" />,
    },
    {
      number: "03",
      title: "Get Strategic Insights",
      description:
        "Receive actionable intelligence on how to improve your AI search visibility and outperform competitors.",
      icon: <BarChart3 className="h-8 w-8 text-indigo-500" />,
    },
    {
      number: "04",
      title: "Grow Your Presence",
      description:
        "Execute data-driven strategies to increase your visibility across all AI-powered search experiences.",
      icon: <TrendingUp className="h-8 w-8 text-indigo-500" />,
    },
  ];

  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      price: "$99",
      description: "For small businesses getting started with AI search visibility.",
      features: [
        "1 brand profile",
        "50 tracked queries",
        "3 AI platforms monitored",
        "Weekly reports",
        "Email alerts",
      ],
      highlighted: false,
      cta: "Get Started",
    },
    {
      name: "Professional",
      price: "$299",
      description: "For growing teams that need deeper intelligence and more coverage.",
      features: [
        "3 brand profiles",
        "500 tracked queries",
        "All AI platforms monitored",
        "Daily reports",
        "Real-time alerts",
        "Competitor tracking (5)",
        "Strategic recommendations",
      ],
      highlighted: true,
      cta: "Get Started",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations requiring full-scale AI search operations.",
      features: [
        "Unlimited brand profiles",
        "Unlimited tracked queries",
        "All AI platforms monitored",
        "Real-time reporting",
        "Custom integrations",
        "Unlimited competitors",
        "Dedicated account manager",
        "Custom API access",
      ],
      highlighted: false,
      cta: "Contact Sales",
    },
  ];

  const faqItems: FaqItem[] = [
    {
      question: "What is AI search visibility?",
      answer:
        "AI search visibility refers to how often and how accurately your brand appears in responses generated by AI-powered search engines like ChatGPT, Perplexity, Google AI Overviews, and Claude. Unlike traditional SEO, AI search requires different strategies to ensure your brand is cited and recommended.",
    },
    {
      question: "How is Luminos different from traditional SEO tools?",
      answer:
        "Traditional SEO tools focus on rankings in link-based search results. Luminos is purpose-built for AI search — tracking citations, mentions, and recommendations within AI-generated answers. We provide strategic intelligence specifically designed for the new AI search landscape.",
    },
    {
      question: "Which AI search platforms do you monitor?",
      answer:
        "We monitor all major AI search platforms including ChatGPT, Perplexity, Google AI Overviews, Claude, Microsoft Copilot, and more. Our coverage expands as new AI search experiences emerge.",
    },
    {
      question: "How quickly can I see results?",
      answer:
        "You can start tracking your AI search visibility within minutes of setup. Strategic improvements typically show measurable results within 2-4 weeks, depending on your starting position and the competitiveness of your market.",
    },
    {
      question: "Do I need technical expertise to use Luminos?",
      answer:
        "Not at all. Luminos is designed for marketing teams, brand managers, and business leaders. No coding or technical integration is required. Simply set up your brand profile and start monitoring.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Luminos</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Get Started
                </Button>
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 pb-4">
            <div className="flex flex-col gap-3">
              <a href="#features" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </a>
              <Separator />
              <div className="flex gap-3 pt-2">
                <a href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </a>
                <a href="/register">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Get Started
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            The Strategic OS for AI Search
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
            Own Your Visibility in
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Search
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
            Luminos is the AI Search Intelligence Platform that helps businesses understand, track, and grow their presence across every AI-powered search experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                See How It Works
              </Button>
            </a>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-8 shadow-2xl shadow-indigo-100/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-500 font-medium">AI Visibility Score</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">87/100</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +12 this week
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    <span className="text-xs text-gray-500 font-medium">AI Mentions</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">2,847</p>
                  <p className="text-sm text-indigo-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +340 this month
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span className="text-xs text-gray-500 font-medium">Platforms Tracked</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">8</p>
                  <p className="text-sm text-purple-600 mt-1">All major AI engines</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for AI Search Dominance
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              A complete strategic operating system designed to help you understand, monitor, and grow your AI search presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:border-indigo-200 transition-colors hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              From Setup to Strategic Growth in 4 Steps
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Get actionable AI search intelligence without complexity. Start seeing insights in minutes, not weeks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 mb-4">
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold text-indigo-600 mb-2">STEP {step.number}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2 w-8">
                    <ArrowRight className="h-5 w-5 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-600">
        <div className="max-w-7xl mx-auto text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <p className="text-4xl font-bold text-white">500+</p>
              <p className="text-indigo-200 mt-1">Brands Tracked</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">2M+</p>
              <p className="text-indigo-200 mt-1">AI Queries Monitored</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">8</p>
              <p className="text-indigo-200 mt-1">AI Platforms Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Plans That Scale With Your Growth
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Start small and scale as your AI search strategy matures. All plans include core platform access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative ${
                  tier.highlighted
                    ? "border-indigo-600 border-2 shadow-xl shadow-indigo-100/50"
                    : "border-gray-200"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-indigo-600 text-white px-3">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    {tier.price !== "Custom" && <span className="text-gray-500">/month</span>}
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <a href="/register" className="w-full">
                    <Button
                      className={`w-full ${
                        tier.highlighted
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : ""
                      }`}
                      variant={tier.highlighted ? "default" : "outline"}
                    >
                      {tier.cta}
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about Luminos and AI search visibility.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Dominate AI Search?
          </h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of forward-thinking brands already using Luminos to grow their visibility in the new era of AI-powered search.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/register">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-6 text-lg font-semibold">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href="#pricing">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                View Pricing
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span className="text-lg font-bold text-gray-900">Luminos</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900">
                FAQ
              </a>
              <a href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Sign In
              </a>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 Luminos. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}