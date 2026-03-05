import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { trackConversion } from "@/lib/analytics";

export default function ConsultationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiRequest("POST", "/api/consultation", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      toast({
        title: "Success!",
        description: "Thank you! We'll contact you soon for your free consultation.",
        variant: "default",
      });

      // Track conversion for Google Ads
      trackConversion('lead_form');

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-24 lg:py-32 bg-white text-zinc-900 overflow-hidden border-y border-zinc-100">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <p className="editorial-label text-brand-green mb-4">
              Free Consultation
            </p>
            <h2 className="text-4xl lg:text-6xl font-bold text-zinc-900 leading-tight mb-8">
              Expert Guidance <br />
              <span className="text-zinc-400 text-3xl lg:text-5xl font-light">For Your Property.</span>
            </h2>
            <p className="text-base text-zinc-500 leading-relaxed max-w-md font-light">
              Fill out the form and our property inspection experts will contact you within 24 hours to discuss your requirements and provide a tailored quote.
            </p>
            
            <div className="mt-12 space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-none border border-zinc-100 flex items-center justify-center text-brand-green bg-zinc-50">
                  <span className="text-xs font-bold">01</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-1">Methodology</p>
                  <p className="text-sm text-zinc-600">Expert Analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-none border border-zinc-100 flex items-center justify-center text-brand-green bg-zinc-50">
                  <span className="text-xs font-bold">02</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-1">Documentation</p>
                  <p className="text-sm text-zinc-600">Detailed Reporting</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-none border border-zinc-100 flex items-center justify-center text-brand-green bg-zinc-50">
                  <span className="text-xs font-bold">03</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-1">Efficiency</p>
                  <p className="text-sm text-zinc-600">Quick Turnaround</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative bg-zinc-50 p-8 lg:p-12 border border-zinc-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <Label htmlFor="name" className="text-zinc-500 text-[10px] uppercase tracking-widest mb-3 block font-bold">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="h-12 px-0 bg-transparent border-0 border-b border-zinc-200 rounded-none focus-visible:ring-0 focus-visible:border-brand-green text-sm text-zinc-900 placeholder:text-zinc-300 transition-colors"
                  />
                </div>
                
                {/* Email Field */}
                <div>
                  <Label htmlFor="email" className="text-zinc-500 text-[10px] uppercase tracking-widest mb-3 block font-bold">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="h-12 px-0 bg-transparent border-0 border-b border-zinc-200 rounded-none focus-visible:ring-0 focus-visible:border-brand-green text-sm text-zinc-900 placeholder:text-zinc-300 transition-colors"
                  />
                </div>
                
                {/* Phone Field */}
                <div>
                  <Label htmlFor="phone" className="text-zinc-500 text-[10px] uppercase tracking-widest mb-3 block font-bold">
                    Phone Number *
                  </Label>
                  <div className="consultation-phone-input-wrapper-light">
                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry="AE"
                      value={formData.phone}
                      onChange={(value) => handleInputChange("phone", value || "")}
                      placeholder="Enter phone number"
                      className="consultation-phone-input-light"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-brand-green text-white rounded-none font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-800 transition-all group flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/10"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Free Quote</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </Button>
                <p className="mt-8 text-[9px] text-zinc-400 uppercase tracking-tighter text-center">
                  * Guaranteed privacy. Your data is protected by industry standards.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
