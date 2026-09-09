import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";

type Intent = "hire" | "research" | "compare" | "brand";
type QueryType = "commercial" | "informational" | "comparison" | "branded";
type Check = { name: string; passed: boolean; evidence: string; weight?: number };
type Overview = {
  audit: {
    measuredAt: string;
    source: string;
    target: string;
    seo: { score: number; checks: Check[] };
    geo: { score: number; checks: Check[] };
  };
  llm: {
    status: "not_benchmarked" | "benchmarked";
    score: number | null;
    metrics: null | {
      testedQueries: number;
      mentionRate: number;
      recommendationRate: number;
      citationRate: number;
      averagePosition: number;
      shareOfVoice: number;
    };
    disclaimer: string;
  };
  platforms: { platform: string; status: "not_connected" | string }[];
  campaign: { id: string | number; name: string; description: string };
  prompts: {
    id: string | number;
    campaignId: string | number;
    prompt: string;
    service?: string;
    location?: string;
    intent: Intent;
    queryType: QueryType;
    active: boolean;
  }[];
  competitors: { id: string | number; name: string; domain?: string }[];
  runs: unknown[];
};

const intentOptions: Intent[] = ["hire", "research", "compare", "brand"];
const queryOptions: QueryType[] = ["commercial", "informational", "comparison", "branded"];

function ScoreRing({ score, accent }: { score: number; accent: string }) {
  const safeScore = Math.max(0, Math.min(100, score));
  return (
    <div className="relative h-28 w-28 shrink-0">
      <div className="absolute inset-0 rounded-full border-[10px] border-slate-100" />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${accent} ${safeScore * 3.6}deg, transparent 0deg)`,
          WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 10px), #000 0)",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 10px), #000 0)",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-semibold text-slate-900">{score}</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">/ 100</span>
      </div>
    </div>
  );
}

function Checks({ checks }: { checks: Check[] }) {
  return (
    <div className="divide-y divide-slate-100">
      {checks.map((check) => (
        <div className="grid grid-cols-[auto_1fr] gap-3 py-3" key={check.name}>
          <span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${check.passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
            {check.passed ? "OK" : "—"}
          </span>
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-medium text-slate-800">{check.name}</p>
              {check.weight !== undefined && <span className="font-mono text-[10px] text-slate-400">weight {check.weight}</span>}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{check.evidence}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function VisibilityDashboard() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState("");
  const [service, setService] = useState("");
  const [location, setLocation] = useState("Dubai");
  const [intent, setIntent] = useState<Intent>("hire");
  const [queryType, setQueryType] = useState<QueryType>("commercial");
  const [competitorName, setCompetitorName] = useState("");
  const [competitorDomain, setCompetitorDomain] = useState("");

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      toast({ title: "Unauthorized", description: "You need admin access to view this page. Redirecting to login...", variant: "destructive" });
      const timer = window.setTimeout(() => { window.location.href = "/api/login"; }, 500);
      return () => window.clearTimeout(timer);
    }
  }, [authLoading, isAuthenticated, toast, user]);

  const enabled = isAuthenticated && user?.role === "admin";
  const overviewQuery = useQuery<Overview>({
    queryKey: ["/api/admin/visibility/overview"],
    enabled,
    retry: false,
  });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["/api/admin/visibility/overview"] });
  const mutationOptions = {
    onSuccess: () => { invalidate(); },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Session expired", description: "Redirecting to login...", variant: "destructive" });
        window.setTimeout(() => { window.location.href = "/api/login"; }, 500);
      } else toast({ title: "Action could not be completed", description: error.message, variant: "destructive" });
    },
  };
  const addPrompt = useMutation({
    mutationFn: (body: Record<string, unknown>) => apiRequest("POST", "/api/admin/visibility/prompts", body),
    ...mutationOptions,
  });
  const deletePrompt = useMutation({
    mutationFn: (id: string | number) => apiRequest("DELETE", `/api/admin/visibility/prompts/${id}`),
    ...mutationOptions,
  });
  const addCompetitor = useMutation({
    mutationFn: (body: Record<string, unknown>) => apiRequest("POST", "/api/admin/visibility/competitors", body),
    ...mutationOptions,
  });
  const deleteCompetitor = useMutation({
    mutationFn: (id: string | number) => apiRequest("DELETE", `/api/admin/visibility/competitors/${id}`),
    ...mutationOptions,
  });
  const runBenchmark = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/visibility/runs"),
    ...mutationOptions,
    onError: (error: Error) => {
      if (error.message.startsWith("409")) toast({ title: "Benchmark not available", description: "Connect a platform before starting an observed visibility run.", variant: "destructive" });
      else toast({ title: "Benchmark could not be started", description: error.message, variant: "destructive" });
    },
  });

  const overview = overviewQuery.data;
  const measuredAt = useMemo(() => overview?.audit.measuredAt ? new Date(overview.audit.measuredAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "Not measured", [overview?.audit.measuredAt]);

  if (authLoading || (!isAuthenticated || user?.role !== "admin")) {
    return <div className="min-h-[100dvh] bg-[#f4f7f6] px-6 pt-24"><div className="mx-auto max-w-7xl animate-pulse space-y-5"><div className="h-10 w-72 rounded bg-slate-200" /><div className="h-4 w-96 rounded bg-slate-200" /><div className="h-72 rounded-xl bg-slate-200" /></div></div>;
  }
  if (overviewQuery.isLoading) {
    return <div className="min-h-[100dvh] bg-[#f4f7f6] px-6 pt-24"><div className="mx-auto max-w-7xl animate-pulse space-y-6"><div className="h-12 w-80 rounded bg-slate-200" /><div className="grid gap-5 md:grid-cols-3"><div className="h-48 rounded-xl bg-slate-200" /><div className="h-48 rounded-xl bg-slate-200" /><div className="h-48 rounded-xl bg-slate-200" /></div><div className="h-96 rounded-xl bg-slate-200" /></div></div>;
  }
  if (overviewQuery.isError || !overview) {
    return <div className="min-h-[100dvh] bg-[#f4f7f6] px-6 pt-28 text-center"><p className="text-sm font-medium text-slate-700">Visibility overview could not be loaded.</p><Button className="mt-4 bg-slate-800" onClick={() => overviewQuery.refetch()}>Retry</Button></div>;
  }

  const { audit, llm, campaign } = overview;
  const submitPrompt = (event: FormEvent) => {
    event.preventDefault();
    if (!prompt.trim()) return;
    addPrompt.mutate({ campaignId: campaign.id, prompt: prompt.trim(), service: service || undefined, location: location || undefined, intent, queryType }, { onSuccess: () => { setPrompt(""); toast({ title: "Prompt added", description: "It is now part of the campaign set." }); } });
  };
  const submitCompetitor = (event: FormEvent) => {
    event.preventDefault();
    if (!competitorName.trim()) return;
    addCompetitor.mutate({ name: competitorName.trim(), domain: competitorDomain.trim() || undefined }, { onSuccess: () => { setCompetitorName(""); setCompetitorDomain(""); toast({ title: "Competitor added" }); } });
  };

  return (
    <main className="min-h-[100dvh] bg-[#f4f7f6] pb-16 pt-20 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="border-b border-slate-200 pb-7">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="font-mono text-[11px] uppercase tracking-[0.24em] text-teal-700">UrbanGrid / executive measurement cockpit</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Visibility, measured.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Three separate systems for understanding how UrbanGrid is found, interpreted, and observed in the market.</p></div>
            <div className="text-left md:text-right"><p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Last measured</p><p className="mt-1 text-sm font-medium text-slate-700">{measuredAt}</p><p className="mt-1 text-xs text-slate-500">Source: {audit.source} · Target: {audit.target}</p></div>
          </div>
        </header>

        <section className="grid gap-4 py-7 md:grid-cols-3">
          <Card className="border-slate-200 border-l-4 border-l-sky-600 bg-white shadow-none"><CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle className="text-base">SEO Score</CardTitle><Badge variant="outline" className="border-sky-200 text-sky-700">Site audit</Badge></div><CardDescription>Technical and on-page signals measured against the target.</CardDescription></CardHeader><CardContent className="flex items-center gap-5"><ScoreRing score={audit.seo.score} accent="#0284c7" /><div><p className="font-mono text-xs text-slate-500">{audit.seo.checks.filter((c) => c.passed).length} of {audit.seo.checks.length} checks passed</p><p className="mt-2 text-xs leading-5 text-slate-500">A diagnostic score, not a ranking forecast.</p></div></CardContent></Card>
          <Card className="border-slate-200 border-l-4 border-l-amber-500 bg-white shadow-none"><CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle className="text-base">GEO Readiness</CardTitle><Badge variant="outline" className="border-amber-200 text-amber-700">Content signals</Badge></div><CardDescription>Whether pages are structured for generative answer engines.</CardDescription></CardHeader><CardContent className="flex items-center gap-5"><ScoreRing score={audit.geo.score} accent="#d97706" /><div><p className="font-mono text-xs text-slate-500">{audit.geo.checks.filter((c) => c.passed).length} of {audit.geo.checks.length} checks passed</p><p className="mt-2 text-xs leading-5 text-slate-500">Readiness is not observed model visibility.</p></div></CardContent></Card>
          <Card className="border-slate-200 border-l-4 border-l-violet-600 bg-white shadow-none"><CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle className="text-base">Observed LLM Visibility</CardTitle><Badge variant="outline" className="border-violet-200 text-violet-700">{llm.status === "benchmarked" ? "Benchmarked" : "Not benchmarked"}</Badge></div><CardDescription>Direct observations from controlled query runs.</CardDescription></CardHeader><CardContent>{llm.status === "benchmarked" && llm.score !== null ? <div className="flex items-center gap-5"><ScoreRing score={llm.score} accent="#7c3aed" /><p className="text-xs leading-5 text-slate-500">Observed results only. No inference from SEO or GEO scores.</p></div> : <div className="rounded-lg bg-violet-50 p-4 text-sm leading-6 text-violet-950">LLM visibility has not yet been directly benchmarked.</div>}</CardContent></Card>
        </section>
        <div className="mb-7 grid gap-3 rounded-lg border border-slate-200 bg-slate-100/70 p-4 text-xs leading-5 text-slate-600 md:grid-cols-[auto_1fr_1fr] md:items-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Methodology distinction</span>
          <span><strong className="font-semibold text-slate-800">SEO and GEO:</strong> measured site and content checks.</span>
          <span><strong className="font-semibold text-slate-800">LLM visibility:</strong> direct observations from benchmark queries only.</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <Card className="border-slate-200 bg-white shadow-none"><CardHeader className="border-b border-slate-100"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-700">01 / SEO system</p><CardTitle className="mt-2 text-xl">Search health checks</CardTitle><CardDescription>Evidence attached to each check is shown exactly as measured.</CardDescription></CardHeader><CardContent className="pt-2"><Checks checks={audit.seo.checks} /></CardContent></Card>
            <Card className="border-slate-200 bg-white shadow-none"><CardHeader className="border-b border-slate-100"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-700">02 / GEO system</p><CardTitle className="mt-2 text-xl">Generative readiness checks</CardTitle><CardDescription>Structural and content evidence. This section does not claim model mentions.</CardDescription></CardHeader><CardContent className="pt-2"><Checks checks={audit.geo.checks} /></CardContent></Card>
            <Card className="border-slate-200 bg-white shadow-none"><CardHeader className="border-b border-slate-100"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-700">03 / observed LLM system</p><CardTitle className="mt-2 text-xl">Benchmark control room</CardTitle><CardDescription>{llm.disclaimer}</CardDescription></CardHeader><CardContent>
              {llm.metrics ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{Object.entries(llm.metrics).map(([key, value]) => <div className="rounded-lg border border-slate-100 bg-slate-50 p-3" key={key}><p className="font-mono text-lg font-semibold text-slate-900">{typeof value === "number" && key !== "testedQueries" ? `${value}%` : value}</p><p className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">{key.replace(/([A-Z])/g, " $1")}</p></div>)}</div> : <div className="rounded-lg border border-dashed border-violet-200 bg-violet-50/50 p-5 text-sm text-slate-600">No observed result values are available yet. Add prompts and connect a supported platform to begin a run.</div>}
              <div className="mt-5 flex flex-wrap items-center gap-3"><Button className="bg-violet-700 hover:bg-violet-800" disabled={runBenchmark.isPending || overview.platforms.every((p) => p.status === "not_connected")} onClick={() => runBenchmark.mutate()}>Start benchmark</Button><span className="text-xs text-slate-500">{overview.platforms.every((p) => p.status === "not_connected") ? "Requires a connected platform" : "Runs the active campaign prompts"}</span></div>
              <div className="mt-5 border-t border-slate-100 pt-4"><p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">Platform access</p><div className="flex flex-wrap gap-2">{overview.platforms.length === 0 ? <span className="text-xs text-slate-500">No platforms configured.</span> : overview.platforms.map((platform) => <Badge key={platform.platform} variant="outline" className={platform.status === "not_connected" ? "border-slate-200 text-slate-400" : "border-emerald-200 text-emerald-700"}>{platform.platform}: {platform.status.replace(/_/g, " ")}</Badge>)}</div></div>
            </CardContent></Card>
          </div>

          <aside className="space-y-6">
            <Card className="border-slate-200 bg-white shadow-none"><CardHeader><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">Campaign set</p><CardTitle className="text-lg">{campaign.name}</CardTitle><CardDescription>{campaign.description}</CardDescription></CardHeader><CardContent><form onSubmit={submitPrompt} className="space-y-3"><label className="block text-xs font-medium text-slate-600">Prompt<input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Which inspection company serves..." className="mt-1.5 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-violet-500 focus:ring-2" /></label><div className="grid grid-cols-2 gap-3"><label className="text-xs font-medium text-slate-600">Service<input value={service} onChange={(e) => setService(e.target.value)} className="mt-1.5 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm" /></label><label className="text-xs font-medium text-slate-600">Location<input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1.5 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm" /></label></div><div className="grid grid-cols-2 gap-3"><label className="text-xs font-medium text-slate-600">Intent<select value={intent} onChange={(e) => setIntent(e.target.value as Intent)} className="mt-1.5 w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-2 text-sm">{intentOptions.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-xs font-medium text-slate-600">Query type<select value={queryType} onChange={(e) => setQueryType(e.target.value as QueryType)} className="mt-1.5 w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-2 text-sm">{queryOptions.map((item) => <option key={item}>{item}</option>)}</select></label></div><Button type="submit" disabled={addPrompt.isPending || !prompt.trim()} className="w-full bg-slate-800 hover:bg-slate-700">Add prompt</Button></form><div className="mt-6 divide-y divide-slate-100 border-t border-slate-100">{overview.prompts.length === 0 ? <p className="py-5 text-xs text-slate-500">No prompts in this campaign yet.</p> : overview.prompts.map((item) => <div className="flex gap-3 py-3" key={item.id}><div className="min-w-0 flex-1"><p className="text-sm text-slate-700">{item.prompt}</p><p className="mt-1 font-mono text-[10px] uppercase text-slate-400">{item.intent} · {item.queryType}{item.location ? ` · ${item.location}` : ""}</p></div><button className="text-xs text-slate-400 hover:text-rose-600" onClick={() => deletePrompt.mutate(item.id)}>Remove</button></div>)}</div></CardContent></Card>
            <Card className="border-slate-200 bg-white shadow-none"><CardHeader><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">Comparison set</p><CardTitle className="text-lg">Competitors</CardTitle><CardDescription>Reference entities for observed share of voice. No rankings are inferred.</CardDescription></CardHeader><CardContent><form onSubmit={submitCompetitor} className="space-y-3"><input value={competitorName} onChange={(e) => setCompetitorName(e.target.value)} placeholder="Company name" className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm" /><div className="flex gap-2"><input value={competitorDomain} onChange={(e) => setCompetitorDomain(e.target.value)} placeholder="Domain (optional)" className="min-w-0 flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm" /><Button type="submit" disabled={addCompetitor.isPending || !competitorName.trim()} className="bg-slate-800">Add</Button></div></form><div className="mt-4 space-y-2">{overview.competitors.length === 0 ? <p className="text-xs text-slate-500">No competitors added.</p> : overview.competitors.map((item) => <div className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2.5" key={item.id}><div><p className="text-sm font-medium text-slate-700">{item.name}</p>{item.domain && <p className="font-mono text-[10px] text-slate-400">{item.domain}</p>}</div><button className="text-xs text-slate-400 hover:text-rose-600" onClick={() => deleteCompetitor.mutate(item.id)}>Remove</button></div>)}</div></CardContent></Card>
          </aside>
        </div>
      </div>
    </main>
  );
}