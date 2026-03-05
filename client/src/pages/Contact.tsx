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
import { apiRequest } from "@/lib/queryClient";
import { trackConversion } from "@/lib/analytics";
import { MapPin, Phone, Mail, Clock, MessageSquare, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  enquiryType: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isLoading, setIsLoading] = useState(false);
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
      await apiRequest("POST", "/api/contact", data);
      
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon!",
        variant: "default",
      });

      // Track conversion for Google Ads
      trackConversion();

      reset();
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

  const enquiryTypes = [
    "New Build Inspection",
    "Pre-Purchase Inspection", 
    "Post-Renovation Inspection",
    "Move-in/Move-out Inspection",
    "DLP Snagging",
    "General Enquiry"
  ];

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
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Contact</p>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-6">
              Get In Touch
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
              Ready to schedule your property inspection? Contact our team of experts today for professional service across the UAE.
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
                    href="https://wa.me/971585686852"
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
                    <Label htmlFor="phone" className="text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder="Enter your phone number"
                      className="rounded-none border-zinc-200 focus:border-brand-green bg-white h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="enquiryType" className="text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">
                      Enquiry Type
                    </Label>
                    <Select onValueChange={(value) => setValue("enquiryType", value)}>
                      <SelectTrigger className="rounded-none border-zinc-200 focus:border-brand-green bg-white h-12">
                        <SelectValue placeholder="Select enquiry type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none">
                        {enquiryTypes.map((type) => (
                          <SelectItem key={type} value={type} className="rounded-none">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[10px] uppercase tracking-wide text-zinc-400 font-semibold">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      rows={5}
                      placeholder="Tell us about your property inspection needs..."
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
              Ready to Schedule <br />Your Inspection?
            </h2>
            <p className="text-sm text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Don't wait – protect your property investment with professional inspection services from UAE's most trusted experts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all"
              >
                CALL NOW <ArrowRight className="w-3 h-3" />
              </a>
              
              <a 
                href="https://wa.me/971585686852"
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
