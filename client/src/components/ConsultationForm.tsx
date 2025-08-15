import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
              Get Your Free Consultation
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Fill out the form below and our property inspection experts will contact you within 24 hours.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-light-grey rounded-lg p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
                {/* Name Field */}
                <div className="lg:col-span-1">
                  <Label htmlFor="name" className="block text-sm font-medium text-text-grey mb-2">
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
                    className="h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green text-sm bg-white"
                  />
                </div>
                
                {/* Email Field */}
                <div className="lg:col-span-1">
                  <Label htmlFor="email" className="block text-sm font-medium text-text-grey mb-2">
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
                    className="h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green text-sm bg-white"
                  />
                </div>
                
                {/* Phone Field */}
                <div className="lg:col-span-1">
                  <Label htmlFor="phone" className="block text-sm font-medium text-text-grey mb-2">
                    Phone Number *
                  </Label>
                  <div className="custom-phone-input-wrapper">
                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry="AE"
                      value={formData.phone}
                      onChange={(value) => handleInputChange("phone", value || "")}
                      placeholder="Enter phone number"
                      className="custom-phone-input"
                    />
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="lg:col-span-1">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-brand-green text-white px-6 rounded-md font-semibold hover:bg-opacity-90 transition-colors text-sm"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      "Get Free Quote"
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-text-grey">
                  * Required fields. We respect your privacy and will never share your information.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
