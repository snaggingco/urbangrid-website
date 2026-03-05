import { useEffect, useState } from "react";
import { Link } from "wouter";
import ConsultationForm from "@/components/ConsultationForm";
import ScrollTriggeredForm from "@/components/ScrollTriggeredForm";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowRight, Shield, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import internachi1 from "@assets/internachi.webp";
import internachi2 from "@assets/internachi2.webp";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({ inspections: 0, cities: 0, rating: 0 });
  const [activeTab, setActiveTab] = useState<keyof typeof serviceCategories>('property-snagging');

  useEffect(() => {
    setIsVisible(true);
    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCounts({
        inspections: Math.floor((40000 / steps) * step),
        cities: Math.floor((7 / steps) * step),
        rating: Math.min(4.9, parseFloat(((4.9 / steps) * step).toFixed(1)))
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  const serviceCategories = {
    'property-snagging': {
      title: 'Property Snagging',
      subtitle: 'Comprehensive property inspection and snagging services',
      categorySlug: 'property-snagging',
      services: [
        { id: 1, title: "New Build Handover Snagging", description: "Comprehensive inspection before accepting your new property, identifying defects and ensuring everything meets standards.", slug: "new-build-snagging" },
        { id: 2, title: "Post Renovation Inspection", description: "Quality assessment after renovation or fit-out work, ensuring all work meets specifications and quality standards.", slug: "post-renovation-inspection" },
        { id: 3, title: "DLP Snagging", description: "Defect Liability Period inspections to identify issues before warranty expires and ensure developer compliance.", slug: "dlp-snagging" },
        { id: 4, title: "Move-in / Move-out Snagging", description: "Comprehensive condition reports for rental properties, protecting both tenants and landlords during transitions.", slug: "move-in-move-out" },
        { id: 5, title: "Secondary Market Snagging", description: "Pre-purchase inspections for existing properties, helping buyers make informed decisions and negotiate fairly.", slug: "secondary-market" },
        { id: 6, title: "Developer & Contractor Snagging", description: "Quality control inspections for developers and contractors, ensuring projects meet industry standards and specifications.", slug: "developer-projects" }
      ]
    },
    'rera-services': {
      title: 'RERA Services',
      subtitle: 'Professional regulatory compliance and assessment services',
      categorySlug: 'rera-services',
      services: [
        { id: 7, title: "Reserve Fund Study / Sinking Fund", description: "Comprehensive analysis of building reserve fund requirements and long-term capital expenditure planning for strata properties.", slug: "reserve-fund-study" },
        { id: 8, title: "Service Charge Cost Allocation", description: "Detailed assessment and allocation of service charges across common property areas ensuring fair distribution and RERA compliance.", slug: "service-charge-allocation" },
        { id: 9, title: "Reinstatement Cost Assessment", description: "Professional valuation of property reinstatement costs for insurance purposes and regulatory compliance requirements.", slug: "reinstatement-cost-assessment" },
        { id: 10, title: "Building Completion Audit", description: "Comprehensive audit to verify building completion status against approved plans and regulatory requirements for RERA compliance.", slug: "building-completion-audit" },
        { id: 11, title: "Building Condition Survey", description: "Detailed condition assessment of building components and systems for regulatory reporting and maintenance planning.", slug: "building-condition-survey" }
      ]
    },
    'technical-inspections': {
      title: 'Technical Inspections',
      subtitle: 'Specialized technical assessments and surveys',
      categorySlug: 'technical-inspections',
      services: [
        { id: 12, title: "Technical Due Diligence", description: "Comprehensive technical analysis for property acquisition, covering structural, mechanical, and compliance aspects for informed investment decisions.", slug: "technical-due-diligence" },
        { id: 13, title: "Dilapidation Survey", description: "Pre and post-construction condition assessments of adjacent properties to document potential impact from nearby construction activities.", slug: "dilapidation-survey" },
        { id: 14, title: "Thermographic Survey", description: "Advanced thermal imaging inspections to detect energy losses, moisture intrusion, and electrical issues invisible to conventional inspection methods.", slug: "thermographic-survey" },
        { id: 15, title: "Noise Survey", description: "Professional acoustic assessments to measure and analyze noise levels for compliance with local regulations and habitability standards.", slug: "noise-survey" },
        { id: 16, title: "Structural Survey", description: "Detailed structural engineering assessment examining building integrity, load-bearing elements, and structural compliance with safety standards.", slug: "structural-survey" }
      ]
    }
  };

  const tabs = [
    { key: 'property-snagging', label: 'Property Snagging' },
    { key: 'rera-services', label: 'RERA Services' },
    { key: 'technical-inspections', label: 'Technical Inspections' }
  ];

  const currentServices = serviceCategories[activeTab].services;

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center bg-zinc-950 mt-8 lg:mt-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=1000&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950" />

        <div className={`relative z-10 max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-20 pb-40 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-brand-green uppercase mb-8">
            Available Now Across UAE
          </p>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-8 max-w-4xl">
            UAE's #1 Snagging &<br />
            <span className="text-brand-green">Inspection Experts</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 mb-12 max-w-xl leading-relaxed font-light">
            Professional property inspection services in Dubai, Abu Dhabi, Sharjah &amp; Ajman — protecting your investment with international standards.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-brand-green text-white hover:bg-emerald-700 transition-all px-8 py-6 text-sm font-semibold tracking-wide rounded-none group relative overflow-hidden active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <span className="flex items-center gap-3">
                  Book Inspection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>

            <div className="flex flex-wrap gap-3">
              {Object.entries(serviceCategories).map(([key, category]) => (
                <DropdownMenu key={key}>
                  <DropdownMenuTrigger asChild>
                    <button className="text-zinc-500 hover:text-white transition-colors text-[11px] font-medium flex items-center gap-1 tracking-wide border-b border-zinc-700 hover:border-zinc-400 pb-0.5">
                      {category.title}
                      <ChevronDown className="w-3 h-3 opacity-50" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 bg-zinc-900 border-zinc-700 rounded-none p-2 shadow-2xl">
                    {category.services.map((service) => (
                      <DropdownMenuItem key={service.id} className="focus:bg-brand-green/10 focus:text-brand-green cursor-pointer rounded-none py-3 px-4">
                        <Link href={`/services/${category.categorySlug}/${service.slug}`} className="w-full flex items-center justify-between group text-zinc-300 hover:text-white">
                          <span className="text-xs font-medium">{service.title}</span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 z-20">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid grid-cols-3 divide-x divide-white/10">
              <div className="py-6 pr-8">
                <div className="text-2xl sm:text-3xl font-bold text-brand-green">{counts.inspections.toLocaleString()}+</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-medium mt-1">Properties Inspected</div>
              </div>
              <div className="py-6 px-8">
                <div className="text-2xl sm:text-3xl font-bold text-white">{counts.cities}</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-medium mt-1">Emirates Covered</div>
              </div>
              <div className="py-6 pl-8">
                <div className="text-2xl sm:text-3xl font-bold text-brand-green">{counts.rating} <span className="text-yellow-500 text-lg">★</span></div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-medium mt-1">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATION STRIP ───────────────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2">
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Certification</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight mb-4">
                Certified by InterNACHI
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Internationally certified home inspectors committed to professional excellence and industry standards. Our credentials represent the highest level of inspection expertise available.
              </p>
            </div>
            <div className="flex items-center gap-8 lg:gap-12">
              <div className="p-6 border border-zinc-100 hover:border-brand-green/30 transition-colors">
                <img src={internachi1} alt="InterNACHI Certification" className="h-16 lg:h-20 w-auto object-contain" loading="lazy" />
              </div>
              <div className="p-6 border border-zinc-100 hover:border-brand-green/30 transition-colors">
                <img src={internachi2} alt="InterNACHI Badge" className="h-16 lg:h-20 w-auto object-contain" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONSULTATION FORM ─────────────────────────────────────────────── */}
      <ConsultationForm />

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Services</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight max-w-lg">
                Our Professional Services
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                Comprehensive property inspection and snagging services across the UAE, following NFPA, ASHRAE, and ASTM international standards.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 mb-12 border-b border-zinc-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as keyof typeof serviceCategories)}
                className={`px-4 sm:px-6 py-3 text-xs font-semibold tracking-wide transition-all border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? 'border-brand-green text-brand-green'
                    : 'border-transparent text-zinc-400 hover:text-zinc-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Services list */}
          <div className="divide-y divide-zinc-200">
            {currentServices.map((service, idx) => (
              <Link key={service.id} href={`/services/${serviceCategories[activeTab].categorySlug}/${service.slug}`}>
                <div className="group flex items-start justify-between gap-6 py-7 cursor-pointer hover:bg-zinc-100 -mx-4 px-4 transition-colors">
                  <div className="flex items-start gap-6">
                    <span className="text-[10px] font-semibold tracking-widest text-zinc-300 pt-1 w-6 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-zinc-900 group-hover:text-brand-green transition-colors mb-1">
                        {service.title}
                      </h3>
                      <p className="text-zinc-400 text-xs leading-relaxed max-w-lg">{service.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-brand-green group-hover:translate-x-1 transition-all mt-1 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY / WHY CHOOSE ───────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Philosophy</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight mb-8">
                Why Choose UrbanGrid?
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                With over a decade of experience in the UAE property market, UrbanGrid is your trusted partner for comprehensive property inspections and snagging services. Our certified team follows international standards including NFPA, ASHRAE, and ASTM guidelines.
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed mb-10">
                We serve clients across Dubai, Abu Dhabi, Sharjah, and the entire UAE, providing peace of mind through thorough, professional inspections that comply with the highest global benchmarks.
              </p>
              <Link href="/about">
                <button className="flex items-center gap-2 text-sm font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=520&q=80"
                alt="Professional property inspection team"
                className="w-full object-cover"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -right-6 bg-zinc-950 text-white p-6">
                <div className="text-3xl font-bold text-brand-green">40,000+</div>
                <div className="text-xs text-zinc-400 mt-1 uppercase tracking-widest">Properties Inspected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACCREDITATIONS ────────────────────────────────────────────────── */}
      <section className="py-20 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Accreditations</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
            <h2 className="text-3xl font-bold text-zinc-900">Certified &amp; Accredited</h2>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">Trusted by leading developers, contractors, and homeowners across the UAE.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 divide-x divide-zinc-200 border border-zinc-200">
            {[
              { label: "RERA Approved", icon: "fas fa-certificate" },
              { label: "ISO 9001", icon: "fas fa-shield-alt" },
              { label: "NACHI Member", icon: "fas fa-award" },
              { label: "Dubai Municipality", icon: "fas fa-building" },
            ].map((cert) => (
              <div key={cert.label} className="flex flex-col items-center justify-center py-10 px-4 gap-3">
                <i className={`${cert.icon} text-brand-green text-xl`}></i>
                <span className="text-[11px] font-semibold text-zinc-600 tracking-wide text-center">{cert.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERNATIONAL STANDARDS ───────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Standards</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight max-w-lg">
                International Standards We Follow
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                Our inspections strictly adhere to internationally recognized standards for fire safety, HVAC systems, and structural integrity.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100 border border-zinc-100">
            {[
              {
                label: "NFPA",
                title: "Fire Safety Standards",
                body: "Following NFPA 70 (NEC), NFPA 72 (Fire Alarm), NFPA 101 (Life Safety Code), and NFPA 25 (Fire Protection Systems) for comprehensive safety inspections.",
                href: "https://www.nfpa.org",
                color: "text-red-500",
                icon: "fas fa-fire-extinguisher"
              },
              {
                label: "ASHRAE",
                title: "HVAC & Air Quality",
                body: "Implementing ASHRAE Standard 180 for building commissioning and ASHRAE 62.1 for ventilation to ensure optimal indoor air quality.",
                href: "https://www.ashrae.org",
                color: "text-blue-500",
                icon: "fas fa-wind"
              },
              {
                label: "ASTM",
                title: "Material & Structural",
                body: "Utilizing ASTM E2018 for Property Condition Assessments and ASTM standards for material testing and structural integrity evaluations.",
                href: "https://www.astm.org",
                color: "text-brand-green",
                icon: "fas fa-cogs"
              }
            ].map((std) => (
              <div key={std.label} className="p-8 lg:p-10 group hover:bg-zinc-50 transition-colors">
                <p className={`text-[10px] font-semibold tracking-[0.25em] uppercase mb-6 ${std.color}`}>{std.label}</p>
                <h3 className="text-xl font-bold text-zinc-900 mb-4">{std.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed mb-6">{std.body}</p>
                <a href={std.href} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all">
                  Learn More <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-16 divide-y divide-zinc-100 border-y border-zinc-100">
            {[
              { q: "What does NFPA 101 cover in building inspections?", a: "NFPA 101 Life Safety Code addresses fire protection requirements, exit routes, emergency lighting, and life safety systems to ensure occupant safety in buildings." },
              { q: "How does ASHRAE Standard 180 impact inspections?", a: "ASHRAE 180 provides guidelines for building commissioning processes, ensuring HVAC systems operate efficiently and meet design specifications." },
              { q: "What is ASTM E2018 for Property Assessments?", a: "ASTM E2018 standardizes property condition assessments, providing consistent methodology for evaluating building systems and components." },
              { q: "Why follow NFPA 72 for fire alarm systems?", a: "NFPA 72 ensures fire detection and alarm systems are properly installed, tested, and maintained according to national safety standards." }
            ].map((faq) => (
              <div key={faq.q} className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <h4 className="text-sm font-semibold text-zinc-800">{faq.q}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATIONS ─────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Coverage</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                Snagging Services Across UAE
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                Professional property inspection services in Dubai, Abu Dhabi, Sharjah and all Emirates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200 border border-zinc-200">
            {[
              { city: "Dubai", stat: "15,000+", note: "Inspections completed", desc: "Dubai Marina, Downtown, Business Bay, Palm Jumeirah and all Dubai areas.", href: "/locations/dubai", icon: "fas fa-building" },
              { city: "Abu Dhabi", stat: "12,000+", note: "Inspections completed", desc: "Saadiyat Island, Yas Island, Al Reem and the entire capital.", href: "/locations/abu-dhabi", icon: "fas fa-mosque" },
              { city: "Sharjah", stat: "8,000+", note: "Inspections completed", desc: "Residential communities, new developments and heritage properties.", href: "/locations/sharjah", icon: "fas fa-university" }
            ].map((loc) => (
              <Link key={loc.city} href={loc.href}>
                <div className="group p-8 lg:p-10 hover:bg-white transition-colors cursor-pointer h-full">
                  <i className={`${loc.icon} text-brand-green text-xl mb-6 block`}></i>
                  <div className="text-2xl font-bold text-brand-green mb-1">{loc.stat}</div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-400 mb-4">{loc.note}</div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-3">{loc.city}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed mb-6">{loc.desc}</p>
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 group-hover:gap-3 transition-all">
                    Explore {loc.city} Services <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-zinc-950 text-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-6">Get Started</p>
              <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight max-w-xl">
                Ready to Protect Your Investment?
              </h2>
            </div>
            <div className="flex flex-col gap-4 lg:items-end">
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xs lg:text-right">
                Experts across Dubai, Abu Dhabi, and the entire UAE ready to provide the most thorough inspection available.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-brand-green text-white hover:bg-emerald-700 px-8 py-6 text-sm font-semibold rounded-none">
                    Get a Free Quote
                  </Button>
                </Link>
                <a
                  href="tel:+971585686852"
                  className="inline-flex items-center justify-center border border-zinc-600 text-zinc-300 px-8 py-6 font-medium text-sm hover:border-white hover:text-white transition-all"
                >
                  <i className="fas fa-phone mr-3 text-brand-green"></i>
                  +971 58 568 6852
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-wrap gap-8 items-center">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
              <Shield className="w-3 h-3 text-brand-green" />
              <span>RERA Approved</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
              <Globe className="w-3 h-3 text-brand-green" />
              <span>International Standards</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
              <i className="fas fa-award text-brand-green text-xs"></i>
              <span>InterNACHI Certified</span>
            </div>
          </div>
        </div>
      </section>

      <ScrollTriggeredForm />
    </>
  );
}
