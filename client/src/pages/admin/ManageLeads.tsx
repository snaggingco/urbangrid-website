import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { leadStages, attributionKeys, type AttributionTouch } from "@shared/leads";
import type { ContactSubmission } from "@shared/schema";
import type { MarketingSummary } from "@shared/marketing";

type Filters = { stage: string; source: string; from: string; to: string; includeNonSales: boolean };
type LeadResponse = { leads: ContactSubmission[]; total: number };
type HistoryEntry = { id: number; leadId: number; fromStage: string; toStage: string; changedAt: string | Date; note: string | null };
const PAGE_SIZE = 25;
const stages = [
  { key: "new", label: "New", tone: "text-emerald-800 bg-emerald-50" },
  { key: "qualified", label: "Qualified", tone: "text-teal-800 bg-teal-50" },
  { key: "quoted", label: "Quoted", tone: "text-amber-800 bg-amber-50" },
  { key: "booked", label: "Booked", tone: "text-sky-800 bg-sky-50" },
  { key: "completed", label: "Completed", tone: "text-green-800 bg-green-50" },
  { key: "lost", label: "Lost", tone: "text-rose-800 bg-rose-50" },
] as const;
const touchFields = [...attributionKeys, "landingPage", "referrer", "capturedAt"] as const;
const inputClass = "mt-1 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30";
const labelClass = "block text-xs font-semibold tracking-wide text-zinc-600";

function queryString(filters: Filters, offset?: number) {
  const params = new URLSearchParams();
  if (filters.stage) params.set("stage", filters.stage);
  if (filters.source) params.set("source", filters.source);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  params.set("includeNonSales", String(filters.includeNonSales));
  if (offset !== undefined) params.set("offset", String(offset));
  return params.toString();
}

function formatDate(value?: string | Date | null, includeTime = false) {
  if (!value) return "Not recorded";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

function moneyLabel(minor: number | null | undefined, currency = "GBP") {
  if (minor == null) return "—";
  return new Intl.NumberFormat("en-GB", { style: "currency", currency, maximumFractionDigits: 2 }).format(minor / 100);
}

function amountToMinor(value: string): number | null {
  if (value.trim() === "") return null;
  if (!/^\d+(?:\.\d{1,2})?$/.test(value.trim())) throw new Error("Use a non-negative amount with up to two decimal places.");
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount > 21474836.47) throw new Error("Amount must not exceed GBP 21,474,836.47.");
  return Math.round(amount * 100);
}

function TouchDetails({ label, touch }: { label: string; touch?: AttributionTouch }) {
  return (
    <section className="min-w-0">
      <h4 className="mb-2 text-xs font-bold uppercase tracking-[0.13em] text-zinc-600">{label}</h4>
      {!touch ? <p className="text-sm text-zinc-500">Not captured on this lead.</p> : (
        <dl className="grid gap-y-2 sm:grid-cols-2">
          {touchFields.map((key) => {
            const value = touch[key as keyof AttributionTouch];
            if (!value && !attributionKeys.includes(key as typeof attributionKeys[number])) return null;
            return <div key={key} className="min-w-0 pr-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">{key}</dt>
              <dd className="mt-0.5 break-all text-xs text-zinc-800">{value || "—"}</dd>
            </div>;
          })}
        </dl>
      )}
    </section>
  );
}

function LeadCard({ lead, onSaved }: { lead: ContactSubmission; onSaved: () => Promise<void> }) {
  const [stage, setStage] = useState(lead.stage || "new");
  const [quote, setQuote] = useState(lead.quoteValueMinor == null ? "" : (lead.quoteValueMinor / 100).toFixed(2));
  const [revenue, setRevenue] = useState(lead.revenueAmountMinor == null ? "" : (lead.revenueAmountMinor / 100).toFixed(2));
  const [inspectionDate, setInspectionDate] = useState(lead.inspectionDate || "");
  const [bookingReference, setBookingReference] = useState(lead.bookingReference || "");
  const [lostReason, setLostReason] = useState(lead.lostReason || "");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const history = useQuery<{ history: HistoryEntry[] }>({
    queryKey: ["/api/admin/leads", lead.id, "history"],
    enabled: showHistory,
    queryFn: async () => (await apiRequest("GET", `/api/admin/leads/${lead.id}/history`)).json(),
  });

  async function save() {
    if (saving) return;
    setSaving(true);
    setNotice(null);
    try {
      const payload: Record<string, unknown> = {};
      const nextQuote = amountToMinor(quote);
      const nextRevenue = amountToMinor(revenue);
      const oldQuote = lead.quoteValueMinor ?? null;
      const oldRevenue = lead.revenueAmountMinor ?? null;
      if (nextQuote !== oldQuote) payload.quoteValueMinor = nextQuote;
      if (nextRevenue !== oldRevenue) payload.revenueAmountMinor = nextRevenue;
      const nextDate = inspectionDate || null;
      if (nextDate !== (lead.inspectionDate || null)) payload.inspectionDate = nextDate;
      const nextReference = bookingReference.trim() || null;
      if (nextReference !== (lead.bookingReference || null)) payload.bookingReference = nextReference;
      const nextReason = lostReason.trim() || null;
      if (nextReason !== (lead.lostReason || null)) payload.lostReason = nextReason;
      if (stage !== lead.stage) {
        if (stage === "lost" && !nextReason) throw new Error("Add a reason before moving this lead to Lost.");
        payload.stage = stage;
      }
      if (stage !== lead.stage && note.trim()) payload.note = note.trim();
      if (!Object.keys(payload).some((key) => key !== "note")) {
        setNotice({ text: "No changes to save." });
        return;
      }
      await apiRequest("PATCH", `/api/admin/leads/${lead.id}`, payload);
      setNotice({ text: "Lead updated." });
      setNote("");
      await onSaved();
    } catch (error) {
      setNotice({ text: error instanceof Error ? error.message : "Could not save changes. Try again.", error: true });
    } finally {
      setSaving(false);
    }
  }

  const milestones = [
    ["Qualified", lead.qualifiedAt], ["Quoted", lead.quotedAt], ["Booked", lead.bookedAt],
    ["Completed", lead.completedAt], ["Lost", lead.lostAt],
  ] as const;
  const stageLabel = stages.find((item) => item.key === lead.stage)?.label ?? lead.stage;

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_2px_12px_rgba(32,56,45,0.04)]">
      <div className="border-b border-zinc-100 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-zinc-900">{lead.name}</h2>
              <span className="font-mono text-xs text-zinc-400">UG-{lead.id}</span>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${stages.find((item) => item.key === lead.stage)?.tone ?? "bg-zinc-100 text-zinc-700"}`}>{stageLabel}</span>
            </div>
            <p className="mt-1 break-all text-sm text-zinc-600">{lead.email}{lead.phone ? ` · ${lead.phone}` : ""}</p>
            <p className="mt-2 text-xs text-zinc-500">
              <span className="font-semibold text-zinc-700">{lead.leadSource || lead.enquiryType || "Unspecified source"}</span>
              <span className="mx-2 text-zinc-300">/</span>Received {formatDate(lead.createdAt, true)}
            </p>
          </div>
          <div className="shrink-0 rounded-lg bg-[#f2f6f2] px-3 py-2 text-right">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Actual revenue</span>
            <span className="font-mono text-sm font-bold text-[#276448]">{moneyLabel(lead.revenueAmountMinor, lead.revenueCurrency)}</span>
          </div>
        </div>
        {lead.message && <p className="mt-4 whitespace-pre-wrap border-l-2 border-[#8aab91] pl-3 text-sm leading-relaxed text-zinc-700">{lead.message}</p>}
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2" aria-label="Lead lifecycle milestones">
          {milestones.map(([label, date]) => <div key={label} className="flex items-center gap-2 text-xs">
            <span className={`h-1.5 w-1.5 rounded-full ${date ? "bg-[#43825d]" : "bg-zinc-300"}`} />
            <span className={date ? "font-semibold text-zinc-700" : "text-zinc-400"}>{label}</span>
            <span className="text-zinc-500">{date ? formatDate(date) : "—"}</span>
          </div>)}
        </div>
      </div>

      <div className="grid gap-x-4 gap-y-4 bg-[#fbfcfa] px-5 py-5 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <label className={labelClass}>Pipeline stage
          <select aria-label={`Stage for lead ${lead.id}`} value={stage} onChange={(event) => setStage(event.target.value)} className={inputClass}>
            {leadStages.map((value) => <option key={value} value={value}>{value.charAt(0).toUpperCase() + value.slice(1)}</option>)}
          </select>
        </label>
        <label className={labelClass}>Quote value · GBP
          <Input aria-label={`Quote value for lead ${lead.id}`} inputMode="decimal" value={quote} onChange={(event) => setQuote(event.target.value)} placeholder="Not recorded" className="mt-1 h-10 bg-white" />
        </label>
        <label className={labelClass}>Actual revenue · GBP
          <Input aria-label={`Actual revenue for lead ${lead.id}`} inputMode="decimal" value={revenue} onChange={(event) => setRevenue(event.target.value)} placeholder="Not recorded" className="mt-1 h-10 bg-white" />
        </label>
        <label className={labelClass}>Inspection date
          <Input aria-label={`Inspection date for lead ${lead.id}`} type="date" value={inspectionDate} onChange={(event) => setInspectionDate(event.target.value)} className="mt-1 h-10 bg-white" />
        </label>
        <label className={labelClass}>Booking reference
          <Input aria-label={`Booking reference for lead ${lead.id}`} value={bookingReference} onChange={(event) => setBookingReference(event.target.value)} maxLength={255} placeholder="Optional" className="mt-1 h-10 bg-white" />
        </label>
        <label className={labelClass}>Lost reason{stage === "lost" && lead.stage !== "lost" ? <span className="ml-1 text-rose-700">Required</span> : null}
          <Input aria-label={`Lost reason for lead ${lead.id}`} value={lostReason} onChange={(event) => setLostReason(event.target.value)} maxLength={1000} placeholder="Optional unless marking Lost" className="mt-1 h-10 bg-white" />
        </label>
        <label className={labelClass}>Transition note
          <Input aria-label={`Transition note for lead ${lead.id}`} value={note} onChange={(event) => setNote(event.target.value)} maxLength={1000} placeholder="Optional; saved with stage change" className="mt-1 h-10 bg-white" />
        </label>
        <div className="flex items-end">
          <Button onClick={save} disabled={saving} className="h-10 w-full bg-[#276448] text-white hover:bg-[#1f523a]">{saving ? "Saving…" : "Save changes"}</Button>
        </div>
        {notice && <p role={notice.error ? "alert" : "status"} className={`self-center text-sm sm:col-span-2 lg:col-span-4 ${notice.error ? "text-rose-700" : "text-[#276448]"}`}>{notice.text}</p>}
        <p className="text-[11px] leading-relaxed text-zinc-500 sm:col-span-2 lg:col-span-4">Amounts are recorded in GBP. Record verified revenue only; this does not send offline ad conversions.</p>
      </div>

      <div className="border-t border-zinc-100 px-5 sm:px-6">
        <details className="group py-3">
          <summary className="cursor-pointer list-none text-sm font-semibold text-[#276448] [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="text-xs">+</span> First and last touch attribution</span>
          </summary>
          <div className="mt-3 grid gap-5 rounded-lg bg-[#f6f8f5] p-4 sm:grid-cols-2">
            <TouchDetails label="First touch" touch={lead.attribution?.firstTouch} />
            <TouchDetails label="Last touch" touch={lead.attribution?.lastTouch} />
          </div>
        </details>
        <div className="border-t border-zinc-100 py-3">
          <button type="button" aria-expanded={showHistory} onClick={() => setShowHistory((current) => !current)} className="text-sm font-semibold text-[#276448] hover:underline">
            {showHistory ? "Hide stage history" : "View stage history"}
          </button>
          {showHistory && <div className="mt-3 rounded-lg bg-[#f6f8f5] p-4">
            {history.isLoading && <p role="status" className="text-sm text-zinc-500">Loading history…</p>}
            {history.error && <div role="alert" className="flex flex-wrap items-center gap-3 text-sm text-rose-700"><span>Could not load stage history.</span><Button size="sm" variant="outline" onClick={() => void history.refetch()}>Retry</Button></div>}
            {history.data && history.data.history.length === 0 && <p className="text-sm text-zinc-500">No recorded stage transitions.</p>}
            {history.data && history.data.history.length > 0 && <ol className="space-y-3">
              {history.data.history.map((item) => <li key={item.id} className="relative border-l border-[#a9c0aa] pl-4">
                <span className="absolute -left-[4px] top-1 h-2 w-2 rounded-full bg-[#43825d]" />
                <p className="text-sm font-semibold text-zinc-800">{item.fromStage} <span className="px-1 text-zinc-400">→</span> {item.toStage}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{formatDate(item.changedAt, true)}</p>
                {item.note && <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700">{item.note}</p>}
              </li>)}
            </ol>}
          </div>}
        </div>
      </div>
    </article>
  );
}

export default function ManageLeads() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const client = useQueryClient();
  const [filters, setFilters] = useState<Filters>({ stage: "", source: "", from: "", to: "", includeNonSales: false });
  const [page, setPage] = useState(0);
  const queryParams = queryString(filters, page * PAGE_SIZE);
  // Keep the overview across all stages when drilling into one stage's list.
  const summaryParams = queryString({ ...filters, stage: "" });
  const enabled = isAuthenticated && user?.role === "admin";
  const query = useQuery<LeadResponse>({
    queryKey: ["/api/admin/leads", queryParams],
    enabled,
    queryFn: async () => (await apiRequest("GET", `/api/admin/leads?${queryParams}`)).json(),
  });
  const summary = useQuery<MarketingSummary>({
    queryKey: ["/api/admin/marketing-summary", summaryParams],
    enabled,
    queryFn: async () => (await apiRequest("GET", `/api/admin/marketing-summary?${summaryParams}`)).json(),
  });
  const updateFilter = (key: keyof Filters, value: string | boolean) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(0);
  };
  async function refreshLeadData() {
    await Promise.all([
      client.invalidateQueries({ queryKey: ["/api/admin/leads"] }),
      client.invalidateQueries({ queryKey: ["/api/admin/marketing-summary"] }),
    ]);
  }
  const totalPages = Math.max(1, Math.ceil((query.data?.total ?? 0) / PAGE_SIZE));
  const values = summary.data?.valuesByCurrency ?? [];
  const quoteTotals = values.map((item) => `${moneyLabel(item.quoteValueMinor, item.currency)} quoted`).join(" · ");
  const realizedTotals = values.map((item) => `${moneyLabel(item.bookedOrCompletedRevenueMinor, item.currency)} booked/completed`).join(" · ");

  if (authLoading) return <main className="min-h-[70dvh] px-6 pt-28"><div className="mx-auto max-w-6xl animate-pulse space-y-4"><div className="h-4 w-40 rounded bg-zinc-200" /><div className="h-10 w-72 rounded bg-zinc-200" /><div className="h-24 rounded-xl bg-zinc-100" /></div></main>;
  if (!enabled) return <main className="min-h-[70dvh] px-6 pt-28"><div className="mx-auto max-w-4xl rounded-xl border border-zinc-200 bg-white p-8"><h1 className="text-xl font-bold text-zinc-900">Admin access required</h1><p className="mt-2 text-sm text-zinc-600">Sign in with an administrator account to manage leads.</p></div></main>;

  return (
    <main className="min-h-[100dvh] bg-[#f7f8f5] px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-[#276448] hover:underline">← Back to dashboard</Link>
        <header className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#64826b]">UrbanGrid · Sales operations</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#24372c] sm:text-4xl">Lead pipeline</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">Follow every inspection enquiry from first contact to verified revenue. Funnel counts use lead creation date; activity reflects stage changes in the selected period.</p>
          </div>
          <div className="rounded-lg border border-[#dce5dc] bg-white px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Reporting timezone</p>
            <p className="mt-1 text-sm font-semibold text-zinc-800">Europe / London · inclusive dates (GMT/BST)</p>
          </div>
        </header>
        <div className="mt-4 flex flex-wrap gap-2">
        </div>

        <section aria-label="Lead funnel summary" className="mt-7">
          {summary.isLoading && <div className="grid animate-pulse grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{stages.map((item) => <div key={item.key} className="h-24 rounded-xl border border-zinc-200 bg-white" />)}</div>}
          {summary.error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><span>Funnel summary could not be loaded.</span><Button variant="outline" size="sm" onClick={() => void summary.refetch()}>Retry summary</Button></div>}
          {summary.data && <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {stages.map((item) => <button type="button" key={item.key} onClick={() => updateFilter("stage", filters.stage === item.key ? "" : item.key)} aria-label={`Filter leads by ${item.label}`} aria-pressed={filters.stage === item.key} className={`rounded-xl border border-zinc-200 bg-white px-4 py-4 text-left transition-colors hover:border-[#9db79f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fa488] ${filters.stage === item.key ? "ring-2 ring-[#7fa488]" : ""}`}>
                <span className="block text-xs font-semibold text-zinc-500">{item.label}</span>
                <span className="mt-2 block font-mono text-2xl font-bold tracking-tight text-[#263a2e]">{summary.data?.countsByStage[item.key] ?? 0}</span>
              </button>)}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-[#dce5dc] bg-[#edf3ec] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#55745c]">Commercial value · {summary.data.funnel.quoted} quoted leads</p>
                <p className="mt-1 text-sm font-semibold text-[#263a2e]">{quoteTotals || "No quote values recorded"}</p>
              </div>
              <div className="rounded-lg border border-[#dce5dc] bg-white px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Verified booked / completed revenue</p>
                <p className="mt-1 text-sm font-semibold text-[#263a2e]">{realizedTotals || "No actual revenue recorded"}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-zinc-200 bg-white px-4 py-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Stage activity in range</span>
              {["qualified", "quoted", "booked", "completed", "lost"].map((name) => <span key={name} className="text-xs text-zinc-600"><strong className="font-mono text-zinc-900">{summary.data?.activity[name] ?? 0}</strong> {name}</span>)}
              {summary.data.legacyLifecycleWithoutTimestamps > 0 && <span className="text-xs text-amber-800">{summary.data.legacyLifecycleWithoutTimestamps} legacy lifecycle records lack timestamps</span>}
            </div>
          </>}
        </section>

        <section aria-label="Lead filters" className="mt-7 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-zinc-800">Filter the working queue</h2>
            {(filters.stage || filters.source || filters.from || filters.to || filters.includeNonSales) && <button type="button" onClick={() => { setFilters({ stage: "", source: "", from: "", to: "", includeNonSales: false }); setPage(0); }} className="text-xs font-semibold text-[#276448] hover:underline">Clear filters</button>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <label className={labelClass}>Stage
              <select aria-label="Filter lead stage" value={filters.stage} onChange={(event) => updateFilter("stage", event.target.value)} className={inputClass}>
                <option value="">All stages</option>{stages.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              </select>
            </label>
            <label className={labelClass}>Lead source
              <select aria-label="Filter lead source" value={filters.source} onChange={(event) => updateFilter("source", event.target.value)} className={inputClass}>
                <option value="">All sources</option>{(summary.data?.sources ?? []).map((source) => <option key={source} value={source}>{source}</option>)}
              </select>
            </label>
            <label className={labelClass}>Created from
              <Input aria-label="Created from date" type="date" value={filters.from} max={filters.to || undefined} onChange={(event) => updateFilter("from", event.target.value)} className="mt-1 h-10" />
            </label>
            <label className={labelClass}>Created to
              <Input aria-label="Created to date" type="date" value={filters.to} min={filters.from || undefined} onChange={(event) => updateFilter("to", event.target.value)} className="mt-1 h-10" />
            </label>
            <label className="flex min-h-10 items-center gap-3 self-end rounded-md border border-zinc-200 bg-[#f9fbf8] px-3 py-2 text-sm text-zinc-700">
              <input type="checkbox" checked={filters.includeNonSales} onChange={(event) => updateFilter("includeNonSales", event.target.checked)} className="h-4 w-4 accent-[#276448]" />
              Include non-sales
            </label>
          </div>
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#263a2e]">Enquiries</h2>
            <p className="text-xs text-zinc-500">{query.data ? `${query.data.total} matching leads` : "Loading working queue"}</p>
          </div>
          <p className="text-xs text-zinc-500">Sorted by most recently received</p>
        </div>
        {query.isLoading && <div className="mt-4 space-y-4" aria-label="Loading leads">{[0, 1, 2].map((item) => <div key={item} className="animate-pulse rounded-xl border border-zinc-200 bg-white p-6"><div className="h-5 w-48 rounded bg-zinc-200" /><div className="mt-4 h-16 rounded bg-zinc-100" /></div>)}</div>}
        {query.error && <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800"><p className="font-semibold">Could not load leads. Check the admin session and try again.</p><Button variant="outline" className="mt-3" onClick={() => void query.refetch()}>Retry</Button></div>}
        {query.data && query.data.leads.length > 0 && <div className="mt-4 space-y-4">{query.data.leads.map((lead) => <LeadCard key={lead.id} lead={lead} onSaved={refreshLeadData} />)}</div>}
        {query.data && query.data.leads.length === 0 && <div className="mt-4 rounded-xl border border-dashed border-[#bdcdbd] bg-white px-6 py-12 text-center">
          <p className="text-sm font-bold text-zinc-800">No leads match this view</p>
          <p className="mt-1 text-sm text-zinc-500">Try widening the date range or clearing one of the filters.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setFilters({ stage: "", source: "", from: "", to: "", includeNonSales: false }); setPage(0); }}>Reset filters</Button>
        </div>}
        {query.data && query.data.total > 0 && <nav aria-label="Lead pages" className="mt-6 flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3">
          <Button variant="outline" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>Previous</Button>
          <span className="text-xs font-medium text-zinc-600">Page {page + 1} of {totalPages} <span className="hidden sm:inline">· {PAGE_SIZE} leads per page</span></span>
          <Button variant="outline" disabled={page + 1 >= totalPages} onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}>Next</Button>
        </nav>}
      </div>
    </main>
  );
}