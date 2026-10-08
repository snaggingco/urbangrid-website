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
import { apiRequest } from "@/lib/queryClient";
import { trackConversion } from "@/lib/analytics";
import { MapPin, Phone, Mail, Clock, MessageSquare, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  enquiryType: z.string().optional(),
  company: z.string().optional(),
  projectName: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");
  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("category");
  const requestedService = params.get("service");

  const serviceLabels: Record<string, string> = {
    "new-build-snagging": "New Build / Handover Inspection",
    "secondary-market": "Resale / Pre-Purchase Inspection",
    "post-renovation-inspection": "Post-Renovation Inspection",
    "move-in-move-out": "Move-in / Move-out Inspection",
    "dlp-snagging": "DLP / Warranty Inspection",
    "developer-projects": "Developer / Multi-Unit Inspection",
    "technical-due-diligence": "Technical Due Diligence",
    "building-condition-survey": "Building Condition Survey",
    "reserve-fund-study": "Reserve Fund Study",
    "reserve-fund-utilization": "Utilization of Reserve Fund Study Report",
    "reinstatement-cost-assessment": "Reinstatement Cost Assessment",
    "service-charge-allocation": "Service Charge Apportionment",
    "asset-tagging": "Asset Tagging & Inventory",
    "building-completion-audit": "Building Completion Audit",
    "mep-condition-review": "MEP Condition Review",
    "dilapidation-survey": "Dilapidation Survey",
    "thermographic-survey": "Thermographic Survey",
    "noise-survey": "Noise / Acoustic Assessment",
    "structural-survey": "Structural Visual Assessment",
  };

  const normalizeCategory = (value: string | null) =>
    value === "consultancy" || value === "technical" || value === "residential" ? value : "residential";

  const [enquiryCategory, setEnquiryCategory] = useState(normalizeCategory(requestedCategory));
  const [selectedService, setSelectedService] = useState(
    requestedService && serviceLabels[requestedService] ? serviceLabels[requestedService] : ""
  );
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    
    try {
      const categoryLabel =
        enquiryCategory === "consultancy"
          ? "Building Consultancy"
          : enquiryCategory === "technical"
            ? "Specialist Technical Survey"
            : "Residential Inspection";

      const contextualMessage = [
        `Enquiry category: ${categoryLabel}`,
        data.company ? `Company / Organisation: ${data.company}` : null,
        data.projectName ? `Project / Property / Location: ${data.projectName}` : null,
        `Service: ${selectedService || data.enquiryType || "General Enquiry"}`,
        "",
        data.message,
      ].filter(Boolean).join("\n");

      await apiRequest("POST", "/api/contact", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        enquiryType: selectedService || data.enquiryType || categoryLabel,
        message: contextualMessage,
      });
      
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon!",
        variant: "default",
      });

      // Track conversion for Google Ads
      trackConversion('lead_form');

      reset();
      setSelectedService("");
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
      "New Build / Handover Inspection",
      "Resale / Pre-Purchase Inspection",
      "Post-Renovation Inspection",
      "Move-in / Move-out Inspection",
      "DLP / Warranty Inspection",
      "Developer / Multi-Unit Inspection",
      "General Residential Enquiry",
    ],
    consultancy: [
      "Technical Due Diligence",
      "Building Condition Survey",
      "MEP Condition Review",
      "Building Completion Audit",
      "Reserve Fund Study",
      "Utilization of Reserve Fund Study Report",
      "Reinstatement Cost Assessment",
      "Service Charge Apportionment",
      "Asset Tagging & Inventory",
      "Common-Area Assessment",
      "Other Building Consultancy",
    ],
    technical: [
      "Structural Visual Assessment",
      "Thermographic Survey",
      "Dilapidation Survey",
      "Noise / Acoustic Assessment",
      "Other Specialist Survey",
    ],
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
              Whether you need a residential inspection, building consultancy study or specialist technical survey, share the requirement and our team will contact you to discuss the next step.
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
                <h2 className="text-3xl font-bold text-zinc-900 mb-4">Tell us about your requirement.</h2>
                <p className="text-sm text-zinc-500 leading-relaxed mb-10">
                  {enquiryCategory === "residential"
                    ? "Share a few details and we will help arrange the appropriate inspection."
                    : "Keep it simple — tell us what you need and our consultancy team will contact you to understand the project and scope."}
                </p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                    <Label className="text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">
                      What do you need help with? *
                    </Label>
                    <Select
                      value={enquiryCategory}
                      onValueChange={(value) => {
                        setEnquiryCategory(value);
                        setSelectedService("");
                        setValue("enquiryType", "");
                      }}
                    >
                      <SelectTrigger className="rounded-none border-zinc-200 focus:border-brand-green bg-white h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        <SelectItem value="residential">Residential Inspection</SelectItem>
                        <SelectItem value="consultancy">Building Consultancy</SelectItem>
                        <SelectItem value="technical">Specialist Technical Survey</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {enquiryCategory !== "residential" && (
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">
                        Company / Organisation <span className="normal-case tracking-normal font-normal">(optional)</span>
                      </Label>
                      <Input
                        id="company"
                        {...register("company")}
                        placeholder="Company or organisation name"
                        className="rounded-none border-zinc-200 focus:border-brand-green bg-white h-12"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="enquiryType" className="text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">
                      Service Required
                    </Label>
                    <Select
                      value={selectedService}
                      onValueChange={(value) => {
                        setSelectedService(value);
                        setValue("enquiryType", value);
                      }}
                    >
                      <SelectTrigger className="rounded-none border-zinc-200 focus:border-brand-green bg-white h-12">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        {enquiryTypes[enquiryCategory as keyof typeof enquiryTypes].map((type) => (
                          <SelectItem key={type} value={type} className="rounded-none">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectName" className="text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">
                      {enquiryCategory === "residential" ? "Property / Community / Location" : "Project / Building / Location"} <span className="normal-case tracking-normal font-normal">(optional)</span>
                    </Label>
                    <Input
                      id="projectName"
                      {...register("projectName")}
                      placeholder={enquiryCategory === "residential" ? "e.g. apartment, villa or community" : "e.g. building or project name"}
                      className="rounded-none border-zinc-200 focus:border-brand-green bg-white h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      rows={5}
                      placeholder={enquiryCategory === "residential" ? "Tell us briefly about the property and inspection requirement..." : "Briefly describe what you need. We will contact you for the project details and scope."}
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
              Speak with UrbanGrid about your property inspection, building consultancy or specialist technical survey requirement.
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
