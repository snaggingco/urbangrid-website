import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { submitLead } from "@/lib/leads";
import { MapPin, Phone, ArrowRight, ExternalLink } from "lucide-react";
import SEO from "@/components/SEO";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  enquiryType: z.string().optional(),
  company: z.string().max(255).optional(),
  projectName: z.string().max(255).optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const qs = new URLSearchParams(window.location.search);
  const categoryFromUrl = qs.get("category");
  const initialCategory = categoryFromUrl === "consultancy" || categoryFromUrl === "technical" ? categoryFromUrl : "residential";
  const [category, setCategory] = useState<"residential" | "consultancy" | "technical">(initialCategory);
  const slugLabels: Record<string,string> = {
    "new-build-snagging":"New Build / Handover Inspection", "secondary-market":"Resale / Pre-Purchase Inspection",
    "post-renovation-inspection":"Post-Renovation Inspection","move-in-move-out":"Move-in / Move-out Inspection",
    "dlp-snagging":"DLP / Warranty Inspection","technical-due-diligence":"Technical Due Diligence",
    "building-condition-survey":"Building Condition Survey","reserve-fund-study":"Reserve Fund Study",
    "reserve-fund-utilization":"Utilization of Reserve Fund Study Report",
    "reinstatement-cost-assessment":"Reinstatement Cost Assessment",
    "service-charge-allocation":"Service Charge Apportionment","asset-tagging":"Asset Tagging & Inventory",
    "building-completion-audit":"Building Completion Audit","mep-condition-review":"MEP Condition Review",
    "dilapidation-survey":"Dilapidation Survey","thermographic-survey":"Thermographic Survey",
    "noise-survey":"Noise / Acoustic Assessment","structural-survey":"Structural Visual Assessment"
  };
  const initialService = slugLabels[qs.get("service") || ""] || "";
  const [selectedService, setSelectedService] = useState(initialService);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { enquiryType: initialService },
  });

  const onSubmit = async (data: ContactFormData) => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const selected = selectedService || data.enquiryType || (
        category === "consultancy" ? "Other Building Consultancy" :
        category === "technical" ? "Other Specialist Survey" : "General Residential Enquiry"
      );
      const contextualMessage = [
        "Enquiry category: " + (category === "consultancy" ? "Building Consultancy" :
          category === "technical" ? "Specialist Technical Survey" : "Residential Inspection"),
        "Service: " + selected,
        data.company ? "Company / Organisation: " + data.company : "",
        data.projectName ? "Project / Property / Location: " + data.projectName : "",
        "", data.message
      ].filter(Boolean).join("\n");
      await submitLead("/api/contact", {
        name:data.name,email:data.email,phone:data.phone,
        enquiryType:selected,message:contextualMessage,leadSource:"london_quote"
      });
      
      toast({
        title: "Enquiry sent",
        description: "Thanks for getting in touch. We will follow up when available.",
        variant: "default",
      });

      reset();
      setSelectedService("");
    } catch (error) {
      toast({
        title: "Enquiry service unavailable",
        description: "We couldn't receive your enquiry just now. Please call +44 7436 597890.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const enquiryTypes = {
    residential: [
      "New Build / Handover Inspection", "Resale / Pre-Purchase Inspection",
      "Post-Renovation Inspection", "Move-in / Move-out Inspection",
      "DLP / Warranty Inspection", "Developer / Multi-Unit Inspection",
      "General Residential Enquiry"
    ],
    consultancy: [
      "Technical Due Diligence", "Building Condition Survey",
      "MEP Condition Review", "Building Completion Audit",
      "Reserve Fund Study", "Utilization of Reserve Fund Study Report",
      "Reinstatement Cost Assessment", "Service Charge Apportionment",
      "Asset Tagging & Inventory", "Common-Area Assessment", "Other Building Consultancy"
    ],
    technical: [
      "Structural Visual Assessment", "Thermographic Survey",
      "Dilapidation Survey", "Noise / Acoustic Assessment", "Other Specialist Survey"
    ]
  };

  const serviceAreas = ["London", "Nearby areas (confirm availability by postcode)"];

  return (
    <>
      <SEO 
        title="Contact UrbanGrid UK | London Property Enquiries"
        description="Enquire about UrbanGrid UK inspection and consultancy services in London and nearby areas. Call +44 7436 597890."
        
      />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="pt-24 pb-20 bg-zinc-950">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-white uppercase mb-4">Contact</p>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-6">
              Get In Touch
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
              Residential inspections, building consultancy and specialist surveys in London and nearby areas. Tell us what you need and our team will discuss scope and a custom quote.
            </p>
          </div>
        </section>

        {/* Contact Form and Information */}
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
              {/* Contact Information */}
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">INFORMATION</p>
                <h2 className="text-4xl font-bold text-zinc-900 mb-12">How to reach us.</h2>
                
                <div className="space-y-12">
                  <div className="flex items-start gap-6">
                    <div className="mt-1">
                      <MapPin className="w-5 h-5 text-brand-green" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-medium mb-1">Office Address</p>
                      <p className="text-sm text-zinc-900 font-medium">28 Manchester Street<br />London W1U 7LE<br />United Kingdom</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="mt-1">
                      <Phone className="w-5 h-5 text-brand-green" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-medium mb-1">Phone Number</p>
                      <a href="tel:+447436597890" className="text-sm text-zinc-900 font-medium hover:text-brand-green transition-colors">+44 7436 597890</a>
                    </div>
                  </div>
                  
                </div>

                <div className="mt-20">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-medium mb-6">Service Areas</p>
                  <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
                    {serviceAreas.join(", ")}
                  </p>
                </div>

                <div className="mt-12 flex flex-wrap gap-4">
                  <a
                    href="tel:+447436597890"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all"
                  >
                    CALL NOW <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="bg-zinc-50 p-10 lg:p-16 border border-zinc-100">
                <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">ENQUIRY</p>
                <h2 className="text-3xl font-bold text-zinc-900 mb-10">Send a message.</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-2">
                    <Label htmlFor="enquiryCategory" className="text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">What can we help you with?</Label>
                    <Select value={category} onValueChange={(value) => {
                      setCategory(value as "residential" | "consultancy" | "technical");
                      setSelectedService("");
                      setValue("enquiryType","");
                    }}>
                      <SelectTrigger id="enquiryCategory" className="rounded-none border-zinc-200 bg-white h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        <SelectItem value="residential">Residential Inspection</SelectItem>
                        <SelectItem value="consultancy">Building Consultancy</SelectItem>
                        <SelectItem value="technical">Specialist Technical Survey</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-zinc-500">{category === "residential" ? "Handover, DLP, resale and tenancy inspections." : "A short enquiry is enough. Our team will discuss the scope with you."}</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Enter your name"
                      className={`rounded-none border-zinc-200 focus:border-brand-green bg-white h-12 ${errors.name ? "border-red-500" : ""}`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="Enter your email"
                      className={`rounded-none border-zinc-200 focus:border-brand-green bg-white h-12 ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder="+44 7XXX XXXXXX"
                      autoComplete="tel"
                      className="rounded-none border-zinc-200 focus:border-brand-green bg-white h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="enquiryType" className="text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">
                      Enquiry Type
                    </Label>
                    <Select value={selectedService} onValueChange={(value) => {
                      setSelectedService(value);
                      setValue("enquiryType",value);
                    }}>
                      <SelectTrigger className="rounded-none border-zinc-200 focus:border-brand-green bg-white h-12">
                        <SelectValue placeholder="Select enquiry type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        {enquiryTypes[category].map((type) => (
                          <SelectItem key={type} value={type} className="rounded-none">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {category !== "residential" && (
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">Company / Organisation (optional)</Label>
                      <Input id="company" {...register("company")} className="rounded-none border-zinc-200 bg-white h-12" placeholder="Organisation name" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="projectName" className="text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">Project / Property / Location (optional)</Label>
                    <Input id="projectName" {...register("projectName")} className="rounded-none border-zinc-200 bg-white h-12" placeholder="Building or community" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      rows={5}
                      placeholder={category === "residential" ? "Tell us about your inspection requirements..." : "Briefly describe the study or technical services you require..."}
                      className={`rounded-none border-zinc-200 focus:border-brand-green bg-white resize-none ${errors.message ? "border-red-500" : ""}`}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.message.message}</p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-green text-white hover:bg-opacity-90 rounded-none h-14 font-semibold tracking-widest text-xs"
                  >
                    {isLoading ? "SENDING..." : "SEND MESSAGE"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-24 lg:py-32 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">LOCATION</p>
                <h2 className="text-3xl font-bold text-zinc-900 mb-6">Our Office.</h2>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Our listed office is at 28 Manchester Street, London W1U 7LE, United Kingdom. Please contact us before visiting.
                </p>
              </div>
              
              <div className="lg:col-span-2">
                <div className="flex min-h-64 flex-col justify-between border border-zinc-200 bg-[#e9e5d8] p-7 sm:p-10">
                  <div className="max-w-md">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-green">London W1</p>
                    <p className="mt-4 text-2xl font-semibold leading-snug text-zinc-900">28 Manchester Street<br />London W1U 7LE</p>
                  </div>
                  <a href="https://www.google.com/maps/search/?api=1&query=28+Manchester+Street%2C+London+W1U+7LE" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-brand-green underline underline-offset-4">
                    Open directions <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 lg:py-32 bg-zinc-950 text-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">
              Ready to Discuss <br />Your Requirement?
            </h2>
            <p className="text-sm text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Share your requirements and the UrbanGrid team will advise on the next steps.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <a 
                href="tel:+447436597890"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all"
              >
                CALL NOW <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
