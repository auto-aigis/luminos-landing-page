import type { User, Subscription, Brand, Competitor, TrackedPrompt, QueryRun, LatestRun, ReportData, ApiKeysStatus } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === "string") msg = d;
      else if (Array.isArray(d)) msg = d.map((e: { msg: string }) => e.msg).join(", ");
      else if (err.error) msg = err.error;
      else if (err.message) msg = err.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const authApi = {
  register: (email: string, password: string, tier: string = "starter") =>
    apiFetch<{ status: string; message: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, tier }),
    }),

  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  resendVerification: (email: string) =>
    apiFetch<{ status: string }>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  login: (email: string, password: string) =>
    apiFetch<User>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch<{ status: string }>("/api/auth/logout", { method: "POST" }),

  me: () => apiFetch<User>("/api/auth/me"),

  subscription: () => apiFetch<Subscription>("/api/auth/subscription"),
};

export const brandApi = {
  create: (data: { name: string; website_url: string; industry: string }) =>
    apiFetch<Brand>("/api/brands", { method: "POST", body: JSON.stringify(data) }),

  list: () => apiFetch<Brand[]>("/api/brands"),

  get: (brandId: string) => apiFetch<Brand>(`/api/brands/${brandId}`),

  update: (brandId: string, data: { name?: string; website_url?: string; industry?: string }) =>
    apiFetch<Brand>(`/api/brands/${brandId}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (brandId: string) =>
    apiFetch<{ status: string }>(`/api/brands/${brandId}`, { method: "DELETE" }),

  addCompetitor: (brandId: string, data: { name: string; website_url: string }) =>
    apiFetch<Competitor>(`/api/brands/${brandId}/competitors`, { method: "POST", body: JSON.stringify(data) }),

  listCompetitors: (brandId: string) =>
    apiFetch<Competitor[]>(`/api/brands/${brandId}/competitors`),

  removeCompetitor: (brandId: string, compId: string) =>
    apiFetch<{ status: string }>(`/api/brands/${brandId}/competitors/${compId}`, { method: "DELETE" }),

  addPrompt: (brandId: string, promptText: string) =>
    apiFetch<TrackedPrompt>(`/api/brands/${brandId}/prompts`, { method: "POST", body: JSON.stringify({ prompt_text: promptText }) }),

  listPrompts: (brandId: string) =>
    apiFetch<TrackedPrompt[]>(`/api/brands/${brandId}/prompts`),

  removePrompt: (brandId: string, promptId: string) =>
    apiFetch<{ status: string }>(`/api/brands/${brandId}/prompts/${promptId}`, { method: "DELETE" }),

  triggerRun: (brandId: string, model?: string) =>
    apiFetch<QueryRun>(`/api/brands/${brandId}/runs`, { method: "POST", body: JSON.stringify({ model }) }),

  listRuns: (brandId: string) =>
    apiFetch<QueryRun[]>(`/api/brands/${brandId}/runs`),

  latestRun: (brandId: string) =>
    apiFetch<LatestRun>(`/api/brands/${brandId}/runs/latest`),

  getReport: (brandId: string) =>
    apiFetch<ReportData>(`/api/brands/${brandId}/report`),
};

export const settingsApi = {
  saveApiKeys: (openaiKey?: string, perplexityKey?: string) =>
    apiFetch<{ status: string }>("/api/settings/api-keys", {
      method: "POST",
      body: JSON.stringify({ openai_key: openaiKey, perplexity_key: perplexityKey }),
    }),

  getApiKeysStatus: () => apiFetch<ApiKeysStatus>("/api/settings/api-keys"),
};

export const paymentApi = {
  checkout: (tier: string, billingInterval: string) =>
    apiFetch<{ price_id: string; client_token: string }>("/api/payments/checkout", {
      method: "POST",
      body: JSON.stringify({ tier, billing_interval: billingInterval }),
    }),
};