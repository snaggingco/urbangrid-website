import { Link, useRoute } from "wouter";
import { ukCityBySlug, ukCityPages } from "@shared/ukLocations";

const wrap = "mx-auto max-w-6xl px-6 sm:px-10 lg:px-16";

export default function UKLocations() {
  const [, params] = useRoute("/locations/:slug");
  const city = params?.slug ? ukCityBySlug(params.slug) : undefined;

  if (params?.slug && !city) {
    return <section className={`${wrap} pb-24 pt-32`}><h1>Location unavailable</h1><Link href="/locations">See enquiry locations</Link></section>;
  }

  if (!city) {
    return <div className="bg-white">
      <section className="bg-zinc-950 pt-32 pb-20 text-white"><div className={wrap}>
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-emerald-300">UK property enquiries</p>
        <h1 className="max-w-4xl text-4xl font-bold lg:text-5xl">Property inspections across major UK cities</h1>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-300">Ask UrbanGrid UK about residential snagging, building condition surveys and consultancy in your area. Every location is subject to a postcode, scope and provider-availability check before a quote or appointment is agreed.</p>
      </div></section>
      <section className={`${wrap} py-14`}>
        <h2 className="mb-6 text-2xl font-bold">Find your city</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/locations/london" className="border border-zinc-200 p-5 hover:border-emerald-600"><span className="block font-semibold">London</span><span className="mt-1 block text-xs text-zinc-500">London and nearby areas</span></Link>
          {ukCityPages.map(item => <Link key={item.slug} href={`/locations/${item.slug}`} className="border border-zinc-200 p-5 hover:border-emerald-600">
            <span className="block font-semibold">{item.name}</span><span className="mt-1 block text-xs text-zinc-500">{item.region} · check availability</span>
          </Link>)}
        </div>
        <p className="mt-8 text-sm text-zinc-600">Don't see your location? <Link className="text-emerald-700 underline" href="/contact">Send your postcode and requirements</Link>. A listed city is an enquiry destination, not evidence of a local office or an available inspector.</p>
      </section>
    </div>;
  }

  const cityContactPath = `/contact?location=${encodeURIComponent(city.name)}`;
  return <div className="bg-white">
    <section className="bg-zinc-950 pt-32 pb-20 text-white"><div className={wrap}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-emerald-300">{city.region} · property inspection enquiries</p>
      <h1 className="max-w-4xl text-4xl font-bold lg:text-5xl">Property snagging and building surveys in {city.name}</h1>
      <p className="mt-6 max-w-3xl text-base leading-relaxed text-zinc-300">Get an inspection or consultancy quote for a property in {city.name}. Please share the postcode and required service. We first confirm provider coverage, suitable expertise, travel and access before agreeing any visit.</p>
      <Link href={cityContactPath} className="mt-8 inline-flex bg-emerald-700 px-6 py-4 text-sm font-semibold text-white hover:bg-emerald-600">Request a {city.name} quote →</Link>
    </div></section>
    <section className={`${wrap} grid gap-12 py-16 lg:grid-cols-2`}>
      <div><h2 className="mb-5 text-2xl font-bold">What can be inspected in {city.name}?</h2>
        <p className="text-sm leading-7 text-zinc-600">{city.name} enquiries may involve {city.examples}. The appropriate approach depends on construction stage, property type and access rather than the city name alone.</p>
        <p className="mt-5 text-sm leading-7 text-zinc-600">Common enquiry types include {city.stock.toLowerCase()}. We can discuss new-build handover inspections, warranty-period checks, resale condition surveys, and building consultancy for relevant properties.</p>
        <p className="mt-5 text-sm leading-7 text-zinc-600">{city.tip}</p>
      </div>
      <aside className="border border-zinc-200 bg-zinc-50 p-7">
        <h2 className="text-xl font-bold">Information to include with your enquiry</h2>
        <ul className="mt-5 space-y-4 text-sm leading-6 text-zinc-600">
          <li><strong>Full property postcode:</strong> used to verify coverage and travel requirements</li>
          <li><strong>Property and inspection stage:</strong> apartment, house, whole building; handover, ownership or maintenance</li>
          <li><strong>Scope:</strong> new-build snagging, resale survey, condition assessment or specialist inspection</li>
          <li><strong>Timing and access:</strong> proposed date, agent/developer contacts, drawings and available documentation</li>
        </ul>
      </aside>
    </section>
    <section className="bg-zinc-50 py-16"><div className={wrap}>
      <h2 className="mb-7 text-2xl font-bold">Explore the right inspection service</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["New-build snagging", "/services/property-snagging/new-build-snagging", "Accessible defects and finishes before or around handover."],
          ["Building condition survey", "/services/rera-services/building-condition-survey", "Visible fabric, services and maintenance priorities under an agreed scope."],
          ["Technical due diligence", "/services/technical-inspections/technical-due-diligence", "Condition and documentation review before a property investment decision."]
        ].map(([title,href,detail]) => <Link key={href} href={href} className="border border-zinc-200 bg-white p-6 hover:border-emerald-600"><h3 className="font-semibold">{title}</h3><p className="mt-3 text-xs leading-6 text-zinc-600">{detail}</p><span className="mt-4 inline-block text-xs font-semibold text-emerald-700">View service →</span></Link>)}
      </div>
    </div></section>
    <section className={`${wrap} py-16`}>
      <h2 className="mb-5 text-2xl font-bold">Availability and scope in {city.name}</h2>
      <p className="max-w-3xl text-sm leading-7 text-zinc-600">This city page helps you enquire; it is not a statement that UrbanGrid has a permanent {city.name} office or an inspector available on any given date. A tailored quote in GBP follows confirmation of provider coverage, inspection requirements and access. There is no online checkout; for standard residential work, payment is after the inspection and before final report release.</p>
      <div className="mt-8 flex flex-wrap gap-5"><Link href={cityContactPath} className="bg-emerald-700 px-6 py-3 text-sm font-semibold text-white">Discuss your property</Link><Link href="/locations" className="px-2 py-3 text-sm font-semibold text-emerald-700 underline">Other UK cities</Link></div>
    </section>
  </div>;
}
