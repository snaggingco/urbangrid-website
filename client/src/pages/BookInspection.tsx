import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import SEO from "@/components/SEO";
import { createBooking } from "@/lib/bookingApi";
import { calculateInspectionPrice, formatAed, residentialServices } from "@shared/inspectionPricing";
import type { BookingInput, BookingView } from "@shared/booking";

const emirates = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"];
const fields = "mt-1 h-12 w-full rounded-md border border-[#d8d5c9] bg-[#fffefa] px-3 text-sm text-[#25352c] outline-none transition focus:border-[#286548] focus:ring-2 focus:ring-[#286548]/15";
const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dubai" });

type FormState = Omit<BookingInput, "submissionKey" | "attribution">;
const blank: FormState = {
  service: "new-build-snagging", propertyType: "Apartment", areaSqft: 1000, project: "", location: "",
  emirate: "Dubai", inspectionDate: "", name: "", email: "", phone: "",
};
const keyName = "ug_booking_submission_key";
function newSubmissionKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16); });
}
function savedSubmissionKey() {
  try {
    const previous = sessionStorage.getItem(keyName);
    if (previous) return previous;
    const next = newSubmissionKey();
    sessionStorage.setItem(keyName, next);
    return next;
  } catch { return newSubmissionKey(); }
}
function setCanonicalAndRobots(robots: string, canonical: string) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]') ?? document.head.appendChild(Object.assign(document.createElement("meta"), { name: "robots" }));
  meta.content = robots;
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
  link.href = canonical;
}

export default function BookInspection() {
  const [form, setForm] = useState<FormState>(blank);
  const [submissionKey, setSubmissionKey] = useState(savedSubmissionKey);
  const [formError, setFormError] = useState("");
  const [booking, setBooking] = useState<BookingView | null>(null);
  const price = useMemo(() => {
    try { return calculateInspectionPrice(form.service, Number(form.areaSqft)); }
    catch { return null; }
  }, [form.service, form.areaSqft]);
  const create = useMutation({
    mutationFn: () => createBooking({ ...form, areaSqft: Number(form.areaSqft), submissionKey }),
    onSuccess: ({ booking: saved }) => { setBooking(saved); setFormError(""); },
    onError: (error: Error) => setFormError(error.message || "We could not save your inspection request. Please try again."),
  });

  useEffect(() => { setCanonicalAndRobots("noindex, nofollow", "https://urbangrid.ae/book-inspection"); }, []);
  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: key === "areaSqft" ? value as unknown as number : value }));
  };
  function startAnother() {
    const next = newSubmissionKey();
    try { sessionStorage.setItem(keyName, next); } catch {}
    setSubmissionKey(next); setBooking(null); setForm(blank); setFormError("");
  }

  return (
    <main className="min-h-[100dvh] bg-[#f5f1e7] px-4 pb-20 pt-24 text-[#26372d] sm:px-6 sm:pt-28">
      <SEO title="Book Your Inspection" description="Book an independent, engineer-led residential inspection in the UAE with a clear price and payment after inspection." canonical="https://urbangrid.ae/book-inspection" noindex />
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_370px] lg:gap-14">
          <section>
            <p className="text-[11px] font-bold uppercase tracking-[0.23em] text-[#397454]">UrbanGrid · Residential inspections</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#202c25] sm:text-5xl">Book Your Inspection</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#687269]">An independent engineer. A clear scope. Your exact price before the inspection.</p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-y border-[#d9d5c9] py-4 text-xs font-medium text-[#526057]">
              <span><b className="mr-2 text-[#286548]">01</b>Set the inspection</span>
              <span><b className="mr-2 text-[#286548]">02</b>Review exact pricing</span>
              <span><b className="mr-2 text-[#286548]">03</b>Confirm your booking</span>
            </div>
            {booking ? (
              <section aria-live="polite" className="mt-8 rounded-2xl border border-[#cbd8cb] bg-[#fffefa] p-6 shadow-[0_12px_38px_rgba(41,66,49,0.06)] sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#397454]">Booking confirmed</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Your inspection is booked.</h2>
                <p className="mt-2 text-sm leading-6 text-[#687269]">Your booking is confirmed now. No upfront payment is required; we’ll coordinate the inspection details with you.</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f3f2e9] p-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#69736a]">Booking reference</span>
                  <code className="font-mono text-sm font-bold text-[#285e42]">{booking.bookingReference}</code>
                </div>
                <dl className="mt-5 divide-y divide-[#e9e6dc] text-sm">
                  <div className="flex justify-between gap-3 py-3"><dt className="text-[#687269]">Inspection fee</dt><dd className="font-semibold">{formatAed(booking.baseMinor)}</dd></div>
                  <div className="flex justify-between gap-3 py-3"><dt className="text-[#687269]">VAT · 5%</dt><dd className="font-semibold">{formatAed(booking.vatMinor)}</dd></div>
                  <div className="flex justify-between gap-3 py-3"><dt className="font-semibold">Total including VAT</dt><dd className="font-semibold text-[#285e42]">{formatAed(booking.quoteTotalMinor)}</dd></div>
                </dl>
                <p className="mt-4 rounded-lg border border-[#cbd8cb] bg-[#eaf1e8] p-4 text-sm font-semibold leading-6 text-[#285e42]">100% payment after inspection and before release of the final report.</p>
                <Link href={`/book-inspection/return?booking=${encodeURIComponent(booking.bookingReference)}`} className="mt-4 inline-flex text-sm font-semibold text-[#286548] underline underline-offset-4">View booking status</Link>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <button type="button" onClick={startAnother} className="text-xs font-semibold text-[#286548] underline underline-offset-4">Start another inspection</button>
                </div>
              </section>
            ) : (
              <form className="mt-7 space-y-7" onSubmit={(event) => { event.preventDefault(); setFormError(""); create.mutate(); }}>
                <section className="rounded-2xl border border-[#e1ded3] bg-[#fffefa] p-5 shadow-[0_10px_32px_rgba(41,66,49,0.04)] sm:p-7">
                  <div className="mb-5 flex items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e4eee3] font-mono text-sm font-bold text-[#286548]">01</span><div><h2 className="text-lg font-semibold">Property & inspection</h2><p className="mb-0 mt-1 text-xs text-[#7a817a]">One property per booking. Every required field is marked.</p></div></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-xs font-semibold text-[#56635a] sm:col-span-2">Inspection service *
                      <select required value={form.service} onChange={(e) => update("service", e.target.value)} className={fields}>{residentialServices.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}</select>
                    </label>
                    <label className="text-xs font-semibold text-[#56635a]">Property type *
                      <select required value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)} className={fields}>{["Apartment", "Villa", "Townhouse", "Penthouse"].map((item) => <option key={item}>{item}</option>)}</select>
                    </label>
                    <label className="text-xs font-semibold text-[#56635a]">Area (sq ft) *
                      <input required type="number" min="1" max="1000000" step="0.01" value={form.areaSqft} onChange={(e) => update("areaSqft", e.target.value)} className={fields} />
                    </label>
                    <label className="text-xs font-semibold text-[#56635a]">Bedrooms <span className="font-normal text-[#90958e]">optional</span>
                      <select value={form.bedrooms || ""} onChange={(e) => setForm((current) => { const next = { ...current }; if (e.target.value) next.bedrooms = e.target.value as NonNullable<FormState["bedrooms"]>; else delete next.bedrooms; return next; })} className={fields}><option value="">Choose if known</option>{["Studio", "1", "2", "3", "4", "5", "6+"].map((item) => <option key={item}>{item}</option>)}</select>
                    </label>
                    <label className="text-xs font-semibold text-[#56635a]">Project / building / community *
                      <input required maxLength={255} value={form.project} onChange={(e) => update("project", e.target.value)} className={fields} placeholder="e.g. Dubai Hills Estate" />
                    </label>
                    <label className="text-xs font-semibold text-[#56635a]">Location / address *
                      <input required maxLength={255} value={form.location} onChange={(e) => update("location", e.target.value)} className={fields} placeholder="Building, street or map location" />
                    </label>
                    <label className="text-xs font-semibold text-[#56635a]">Emirate *
                      <select required value={form.emirate} onChange={(e) => update("emirate", e.target.value)} className={fields}>{emirates.map((item) => <option key={item}>{item}</option>)}</select>
                    </label>
                    <label className="text-xs font-semibold text-[#56635a]">Preferred inspection date *
                      <input required type="date" min={today} value={form.inspectionDate} onChange={(e) => update("inspectionDate", e.target.value)} className={fields} />
                    </label>
                    <label className="text-xs font-semibold text-[#56635a] sm:col-span-2">Preferred time window <span className="font-normal text-[#90958e]">optional</span>
                      <input maxLength={100} value={form.timeWindow || ""} onChange={(e) => setForm((current) => ({ ...current, timeWindow: e.target.value || undefined }))} className={fields} placeholder="e.g. Morning, 9 am–12 pm" />
                    </label>
                  </div>
                </section>
                <section className="rounded-2xl border border-[#e1ded3] bg-[#fffefa] p-5 shadow-[0_10px_32px_rgba(41,66,49,0.04)] sm:p-7">
                  <div className="mb-5 flex items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e4eee3] font-mono text-sm font-bold text-[#286548]">02</span><div><h2 className="text-lg font-semibold">Your details</h2><p className="mb-0 mt-1 text-xs text-[#7a817a]">We’ll use these details to coordinate access and timing.</p></div></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-xs font-semibold text-[#56635a]">Full name *
                      <input required minLength={2} maxLength={255} value={form.name} onChange={(e) => update("name", e.target.value)} className={fields} autoComplete="name" />
                    </label>
                    <label className="text-xs font-semibold text-[#56635a]">Email *
                      <input required type="email" maxLength={255} value={form.email} onChange={(e) => update("email", e.target.value)} className={fields} autoComplete="email" />
                    </label>
                    <label className="text-xs font-semibold text-[#56635a] sm:col-span-2">Phone *
                      <input required type="tel" pattern="\+?[\d\s()-]{7,50}" maxLength={50} value={form.phone} onChange={(e) => update("phone", e.target.value)} className={fields} autoComplete="tel" placeholder="+971 50 000 0000" />
                    </label>
                  </div>
                </section>
                {formError && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{formError}</p>}
                <button type="submit" disabled={create.isPending || !price} className="flex min-h-14 w-full items-center justify-center rounded-md bg-[#286548] px-5 text-sm font-semibold text-white transition hover:bg-[#204f38] disabled:cursor-not-allowed disabled:opacity-55">
                  {create.isPending ? "Confirming your booking…" : "Confirm inspection booking"}
                </button>
                <p className="mb-0 text-center text-xs leading-5 text-[#737c73]">Your booking is confirmed when submitted. No upfront payment is required.</p>
              </form>
            )}
          </section>

          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-2xl border border-[#244b36] bg-[#244b36] text-[#f6f2e8] shadow-[0_18px_46px_rgba(31,61,43,0.17)]">
              <div className="border-b border-white/15 px-5 py-5 sm:px-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9ddc7]">Transparent quote</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">Know the full amount first.</h2>
                <p className="mb-0 mt-2 text-xs leading-5 text-[#d1ddd0]">Calculated from the selected inspection and property area, including UAE VAT.</p>
              </div>
              <div className="space-y-3 px-5 py-5 sm:px-6">
                {price ? <>
                  <div className="flex justify-between text-sm"><span className="text-[#d1ddd0]">Inspection fee</span><span>{formatAed(price.baseMinor)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#d1ddd0]">VAT · 5%</span><span>{formatAed(price.vatMinor)}</span></div>
                  <div className="mt-4 border-t border-white/20 pt-4"><div className="flex items-baseline justify-between"><span className="text-sm font-semibold">Total</span><span className="text-xl font-semibold">{formatAed(price.totalMinor)}</span></div></div>
                </> : <div className="rounded-lg border border-white/20 bg-white/5 p-4"><p className="mb-1 text-sm font-semibold">Enter a valid property area</p><p className="mb-0 text-xs leading-5 text-[#d1ddd0]">Use an area up to 1,000,000 sq ft to calculate the standard residential inspection price.</p></div>}
                <div className="rounded-lg bg-white/10 p-3 text-xs font-semibold leading-5">100% payment after inspection and before release of the final report.</div>
                <div className="border-t border-white/20 pt-4">
                  <p className="mb-1 text-xs font-semibold">Independent, engineer-led work</p>
                  <p className="mb-0 text-xs leading-5 text-[#d1ddd0]">Your single-property residential booking is confirmed at submission. Large villas are priced by the same transparent area calculation, without a size surcharge.</p>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-[#ded9cd] bg-[#eeeade] p-4">
              <p className="mb-1 text-sm font-semibold">A scope outside single-property residential inspection?</p>
              <p className="mb-2 text-xs leading-5 text-[#687269]">Multi-unit, building or common-area work, RFS, BCS, BCA, RCA, commercial, consultancy and fit-out services need a custom scope.</p>
              <Link href="/contact?enquiryType=General%20Enquiry" className="text-sm font-semibold text-[#286548] underline underline-offset-4">Request a custom quote</Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}