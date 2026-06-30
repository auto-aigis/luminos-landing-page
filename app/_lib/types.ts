export type Tier = "starter" | "professional" | "enterprise";

export interface User {
  id: string;
  email: string;
  display_name: string | null;
  is_email_verified: boolean;
  onboarding_completed: boolean;
  tier: Tier;
  created_at: string;
}

export interface Subscription {
  tier: Tier;
  status: string;
  billing_interval: "monthly" | "yearly" | null;
  current_period_end: string | null;
}

export interface Brand {
  id: string;
  user_id: string;
  name: string;
  website_url: string;
  industry: string;
  created_at: string;
  competitors_count: number;
  prompts_count: number;
}

export interface Competitor {
  id: string;
  brand_id: string;
  name: string;
  website_url: string;
}

export interface TrackedPrompt {
  id: string;
  brand_id: string;
  prompt_text: string;
  created_at: string;
}

export interface QueryRun {
  id: string;
  brand_id: string;
  triggered_by: string;
  status: "pending" | "running" | "completed" | "failed";
  started_at: string;
  completed_at: string | null;
}

export interface LatestRun {
  has_data: boolean;
  run_id: string | null;
  completed_at: string | null;
  results_count: number;
}

export interface ReportData {
  visibility_score: number | null;
  share_of_voice: { brand: number; competitors: Record<string, number> } | null;
  prompt_coverage: { mentioned: string[]; not_mentioned: string[] } | null;
  brand_perception: string | null;
  citation_analysis: { sources: string[] } | null;
  competitor_comparison: { competitor: string; visibility: number }[] | null;
  knowledge_gaps: { prompt: string; competitors_mentioned: string[] }[] | null;
  tier_locked_sections: string[];
}

export interface ApiKeysStatus {
  openai_configured: boolean;
  perplexity_configured: boolean;
}

export interface PricingTier {
  id: Tier;
  name: string;
  monthly_price: number;
  yearly_price: number;
  features: string[];
  limits: {
    max_brands: number;
    max_prompts: number;
    max_competitors: number;
    refresh_rate: string;
  };
}