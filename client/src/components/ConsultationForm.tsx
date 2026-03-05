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
      trackConversion();

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
    <section className="py-28 lg:py-40 bg-zinc-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">
              Free Consultation
            </p>
            <h2 className="section-heading text-white mb-8">
              Expert Guidance <br />
              <span className="text-zinc-500">For Your Property.</span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-light max-w-md">
              Fill out the form and our property inspection experts will contact you within 24 hours to discuss your requirements and provide a tailored quote.
            </p>
            
            <div className="mt-12 space-y-8">
              <div className="flex items-center gap-6">
                <div className="text-4xl font-bold text-zinc-800 leading-none shrink-0">01</div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Expert Analysis</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-4xl font-bold text-zinc-800 leading-none shrink-0">02</div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Detailed Reporting</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-4xl font-bold text-zinc-800 leading-none shrink-0">03</div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Quick Turnaround</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-8">
                {/* Name Field */}
                <div>
                  <Label htmlFor="name" className="text-zinc-500 text-[10px] uppercase tracking-widest mb-4 block">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Your Name"
                    required
                    className="h-auto pb-3 px-0 bg-transparent border-0 border-b border-zinc-700 rounded-none focus-visible:ring-0 focus-visible:border-brand-green text-sm text-white placeholder:text-zinc-700 transition-colors"
                  />
                </div>
                
                {/* Email Field */}
                <div>
                  <Label htmlFor="email" className="text-zinc-500 text-[10px] uppercase tracking-widest mb-4 block">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Email Address"
                    required
                    className="h-auto pb-3 px-0 bg-transparent border-0 border-b border-zinc-700 rounded-none focus-visible:ring-0 focus-visible:border-brand-green text-sm text-white placeholder:text-zinc-700 transition-colors"
                  />
                </div>
                
                {/* Phone Field */}
                <div>
                  <Label htmlFor="phone" className="text-zinc-500 text-[10px] uppercase tracking-widest mb-4 block">
                    Phone Number *
                  </Label>
                  <div className="consultation-phone-input-wrapper">
                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry="AE"
                      value={formData.phone}
                      onChange={(value) => handleInputChange("phone", value || "")}
                      placeholder="Phone Number"
                      className="consultation-phone-input"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-8">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 bg-brand-green text-white rounded-none font-bold uppercase tracking-[0.2em] text-xs hover:bg-emerald-800 transition-all group flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Free Quote</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  )}
                </Button>
                <p className="mt-8 text-[10px] text-zinc-600 uppercase tracking-widest text-center">
                  * We respect your privacy. No spam, ever.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
