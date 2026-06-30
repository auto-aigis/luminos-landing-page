"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { brandApi, settingsApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import type { Brand, Competitor, TrackedPrompt, ApiKeysStatus, Tier } from "@/app/_lib/types";
import { Plus, X, Save, Loader2, AlertCircle, Check } from "lucide-react";
import Link from "next/link";

const industries = ["B2B SaaS", "Cybersecurity", "Data Platforms", "MarTech", "Other"];
const tierLimits: Record<Tier, { maxPrompts: number; maxCompetitors: number }> = {
  starter: { maxPrompts: 5, maxCompetitors: 3 },
  professional: { maxPrompts: 25, maxCompetitors: 10 },
  enterprise: { maxPrompts: 100, maxCompetitors: Infinity },
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [prompts, setPrompts] = useState<TrackedPrompt[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeysStatus>({ openai_configured: false, perplexity_configured: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [brandName, setBrandName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [newCompName, setNewCompName] = useState("");
  const [newCompUrl, setNewCompUrl] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [perplexityKey, setPerplexityKey] = useState("");

  const tier = user?.tier || "starter";
  const limits = tierLimits[tier];

  useEffect(() => {
    async function load() {
      try {
        const [brandsList, keysStatus] = await Promise.all([brandApi.list(), settingsApi.getApiKeysStatus()]);
        setApiKeys(keysStatus);
        if (brandsList.length > 0) {
          const b = brandsList[0];
          setBrand(b);
          setBrandName(b.name);
          setWebsiteUrl(b.website_url);
          setIndustry(b.industry);
          const [comps, proms] = await Promise.all([brandApi.listCompetitors(b.id), brandApi.listPrompts(b.id)]);
          setCompetitors(comps);
          setPrompts(proms);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const saveBrand = async () => {
    if (!brand) return;
    setSaving(true);
    setMsg(null);
    try {
      const updated = await brandApi.update(brand.id, { name: brandName, website_url: websiteUrl, industry });
      setBrand(updated);
      setMsg({ type: "success", text: "Brand settings saved" });
    } catch {
      setMsg({ type: "error", text: "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  const addCompetitor = async () => {
    if (!brand || !newCompName || competitors.length >= limits.maxCompetitors) return;
    try {
      const comp = await brandApi.addCompetitor(brand.id, { name: newCompName, website_url: newCompUrl });
      setCompetitors([...competitors, comp]);
      setNewCompName("");
      setNewCompUrl("");
    } catch {
      setMsg({ type: "error", text: "Failed to add competitor" });
    }
  };

  const removeCompetitor = async (id: string) => {
    if (!brand) return;
    try {
      await brandApi.removeCompetitor(brand.id, id);
      setCompetitors(competitors.filter((c) => c.id !== id));
    } catch {}
  };

  const addPrompt = async () => {
    if (!brand || !newPrompt.trim() || prompts.length >= limits.maxPrompts) return;
    try {
      const p = await brandApi.addPrompt(brand.id, newPrompt.trim());
      setPrompts([...prompts, p]);
      setNewPrompt("");
    } catch {
      setMsg({ type: "error", text: "Failed to add prompt" });
    }
  };

  const removePrompt = async (id: string) => {
    if (!brand) return;
    try {
      await brandApi.removePrompt(brand.id, id);
      setPrompts(prompts.filter((p) => p.id !== id));
    } catch {}
  };

  const saveApiKeys = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await settingsApi.saveApiKeys(openaiKey || undefined, perplexityKey || undefined);
      const status = await settingsApi.getApiKeysStatus();
      setApiKeys(status);
      setOpenaiKey("");
      setPerplexityKey("");
      setMsg({ type: "success", text: "API keys saved" });
    } catch {
      setMsg({ type: "error", text: "Failed to save API keys" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

      {msg && (
        <div className={`p-3 rounded-lg flex items-center gap-2 ${msg.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {msg.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Brand Information</CardTitle>
          <CardDescription>Update your brand details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brand name</Label>
              <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Industry</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {industries.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={saveBrand} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Competitors</CardTitle>
          <CardDescription>Manage tracked competitors ({competitors.length}/{limits.maxCompetitors})</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {competitors.map((c) => (
              <Badge key={c.id} variant="secondary" className="flex items-center gap-1 pr-1">
                {c.name}
                <button onClick={() => removeCompetitor(c.id)} className="ml-1 hover:text-red-600"><X className="w-3 h-3" /></button>
              </Badge>
            ))}
          </div>
          {competitors.length < limits.maxCompetitors && (
            <div className="flex gap-2">
              <Input placeholder="Competitor name" value={newCompName} onChange={(e) => setNewCompName(e.target.value)} className="flex-1" />
              <Input placeholder="Website (optional)" value={newCompUrl} onChange={(e) => setNewCompUrl(e.target.value)} className="flex-1" />
              <Button onClick={addCompetitor} disabled={!newCompName}><Plus className="w-4 h-4" /></Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tracked Prompts</CardTitle>
          <CardDescription>Manage search queries to monitor ({prompts.length}/{limits.maxPrompts})</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {prompts.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span className="text-sm">{p.prompt_text}</span>
                <button onClick={() => removePrompt(p.id)} className="text-gray-400 hover:text-red-600"><X className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          {prompts.length < limits.maxPrompts && (
            <div className="flex gap-2">
              <Input placeholder='e.g., "best data platform for enterprise"' value={newPrompt} onChange={(e) => setNewPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addPrompt()} className="flex-1" />
              <Button onClick={addPrompt} disabled={!newPrompt.trim()}><Plus className="w-4 h-4" /></Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Configure your AI provider keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>OpenAI API Key</Label>
            <div className="flex items-center gap-2">
              <Input type="password" value={openaiKey} onChange={(e) => setOpenaiKey(e.target.value)} placeholder={apiKeys.openai_configured ? "••••••••••••" : "sk-..."} />
              {apiKeys.openai_configured && <Badge>Configured</Badge>}
            </div>
          </div>
          {tier !== "starter" && (
            <div className="space-y-2">
              <Label>Perplexity API Key</Label>
              <div className="flex items-center gap-2">
                <Input type="password" value={perplexityKey} onChange={(e) => setPerplexityKey(e.target.value)} placeholder={apiKeys.perplexity_configured ? "••••••••••••" : "pplx-..."} />
                {apiKeys.perplexity_configured && <Badge>Configured</Badge>}
              </div>
            </div>
          )}
          {tier === "starter" && (
            <p className="text-sm text-amber-600">Upgrade to Professional or Enterprise to add Perplexity API key.</p>
          )}
          <Button onClick={saveApiKeys} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save API keys
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}