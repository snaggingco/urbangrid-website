import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { submitLead } from "@/lib/leads";

type QuoteForm = {
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  community: string;
};

const initialForm: QuoteForm = {
  name: "",
  email: "",
  phone: "",
  propertyType: "",
  community: "",
};

export default function DubaiQuoteForm() {
  const [form, setForm] = useState(initialForm);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);

  const update = (field: keyof QuoteForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setError("");

    const details = [
      "Dubai property snagging quote request",
      form.propertyType ? `Property type: ${form.propertyType}` : "",
      form.community ? `Community / area: ${form.community}` : "",
    ].filter(Boolean).join("\n");

    try {
      await submitLead("/api/contact", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        enquiryType: "Dubai snagging quote",
        message: details,
        leadSource: "dubai_quote",
      });
      setSubmitted(true);
      setForm(initialForm);
    } catch {
      setError("We couldn't send your request just now. Your details are still here — please try again.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  };

  if (submitted) {
    return (
      <div className="h-full border border-emerald-200 bg-white p-6 sm:p-8" role="status" aria-live="polite">
        <div className="mb-5 flex h-11 w-11 items-center justify-center bg-emerald-50 text-brand-green">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">Request received</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Our team will review your property details and get back to you with the next steps for a tailored quote.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-5 text-sm font-semibold text-brand-green underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
        >
          Send another request
        </button>
      </div>
    );
  }

  const inputClass = "mt-1.5 h-11 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-brand-green focus:ring-2 focus:ring-brand-green/15";
  const labelClass = "block text-xs font-semibold text-zinc-700";

  return (
    <div className="border border-zinc-200 bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.12)] sm:p-7">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">Dubai inspection quote</p>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">Tell us about the property</h2>
        <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">Share a few details and our team will follow up with a tailored price.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label htmlFor="dubai-name" className={labelClass}>Name <span aria-hidden="true">*</span></label>
          <input id="dubai-name" name="name" autoComplete="name" required minLength={2} maxLength={255} value={form.name} onChange={(event) => update("name", event.target.value)} className={inputClass} placeholder="Your name" />
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor="dubai-email" className={labelClass}>Email <span aria-hidden="true">*</span></label>
            <input id="dubai-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={(event) => update("email", event.target.value)} className={inputClass} placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="dubai-phone" className={labelClass}>Phone <span aria-hidden="true">*</span></label>
            <input id="dubai-phone" name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={50} value={form.phone} onChange={(event) => update("phone", event.target.value)} className={inputClass} placeholder="+971 5X XXX XXXX" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor="dubai-property-type" className={labelClass}>Property type <span className="font-normal text-zinc-400">(optional)</span></label>
            <select id="dubai-property-type" name="propertyType" value={form.propertyType} onChange={(event) => update("propertyType", event.target.value)} className={inputClass}>
              <option value="">Select type</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="dubai-community" className={labelClass}>Community / area <span className="font-normal text-zinc-400">(optional)</span></label>
            <input id="dubai-community" name="community" value={form.community} onChange={(event) => update("community", event.target.value)} className={inputClass} placeholder="e.g. Dubai Hills Estate" />
          </div>
        </div>
        {error && <p className="text-sm leading-relaxed text-red-700" role="alert">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="group flex min-h-12 w-full items-center justify-center gap-2 bg-brand-green px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green disabled:cursor-wait disabled:opacity-70 motion-reduce:transition-none"
        >
          {pending ? "Sending request…" : "Request my quote"}
          {!pending && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" />}
        </button>
        <p className="text-center text-[11px] leading-relaxed text-zinc-500">No obligation. Final quote depends on property size and service.</p>
      </form>
    </div>
  );
}