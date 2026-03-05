import { useEffect, useState } from "react";
import { Link } from "wouter";
import ConsultationForm from "@/components/ConsultationForm";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, CheckCircle2, Shield, Star, Globe, Building2, MousePointer2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import internachi1 from "@assets/internachi.webp";
import internachi2 from "@assets/internachi2.webp";
import SEO from "@/components/SEO";

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
    <div className="bg-zinc-950 min-h-screen">
      <SEO />

      {/* ── SECTION 1: HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=1000&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/40 to-zinc-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/20 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full pt-32 pb-24">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/20 border border-brand-green/30 backdrop-blur-sm mb-8 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
              <span className="text-[10px] font-semibold tracking-[0.2em] text-brand-green uppercase">Available Now Across UAE</span>
            </div>

            <h1 className="hero-text text-white max-w-5xl mb-8">
              UAE'S #1 SNAGGING &<br />
              <span className="text-brand-green">INSPECTION EXPERTS</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 mb-12 max-w-xl leading-relaxed font-light">
              Professional property inspection services in Dubai, Abu Dhabi, Sharjah & Ajman — protecting your investment with international standards and same-day reporting.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-brand-green text-white hover:bg-emerald-700 transition-all px-10 py-8 text-sm font-bold tracking-[0.1em] rounded-none group relative overflow-hidden active:scale-95 uppercase"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <span className="flex items-center gap-3">
                    Book Inspection
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>

              <div className="flex flex-wrap gap-6">
                {Object.entries(serviceCategories).map(([key, category]) => (
                  <DropdownMenu key={key}>
                    <DropdownMenuTrigger asChild>
                      <button className="text-white/60 hover:text-white transition-colors text-[11px] font-bold flex items-center gap-2 tracking-[0.15em] uppercase border-b border-white/20 hover:border-white pb-1">
                        {category.title}
                        <ChevronDown className="w-3 h-3 opacity-50" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 bg-zinc-900 border-zinc-800 rounded-none p-2 shadow-2xl">
                      {category.services.map((service) => (
                        <DropdownMenuItem key={service.id} className="focus:bg-brand-green/10 focus:text-brand-green cursor-pointer rounded-none py-3 px-4">
                          <Link href={`/services/${category.categorySlug}/${service.slug}`} className="w-full flex items-center justify-between group text-zinc-300 hover:text-white">
                            <span className="text-[10px] font-bold uppercase tracking-wider">{service.title}</span>
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
        </div>

        <div className="absolute bottom-12 right-6 sm:right-10 lg:right-16 flex flex-col items-end gap-4">
          <div className="flex flex-col items-center gap-2 text-white/40 animate-bounce">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] vertical-text">Scroll</span>
            <MousePointer2 className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* ── SECTION 2: STATS ───────────────────────────────────────────────── */}
      <section className="bg-zinc-950 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-900">
            <div className="py-20 px-8 text-center group transition-colors hover:bg-zinc-900/50">
              <div className="text-7xl lg:text-8xl font-black text-brand-green mb-2 leading-none">
                {counts.inspections.toLocaleString()}+
              </div>
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-bold">Properties Inspected</div>
            </div>
            <div className="py-20 px-8 text-center group transition-colors hover:bg-zinc-900/50">
              <div className="text-7xl lg:text-8xl font-black text-white mb-2 leading-none">
                {counts.cities}
              </div>
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-bold">Emirates Covered</div>
            </div>
            <div className="py-20 px-8 text-center group transition-colors hover:bg-zinc-900/50">
              <div className="text-7xl lg:text-8xl font-black text-brand-green mb-2 leading-none flex items-center justify-center gap-2">
                {counts.rating} <Star className="w-12 h-12 fill-brand-green text-brand-green" />
              </div>
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-bold">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: NARRATIVE ───────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <div className="max-w-2xl">
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">Philosophy</p>
            <h2 className="section-heading text-white mb-8">
              THE ART OF<br />
              <span className="text-brand-green">PRECISION INSPECTION</span>
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed font-light mb-10">
              With over a decade of experience in the UAE property market, UrbanGrid is your trusted partner for comprehensive property inspections. Our certified team follows international standards including NFPA, ASHRAE, and ASTM guidelines to ensure every detail is accounted for.
            </p>
            <Link href="/about">
              <button className="flex items-center gap-4 text-xs font-bold text-white uppercase tracking-[0.2em] group">
                <span className="border-b border-brand-green pb-1 group-hover:border-white transition-colors">Our Full Story</span>
                <ArrowRight className="w-5 h-5 text-brand-green group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: SERVICES ────────────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-20">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">Expertise</p>
            <h2 className="section-heading text-zinc-900 mb-8 max-w-3xl">
              SPECIALIZED PROPERTY<br />SOLUTIONS
            </h2>
            
            {/* Minimal Tabs */}
            <div className="flex flex-wrap gap-8 border-b border-zinc-100 mt-12">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as keyof typeof serviceCategories)}
                  className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${
                    activeTab === tab.key
                      ? 'text-zinc-900'
                      : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-zinc-100">
            {currentServices.map((service, idx) => (
              <Link key={service.id} href={`/services/${serviceCategories[activeTab].categorySlug}/${service.slug}`}>
                <div className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-8 py-12 cursor-pointer transition-all hover:px-4">
                  <div className="flex items-center gap-10">
                    <span className="text-6xl font-black text-zinc-100 group-hover:text-brand-green/10 transition-colors leading-none shrink-0 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900 group-hover:text-brand-green transition-colors mb-3 uppercase tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-zinc-500 text-sm leading-relaxed max-w-xl font-light">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-brand-green opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest">Explore Service</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: CERTIFICATION ───────────────────────────────────────── */}
      <section className="py-24 bg-zinc-950 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase mb-12">Internationally Certified By</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-16 lg:gap-32">
            <div className="group">
              <img src={internachi1} alt="InterNACHI" className="h-24 lg:h-32 w-auto grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
            </div>
            <div className="group">
              <img src={internachi2} alt="InterNACHI Badge" className="h-24 lg:h-32 w-auto grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
            </div>
          </div>
          <div className="mt-16 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-wider">WORLD-CLASS CREDENTIALS</h3>
            <p className="text-zinc-500 text-sm font-light leading-relaxed">
              Our inspectors are certified by the International Association of Certified Home Inspectors (InterNACHI), ensuring adherence to the strictest professional standards in the industry.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: CONSULTATION ────────────────────────────────────────── */}
      <ConsultationForm />

      {/* ── SECTION 7: LOCATIONS ───────────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">Network</p>
              <h2 className="section-heading text-zinc-900">ACROSS THE EMIRATES</h2>
            </div>
            <p className="text-zinc-500 text-sm max-w-sm font-light">
              Strategic presence across all major Emirates, providing localized expertise with unified international standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[
              { 
                city: 'DUBAI', 
                img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                slug: 'dubai'
              },
              { 
                city: 'ABU DHABI', 
                img: 'https://images.unsplash.com/photo-1548813831-38faf5a5cdfb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                slug: 'abu-dhabi'
              },
              { 
                city: 'SHARJAH', 
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                slug: 'sharjah'
              }
            ].map((loc) => (
              <Link key={loc.city} href={`/locations/${loc.slug}/snagging-company`}>
                <div className="relative group h-[500px] overflow-hidden cursor-pointer">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                    style={{ backgroundImage: `url('${loc.img}')` }}
                  />
                  <div className="absolute inset-0 bg-zinc-950/40 group-hover:bg-zinc-950/20 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-10 left-10 right-10">
                    <h3 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">{loc.city}</h3>
                    <div className="w-12 h-1 bg-brand-green group-hover:w-full transition-all duration-700" />
                    <div className="mt-4 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">View Operations</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: STANDARDS ───────────────────────────────────────────── */}
      <section className="py-28 lg:py-40 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-20 text-center">
            <p className="text-[10px] font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">Quality Control</p>
            <h2 className="section-heading text-zinc-900 mb-8">GLOBAL STANDARDS</h2>
            <p className="text-zinc-500 text-sm max-w-2xl mx-auto font-light leading-relaxed">
              Our inspection framework is built upon rigorous international benchmarks, ensuring compliance with global fire safety, HVAC, and structural integrity requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {[
              {
                label: "NFPA",
                title: "FIRE SAFETY",
                body: "Following NFPA 70, 72, 101, and 25 for comprehensive life safety and fire protection systems evaluation.",
                color: "text-red-500"
              },
              {
                label: "ASHRAE",
                title: "HVAC SYSTEMS",
                body: "Implementing ASHRAE Standard 180 and 62.1 to ensure optimal ventilation and indoor air quality performance.",
                color: "text-blue-500"
              },
              {
                label: "ASTM",
                title: "STRUCTURAL",
                body: "Utilizing ASTM E2018 for Property Condition Assessments and material testing integrity evaluations.",
                color: "text-brand-green"
              }
            ].map((std) => (
              <div key={std.label} className="group">
                <p className={`text-[10px] font-black tracking-[0.4em] mb-6 ${std.color}`}>{std.label}</p>
                <h3 className="text-xl font-extrabold text-zinc-900 mb-6 uppercase tracking-wider">{std.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8 font-light">{std.body}</p>
                <div className="w-8 h-px bg-zinc-200 group-hover:w-full group-hover:bg-brand-green transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 9: FINAL CTA ───────────────────────────────────────────── */}
      <section className="py-32 lg:py-48 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#064E3B_0,transparent_50%)]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <p className="text-[10px] font-semibold tracking-[0.4em] text-brand-green uppercase mb-8">Take Action</p>
          <h2 className="hero-text text-white mb-12">
            SECURE YOUR<br />INVESTMENT TODAY
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-brand-green text-white hover:bg-emerald-700 transition-all px-12 py-8 text-sm font-black tracking-[0.2em] rounded-none w-full sm:w-auto uppercase"
              >
                Book Inspection
              </Button>
            </Link>
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white hover:text-zinc-950 transition-all px-12 py-8 text-sm font-black tracking-[0.2em] rounded-none w-full sm:w-auto uppercase"
              >
                View Services
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-12 opacity-40">
            {[
              { icon: Shield, text: "RERA APPROVED" },
              { icon: CheckCircle2, text: "ISO 9001 CERTIFIED" },
              { icon: Globe, text: "INTERNATIONAL STANDARDS" },
              { icon: Building2, text: "DUBAI MUNICIPALITY" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-brand-green" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
