import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
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
import { MapPin, Phone, Mail, Clock, MessageSquare, ArrowRight } from "lucide-react";
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
  const [phoneValue, setPhoneValue] = useState("");
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
        enquiryType:selected,message:contextualMessage,leadSource:"contact"
      });
      
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon!",
        variant: "default",
      });

      reset();
      setSelectedService("");
      setPhoneValue("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
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

  const serviceAreas = [
    "Dubai",
    "Abu Dhabi", 
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain"
  ];

  return (
    <>
      <SEO 
        title="Contact UrbanGrid - Leading Snagging Companies in UAE"
        description="Contact UrbanGrid, one of the leading snagging companies in UAE. Schedule your professional property inspection or snagging service in Dubai, Abu Dhabi, Sharjah, and across the Emirates. Call +971 58 568 6852"
        keywords="snagging companies in UAE, contact snagging company, property inspection UAE, UrbanGrid contact, snagging services UAE"
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
              Residential inspections, building consultancy and specialist surveys across the UAE. Tell us what you need and our team will contact you to discuss the scope.
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
                      <p className="text-sm text-zinc-900 font-medium">Office 1205, Business Bay, Dubai, UAE</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="mt-1">
                      <Phone className="w-5 h-5 text-brand-green" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-medium mb-1">Phone Number</p>
                      <a href="tel:+971585686852" className="text-sm text-zinc-900 font-medium hover:text-brand-green transition-colors">+971 58 568 6852</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="mt-1">
                      <Mail className="w-5 h-5 text-brand-green" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-medium mb-1">Email Address</p>
                      <a href="mailto:info@urbangrid.ae" className="text-sm text-zinc-900 font-medium hover:text-brand-green transition-colors">info@urbangrid.ae</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="mt-1">
                      <Clock className="w-5 h-5 text-brand-green" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-medium mb-1">Working Hours</p>
                      <p className="text-sm text-zinc-900 font-medium leading-relaxed">
                        Sunday - Thursday: 8:00 AM - 6:00 PM<br />
                        Friday - Saturday: By Appointment
                      </p>
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
                    href="tel:+971585686852"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all"
                  >
                    CALL NOW <ArrowRight className="w-3 h-3" />
                  </a>
                  <a
                    href="https://wa.me/971567427634"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all"
                  >
                    WHATSAPP <ArrowRight className="w-3 h-3" />
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
                    <div className="consultation-phone-input-wrapper-light">
                      <PhoneInput
                        international
                        countryCallingCodeEditable={false}
                        defaultCountry="AE"
                        value={phoneValue}
                        onChange={(value) => {
                          const v = value || "";
                          setPhoneValue(v);
                          setValue("phone", v);
                        }}
                        placeholder="Enter phone number"
                        className="consultation-phone-input-light"
                      />
                    </div>
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
                  Visit us at our office in the heart of Business Bay, Dubai. We are located centrally to serve all seven emirates efficiently.
                </p>
              </div>
              
              <div className="lg:col-span-2">
                <div className="border border-zinc-200 p-1 bg-white">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.231048063958!2d55.26356331501744!3d25.188447583901076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2sBusiness%20Bay%2C%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1635789123456!5m2!1sen!2s"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="UrbanGrid Office Location"
                    className="grayscale"
                  ></iframe>
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
                href="tel:+971585686852"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all"
              >
                CALL NOW <ArrowRight className="w-3 h-3" />
              </a>
              
              <a 
                href="https://wa.me/971567427634"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all"
              >
                WHATSAPP US <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
