import { useEffect, useState } from "react";
import { Link } from "wouter";
import ConsultationForm from "@/components/ConsultationForm";
import ScrollTriggeredForm from "@/components/ScrollTriggeredForm";
import SampleReportModal from "@/components/SampleReportModal";
import { Button } from "@/components/ui/button";
import {
  ChevronDown, ArrowRight, Shield, Globe,
  Zap, Droplets, Wind, Building2,
  Layers, DoorOpen, Flame, Sun, Users, Star, Quote
} from "lucide-react";
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
  const [counts, setCounts] = useState({ inspections: 0, defects: 0, saving: 0, cities: 0, rating: 0 });
  const [activeTab, setActiveTab] = useState<keyof typeof serviceCategories>('property-snagging');
  const [reportModalOpen, setReportModalOpen] = useState(false);

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
        defects: Math.floor((600000 / steps) * step),
        saving: Math.floor((50000 / steps) * step),
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
        { id: 1, title: "New Build Handover Snagging", description: "We inspect your new property before you accept the keys — identifying every defect so the developer fixes them, not you.", slug: "new-build-snagging" },
        { id: 2, title: "Post Renovation Inspection", description: "After fit-out or renovation work, we verify every detail meets your specification and quality standards before final payment.", slug: "post-renovation-inspection" },
        { id: 3, title: "DLP Snagging", description: "We identify hidden issues before your Defects Liability Period expires — giving you one last chance to have the developer cover repairs.", slug: "dlp-snagging" },
        { id: 4, title: "Move-in / Move-out Snagging", description: "A detailed condition report protects your deposit and documents the property's state before and after your tenancy.", slug: "move-in-move-out" },
        { id: 5, title: "Secondary Market Snagging", description: "Before you commit to a resale property, we uncover hidden defects that give you negotiating power or the confidence to walk away.", slug: "secondary-market" },
        { id: 6, title: "Developer & Contractor Snagging", description: "We provide independent quality control for your project — catching defects before your clients do.", slug: "developer-projects" }
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

  const inspectionCategories = [
    { icon: <Wind className="w-5 h-5" />, title: "Air Conditioning & Ventilation", caption: "We check airflow, refrigerant levels, and duct sealing so your cooling bills don't spike after handover." },
    { icon: <Zap className="w-5 h-5" />, title: "Electrical Systems", caption: "Every circuit, socket, and DB board is tested against UAE DEWA regulations — before you move in." },
    { icon: <Droplets className="w-5 h-5" />, title: "Plumbing & Drainage", caption: "Pressure tests and flow checks catch leaks and blockages that are invisible until they cause real damage." },
    { icon: <Shield className="w-5 h-5" />, title: "Waterproofing", caption: "Bathrooms, terraces, and roof membranes are the most common failure points — we check every one." },
    { icon: <Building2 className="w-5 h-5" />, title: "Structural Elements", caption: "Cracks, settlement, and load-bearing issues are identified by qualified engineers, not general inspectors." },
    { icon: <Layers className="w-5 h-5" />, title: "Finishes & Tiling", caption: "Hollow tiles, uneven grout, paint defects, and silicone failures — all logged with photos in your report." },
    { icon: <DoorOpen className="w-5 h-5" />, title: "Doors & Windows", caption: "Alignment, sealing, and hardware are checked so you don't pay for replacements within the first year." },
    { icon: <Flame className="w-5 h-5" />, title: "Fire Safety Systems", caption: "Smoke detectors, sprinklers, and emergency lighting are tested to NFPA 72 and UAE Civil Defence standards." },
    { icon: <Sun className="w-5 h-5" />, title: "Balconies & External", caption: "Railings, drainage falls, and external cladding are inspected so you enjoy your outdoor space safely." },
    { icon: <Users className="w-5 h-5" />, title: "Common Areas", caption: "Lifts, lobbies, parking, and plant rooms are documented — critical for RERA compliance and resale value." }
  ];

  const testimonials = [
    {
      name: "Khalid A.",
      property: "3BR Apartment · Dubai Marina",
      rating: 5,
      defect: "They found 31 defects the developer's own team missed — including two live wiring faults behind the kitchen. Saved us easily AED 55,000.",
    },
    {
      name: "Sarah M.",
      property: "2BR Apartment · Downtown Dubai",
      rating: 5,
      defect: "Water was seeping into the bathroom wall — invisible to the eye. UrbanGrid caught it with thermal imaging before we signed. The developer fixed it under warranty.",
    },
    {
      name: "Priya R.",
      property: "4BR Villa · Arabian Ranches",
      rating: 5,
      defect: "23 snagging items documented with photos. The developer resolved every single one within our DLP window. The report paid for itself 20 times over.",
    },
    {
      name: "Omar H.",
      property: "1BR Studio · Business Bay",
      rating: 5,
      defect: "Got the report within 24 hours, clear enough that even my developer's site manager couldn't dispute any item. Professional service from start to finish.",
    },
    {
      name: "Fatima N.",
      property: "2BR Apartment · Yas Island, Abu Dhabi",
      rating: 5,
      defect: "The AC system was undersized for the apartment — an AED 18,000 problem UrbanGrid flagged before I accepted the keys. Essential service.",
    },
    {
      name: "James T.",
      property: "3BR Apartment · Al Reem Island, Abu Dhabi",
      rating: 5,
      defect: "Used UrbanGrid for a secondary market purchase. Their report helped me negotiate AED 40,000 off the asking price based on documented defects.",
    }
  ];

  const currentServices = serviceCategories[activeTab].services;

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center bg-zinc-900 mt-8 lg:mt-12 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=1000&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          width="1600"
          height="1000"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/60 via-zinc-900/45 to-zinc-900" />

        <div className={`relative z-10 max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-14 sm:pt-18 pb-36 sm:pb-48 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-brand-green uppercase mb-6">
            Available Now Across UAE
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-7xl font-bold text-white leading-[1.02] tracking-tight mb-5 max-w-3xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            UAE's Leading Home Inspection<br />
            <span className="text-brand-white">&amp; Snagging Company.</span>
          </h1>

          <p className="text-sm sm:text-lg text-zinc-200 mb-8 max-w-lg leading-relaxed font-normal">
            40,000+ UAE properties inspected for snagging and home inspection. 600,000+ defects documented.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
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

            <button
              onClick={() => setReportModalOpen(true)}
              className="inline-flex items-center gap-2 border border-zinc-600 text-zinc-300 px-8 py-[14px] text-sm font-semibold hover:border-white hover:text-white transition-all"
            >
              Download Sample Report
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-zinc-400 font-medium mb-8">
            <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-brand-green" />Reports within 24 hours</span>
            <span className="text-zinc-700">·</span>
            <span>Contractor-ready format</span>
            <span className="text-zinc-700">·</span>
            <span>7 Emirates covered</span>
            <span className="text-zinc-700">·</span>
            <span>10+ years experience</span>
          </div>

          {/* Service dropdowns */}
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

        {/* Stats strip — 5 animated tiles, all visible at every breakpoint */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 z-20">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-b-0">
              <div className="py-5 pr-4 border-r border-white/10">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{counts.inspections.toLocaleString()}+</div>
                <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-medium mt-1">Properties Inspected</div>
              </div>
              <div className="py-5 px-4 border-r border-white/10">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{counts.defects.toLocaleString()}+</div>
                <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-medium mt-1">Defects Found</div>
              </div>
              <div className="py-5 px-4 border-r border-white/10 col-span-2 sm:col-span-1">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-green">AED {counts.saving.toLocaleString()}+</div>
                <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-medium mt-1">Avg. Client Saving</div>
              </div>
              <div className="py-5 px-4 border-r border-white/10 border-t border-white/10 sm:border-t-0">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{counts.cities}</div>
                <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-medium mt-1">Emirates Covered</div>
              </div>
              <div className="py-5 pl-4 border-t border-white/10 sm:border-t-0">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{counts.rating} <span className="text-yellow-500 text-base">★</span></div>
                <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-medium mt-1">Client Satisfaction</div>
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

      {/* ── WHAT WE INSPECT ───────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Scope of Inspection</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight max-w-lg">
                What We Inspect in Your Property
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                Engineer-led inspections that have uncovered 600,000+ defects across 40,000 UAE properties — every category covered, nothing glossed over.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-px bg-zinc-200">
            {inspectionCategories.map((item) => (
              <div key={item.title} className="bg-white p-6 lg:p-7 group hover:bg-brand-green/5 transition-colors">
                <div className="w-10 h-10 flex items-center justify-center border border-zinc-100 text-brand-green mb-5 group-hover:border-brand-green/30 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xs font-bold text-zinc-900 mb-2 leading-snug">{item.title}</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed">{item.caption}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/services">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all cursor-pointer">
                See All Inspection Services <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
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
                Engineer-led inspections that have uncovered 600,000+ defects across 40,000 UAE properties — protecting your investment at every stage.
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
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight mb-4">
                Your home is likely the largest purchase of your life.
              </h2>
              <p className="text-brand-green text-sm font-semibold mb-6">Here's how we protect it.</p>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                In 10+ years and 40,000+ UAE inspections, we've seen the same defects over and over — faulty wiring hidden behind walls, waterproofing failures that show up two years too late, AC systems that fail before summer. Your report gives you the evidence to have every one of them fixed at the developer's expense, not yours.
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed mb-10">
                Every inspection is led by a qualified engineer. Your report arrives within 24 hours in a contractor-ready format — specific enough that no developer can dispute it, clear enough that you can act on it immediately.
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
                width="700"
                height="520"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute -bottom-6 -right-6 bg-zinc-950 text-white p-6">
                <div className="text-3xl font-bold text-brand-green">600,000+</div>
                <div className="text-xs text-zinc-400 mt-1 uppercase tracking-widest">Defects Documented</div>
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

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Client Stories</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight max-w-lg">
                What Our Clients Say
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
                </div>
                <p className="text-zinc-500 text-sm">
                  Based on <span className="font-semibold text-zinc-900">1,200+ verified Google reviews</span> · 4.9 ★ average
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-100">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white p-8 flex flex-col gap-5">
                <Quote className="w-6 h-6 text-brand-green/30" />
                <p className="text-zinc-700 text-sm leading-relaxed flex-1">"{t.defect}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <div>
                    <p className="text-xs font-bold text-zinc-900">{t.name}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{t.property}</p>
                  </div>
                  <div className="flex">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/contact">
              <Button className="bg-brand-green text-white hover:bg-emerald-700 px-8 py-6 text-sm font-semibold rounded-none">
                Book Your Inspection Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── INTERNATIONAL STANDARDS ───────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Standards</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight max-w-lg">
                International Standards We Follow
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                Our inspections strictly adhere to internationally recognised standards for fire safety, HVAC systems, and structural integrity.
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
                body: "Utilising ASTM E2018 for Property Condition Assessments and ASTM standards for material testing and structural integrity evaluations.",
                href: "https://www.astm.org",
                color: "text-brand-green",
                icon: "fas fa-cogs"
              }
            ].map((std) => (
              <div key={std.label} className="p-8 lg:p-10 group hover:bg-white transition-colors">
                <p className={`text-[10px] font-semibold tracking-[0.25em] uppercase mb-6 ${std.color}`}>{std.label}</p>
                <h3 className="text-xl font-bold text-zinc-900 mb-4">{std.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed mb-6">{std.body}</p>
                <a href={std.href} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all">
                  Visit {std.label}.org <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-16 divide-y divide-zinc-100 border-y border-zinc-100">
            {[
              { q: "What does NFPA 101 cover in building inspections?", a: "NFPA 101 Life Safety Code addresses fire protection requirements, exit routes, emergency lighting, and life safety systems to ensure occupant safety in buildings." },
              { q: "How does ASHRAE Standard 180 impact inspections?", a: "ASHRAE 180 provides guidelines for building commissioning processes, ensuring HVAC systems operate efficiently and meet design specifications." },
              { q: "What is ASTM E2018 for Property Assessments?", a: "ASTM E2018 standardises property condition assessments, providing consistent methodology for evaluating building systems and components." },
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

      {/* ── COVERAGE ──────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
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
              { city: "Dubai", stat: "15,000+", note: "Inspections completed", desc: "Dubai Marina, Downtown, Business Bay, Palm Jumeirah and all Dubai areas.", icon: "fas fa-building" },
              { city: "Abu Dhabi", stat: "12,000+", note: "Inspections completed", desc: "Saadiyat Island, Yas Island, Al Reem and the entire capital.", icon: "fas fa-mosque" },
              { city: "Sharjah", stat: "8,000+", note: "Inspections completed", desc: "Residential communities, new developments and heritage properties.", icon: "fas fa-university" }
            ].map((loc) => (
              <div key={loc.city} className="p-8 lg:p-10 h-full">
                <i className={`${loc.icon} text-brand-green text-xl mb-6 block`}></i>
                <div className="text-2xl font-bold text-brand-green mb-1">{loc.stat}</div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-400 mb-4">{loc.note}</div>
                <h3 className="text-lg font-bold text-zinc-900 mb-3">{loc.city}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{loc.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/contact">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all cursor-pointer">
                Request a Quote in Your Area <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
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
                Don't Accept Your Property<br />Without Reading the Report First.
              </h2>
            </div>
            <div className="flex flex-col gap-4 lg:items-end">
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xs lg:text-right">
                Reports delivered within 24 hours. Engineers across all 7 Emirates. The UAE's most thorough inspection, or your money back.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-brand-green text-white hover:bg-emerald-700 px-8 py-6 text-sm font-semibold rounded-none">
                    Get a Free Quote
                  </Button>
                </Link>
                <a
                  href="tel:+971567427634"
                  className="inline-flex items-center justify-center border border-zinc-600 text-zinc-300 px-8 py-6 font-medium text-sm hover:border-white hover:text-white transition-all"
                >
                  <i className="fas fa-phone mr-3 text-brand-green"></i>
                  +971 567427634
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
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>4.9 ★ · 1,200+ Google Reviews</span>
            </div>
          </div>
        </div>
      </section>

      <ScrollTriggeredForm />

      <SampleReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </>
  );
}
