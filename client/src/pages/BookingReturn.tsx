import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { bookingConfig, getBooking, payBooking, verifyBooking } from "@/lib/bookingApi";
import { formatAed } from "@shared/inspectionPricing";
import type { BookingView } from "@shared/booking";
import { trackVerifiedPayments } from "@/lib/analytics";

function setReturnRobots() {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]') ?? document.head.appendChild(Object.assign(document.createElement("meta"), { name: "robots" }));
  meta.content = "noindex, nofollow";
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
  link.href = "https://urbangrid.ae/book-inspection/return";
}
function paymentIsPending(booking: BookingView) {
  return booking.payments.some((payment) => payment.status === "pending") || booking.paymentStatus.toLowerCase() === "pending";
}
function statusCopy(booking: BookingView) {
  if (booking.status === "lost") {
    return { title: "This booking is closed", body: "Contact UrbanGrid if you need help with this inspection record.", tone: "canceled" };
  }
  if (!booking.inspectionCompletedAt) {
    return {
      title: "Your inspection is confirmed",
      body: "No upfront payment is required. Payment is due after the inspection and before the final report is released.",
      tone: "confirmed",
    };
  }
  const latest = [...booking.payments].reverse().find((payment) => payment.paymentType !== "refund");
  if (latest?.status === "completed" && latest.verifiedOnline) return { title: "Payment verified", body: "The payment provider has confirmed the full payment. Your inspection record is shown below.", tone: "verified" };
  if (latest?.status === "failed") return { title: "Payment not completed", body: "The provider did not confirm payment. The outstanding amount remains due; you can try again securely.", tone: "failed" };
  if (latest?.status === "canceled" || latest?.status === "cancelled") return { title: "Payment canceled", body: "No successful payment has been recorded. The outstanding amount remains due.", tone: "canceled" };
  if (paymentIsPending(booking)) return { title: "Checking payment status", body: "We are asking the payment provider for the latest status. This page will not mark payment complete until it is verified.", tone: "pending" };
  if (booking.paymentStatus.toLowerCase() === "paid" || booking.cashCollectedMinor > 0) return { title: "Payment recorded", body: "A payment is recorded on this booking. Online confirmation is shown only when verified by the payment provider.", tone: "neutral" };
  return { title: "Inspection completed · payment due", body: "The inspection is marked complete. Payment is due in full before release of the final report.", tone: "due" };
}

export default function BookingReturn() {
  const search = useSearch();
  const reference = new URLSearchParams(search).get("booking") || "";
  const [polls, setPolls] = useState(0);
  const [pollNotice, setPollNotice] = useState("");
  const [payError, setPayError] = useState("");
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ["booking-return", reference],
    enabled: Boolean(reference),
    queryFn: async () => (await getBooking(reference)).booking,
  });
  const config = useQuery({ queryKey: ["booking-config"], queryFn: bookingConfig });
  const verify = useMutation({
    mutationFn: () => {
      if (!query.data?.inspectionCompletedAt) throw new Error("Payment verification is available after the inspection is completed.");
      return verifyBooking(reference);
    },
    onSuccess: (result) => {
      client.setQueryData(["booking-return", reference], result.booking);
      setPolls((count) => count + 1);
      setPollNotice("");
    },
    onError: (error: Error) => { setPolls((count) => count + 1); setPollNotice(error.message || "Status check failed. You can retry."); },
  });
  useEffect(() => { setReturnRobots(); }, []);
  useEffect(() => {
    if (query.data) trackVerifiedPayments(query.data);
  }, [query.data]);
  useEffect(() => {
    if (!query.data?.inspectionCompletedAt || !paymentIsPending(query.data) || polls >= 6 || verify.isPending) return;
    const timer = window.setTimeout(() => verify.mutate(), 5000);
    return () => window.clearTimeout(timer);
  }, [query.data, polls, verify.isPending]);

  async function payAfterInspection() {
    if (!query.data?.inspectionCompletedAt || query.data.amountOutstandingMinor <= 0) return;
    setPayError("");
    try {
      const result = await payBooking(reference, "full");
      window.location.assign(result.redirectUrl);
    } catch (error) { setPayError(error instanceof Error ? error.message : "Could not open secure payment. Please try again."); }
  }
  async function refreshStatus() {
    setPollNotice("");
    if (!query.data?.inspectionCompletedAt) {
      await query.refetch();
      return;
    }
    setPolls(0);
    verify.mutate();
  }
  const display = query.data ? statusCopy(query.data) : null;
  const completed = Boolean(query.data?.inspectionCompletedAt);
  const canPay = Boolean(completed && query.data && query.data.amountOutstandingMinor > 0);

  return (
    <main className="min-h-[100dvh] bg-[#f5f1e7] px-4 pb-20 pt-28 sm:px-6 sm:pt-32">
      <SEO title="Inspection booking status | UrbanGrid" description="Review your UrbanGrid inspection booking and payment status." canonical="https://urbangrid.ae/book-inspection/return" noindex />
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#397454]">UrbanGrid · Booking status</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#202c25] sm:text-4xl">Your inspection record.</h1>
        {!reference && <section className="mt-8 rounded-2xl border border-[#ded9cd] bg-[#fffefa] p-6"><h2 className="text-xl font-semibold">Booking reference missing</h2><p className="mt-2 text-sm text-[#687269]">Use the secure booking link provided after confirmation, or start a new inspection booking.</p><Link href="/book-inspection" className="mt-4 inline-flex font-semibold text-[#286548] underline underline-offset-4">Book an inspection</Link></section>}
        {query.isLoading && reference && <div aria-label="Loading booking" className="mt-8 animate-pulse space-y-4 rounded-2xl border border-[#ded9cd] bg-[#fffefa] p-6"><div className="h-4 w-32 rounded bg-[#e5e1d7]" /><div className="h-8 w-64 rounded bg-[#e5e1d7]" /><div className="h-24 rounded bg-[#f0ede4]" /></div>}
        {query.error && <section role="alert" className="mt-8 rounded-2xl border border-[#e5c9c4] bg-[#fff9f7] p-6"><h2 className="text-xl font-semibold text-[#642e27]">Booking details are unavailable</h2><p className="mt-2 text-sm text-[#73554f]">The secure booking session may have expired, or this reference could not be found.</p><Button variant="outline" onClick={() => void query.refetch()} className="mt-3">Retry status</Button></section>}
        {query.data && display && <section aria-live="polite" className="mt-8 overflow-hidden rounded-2xl border border-[#dcd9cf] bg-[#fffefa] shadow-[0_12px_38px_rgba(41,66,49,0.06)]">
          <div className={`border-b px-6 py-6 sm:px-8 ${display.tone === "verified" || display.tone === "confirmed" ? "border-[#cbd8cb] bg-[#eaf1e8]" : display.tone === "failed" || display.tone === "canceled" ? "border-[#ead0ca] bg-[#fff2ee]" : "border-[#e5e0d5] bg-[#f2f0e7]"}`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#657268]">{completed ? "Inspection & payment status" : "Booking status"}</p>
            <h2 className="mt-2 text-2xl font-semibold">{display.title}</h2>
            <p className="mb-0 mt-2 max-w-xl text-sm leading-6 text-[#687269]">{display.body}</p>
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap justify-between gap-3 border-b border-[#ebe8df] pb-5">
              <div><span className="block text-[10px] font-bold uppercase tracking-wider text-[#7b837a]">Booking reference</span><code className="mt-1 block font-mono text-sm font-bold">{query.data.bookingReference}</code></div>
              <div className="text-right"><span className="block text-[10px] font-bold uppercase tracking-wider text-[#7b837a]">Inspection date</span><span className="mt-1 block text-sm font-semibold">{query.data.inspectionDate} · {query.data.emirate}</span></div>
            </div>
            <dl className="mt-4 divide-y divide-[#ebe8df] text-sm">
              <div className="flex justify-between gap-3 py-3"><dt className="text-[#687269]">Inspection fee</dt><dd className="font-semibold">{formatAed(query.data.baseMinor)}</dd></div>
              <div className="flex justify-between gap-3 py-3"><dt className="text-[#687269]">VAT · 5%</dt><dd className="font-semibold">{formatAed(query.data.vatMinor)}</dd></div>
              <div className="flex justify-between gap-3 py-3"><dt className="font-semibold">Total including VAT</dt><dd className="font-semibold">{formatAed(query.data.quoteTotalMinor)}</dd></div>
              {completed && <div className="flex justify-between gap-3 py-3"><dt className="text-[#687269]">Amount outstanding</dt><dd className="font-semibold">{formatAed(query.data.amountOutstandingMinor)}</dd></div>}
            </dl>
            {!completed && <p className="mt-4 rounded-lg border border-[#cbd8cb] bg-[#eaf1e8] p-4 text-sm font-semibold leading-6 text-[#285e42]">100% payment after inspection and before release of the final report.</p>}
            {completed && <div className="mt-4 rounded-lg bg-[#f3f2e9] p-4 text-sm">
              <p className="mb-1 font-semibold">Inspection completed</p>
              <p className="mb-0 text-xs text-[#687269]">{query.data.inspectionCompletedAt ? new Intl.DateTimeFormat("en-AE", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dubai" }).format(new Date(query.data.inspectionCompletedAt)) : "—"} · Report status: {query.data.reportStatus}</p>
            </div>}
            {query.data.operations && <div className="mt-4 rounded-lg border border-[#dedbd1] bg-[#f8f7f1] p-4 text-sm">
              <p className="mb-2 font-semibold">Strata operations status</p>
              <dl className="mb-0 grid gap-x-4 gap-y-2 text-xs sm:grid-cols-3">
                <div><dt className="text-[#687269]">Lifecycle status</dt><dd className="mb-0 mt-1 font-semibold text-[#34443a]">{query.data.operations.status || "Not reported"}</dd></div>
                <div><dt className="text-[#687269]">Status version</dt><dd className="mb-0 mt-1 font-mono text-[#34443a]">{query.data.operations.version ?? "Not reported"}</dd></div>
                <div><dt className="text-[#687269]">Last reconciled</dt><dd className="mb-0 mt-1 text-[#34443a]">{query.data.operations.lastReconciledAt ? new Intl.DateTimeFormat("en-AE", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dubai" }).format(new Date(query.data.operations.lastReconciledAt)) : "Not reported"}</dd></div>
              </dl>
              <p className="mb-0 mt-3 text-[11px] leading-5 text-[#687269]">This operations status is separate from payment verification and final-report release eligibility. Strata status alone does not confirm payment or authorize report release.</p>
            </div>}
            {canPay && config.isLoading && <p role="status" className="mt-5 rounded-lg bg-[#f3f2e9] p-3 text-sm text-[#687269]">Checking secure payment availability…</p>}
            {canPay && !config.isLoading && config.data?.onlinePaymentEnabled && <div className="mt-5">
              {config.data.testMode && <p className="mb-3 rounded-lg border border-[#e4d5b8] bg-[#fcf6e9] p-3 text-sm font-semibold text-[#735a2d]">Payment provider is in test mode. This will not be an actual payment.</p>}
              <Button onClick={payAfterInspection} className="h-12 w-full bg-[#286548] text-white hover:bg-[#204f38]">Pay after inspection · {formatAed(query.data.amountOutstandingMinor)}</Button>
            </div>}
            {canPay && !config.isLoading && (!config.data?.onlinePaymentEnabled || config.error) && <p className="mt-5 rounded-lg border border-[#e4d5b8] bg-[#fcf6e9] p-3 text-sm leading-5 text-[#735a2d]">Online payment is not available right now. Please contact UrbanGrid to arrange payment before the final report is released.</p>}
            {payError && <p role="alert" className="mt-3 text-sm text-rose-700">{payError}</p>}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#737c73]">Booking: {query.data.status} · Payment: {query.data.paymentStatus}</span>
              <Button variant="outline" onClick={() => void refreshStatus()} disabled={verify.isPending}>{verify.isPending ? "Checking…" : completed ? "Refresh payment verification" : "Refresh booking status"}</Button>
            </div>
            {pollNotice && <p role="alert" className="mt-3 text-xs text-amber-800">{pollNotice}</p>}
            {paymentIsPending(query.data) && polls >= 6 && <p className="mt-3 text-xs text-[#737c73]">Automatic checks have paused. Refresh to ask the provider again.</p>}
            <div className="mt-6 border-t border-[#ebe8df] pt-5">
              <h3 className="text-sm font-semibold">Inspection details</h3>
              <p className="mb-0 mt-2 text-sm leading-6 text-[#687269]">{query.data.service} · {query.data.propertyType} · {query.data.areaSqft.toLocaleString()} sq ft<br />{query.data.project} · {query.data.location}</p>
            </div>
          </div>
        </section>}
        <Link href="/book-inspection" className="mt-6 inline-flex text-sm font-semibold text-[#286548] underline underline-offset-4">Return to inspection booking</Link>
      </div>
    </main>
  );
}