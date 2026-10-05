import type { OperationsEventSummary, OperationsReceiverIdentifiers } from "@shared/operationsIntegration";

type DiagnosticEvent = OperationsEventSummary & {
  lastSyncAt?: string | null;
  receiverIdentifiers: (OperationsReceiverIdentifiers & { reportId?: string }) | null;
};

type OperationsDiagnosticsProps = {
  events?: DiagnosticEvent[];
  pendingCount?: number;
  failedCount?: number;
  state?: "ready" | "loading" | "error";
};

function timestamp(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-AE", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Dubai",
    }).format(date);
}

function Identifier({ label, value }: { label: string; value?: string }) {
  return <span className="block">
    <span className="text-[#788179]">{label}: </span>
    <span className="break-all font-mono text-[#34443a]">{value || "—"}</span>
  </span>;
}

export default function OperationsDiagnostics({
  events = [],
  pendingCount = 0,
  failedCount = 0,
  state = "ready",
}: OperationsDiagnosticsProps) {
  return <section aria-label="Read-only operations diagnostics" className="mx-4 my-5 overflow-hidden rounded-lg border border-[#dedbd1] bg-[#fbfaf5] sm:mx-5">
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#e9e6dd] px-4 py-4">
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#64826b]">Read-only diagnostics</p>
        <h3 className="mb-0 text-sm font-bold text-[#34443a]">Strata lifecycle status</h3>
        <p className="mb-0 mt-1 text-xs leading-5 text-[#788179]">Observational status from the latest Operations integration response. This section does not change records or trigger syncs.</p>
      </div>
      <span className="inline-flex shrink-0 items-center rounded-full border border-[#d9ded3] bg-[#f2f4ed] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#647168]">View only</span>
    </div>

    {state === "loading" ? <div aria-label="Loading operations diagnostics" className="space-y-3 p-4">
      <div className="h-4 w-40 animate-pulse rounded bg-[#e4e3d9]" />
      <div className="h-16 animate-pulse rounded bg-[#efeee7]" />
      <div className="h-16 animate-pulse rounded bg-[#efeee7]" />
    </div> : state === "error" ? <div role="alert" className="px-4 py-6">
      <p className="mb-1 text-sm font-semibold text-[#8a4438]">Diagnostics are unavailable.</p>
      <p className="mb-0 text-xs leading-5 text-[#788179]">The existing integration status request failed. Use the panel’s refresh control to try again; no separate request was made for this view.</p>
    </div> : <>
      <div className="grid grid-cols-2 gap-px border-b border-[#e9e6dd] bg-[#e9e8df] sm:grid-cols-2">
        <div className="bg-[#f7f7f1] px-4 py-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#778279]">Pending outbox</p>
          <p className="mb-0 font-mono text-xl font-semibold text-[#263a2e]">{pendingCount.toLocaleString("en-AE")}</p>
        </div>
        <div className="bg-[#f7f7f1] px-4 py-3">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#778279]">Failed outbox</p>
          <p className={`mb-0 font-mono text-xl font-semibold ${failedCount > 0 ? "text-[#8a4438]" : "text-[#263a2e]"}`}>{failedCount.toLocaleString("en-AE")}</p>
        </div>
      </div>

      {events.length ? <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-xs">
          <thead className="bg-[#f2f4ed] text-[10px] uppercase tracking-wider text-[#647168]">
            <tr>
              <th className="px-3 py-2.5 font-bold">Booking reference</th>
              <th className="px-3 py-2.5 font-bold">Strata identifiers</th>
              <th className="px-3 py-2.5 font-bold">Lifecycle</th>
              <th className="px-3 py-2.5 font-bold">Last sync</th>
              <th className="px-3 py-2.5 font-bold">Last integration error</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const detail = event as DiagnosticEvent;
              const identifiers = detail.receiverIdentifiers;
              const lifecycle = detail.lifecycleStatus || (detail.status === "delivered" ? "booked" : "not yet synced");
              // A failed reconciliation attempt is not a successful sync.
              const lastSyncAt = detail.lastSyncAt || detail.deliveredAt;
              const lastError = detail.reconcileErrorCode || detail.errorCode || detail.lastFailureCode;
              return <tr key={event.eventId} className="align-top border-t border-[#e9e8df]">
                <td className="max-w-[190px] px-3 py-3">
                  <span className="break-words font-semibold text-[#34443a]">{event.bookingReference || `Booking ${event.bookingId}`}</span>
                  <span className="mt-1 block truncate font-mono text-[10px] text-[#788179]" title={event.eventId}>{event.eventId}</span>
                </td>
                <td className="px-3 py-3 text-[10px] leading-5">
                  <Identifier label="Order" value={identifiers?.orderId} />
                  <Identifier label="Job" value={identifiers?.jobId} />
                  <Identifier label="Project" value={identifiers?.projectId} />
                  <Identifier label="Report" value={identifiers?.reportId} />
                </td>
                <td className="px-3 py-3">
                  <span className="inline-flex rounded-full bg-[#edf0e7] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#526748]">{lifecycle}</span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-[#687269]">{timestamp(lastSyncAt)}</td>
                <td className="max-w-[230px] break-words px-3 py-3 font-mono text-[11px] text-[#8a4438]">{lastError || <span className="font-sans text-[#788179]">—</span>}</td>
              </tr>;
            })}
          </tbody>
        </table>
      </div> : <div className="px-4 py-7 text-center">
        <p className="mb-1 text-sm font-semibold text-[#34443a]">No event-level diagnostics returned</p>
        <p className="mb-0 text-xs leading-5 text-[#788179]">{pendingCount > 0 || failedCount > 0
          ? "Outbox totals above are available, but the current status response contains no event rows to inspect."
          : "No operations events are currently available to inspect."}</p>
      </div>}
    </>}
  </section>;
}