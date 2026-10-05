import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import type { OperationsEventSummary, OperationsIntegrationStatus } from "@shared/operationsIntegration";
import OperationsDiagnostics from "./OperationsDiagnostics";

function timestamp(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-AE", {
      dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dubai",
    }).format(date);
}

const statusTone: Record<string, string> = {
  delivered: "bg-[#e7f0e7] text-[#315f43]",
  failed: "bg-[#f7e9e4] text-[#8a4438]",
  processing: "bg-[#edf0e7] text-[#66724e]",
  pending: "bg-[#f2efe4] text-[#806a36]",
};

function StatusPill({ status }: { status: string }) {
  return <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${statusTone[status] ?? "bg-[#efeee7] text-[#687269]"}`}>{status}</span>;
}

async function postWithCsrf(path: string, body: Record<string, unknown>) {
  const configResponse = await fetch("/api/bookings/config", { credentials: "include" });
  if (!configResponse.ok) throw new Error("request");
  const config = await configResponse.json() as { csrfToken?: unknown };
  if (typeof config.csrfToken !== "string" || !config.csrfToken) throw new Error("request");

  const response = await fetch(path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "x-csrf-token": config.csrfToken },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("request");
  return response;
}

function EventRow({
  event,
  onRetry,
  retrying,
  onCleanup,
  cleanupPending,
  confirmingCleanup,
  onConfirmCleanup,
  onCancelCleanup,
  developmentEnvironment,
  statusReconciliationConfigured,
  onReconcile,
  reconciling,
}: {
  event: OperationsEventSummary;
  onRetry: (eventId: string) => void;
  retrying: boolean;
  onCleanup: (eventId: string) => void;
  cleanupPending: boolean;
  confirmingCleanup: boolean;
  onConfirmCleanup: (eventId: string) => void;
  onCancelCleanup: () => void;
  developmentEnvironment: boolean;
  statusReconciliationConfigured: boolean;
  onReconcile: (bookingId: number) => void;
  reconciling: boolean;
}) {
  const failureCode = event.lastFailureCode;
  const canCleanup = developmentEnvironment && event.isIntegrationTest;
  const canReconcile = statusReconciliationConfigured && (
    (!event.isIntegrationTest && event.status === "delivered")
    || (developmentEnvironment && event.isIntegrationTest)
  );
  return <tr className="align-top border-t border-[#e9e8df]">
    <td className="px-3 py-3">
      <span className="block font-semibold text-[#34443a]">{event.bookingReference || `Booking ${event.bookingId}`}</span>
      {event.isIntegrationTest && <span className="mt-1 inline-flex rounded-sm border border-[#c6d8c4] bg-[#edf4eb] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-[#315f43]">integration_test</span>}
      <span className="mt-1 block max-w-[180px] truncate font-mono text-[10px] text-[#788179]" title={event.eventId}>{event.eventId}</span>
      {event.receiverIdentifiers && <span className="mt-2 block space-y-0.5 text-[10px] text-[#687269]">
        {event.receiverIdentifiers.orderId && <span className="block">Receiver Order: <span className="font-mono">{event.receiverIdentifiers.orderId}</span></span>}
        {event.receiverIdentifiers.jobId && <span className="block">Receiver Job: <span className="font-mono">{event.receiverIdentifiers.jobId}</span></span>}
        {event.receiverIdentifiers.projectId && <span className="block">Receiver Project: <span className="font-mono">{event.receiverIdentifiers.projectId}</span></span>}
        {"reportId" in event.receiverIdentifiers && typeof event.receiverIdentifiers.reportId === "string" && event.receiverIdentifiers.reportId && <span className="block">Receiver Report: <span className="font-mono">{event.receiverIdentifiers.reportId}</span></span>}
      </span>}
      {(event.lifecycleStatus || event.lastReconcileAt || event.reconcileErrorCode) && <span className="mt-2 block space-y-0.5 text-[10px] text-[#687269]">
        {event.lifecycleStatus && <span className="block">Operations status: <span className="font-semibold text-[#34443a]">{event.lifecycleStatus}</span></span>}
        {event.lastReconcileAt && <span className="block">Last reconciled: {timestamp(event.lastReconcileAt)}</span>}
        {event.reconcileErrorCode && <span className="block font-mono text-[#8a4438]">Reconcile issue: {event.reconcileErrorCode}</span>}
      </span>}
    </td>
    <td className="px-3 py-3"><StatusPill status={event.status} /></td>
    <td className="px-3 py-3 text-right font-mono">{event.attempts}</td>
    <td className="px-3 py-3 text-xs text-[#687269]">
      {failureCode ? <span className="font-mono font-semibold text-[#8a4438]">{failureCode}</span> : "—"}
      {event.lastFailureAt && <span className="mt-1 block text-[10px]">Failed {timestamp(event.lastFailureAt)}</span>}
    </td>
    <td className="px-3 py-3 text-xs text-[#687269]">{event.status === "delivered" ? timestamp(event.deliveredAt) : timestamp(event.nextAttemptAt)}</td>
    <td className="px-3 py-3 text-right">
      <div className="flex flex-col items-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={event.status !== "failed" || retrying}
          onClick={() => onRetry(event.eventId)}
          className="h-8 border-[#d9ded3] bg-[#fffefa] text-xs text-[#315f43] hover:bg-[#edf2e9]"
        >{retrying ? "Retrying…" : "Retry"}</Button>
        {canReconcile && <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={reconciling}
          onClick={() => onReconcile(event.bookingId)}
          className="h-8 border-[#b8cbb4] bg-[#fffefa] text-xs text-[#315f43] hover:bg-[#edf2e9]"
        >{reconciling ? "Reconciling…" : "Reconcile"}</Button>}
        {canCleanup && (confirmingCleanup ? <div className="flex flex-col items-end gap-1.5">
          <span className="max-w-52 text-right text-[10px] leading-4 text-[#687269]">Delete this UrbanGrid test booking and event only? Strata receiver records are not deleted.</span>
          <div className="flex gap-1.5">
            <Button type="button" variant="outline" size="sm" onClick={onCancelCleanup} disabled={cleanupPending} className="h-7 px-2 text-[10px]">Cancel</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => onConfirmCleanup(event.eventId)} disabled={cleanupPending || event.status === "processing"} className="h-7 border-[#d9bdb4] px-2 text-[10px] text-[#8a4438] hover:bg-[#f7e9e4]">{cleanupPending ? "Cleaning…" : "Confirm cleanup"}</Button>
          </div>
        </div> : <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={event.status === "processing" || cleanupPending}
          onClick={() => onCleanup(event.eventId)}
          className="h-8 border-[#d9ded3] bg-[#fffefa] text-xs text-[#687269] hover:bg-[#f2f4ed]"
        >Cleanup test</Button>)}
      </div>
    </td>
  </tr>;
}

export default function OperationsIntegrationStatus({ enabled }: { enabled: boolean }) {
  const [retryError, setRetryError] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [cleanupError, setCleanupError] = useState<string | null>(null);
  const [reconcileError, setReconcileError] = useState<string | null>(null);
  const [confirmingCleanup, setConfirmingCleanup] = useState<string | null>(null);
  const status = useQuery<OperationsIntegrationStatus>({
    queryKey: ["/api/admin/integrations/operations/status"],
    enabled,
    queryFn: async () => (await apiRequest("GET", "/api/admin/integrations/operations/status")).json(),
    refetchInterval: enabled ? 30_000 : false,
  });

  const retry = useMutation({
    mutationFn: async (eventId: string) => {
      setRetryError(null);
      const configResponse = await fetch("/api/bookings/config", { credentials: "include" });
      if (!configResponse.ok) throw new Error("csrf");
      const config = await configResponse.json() as { csrfToken?: unknown };
      if (typeof config.csrfToken !== "string" || !config.csrfToken) throw new Error("csrf");

      const response = await fetch(`/api/admin/integrations/operations/events/${encodeURIComponent(eventId)}/retry`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", "x-csrf-token": config.csrfToken },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error(`status:${response.status}`);
    },
    onSuccess: () => {
      void status.refetch();
    },
    onError: (error) => {
      const match = error instanceof Error ? error.message.match(/^status:(\d{3})$/) : null;
      setRetryError(match ? `Retry was not accepted (HTTP ${match[1]}). Refresh status and try again.` : "Retry could not be completed. Check the administrator session and try again.");
    },
  });

  const sendTest = useMutation({
    mutationFn: async () => {
      setTestError(null);
      await postWithCsrf("/api/admin/integrations/operations/test", {});
    },
    onSuccess: () => {
      void status.refetch();
    },
    onError: () => setTestError("The Development test could not be sent. Check the administrator session and try again."),
  });

  const reconcile = useMutation({
    mutationFn: async (bookingId: number) => {
      setReconcileError(null);
      await postWithCsrf(`/api/admin/integrations/operations/reconcile/${bookingId}`, {});
    },
    onSuccess: () => {
      void status.refetch();
    },
    onError: () => {
      setReconcileError("Could not complete status reconciliation. No result was confirmed; refresh status before retrying.");
    },
  });

  const cleanup = useMutation({
    mutationFn: async (eventId: string) => {
      setCleanupError(null);
      await postWithCsrf(`/api/admin/integrations/operations/events/${encodeURIComponent(eventId)}/cleanup`, { confirm: true });
    },
    onSuccess: () => {
      setConfirmingCleanup(null);
      void status.refetch();
    },
    onError: () => {
      setCleanupError("Cleanup was not completed. The event may be processing or may not be an eligible Development test. Refresh status and try again.");
    },
  });

  const triggerRetry = (eventId: string) => retry.mutate(eventId);
  const data = status.data;

  return <section aria-label="Operations integration delivery diagnostics" className="mt-7 overflow-hidden rounded-xl border border-[#dedbd1] bg-[#fffefa]">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e9e6dd] px-4 py-4 sm:px-5">
      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#64826b]">Booking delivery</p>
        <h2 className="mb-0 text-base font-bold text-[#34443a]">Operations integration</h2>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => void status.refetch()} disabled={!enabled || status.isFetching} className="border-[#d9ded3] bg-[#fffefa] text-[#315f43]">
        {status.isFetching ? "Refreshing…" : "Refresh status"}
      </Button>
    </div>

    {!enabled ? <div className="px-5 py-6 text-sm text-[#687269]">Integration diagnostics are available to administrators.</div> :
      status.isLoading ? <><div aria-label="Loading integration status" className="space-y-3 p-5">
        <div className="h-4 w-44 animate-pulse rounded bg-[#e4e3d9]" />
        <div className="h-16 animate-pulse rounded-lg bg-[#efeee7]" />
        <div className="h-28 animate-pulse rounded-lg bg-[#efeee7]" />
      </div><OperationsDiagnostics state="loading" /></> :
        status.error ? <><div role="alert" className="flex flex-wrap items-center justify-between gap-3 px-5 py-6 text-sm text-[#8a4438]">
          <div><p className="mb-1 font-semibold">Could not load delivery diagnostics.</p><p className="mb-0 text-xs text-[#788179]">Check the administrator session and try again.</p></div>
          <Button type="button" variant="outline" size="sm" onClick={() => void status.refetch()}>Try again</Button>
        </div><OperationsDiagnostics state="error" /></> : data ? <>
          <div className="grid gap-4 border-b border-[#e9e6dd] px-4 py-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-4">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#778279]">Configuration</p>
              <p className={`mb-1 text-sm font-semibold ${data.configured ? "text-[#315f43]" : "text-[#8a4438]"}`}>{data.developmentVerification?.healthy ? "Development integration healthy" : data.configured ? "Configured" : "Not configured"}</p>
              {data.developmentVerification && <p className="mb-1 text-xs text-[#788179]">Real Development verification: {new Date(data.developmentVerification.checkedAt).toLocaleString("en-AE")}{data.developmentVerification.healthy ? "" : " — current configuration or sync errors need attention"}</p>}
              <p className="mb-0 break-words text-xs leading-5 text-[#788179]">{data.configurationIssue || (data.keyConfigured ? "Integration key present" : "Integration key not configured")}</p>
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#778279]">Endpoint</p>
              <p className="mb-0 break-all font-mono text-xs leading-5 text-[#34443a]">{data.endpoint || "Not configured"}</p>
              <p className="mb-0 mt-1 text-[10px] text-[#788179]">{data.environment} · schema v{data.schemaVersion}</p>
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#778279]">Key fingerprint · SHA-256</p>
              <p className="mb-0 break-all font-mono text-xs leading-5 text-[#34443a]">{data.keyFingerprint || (data.keyConfigured ? "Fingerprint unavailable" : "No key configured")}</p>
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#778279]">Worker heartbeat</p>
              <p className={`mb-1 text-sm font-semibold ${data.workerRunning ? "text-[#315f43]" : "text-[#8a4438]"}`}>{data.workerRunning ? "Running" : "Not running"}</p>
              <p className="mb-0 text-xs text-[#788179]">Last tick {timestamp(data.lastWorkerTickAt)}</p>
            </div>
          </div>
          <div className="border-b border-[#e9e6dd] bg-[#f6f5ee] px-4 py-3 text-xs sm:px-5">
            <span className="font-semibold text-[#34443a]">Status reconciliation: </span>
            {data.statusReconciliationConfigured === true
              ? <span className="text-[#315f43]">Configured</span>
              : data.statusReconciliationConfigured === false
                ? <span className="text-[#806a36]">Pending configuration</span>
                : <span className="text-[#788179]">Configuration status unavailable</span>}
            {data.statusReconciliationConfigured === false && <span className="ml-1 text-[#788179]">Delivered events cannot be reconciled until configured.</span>}
          </div>

          <div className="grid grid-cols-2 gap-px bg-[#e9e8df] sm:grid-cols-3 lg:grid-cols-5">
            {([
              ["Pending", data.counts.pending],
              ["Failed", data.counts.failed],
              ["Delivered", data.counts.delivered],
              ["Processing", data.counts.processing],
              ["Awaiting enqueue", data.counts.awaitingEnqueue],
            ] as const).map(([label, value]) => <div key={label} className="bg-[#fffefa] px-4 py-3">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#778279]">{label}</p>
              <p className="mb-0 font-mono text-xl font-semibold text-[#263a2e]">{value.toLocaleString("en-AE")}</p>
            </div>)}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-[#e9e6dd] bg-[#f6f5ee] px-4 py-3 text-xs text-[#687269] sm:px-5">
            <span className="font-semibold text-[#34443a]">Last delivery</span>
            {data.lastDelivery ? <>
              <StatusPill status={data.lastDelivery.status} />
              <span>{data.lastDelivery.deliveredAt ? timestamp(data.lastDelivery.deliveredAt) : timestamp(data.lastDelivery.lastAttemptAt)}</span>
              {data.lastDelivery.lastFailureCode && <span className="font-mono text-[#8a4438]">Last failure: {data.lastDelivery.lastFailureCode}</span>}
              {data.lastDelivery.httpStatus !== null && <span>HTTP {data.lastDelivery.httpStatus}</span>}
            </> : <span>No delivery attempts recorded</span>}
            {data.retryPolicy && <span className="ml-auto">Retry policy: {data.retryPolicy}</span>}
          </div>

          <OperationsDiagnostics
            events={data.events}
            pendingCount={data.counts.pending}
            failedCount={data.counts.failed}
          />

          {retryError && <div role="alert" className="mx-4 mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800 sm:mx-5">{retryError}</div>}
          {reconcileError && <div role="alert" className="mx-4 mt-3 rounded-md border border-[#e2c9c0] bg-[#fbf1ed] px-3 py-2 text-xs text-[#8a4438] sm:mx-5">{reconcileError}</div>}

          <div className="flex flex-wrap items-end justify-between gap-2 px-4 pb-3 pt-5 sm:px-5">
            <div><h3 className="mb-0 text-sm font-bold text-[#34443a]">Recent events</h3><p className="mb-0 mt-1 text-xs text-[#788179]">Latest {data.events.length} metadata-only delivery records</p></div>
          </div>
          {data.environment === "development" && data.developmentTestsAvailable && <div className="mx-4 mb-4 rounded-lg border border-[#cbd8c7] bg-[#f0f5ed] p-4 sm:mx-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#64826b]">Development only</p>
                <h3 className="mb-1 text-sm font-bold text-[#34443a]">Send a synthetic integration test</h3>
                <p className="mb-0 max-w-3xl text-xs leading-5 text-[#687269]">Creates or reuses a quarantined synthetic booking and event. No real customer, notifications, or conversions are involved. The ordinary worker sends it to the configured Development receiver.</p>
              </div>
              <Button type="button" variant="outline" size="sm" disabled={!data.configured || sendTest.isPending} onClick={() => sendTest.mutate()} className="shrink-0 border-[#b8cbb4] bg-[#fffefa] text-[#315f43] hover:bg-[#e6efe3]">
                {sendTest.isPending ? "Sending test…" : "Send test event"}
              </Button>
            </div>
            {!data.configured && <p className="mb-0 mt-2 text-[11px] text-[#8a4438]">Configure the Development integration before sending a test.</p>}
            {testError && <p role="alert" className="mb-0 mt-3 text-xs text-[#8a4438]">{testError}</p>}
          </div>}
          {cleanupError && <div role="alert" className="mx-4 mb-3 rounded-md border border-[#e2c9c0] bg-[#fbf1ed] px-3 py-2 text-xs text-[#8a4438] sm:mx-5">{cleanupError}</div>}
          {data.events.length ? <div className="overflow-x-auto">
            <table aria-label="Operations outbox management" className="w-full min-w-[760px] border-collapse text-left text-xs">
              <thead className="bg-[#f2f4ed] text-[10px] uppercase tracking-wider text-[#647168]">
                <tr><th className="px-3 py-2.5 font-bold">Booking / event</th><th className="px-3 py-2.5 font-bold">Status</th><th className="px-3 py-2.5 text-right font-bold">Attempts</th><th className="px-3 py-2.5 font-bold">Last failure</th><th className="px-3 py-2.5 font-bold">Delivered / next retry</th><th className="px-3 py-2.5 text-right font-bold">Action</th></tr>
              </thead>
              <tbody>{data.events.map((event) => <EventRow
                key={event.eventId}
                event={event}
                onRetry={triggerRetry}
                retrying={retry.isPending && retry.variables === event.eventId}
                onCleanup={(eventId) => { setCleanupError(null); setConfirmingCleanup(eventId); }}
                cleanupPending={cleanup.isPending}
                confirmingCleanup={confirmingCleanup === event.eventId}
                onConfirmCleanup={(eventId) => cleanup.mutate(eventId)}
                onCancelCleanup={() => setConfirmingCleanup(null)}
                developmentEnvironment={data.environment === "development"}
                statusReconciliationConfigured={data.statusReconciliationConfigured === true}
                onReconcile={(bookingId) => reconcile.mutate(bookingId)}
                reconciling={reconcile.isPending && reconcile.variables === event.bookingId}
              />)}</tbody>
            </table>
          </div> : <div className="px-5 py-9 text-center">
            <p className="mb-1 text-sm font-semibold text-[#34443a]">{data.counts.awaitingEnqueue > 0 ? "No delivery events recorded yet" : "No booking events yet"}</p>
            <p className="mb-0 text-xs text-[#788179]">{data.counts.awaitingEnqueue > 0 ? `${data.counts.awaitingEnqueue.toLocaleString("en-AE")} bookings are awaiting event enqueue.` : "New booking delivery attempts will appear here."}</p>
          </div>}
        </> : <div className="px-5 py-6 text-sm text-[#687269]">Integration status is unavailable.</div>}
  </section>;
}