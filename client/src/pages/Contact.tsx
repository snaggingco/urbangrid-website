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
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";

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

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center pt-20 bg-zinc-950">
        <div 
          className="absolute inset-0 opacity-40 bg-cover bg-center" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=1000&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950 to-zinc-950" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">Contact</p>
          <h1 className="text-6xl sm:text-7xl lg:text-[7rem] xl:text-[8rem] font-bold leading-[0.95] tracking-tight text-white max-w-4xl">
            Get In <span className="text-brand-green">Touch</span>
          </h1>
          <p className="mt-8 text-lg text-zinc-400 font-light max-w-xl leading-relaxed">
            Ready to schedule your property inspection? Contact our team of experts today for professional service across the UAE.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-28 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32">
            
            {/* Contact Information */}
            <div>
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">INFORMATION</p>
              <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-16">How to reach us.</h2>
              
              <div className="space-y-16">
                <div className="flex items-start gap-8">
                  <MapPin className="w-6 h-6 text-brand-green shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-3">Office Address</p>
                    <p className="text-xl text-zinc-900 font-medium leading-tight">Office 1205, Business Bay,<br />Dubai, UAE</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-8">
                  <Phone className="w-6 h-6 text-brand-green shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-3">Phone Number</p>
                    <a href="tel:+971585686852" className="text-xl text-zinc-900 font-medium hover:text-brand-green transition-colors leading-tight">+971 58 568 6852</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-8">
                  <Mail className="w-6 h-6 text-brand-green shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-3">Email Address</p>
                    <a href="mailto:info@snagging.me" className="text-xl text-zinc-900 font-medium hover:text-brand-green transition-colors leading-tight">info@snagging.me</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-8">
                  <Clock className="w-6 h-6 text-brand-green shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-3">Working Hours</p>
                    <p className="text-lg text-zinc-900 font-medium leading-relaxed">
                      Sun - Thu: 08:00 AM - 06:00 PM<br />
                      Fri - Sat: By Appointment
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-24 pt-12 border-t border-zinc-100">
                <div className="flex flex-wrap gap-12">
                  <a href="tel:+971585686852" className="group flex items-center gap-3 text-xs font-bold tracking-widest text-brand-green">
                    CALL NOW <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <a href="https://wa.me/971585686852" className="group flex items-center gap-3 text-xs font-bold tracking-widest text-brand-green">
                    WHATSAPP <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-zinc-50 p-10 lg:p-16 relative">
              <div className="absolute top-0 right-0 w-24 h-1 bg-brand-green" />
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">ENQUIRY</p>
              <h2 className="text-3xl font-bold text-zinc-900 mb-12">Send a message.</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                <div className="space-y-4">
                  <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Full Name *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter your name"
                    className="rounded-none border-0 border-b border-zinc-200 focus:border-brand-green bg-transparent h-14 px-0 shadow-none text-base"
                  />
                  {errors.name && <p className="text-red-500 text-[10px] uppercase tracking-wider">{errors.name.message}</p>}
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email"
                    className="rounded-none border-0 border-b border-zinc-200 focus:border-brand-green bg-transparent h-14 px-0 shadow-none text-base"
                  />
                  {errors.email && <p className="text-red-500 text-[10px] uppercase tracking-wider">{errors.email.message}</p>}
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="Enter your phone number"
                    className="rounded-none border-0 border-b border-zinc-200 focus:border-brand-green bg-transparent h-14 px-0 shadow-none text-base"
                  />
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="enquiryType" className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Enquiry Type</Label>
                  <Select onValueChange={(value) => setValue("enquiryType", value)}>
                    <SelectTrigger className="rounded-none border-0 border-b border-zinc-200 focus:border-brand-green bg-transparent h-14 px-0 shadow-none text-base">
                      <SelectValue placeholder="Select enquiry type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-zinc-100">
                      {enquiryTypes.map((type) => (
                        <SelectItem key={type} value={type} className="rounded-none focus:bg-zinc-50 focus:text-brand-green">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="message" className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Message *</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    rows={4}
                    placeholder="Tell us about your property inspection needs..."
                    className="rounded-none border-0 border-b border-zinc-200 focus:border-brand-green bg-transparent px-0 shadow-none text-base resize-none"
                  />
                  {errors.message && <p className="text-red-500 text-[10px] uppercase tracking-wider">{errors.message.message}</p>}
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-green text-white hover:bg-opacity-90 rounded-none h-16 font-bold tracking-widest text-xs transition-all"
                >
                  {isLoading ? "SENDING..." : "SEND MESSAGE"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-28 lg:py-40 bg-zinc-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">LOCATION</p>
              <h2 className="text-4xl font-bold text-zinc-900 mb-8 leading-tight">Our Office.</h2>
              <p className="text-lg text-zinc-500 font-light leading-relaxed">
                Visit us at our office in the heart of Business Bay, Dubai. We are located centrally to serve all seven emirates efficiently.
              </p>
            </div>
            
            <div className="lg:col-span-2 relative">
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-brand-green/20 -translate-x-4 -translate-y-4" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-brand-green/20 translate-x-4 translate-y-4" />
              <div className="border border-zinc-200 p-1 bg-white relative z-10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.231048063958!2d55.26356331501744!3d25.188447583901076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2sBusiness%20Bay%2C%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1635789123456!5m2!1sen!2s"
                  width="100%"
                  height="500"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="UrbanGrid Office Location"
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 lg:py-40 bg-zinc-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-10 leading-tight">
            Ready to secure your <span className="text-brand-green">investment?</span>
          </h2>
          <p className="text-lg text-zinc-400 font-light mb-16 max-w-2xl mx-auto leading-relaxed">
            Don't wait – protect your property investment with professional inspection services from UAE's most trusted experts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-12 justify-center items-center">
            <a href="tel:+971585686852" className="group flex items-center gap-4 text-xs font-bold tracking-[0.2em] text-brand-green">
              CALL NOW <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </a>
            <div className="w-1 h-1 rounded-full bg-zinc-800 hidden sm:block" />
            <a href="https://wa.me/971585686852" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 text-xs font-bold tracking-[0.2em] text-brand-green">
              WHATSAPP US <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
