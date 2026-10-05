import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { request } from "@/lib/bookingApi";
import { calculateInspectionPrice, formatAed, residentialServices } from "@shared/inspectionPricing";
import type { AdminBookingInput, BookingView } from "@shared/booking";
import { apiRequest } from "@/lib/queryClient";

type Summary = {
  bookedValueMinor: number;
  cashCollectedMinor: number;
  paymentOutstandingMinor: number;
  completedRevenueMinor: number;
  bySource: { source: string; campaign: string | null; gclidPresent: boolean; bookings: number; bookedValueMinor: number; cashCollectedMinor: number }[];
};
type AdminResponse = { bookings: BookingView[]; summary: Summary; paymentSetup: { onlinePaymentEnabled: boolean; testMode: boolean; webhookEnabled: boolean } };
type AuditItem = { id: number; action: string; actor: string; details: unknown; createdAt: string };
const inputClass = "mt-1 h-10 w-full rounded-md border border-[#d8d5c9] bg-[#fffefa] px-3 text-sm text-[#25352c] outline-none focus:border-[#286548] focus:ring-2 focus:ring-[#286548]/15";
const emirates = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];
const statuses = ["booked", "completed", "lost"] as const;
function localDate(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Dubai" });
}
function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16); });
}
function amountToMinor(value: string) {
  const trimmed = value.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(trimmed)) throw new Error("Enter an amount in AED with up to two decimal places.");
  const parts = trimmed.split(".");
  const minor = Number(parts[0]) * 100 + Number((parts[1] || "").padEnd(2, "0"));
  if (!Number.isSafeInteger(minor) || minor <= 0 || minor > 2147483647) throw new Error("Enter a positive amount within the supported limit.");
  return minor;
}
function dateLabel(value?: string | null) {
  if (!value) return "Not set";
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-AE", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Dubai" }).format(date);
}
function timestampLabel(value: string) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : new Intl.DateTimeFormat("en-AE", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dubai" }).format(d);
}
const badgeTone: Record<string, string> = {
  booked: "bg-[#e8f0e5] text-[#285e42]", completed: "bg-[#dcebe2] text-[#24533b]", lost: "bg-[#f5e8e3] text-[#8a4438]",
};
type CreateForm = Omit<AdminBookingInput, "attribution">;
type BookingLead = { id: number; name: string; email: string; phone: string | null; stage: string; createdAt: string | Date };
const emptyForm = (): CreateForm => ({
  submissionKey: uuid(), service: "new-build-snagging", propertyType: "Apartment", areaSqft: 1000,
  project: "", location: "", emirate: "Dubai", inspectionDate: "", name: "", email: "", phone: "",
});

function BookingRecord({ booking, refresh, onlinePaymentEnabled, testMode }: { booking: BookingView; refresh: () => Promise<void>; onlinePaymentEnabled: boolean; testMode: boolean }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<(typeof statuses)[number]>("booked");
  const [statusNote, setStatusNote] = useState("");
  const [paymentType, setPaymentType] = useState<"full" | "refund">("full");
  const [amount, setAmount] = useState("");
  const [paidAt, setPaidAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [paymentReference, setPaymentReference] = useState("");
  const [providerNote, setProviderNote] = useState("");
  const [provider, setProvider] = useState<"ziina_manual" | "bank_transfer" | "cash" | "other">("bank_transfer");
  const [notice, setNotice] = useState<{ text: string; error?: boolean } | null>(null);
  const [paymentLinks, setPaymentLinks] = useState<{ redirectUrl: string; accessUrl: string } | null>(null);
  const client = useQueryClient();
  const audit = useQuery({
    queryKey: ["admin-booking-audit", booking.id],
    enabled: open,
    queryFn: async () => request<{ audit: AuditItem[] }>(`/api/admin/bookings/${booking.id}/audit`),
  });
  const action = useMutation({
    mutationFn: () => request(`/api/admin/bookings/${booking.id}/action`, { status, note: statusNote.trim() }),
    onSuccess: async () => { setNotice({ text: "Booking status updated." }); setStatusNote(""); await refresh(); await client.invalidateQueries({ queryKey: ["admin-booking-audit", booking.id] }); },
    onError: (error: Error) => setNotice({ text: error.message || "Could not update booking status.", error: true }),
  });
  const externalPayment = useMutation({
    mutationFn: () => {
      if (!booking.inspectionCompletedAt) throw new Error("Offline payment can only be recorded after the inspection is completed.");
      const amountMinor = amountToMinor(amount);
      if (paymentType === "full" && amountMinor !== booking.amountOutstandingMinor) {
        throw new Error(`A full payment must match the outstanding amount of ${formatAed(booking.amountOutstandingMinor)}.`);
      }
      return request(`/api/admin/bookings/${booking.id}/external-payment`, {
      paymentType, amountMinor, paidAt: new Date(paidAt).toISOString(),
      reference: paymentReference.trim(), providerNote: providerNote.trim(), provider,
      });
    },
    onSuccess: async () => { setNotice({ text: "Offline payment recorded." }); setAmount(""); setPaymentReference(""); setProviderNote(""); await refresh(); await client.invalidateQueries({ queryKey: ["admin-booking-audit", booking.id] }); },
    onError: (error: Error) => setNotice({ text: error.message || "Could not record payment.", error: true }),
  });
  const requestPayment = useMutation({
    mutationFn: () => {
      if (!booking.inspectionCompletedAt) throw new Error("Payment requests are available only after inspection completion.");
      return request<{ redirectUrl: string; paymentId: number; accessUrl: string }>(`/api/admin/bookings/${booking.id}/request-payment`, {});
    },
    onSuccess: async (result) => { setPaymentLinks({ redirectUrl: result.redirectUrl, accessUrl: result.accessUrl }); setNotice({ text: `Full payment request created · payment ${result.paymentId}.` }); await client.invalidateQueries({ queryKey: ["admin-booking-audit", booking.id] }); },
    onError: (error: Error) => setNotice({ text: error.message || "Could not create the full payment request.", error: true }),
  });
  async function copyLink(value: string, label: string) {
    try { await navigator.clipboard.writeText(value); setNotice({ text: `${label} copied.` }); }
    catch { setNotice({ text: "Copy was blocked. Select and copy the link.", error: true }); }
  }
  let enteredPaymentMinor = 0;
  try { enteredPaymentMinor = amountToMinor(amount); } catch {}
  const paymentAmountValid = enteredPaymentMinor > 0 && (paymentType === "refund" || enteredPaymentMinor === booking.amountOutstandingMinor);
  const source = booking.leadSource || "Unattributed";
  return (
    <article className="overflow-hidden rounded-xl border border-[#dedbd1] bg-[#fffefa] shadow-[0_4px_18px_rgba(40,60,45,0.035)]">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="grid w-full gap-4 p-4 text-left sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-center sm:p-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-bold text-[#286548]">{booking.bookingReference}</span><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${badgeTone[booking.status] || "bg-[#eeece4] text-[#626b63]"}`}>{booking.status}</span></div>
          <p className="mb-0 mt-2 truncate text-sm font-semibold text-[#25352c]">{booking.project} · {booking.emirate}</p>
          <p className="mb-0 mt-0.5 text-xs text-[#747d74]">{booking.service} · {booking.propertyType} · {booking.areaSqft.toLocaleString()} sq ft</p>
        </div>
        <div><p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#879087]">Quoted total / outstanding</p><p className="mb-0 text-sm font-semibold">{formatAed(booking.quoteTotalMinor)} <span className="font-normal text-[#7b837b]">/ {formatAed(booking.amountOutstandingMinor)}</span></p></div>
        <div><p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#879087]">Inspection / source</p><p className="mb-0 text-sm font-semibold">{dateLabel(booking.inspectionDate)}</p><p className="mb-0 mt-0.5 truncate text-xs text-[#747d74]">{source}{booking.campaign ? ` · ${booking.campaign}` : ""}</p></div>
        <span className="text-xs font-semibold text-[#286548]">{open ? "Close details −" : "Manage booking +"}</span>
      </button>
      {open && <div className="border-t border-[#e9e6dd] p-4 sm:p-5">
        <div className="grid gap-x-8 gap-y-5 lg:grid-cols-[1fr_1fr]">
          <section>
            <h3 className="text-sm font-bold">Booking & payment record</h3>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
              <div><dt className="text-[#7b837b]">Contact</dt><dd className="mt-0.5 break-all font-medium text-[#34443a]">{booking.leadId ? `Lead ${booking.leadId}` : "Offline booking"}</dd></div>
              <div><dt className="text-[#7b837b]">Booking status / lead stage</dt><dd className="mt-0.5 font-medium capitalize text-[#34443a]">{booking.status} / {booking.leadStage}</dd></div>
              <div><dt className="text-[#7b837b]">Inspection completed</dt><dd className="mt-0.5 font-medium">{booking.inspectionCompletedAt ? timestampLabel(booking.inspectionCompletedAt) : "Not completed"}</dd></div>
              <div><dt className="text-[#7b837b]">Report status</dt><dd className="mt-0.5 font-medium">{booking.reportStatus}</dd></div>
              <div><dt className="text-[#7b837b]">Amount outstanding</dt><dd className="mt-0.5 font-medium">{formatAed(booking.amountOutstandingMinor)}</dd></div>
              <div><dt className="text-[#7b837b]">Cash collected / payment status</dt><dd className="mt-0.5 font-medium">{formatAed(booking.cashCollectedMinor)} / {booking.paymentStatus}</dd></div>
              <div><dt className="text-[#7b837b]">GCLID captured</dt><dd className="mt-0.5 font-medium">{booking.gclid ? "Yes" : "No"}</dd></div>
              <div className="col-span-2"><dt className="text-[#7b837b]">Location</dt><dd className="mt-0.5 font-medium">{booking.location}</dd></div>
            </dl>
            <div className="mt-4 rounded-lg bg-[#f4f2e9] p-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#727d73]">Payment attempts</p>
              {booking.payments.length ? <ul className="space-y-2">{booking.payments.map((payment) => <li key={payment.id} className="flex flex-wrap justify-between gap-2 text-xs"><span className="capitalize">{payment.paymentType} · {payment.provider} · {payment.status}{payment.verifiedOnline ? " · provider verified" : ""}</span><span className="font-mono font-semibold">{formatAed(payment.amountMinor)}{payment.completedAt ? ` · ${timestampLabel(payment.completedAt)}` : ""}</span></li>)}</ul> : <p className="mb-0 text-xs text-[#7b837b]">No payment attempts recorded.</p>}
            </div>
          </section>
          <section>
            <h3 className="text-sm font-bold">Record a status change</h3>
            <p className="mb-0 mt-1 text-xs leading-5 text-[#747d74]">Mark Completed only after the physical inspection has taken place. A required note is recorded in the audit trail.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[150px_1fr]">
              <label className="text-[11px] font-semibold text-[#69746b]">New status
                <select value={status} onChange={(e) => setStatus(e.target.value as (typeof statuses)[number])} className={inputClass}>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
              </label>
              <label className="text-[11px] font-semibold text-[#69746b]">Required note
                <Input value={statusNote} onChange={(e) => setStatusNote(e.target.value)} maxLength={1000} placeholder="Reason for this status update" className="mt-1 h-10" />
              </label>
            </div>
            <Button onClick={() => { setNotice(null); action.mutate(); }} disabled={action.isPending || !statusNote.trim()} className="mt-3 h-9 bg-[#286548] text-white hover:bg-[#204f38]">{action.isPending ? "Saving…" : "Update status"}</Button>
            <div className="mt-5 border-t border-[#e9e6dd] pt-4">
              <h3 className="text-sm font-bold">Record offline payment</h3>
              {!booking.inspectionCompletedAt && <p className="mb-0 mt-1 rounded-md bg-[#f3f2e9] p-3 text-xs text-[#687269]">Available only after staff record the completed physical inspection.</p>}
              {booking.inspectionCompletedAt && testMode && <p className="mb-0 mt-1 rounded-md border border-[#e4d5b8] bg-[#fcf6e9] p-3 text-xs font-semibold text-[#735a2d]">Online provider is in test mode. Do not treat an online test payment as collected revenue.</p>}
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="text-[11px] font-semibold text-[#69746b]">Payment type
                  <select value={paymentType} onChange={(e) => setPaymentType(e.target.value as typeof paymentType)} className={inputClass}><option value="full">Full payment</option><option value="refund">Refund</option></select>
                </label>
                <label className="text-[11px] font-semibold text-[#69746b]">Amount · AED
                  <Input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="mt-1 h-10" />
                  <span className="mt-1 block text-[10px] font-normal text-[#7b837b]">{paymentType === "full" ? `Enter exact outstanding amount · ${formatAed(booking.amountOutstandingMinor)}` : "Enter refund amount"}</span>
                </label>
                <label className="text-[11px] font-semibold text-[#69746b]">Paid at
                  <Input type="datetime-local" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} className="mt-1 h-10" />
                </label>
                <label className="text-[11px] font-semibold text-[#69746b]">Provider
                  <select value={provider} onChange={(e) => setProvider(e.target.value as typeof provider)} className={inputClass}>{[["ziina_manual", "Ziina · manual"], ["bank_transfer", "Bank transfer"], ["cash", "Cash"], ["other", "Other"]].map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
                </label>
                <label className="text-[11px] font-semibold text-[#69746b]">Payment reference *
                  <Input required value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} maxLength={255} className="mt-1 h-10" />
                </label>
                <label className="text-[11px] font-semibold text-[#69746b]">Provider note *
                  <Input required value={providerNote} onChange={(e) => setProviderNote(e.target.value)} maxLength={1000} className="mt-1 h-10" />
                </label>
              </div>
              <Button onClick={() => { setNotice(null); externalPayment.mutate(); }} disabled={!booking.inspectionCompletedAt || externalPayment.isPending || !paymentAmountValid || !paymentReference.trim() || !providerNote.trim() || !paidAt} variant="outline" className="mt-3">{externalPayment.isPending ? "Recording…" : "Record full payment or refund"}</Button>
            </div>
            <div className="mt-5 border-t border-[#e9e6dd] pt-4">
              <h3 className="text-sm font-bold">Private booking / payment link</h3>
              <p className="mb-2 mt-1 text-xs text-[#747d74]">Generate links only after physical inspection completion. The hosted request is full payment; the private link opens booking status.</p>
              {!booking.inspectionCompletedAt && <p className="mb-2 rounded-md bg-[#f3f2e9] p-3 text-xs text-[#687269]">Payment links are unavailable until staff mark the inspection completed.</p>}
              {booking.inspectionCompletedAt && !onlinePaymentEnabled && <p className="mb-2 rounded-md bg-[#f3f2e9] p-3 text-xs text-[#687269]">Online checkout is not enabled; the private status link is still available from the generated response.</p>}
              {booking.inspectionCompletedAt && booking.amountOutstandingMinor > 0 && <Button variant="outline" size="sm" onClick={() => requestPayment.mutate()} disabled={requestPayment.isPending}>{requestPayment.isPending ? "Creating…" : onlinePaymentEnabled ? `Create full-payment request · ${formatAed(booking.amountOutstandingMinor)}` : "Create private booking/payment link"}</Button>}
              {booking.inspectionCompletedAt && booking.amountOutstandingMinor <= 0 && <p className="mb-2 rounded-md bg-[#eaf1e8] p-3 text-xs text-[#285e42]">No payment is outstanding on this booking.</p>}
              {paymentLinks && <div className="mt-3 space-y-3">
                <div><label className="text-[10px] font-semibold text-[#69746b]">Hosted full-payment request</label><div className="flex flex-wrap gap-2"><input readOnly aria-label="Hosted full-payment request link" value={paymentLinks.redirectUrl} className="min-w-0 flex-1 rounded-md border border-[#d8d5c9] bg-white px-2 py-2 text-xs" /><Button size="sm" variant="outline" onClick={() => copyLink(paymentLinks.redirectUrl, "Payment request link")}>Copy</Button></div></div>
                <div><label className="text-[10px] font-semibold text-[#69746b]">Private booking / payment status</label><div className="flex flex-wrap gap-2"><input readOnly aria-label="Private booking and payment link" value={paymentLinks.accessUrl} className="min-w-0 flex-1 rounded-md border border-[#d8d5c9] bg-white px-2 py-2 text-xs" /><Button size="sm" variant="outline" onClick={() => copyLink(paymentLinks.accessUrl, "Private booking link")}>Copy</Button></div></div>
              </div>}
            </div>
          </section>
        </div>
        {notice && <p role={notice.error ? "alert" : "status"} className={`mt-4 rounded-lg p-3 text-xs ${notice.error ? "bg-rose-50 text-rose-800" : "bg-[#eaf1e8] text-[#285e42]"}`}>{notice.text}</p>}
        <section className="mt-5 border-t border-[#e9e6dd] pt-4">
          <h3 className="text-sm font-bold">Audit trail</h3>
          {audit.isLoading && <p className="mt-2 text-xs text-[#7b837b]">Loading audit trail…</p>}
          {audit.error && <div role="alert" className="mt-2 flex items-center gap-3 text-xs text-rose-800"><span>Could not load audit trail.</span><Button size="sm" variant="outline" onClick={() => void audit.refetch()}>Retry</Button></div>}
          {audit.data?.audit.length === 0 && <p className="mt-2 text-xs text-[#7b837b]">No audit events have been recorded.</p>}
          {audit.data?.audit.length ? <ol className="mt-3 space-y-3">{audit.data.audit.map((event) => <li key={event.id} className="border-l-2 border-[#a8c0a9] pl-3"><p className="mb-0 text-xs font-semibold text-[#34443a]">{event.action} <span className="font-normal text-[#7b837b]">· {event.actor}</span></p><p className="mb-0 mt-0.5 text-[10px] text-[#7b837b]">{timestampLabel(event.createdAt)}</p><pre className="mt-1 whitespace-pre-wrap break-words text-[10px] text-[#687269]">{typeof event.details === "string" ? event.details : JSON.stringify(event.details, null, 2)}</pre></li>)}</ol> : null}
        </section>
      </div>}
    </article>
  );
}

export default function Bookings() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const client = useQueryClient();
  const [from, setFrom] = useState(() => localDate(30));
  const [to, setTo] = useState(() => localDate());
  const [source, setSource] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateForm>(emptyForm);
  const [bookingMode, setBookingMode] = useState<"new" | "existing">("new");
  const [leadSearch, setLeadSearch] = useState("");
  const [debouncedLeadSearch, setDebouncedLeadSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<BookingLead | null>(null);
  const [createError, setCreateError] = useState("");
  const [createNotice, setCreateNotice] = useState("");
  const enabled = isAuthenticated && user?.role === "admin";
  const retryKey = useRef(form.submissionKey);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedLeadSearch(leadSearch.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [leadSearch]);
  const leadSearchQuery = useQuery<{ leads: BookingLead[] }>({
    queryKey: ["/api/admin/booking-leads", debouncedLeadSearch],
    enabled: enabled && showCreate && bookingMode === "existing" && debouncedLeadSearch.length >= 2,
    queryFn: async () => (await apiRequest("GET", `/api/admin/booking-leads?q=${encodeURIComponent(debouncedLeadSearch)}`)).json(),
  });
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (source) params.set("source", source);
  const queryString = params.toString();
  const query = useQuery({
    queryKey: ["admin-bookings", queryString],
    enabled,
    queryFn: () => request<AdminResponse>(`/api/admin/bookings?${queryString}`),
  });
  const price = useMemo(() => {
    try { return calculateInspectionPrice(form.service, Number(form.areaSqft)); } catch { return null; }
  }, [form.service, form.areaSqft]);
  const create = useMutation({
    mutationFn: () => request<{ booking: BookingView }>("/api/admin/bookings", {
      ...form, submissionKey: retryKey.current, areaSqft: Number(form.areaSqft),
      ...(selectedLead ? { existingLeadId: selectedLead.id } : {}),
    }),
    onSuccess: async (result) => {
      setCreateNotice(`Offline quote ${result.booking.bookingReference} created.`);
      setCreateError(""); setSelectedLead(null); setBookingMode("new"); setLeadSearch(""); setDebouncedLeadSearch("");
      const next = emptyForm(); retryKey.current = next.submissionKey; setForm(next);
      await Promise.all([
        client.invalidateQueries({ queryKey: ["admin-bookings"] }),
        client.invalidateQueries({ queryKey: ["/api/admin/acquisition"] }),
        client.invalidateQueries({ queryKey: ["/api/admin/leads"] }),
        client.invalidateQueries({ queryKey: ["/api/admin/marketing-summary"] }),
      ]);
    },
    onError: (error: Error) => setCreateError(error.message || "Could not create offline booking."),
  });
  async function refresh() { await client.invalidateQueries({ queryKey: ["admin-bookings"] }); }
  const visibleBookings = (query.data?.bookings ?? []).filter((booking) => {
    const searchTerm = search.trim().toLowerCase();
    const searchMatch = !searchTerm || [booking.bookingReference, booking.project, booking.location, booking.emirate, booking.service, booking.leadSource, booking.campaign].some((value) => value?.toLowerCase().includes(searchTerm));
    return searchMatch && (!statusFilter || booking.status === statusFilter);
  });
  function updateForm(key: keyof CreateForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  function changeBookingMode(mode: "new" | "existing") {
    setBookingMode(mode);
    setSelectedLead(null);
    setLeadSearch("");
    setDebouncedLeadSearch("");
    const next = emptyForm();
    retryKey.current = next.submissionKey;
    setForm(next);
    setCreateError("");
    setCreateNotice("");
  }
  function selectLead(lead: BookingLead) {
    const key = uuid();
    setSelectedLead(lead);
    retryKey.current = key;
    setForm((current) => ({ ...current, submissionKey: key, name: lead.name, email: lead.email, phone: lead.phone || "" }));
    setCreateError("");
    setCreateNotice("");
  }

  if (authLoading) return <main className="min-h-[70dvh] bg-[#f5f3eb] px-5 pt-28"><div className="mx-auto max-w-6xl animate-pulse space-y-4"><div className="h-4 w-36 rounded bg-[#dedbd1]" /><div className="h-10 w-64 rounded bg-[#dedbd1]" /><div className="h-28 rounded-xl bg-[#e9e6dc]" /></div></main>;
  if (!enabled) return <main className="min-h-[70dvh] bg-[#f5f3eb] px-5 pt-28"><div className="mx-auto max-w-4xl rounded-xl border border-[#dedbd1] bg-[#fffefa] p-8"><h1 className="text-xl font-bold">Admin access required</h1><p className="mt-2 text-sm text-[#687269]">Sign in with an administrator account to manage bookings.</p></div></main>;

  const metric = (label: string, value: number, note: string) => <div className="rounded-xl border border-[#dfddd3] bg-[#fffefa] px-4 py-4"><p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#7b837b]">{label}</p><p className="mb-1 font-mono text-xl font-semibold tracking-tight text-[#274433]">{formatAed(value)}</p><p className="mb-0 text-[10px] text-[#7b837b]">{note}</p></div>;
  return (
    <main className="min-h-[100dvh] bg-[#f5f3eb] px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="inline-flex text-sm font-semibold text-[#286548] hover:underline">← Back to dashboard</Link>
        <Link href="/admin/acquisition" className="ml-5 inline-flex text-sm font-semibold text-[#286548] hover:underline">Acquisition report →</Link>
        <header className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#64826b]">UrbanGrid · Sales operations</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#263a2e] sm:text-4xl">Inspection bookings</h1><p className="mb-0 mt-2 max-w-2xl text-sm leading-6 text-[#687269]">Quoted value, verified collections and outstanding payments in one operational view.</p></div>
          <Button onClick={() => { setShowCreate((value) => !value); setCreateError(""); setCreateNotice(""); }} className="bg-[#286548] text-white hover:bg-[#204f38]">{showCreate ? "Close offline booking" : "＋ New offline booking"}</Button>
        </header>
        {query.data && <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-[#d9e2d6] bg-[#eaf1e8] px-4 py-3 text-xs">
          <span className="font-bold uppercase tracking-wide text-[#526a56]">Payment setup</span><span>Online: <b>{query.data.paymentSetup.onlinePaymentEnabled ? "Configured" : "Pending"}</b></span><span>Mode: <b>{query.data.paymentSetup.testMode ? "Test" : "Live"}</b></span><span>Webhook secret: <b>{query.data.paymentSetup.webhookEnabled ? "Configured locally — verify provider registration" : "Not configured"}</b></span>
          {query.data.paymentSetup.testMode && <span className="basis-full font-semibold text-[#735a2d]">Test mode: online payments are simulated and are not actual payments.</span>}
        </div>}
        {showCreate && <section className="mt-5 rounded-2xl border border-[#d8ded4] bg-[#fffefa] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-semibold">Create offline inspection booking</h2><p className="mb-0 mt-1 text-xs text-[#747d74]">For WhatsApp and direct enquiries. The booking is confirmed at submission; no upfront payment is required.</p></div><p className="mb-0 rounded-md bg-[#f0eee5] px-3 py-2 text-[10px] font-semibold text-[#687269]">Retry keeps the same submission key</p></div>
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Enquiry source">
            <Button type="button" variant={bookingMode === "new" ? "default" : "outline"} onClick={() => changeBookingMode("new")} className={bookingMode === "new" ? "bg-[#286548] text-white hover:bg-[#204f38]" : ""}>New enquiry</Button>
            <Button type="button" variant={bookingMode === "existing" ? "default" : "outline"} onClick={() => changeBookingMode("existing")} className={bookingMode === "existing" ? "bg-[#286548] text-white hover:bg-[#204f38]" : ""}>Link existing enquiry</Button>
          </div>
          {bookingMode === "existing" && <div className="mt-4 rounded-xl border border-[#dce5dc] bg-[#f7f9f4] p-4">
            {selectedLead ? <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#55745c]">Original enquiry selected</p><p className="mb-1 text-sm font-semibold text-[#34443a]">Lead {selectedLead.id} · {selectedLead.name}</p><p className="mb-0 text-xs text-[#69746b]">{selectedLead.email}{selectedLead.phone ? ` · ${selectedLead.phone}` : " · No phone recorded"}</p><p className="mb-0 mt-2 max-w-2xl text-xs leading-5 text-[#69746b]">This booking will remain attached to the original lead, preserving first-touch attribution and enquiry history. No duplicate lead will be created.</p></div>
              <Button type="button" variant="outline" onClick={() => changeBookingMode("existing")}>Choose another lead</Button>
            </div> : <>
              <label className="block max-w-xl text-[11px] font-semibold text-[#69746b]">Search sales enquiries by name, email or lead ID
                <Input value={leadSearch} onChange={(event) => setLeadSearch(event.target.value)} placeholder="Enter at least 2 characters" className="mt-1 h-10 bg-white" />
              </label>
              {leadSearch.trim().length < 2 && <p className="mb-0 mt-3 text-xs text-[#788179]">Type at least two characters to find the first 25 matching sales enquiries.</p>}
              {leadSearch.trim().length >= 2 && leadSearch.trim() !== debouncedLeadSearch && <p role="status" className="mb-0 mt-3 text-xs text-[#788179]">Updating search…</p>}
              {leadSearch.trim().length >= 2 && leadSearch.trim() === debouncedLeadSearch && leadSearchQuery.isLoading && <p role="status" className="mb-0 mt-3 text-xs text-[#788179]">Searching enquiries…</p>}
              {leadSearch.trim().length >= 2 && leadSearch.trim() === debouncedLeadSearch && leadSearchQuery.error && <div role="alert" className="mt-3 flex flex-wrap items-center gap-3 text-xs text-rose-800"><span>Could not search enquiries.</span><Button type="button" size="sm" variant="outline" onClick={() => void leadSearchQuery.refetch()}>Retry search</Button></div>}
              {leadSearch.trim().length >= 2 && leadSearch.trim() === debouncedLeadSearch && leadSearchQuery.data && leadSearchQuery.data.leads.length === 0 && <p className="mb-0 mt-3 text-xs text-[#788179]">No matching sales enquiries. Try a different name, email or ID.</p>}
              {leadSearch.trim().length >= 2 && leadSearch.trim() === debouncedLeadSearch && leadSearchQuery.data && leadSearchQuery.data.leads.length > 0 && <ul className="mt-3 max-h-64 divide-y divide-[#e3e7df] overflow-y-auto rounded-lg border border-[#e3e7df] bg-white">
                {leadSearchQuery.data.leads.map((lead) => <li key={lead.id}><button type="button" onClick={() => selectLead(lead)} className="flex w-full flex-wrap items-center justify-between gap-2 px-3 py-3 text-left hover:bg-[#f2f6f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7fa488]">
                  <span><span className="block text-sm font-semibold text-[#34443a]">{lead.name} <span className="font-mono text-xs font-normal text-[#788179]">Lead {lead.id}</span></span><span className="mt-1 block text-xs text-[#788179]">{lead.email}{lead.phone ? ` · ${lead.phone}` : " · No phone"}</span></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#55745c]">{lead.stage}</span>
                </button></li>)}
              </ul>}
            </>}
          </div>}
          <form onSubmit={(e) => {
            e.preventDefault();
            if (bookingMode === "existing" && !selectedLead) { setCreateError("Select the original enquiry before creating its booking."); return; }
            if (create.isPending) return;
            setCreateError(""); setCreateNotice(""); create.mutate();
          }} className="mt-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-[11px] font-semibold text-[#69746b] lg:col-span-2">Inspection service *
                <select required value={form.service} onChange={(e) => updateForm("service", e.target.value)} className={inputClass}>{residentialServices.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select>
              </label>
              <label className="text-[11px] font-semibold text-[#69746b]">Property type *
                <select required value={form.propertyType} onChange={(e) => updateForm("propertyType", e.target.value)} className={inputClass}>{["Apartment", "Villa", "Townhouse", "Penthouse"].map((item) => <option key={item}>{item}</option>)}</select>
              </label>
              <label className="text-[11px] font-semibold text-[#69746b]">Area · sq ft *
                <Input required type="number" min="1" max="1000000" step="0.01" value={form.areaSqft} onChange={(e) => updateForm("areaSqft", e.target.value)} className="mt-1 h-10" />
              </label>
              <label className="text-[11px] font-semibold text-[#69746b]">Bedrooms
                <select value={form.bedrooms || ""} onChange={(e) => setForm((current) => { const next = { ...current }; if (e.target.value) next.bedrooms = e.target.value as NonNullable<CreateForm["bedrooms"]>; else delete next.bedrooms; return next; })} className={inputClass}><option value="">Optional</option>{["Studio", "1", "2", "3", "4", "5", "6+"].map((item) => <option key={item}>{item}</option>)}</select>
              </label>
              <label className="text-[11px] font-semibold text-[#69746b]">Project / building / community *
                <Input required maxLength={255} value={form.project} onChange={(e) => updateForm("project", e.target.value)} className="mt-1 h-10" />
              </label>
              <label className="text-[11px] font-semibold text-[#69746b]">Location / address *
                <Input required maxLength={255} value={form.location} onChange={(e) => updateForm("location", e.target.value)} className="mt-1 h-10" />
              </label>
              <label className="text-[11px] font-semibold text-[#69746b]">Emirate *
                <select required value={form.emirate} onChange={(e) => updateForm("emirate", e.target.value)} className={inputClass}>{emirates.map((item) => <option key={item}>{item}</option>)}</select>
              </label>
              <label className="text-[11px] font-semibold text-[#69746b]">Inspection date *
                <Input required type="date" value={form.inspectionDate} onChange={(e) => updateForm("inspectionDate", e.target.value)} className="mt-1 h-10" />
              </label>
              <label className="text-[11px] font-semibold text-[#69746b]">Preferred time window
                <Input maxLength={100} value={form.timeWindow || ""} onChange={(e) => setForm((current) => ({ ...current, timeWindow: e.target.value || undefined }))} className="mt-1 h-10" placeholder="Optional" />
              </label>
              <label className="text-[11px] font-semibold text-[#69746b]">Customer name *
                <Input required minLength={2} maxLength={255} readOnly={!!selectedLead} value={form.name} onChange={(e) => updateForm("name", e.target.value)} className={`mt-1 h-10 ${selectedLead ? "bg-[#f0efe8] text-[#69746b]" : ""}`} />
              </label>
              <label className="text-[11px] font-semibold text-[#69746b]">Email *
                <Input required type="email" maxLength={255} readOnly={!!selectedLead} value={form.email} onChange={(e) => updateForm("email", e.target.value)} className={`mt-1 h-10 ${selectedLead ? "bg-[#f0efe8] text-[#69746b]" : ""}`} />
              </label>
              <label className="text-[11px] font-semibold text-[#69746b]">Phone {selectedLead ? "(optional)" : "*"}
                <Input required={!selectedLead} type="tel" pattern={selectedLead ? undefined : "\\+?[\\d\\s()-]{7,50}"} maxLength={50} readOnly={!!selectedLead} value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} className={`mt-1 h-10 ${selectedLead ? "bg-[#f0efe8] text-[#69746b]" : ""}`} />
              </label>
            </div>
            {price ? <div className="mt-4 rounded-lg bg-[#eaf1e8] px-4 py-3 text-xs text-[#3f5845]"><p className="mb-1">Inspection fee: <b>{formatAed(price.baseMinor)}</b> · VAT: <b>{formatAed(price.vatMinor)}</b> · Total: <b>{formatAed(price.totalMinor)}</b></p><p className="mb-0 font-semibold">100% payment after inspection and before release of the final report.</p></div> : <p className="mb-0 mt-4 text-xs text-amber-800">Enter a valid single-property residential area up to 1,000,000 sq ft to calculate the standard price.</p>}
            {createError && <p role="alert" className="mb-0 mt-3 text-sm text-rose-700">{createError}</p>}
            {createNotice && <p role="status" className="mb-0 mt-3 text-sm text-[#286548]">{createNotice}</p>}
            <Button type="submit" disabled={create.isPending || !price || (bookingMode === "existing" && !selectedLead)} className="mt-4 bg-[#286548] text-white hover:bg-[#204f38]">{create.isPending ? "Saving booking…" : "Create offline booking"}</Button>
          </form>
        </section>}
        {query.data && <section aria-label="Booking financial summary" className="mt-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {metric("Booked value", query.data.summary.bookedValueMinor, "Quoted value in selected period")}
            {metric("Cash collected", query.data.summary.cashCollectedMinor, "Recorded payments and refunds")}
            {metric("Payment outstanding", query.data.summary.paymentOutstandingMinor, "Full amount due after completed inspection")}
            {metric("Completed revenue", query.data.summary.completedRevenueMinor, "Completed inspections")}
          </div>
        </section>}
        <section aria-label="Booking filters" className="mt-6 rounded-xl border border-[#dedbd1] bg-[#fffefa] p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <label className="text-[11px] font-semibold text-[#69746b]">From
              <Input type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} className="mt-1 h-10" />
            </label>
            <label className="text-[11px] font-semibold text-[#69746b]">To
              <Input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} className="mt-1 h-10" />
            </label>
            <label className="text-[11px] font-semibold text-[#69746b]">Lead source
              <select value={source} onChange={(e) => setSource(e.target.value)} className={inputClass}><option value="">All sources</option>{query.data?.summary.bySource.map((item) => <option key={item.source} value={item.source}>{item.source}</option>)}</select>
            </label>
            <label className="text-[11px] font-semibold text-[#69746b]">Search booking
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Reference, project, source…" className="mt-1 h-10" />
            </label>
            <label className="text-[11px] font-semibold text-[#69746b]">Status
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass}><option value="">All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
            </label>
          </div>
        </section>
        {query.data && query.data.summary.bySource.length > 0 && <section className="mt-5 rounded-xl border border-[#dedbd1] bg-[#fffefa] p-4 sm:p-5">
          <h2 className="text-sm font-bold">Attribution by source</h2>
          <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="border-b border-[#e9e6dd] text-[10px] uppercase tracking-wider text-[#7b837b]"><tr><th className="pb-2 pr-4">Source / campaign</th><th className="pb-2 pr-4">Bookings</th><th className="pb-2 pr-4">Booked value</th><th className="pb-2 pr-4">Cash collected</th><th className="pb-2">GCLID</th></tr></thead><tbody>{query.data.summary.bySource.map((item, index) => <tr key={`${item.source}-${item.campaign}-${index}`} className="border-b border-[#f0eee7] last:border-0"><td className="py-2.5 pr-4"><b>{item.source}</b><span className="ml-2 text-[#7b837b]">{item.campaign || "No campaign"}</span></td><td className="py-2.5 pr-4">{item.bookings}</td><td className="py-2.5 pr-4 font-mono">{formatAed(item.bookedValueMinor)}</td><td className="py-2.5 pr-4 font-mono">{formatAed(item.cashCollectedMinor)}</td><td className="py-2.5">{item.gclidPresent ? "Present" : "—"}</td></tr>)}</tbody></table></div>
        </section>}
        <div className="mt-7 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-semibold text-[#263a2e]">Bookings</h2><p className="mb-0 mt-1 text-xs text-[#7b837b]">{query.data ? `${visibleBookings.length} shown · ${query.data.bookings.length} in selected period` : "Fetching the selected period"}</p></div><span className="text-[10px] font-medium text-[#7b837b]">Reporting dates · UAE timezone</span></div>
        {query.isLoading && <div className="mt-4 space-y-3" aria-label="Loading bookings">{[0, 1, 2].map((i) => <div key={i} className="animate-pulse rounded-xl border border-[#dedbd1] bg-[#fffefa] p-5"><div className="h-4 w-40 rounded bg-[#e4e1d8]" /><div className="mt-3 h-8 rounded bg-[#f0eee7]" /></div>)}</div>}
        {query.error && <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800"><p className="mb-2 font-semibold">Could not load inspection bookings.</p><Button variant="outline" onClick={() => void query.refetch()}>Retry</Button></div>}
        {query.data && visibleBookings.length > 0 && <div className="mt-4 space-y-3">{visibleBookings.map((booking) => <BookingRecord key={booking.id} booking={booking} refresh={refresh} onlinePaymentEnabled={query.data.paymentSetup.onlinePaymentEnabled} testMode={query.data.paymentSetup.testMode} />)}</div>}
        {query.data && visibleBookings.length === 0 && <div className="mt-4 rounded-xl border border-dashed border-[#c9d3c7] bg-[#fffefa] px-6 py-12 text-center"><p className="text-sm font-bold">No bookings in this view</p><p className="mb-0 mt-1 text-xs text-[#7b837b]">Try a wider date range or clear a source, status or search filter.</p><Button variant="outline" className="mt-4" onClick={() => { setSource(""); setStatusFilter(""); setSearch(""); setFrom(""); setTo(""); }}>Clear filters</Button></div>}
      </div>
    </main>
  );
}