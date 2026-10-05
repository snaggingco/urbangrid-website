import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import type { AcquisitionGroup, AcquisitionMetrics, AcquisitionReport } from "@shared/acquisition";
import OperationsIntegrationStatus from "@/components/admin/OperationsIntegrationStatus";

function dubaiDate(daysAgo = 0) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dubai", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const date = new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day) - daysAgo));
  return date.toISOString().slice(0, 10);
}

function money(minor: number) {
  return new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 2 }).format(minor / 100);
}

function rate(value: number | null) {
  return value === null ? "—" : `${(value * 100).toFixed(1)}%`;
}

const number = (value: number) => value.toLocaleString("en-AE");

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="min-w-0 border-l-2 border-[#96b29b] py-1 pl-3">
    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.13em] text-[#778279]">{label}</p>
    <p className="mb-1 truncate font-mono text-xl font-semibold tracking-tight text-[#263a2e]">{value}</p>
    <p className="mb-0 text-[10px] leading-4 text-[#778279]">{detail}</p>
  </div>;
}

function MetricsTable({ groups }: { groups: AcquisitionGroup[] }) {
  return <div className="overflow-x-auto">
    <table className="w-full min-w-[1120px] border-collapse text-left text-xs">
      <thead className="bg-[#f2f4ed] text-[10px] uppercase tracking-wider text-[#647168]">
        <tr>
          <th className="px-3 py-3 font-bold">Source / medium / campaign</th>
          <th className="px-3 py-3 text-right font-bold">Leads</th>
          <th className="px-3 py-3 text-right font-bold">Booked leads</th>
          <th className="px-3 py-3 text-right font-bold">Lead → booking</th>
          <th className="px-3 py-3 text-right font-bold">Eligible bookings</th>
          <th className="px-3 py-3 text-right font-bold">Booked value</th>
          <th className="px-3 py-3 text-right font-bold">Completed service</th>
          <th className="px-3 py-3 text-right font-bold">Net cash</th>
          <th className="px-3 py-3 text-right font-bold">Outstanding</th>
          <th className="px-3 py-3 text-right font-bold">Avg. booked</th>
          <th className="px-3 py-3 text-right font-bold">GCLID leads / rate</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#e9e8df]">
        {groups.map((group, index) => <tr key={`${group.source}-${group.medium}-${group.campaign}-${index}`} className="align-top hover:bg-[#fbfcf8]">
          <th scope="row" className="max-w-[260px] px-3 py-3 font-medium text-[#34443a]">
            <span className="block truncate font-semibold">{group.source}</span>
            <span className="mt-1 block truncate text-[11px] font-normal text-[#788179]">{group.medium} / {group.campaign}</span>
          </th>
          <td className="px-3 py-3 text-right font-mono">{number(group.leads)}</td>
          <td className="px-3 py-3 text-right font-mono">{number(group.bookedLeads)}</td>
          <td className="px-3 py-3 text-right font-mono">{rate(group.leadToBookingRate)}</td>
          <td className="px-3 py-3 text-right font-mono">{number(group.eligibleBookings)}</td>
          <td className="px-3 py-3 text-right font-mono font-semibold text-[#315f43]">{money(group.bookedValueMinor)}</td>
          <td className="px-3 py-3 text-right font-mono">{money(group.completedServiceValueMinor)}</td>
          <td className="px-3 py-3 text-right font-mono">{money(group.netCashCollectedMinor)}</td>
          <td className="px-3 py-3 text-right font-mono">{money(group.outstandingMinor)}</td>
          <td className="px-3 py-3 text-right font-mono">{group.averageBookedValueMinor === null ? "—" : money(group.averageBookedValueMinor)}</td>
          <td className="px-3 py-3 text-right font-mono">{number(group.gclidLeads)} / {rate(group.gclidRate)}</td>
        </tr>)}
      </tbody>
    </table>
  </div>;
}

function SummaryMetrics({ metrics }: { metrics: AcquisitionMetrics }) {
  return <div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-3 xl:grid-cols-6">
    <Metric label="Sales enquiries" value={number(metrics.leads)} detail="Eligible first-touch leads" />
    <Metric label="Booked leads" value={`${number(metrics.bookedLeads)} · ${rate(metrics.leadToBookingRate)}`} detail="Unique leads with ≥1 eligible booking" />
    <Metric label="Eligible bookings" value={number(metrics.eligibleBookings)} detail="Distinct residential inspection bookings" />
    <Metric label="Booked value" value={money(metrics.bookedValueMinor)} detail="VAT-inclusive quoted booking value" />
    <Metric label="Cash collected" value={money(metrics.netCashCollectedMinor)} detail="Net of refunds; test payments excluded" />
    <Metric label="Outstanding" value={money(metrics.outstandingMinor)} detail="Eligible bookings only" />
    <Metric label="Completed service" value={money(metrics.completedServiceValueMinor)} detail="Physically completed inspections" />
    <Metric label="Average booked" value={metrics.averageBookedValueMinor === null ? "—" : money(metrics.averageBookedValueMinor)} detail="Booked value per eligible booking" />
    <Metric label="GCLID captured" value={`${number(metrics.gclidLeads)} · ${rate(metrics.gclidRate)}`} detail="Present on either captured touch" />
  </div>;
}

export default function Acquisition() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [from, setFrom] = useState(() => dubaiDate(30));
  const [to, setTo] = useState(() => dubaiDate());
  const params = useMemo(() => {
    const query = new URLSearchParams();
    if (from) query.set("from", from);
    if (to) query.set("to", to);
    return query.toString();
  }, [from, to]);
  const enabled = isAuthenticated && user?.role === "admin";
  const report = useQuery<AcquisitionReport>({
    queryKey: ["/api/admin/acquisition", params],
    enabled,
    queryFn: async () => (await apiRequest("GET", `/api/admin/acquisition${params ? `?${params}` : ""}`)).json(),
  });

  if (authLoading) return <main className="min-h-[100dvh] bg-[#f5f3eb] px-4 pt-24 sm:px-6"><div className="mx-auto max-w-7xl animate-pulse space-y-4"><div className="h-4 w-40 rounded bg-[#dedbd1]" /><div className="h-10 w-64 rounded bg-[#dedbd1]" /><div className="h-36 rounded-xl bg-[#e9e6dc]" /></div></main>;
  if (!enabled) return <main className="min-h-[100dvh] bg-[#f5f3eb] px-4 pt-24 sm:px-6"><div className="mx-auto max-w-4xl rounded-xl border border-[#dedbd1] bg-[#fffefa] p-8"><h1 className="text-xl font-bold text-[#263a2e]">Admin access required</h1><p className="mt-2 text-sm text-[#687269]">Sign in with an administrator account to view acquisition reporting.</p></div></main>;

  const rangeLabel = report.data ? `${report.data.range.from ?? "All dates"} — ${report.data.range.to ?? "Today"}` : "Selected lead-created dates";
  return <main className="min-h-[100dvh] bg-[#f5f3eb] px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        <Link href="/admin" className="text-sm font-semibold text-[#286548] hover:underline">← Dashboard</Link>
        <Link href="/admin/bookings" className="text-sm font-semibold text-[#286548] hover:underline">Inspection bookings</Link>
        <Link href="/admin/leads" className="text-sm font-semibold text-[#286548] hover:underline">Lead pipeline</Link>
      </div>
      <header className="mt-5 flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#64826b]">UrbanGrid · Sales operations</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#263a2e] sm:text-4xl">Acquisition report</h1><p className="mb-0 mt-2 max-w-3xl text-sm leading-6 text-[#687269]">Trace first-touch enquiry cohorts through residential bookings and cash collected. Booked value and cash are reported separately.</p></div>
        <div className="rounded-lg border border-[#d9e2d6] bg-[#eaf1e8] px-4 py-3"><p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#55745c]">Attribution basis</p><p className="mb-0 text-sm font-semibold text-[#34443a]">First touch · Asia / Dubai</p></div>
      </header>

      <section aria-label="Acquisition report date filters" className="mt-6 rounded-xl border border-[#dedbd1] bg-[#fffefa] p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><h2 className="text-sm font-bold text-[#34443a]">Lead creation cohort</h2><p className="mb-0 mt-1 text-xs text-[#788179]">Inclusive Dubai calendar dates · subsequent booking and payment activity stays with the cohort.</p></div>
          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
            <label className="text-[11px] font-semibold text-[#69746b]">Created from<Input type="date" value={from} max={to || undefined} onChange={(event) => setFrom(event.target.value)} className="mt-1 h-10" /></label>
            <label className="text-[11px] font-semibold text-[#69746b]">Created to<Input type="date" value={to} min={from || undefined} onChange={(event) => setTo(event.target.value)} className="mt-1 h-10" /></label>
          </div>
        </div>
      </section>

      {report.isLoading && <div className="mt-5 rounded-xl border border-[#dedbd1] bg-[#fffefa] p-5" aria-label="Loading acquisition report"><div className="grid animate-pulse grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-6">{Array.from({ length: 9 }, (_, index) => <div key={index} className="space-y-2"><div className="h-3 w-20 rounded bg-[#e4e3d9]" /><div className="h-6 w-28 rounded bg-[#e4e3d9]" /><div className="h-3 w-full rounded bg-[#efeee7]" /></div>)}</div><div className="mt-6 h-48 animate-pulse rounded-lg bg-[#f1f0e8]" /></div>}
      {report.error && <div role="alert" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800"><div><p className="mb-1 font-semibold">Could not load acquisition data.</p><p className="mb-0 text-xs">Check the administrator session and try the report again.</p></div><Button variant="outline" onClick={() => void report.refetch()}>Retry report</Button></div>}
      {report.data && <>
        <section aria-label="Acquisition totals" className="mt-5 rounded-xl border border-[#dedbd1] bg-[#fffefa] p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-[#e9e6dd] pb-3"><h2 className="mb-0 text-sm font-bold text-[#34443a]">Cohort totals</h2><p className="mb-0 text-xs text-[#788179]">{rangeLabel} · AED · VAT included</p></div>
          <SummaryMetrics metrics={report.data.totals} />
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-[#dedbd1] bg-[#fffefa]">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#e9e6dd] px-4 py-4 sm:px-5">
            <div><h2 className="mb-0 text-base font-bold text-[#34443a]">Performance by first-touch attribution</h2><p className="mb-0 mt-1 text-xs text-[#788179]">Source / medium / campaign · grouped cohorts</p></div>
            <p className="mb-0 text-xs text-[#788179]">{report.data.groups.length} groups</p>
          </div>
          {report.data.groups.length ? <MetricsTable groups={report.data.groups} /> : <div className="px-6 py-12 text-center"><p className="mb-1 text-sm font-bold text-[#34443a]">No eligible enquiries in this date range</p><p className="mb-0 text-xs text-[#788179]">Try a wider creation-date range. Non-sales enquiries are excluded.</p></div>}
        </section>

        <section aria-label="Metric definitions" className="mt-5 rounded-xl border border-[#dedbd1] bg-[#f0efe6] p-4 sm:p-5">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#526a56]">Reading this report</h2>
          <div className="grid gap-x-8 gap-y-2 text-xs leading-5 text-[#657168] sm:grid-cols-2">
            <p className="mb-0"><b className="text-[#34443a]">Booked value</b> is the VAT-inclusive value of eligible residential bookings, not cash received.</p>
            <p className="mb-0"><b className="text-[#34443a]">Cash collected</b> is net cash after refunds; test payments are excluded. Outstanding includes eligible bookings only.</p>
            <p className="mb-0"><b className="text-[#34443a]">Lead → booking rate</b> is unique leads with at least one eligible booking divided by leads. Bookings are distinct inspection IDs.</p>
            <p className="mb-0"><b className="text-[#34443a]">Completed service</b> requires completed status and a physical completion timestamp. Lost/canceled bookings and leads are excluded.</p>
            <p className="mb-0"><b className="text-[#34443a]">Attribution</b> uses first-touch UTM values. Missing fields appear as Unknown; GCLID can be captured on either touch.</p>
            <p className="mb-0"><b className="text-[#34443a]">Scope</b> includes sales enquiries only; careers, brokers, sample downloads and staff lead revenue are excluded.</p>
          </div>
          <p className="mb-0 mt-3 border-t border-[#dcded2] pt-3 text-xs text-[#657168]">Ad spend is not entered or joined here. Join spend externally to calculate cost per booking. The report does not track response times.</p>
          {report.data.notes.length > 0 && <ul className="mb-0 mt-3 list-disc pl-5 text-xs text-[#657168]">{report.data.notes.map((note, index) => <li key={`${note}-${index}`}>{note}</li>)}</ul>}
        </section>
      </>}
      <OperationsIntegrationStatus enabled={enabled} />
    </div>
  </main>;
}