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
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-8">
            Get Your Free Consultation
          </h2>
          
          <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3 items-end justify-center">
              {/* Name Field */}
              <div className="w-full md:flex-1 md:min-w-0">
                <Label htmlFor="name" className="block text-sm font-medium text-text-grey mb-2 text-center md:text-left">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green text-sm w-full max-w-sm mx-auto md:max-w-none md:mx-0"
                />
              </div>
              
              {/* Email Field */}
              <div className="w-full md:flex-1 md:min-w-0">
                <Label htmlFor="email" className="block text-sm font-medium text-text-grey mb-2 text-center md:text-left">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="h-12 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-brand-green text-sm w-full max-w-sm mx-auto md:max-w-none md:mx-0"
                />
              </div>
              
              {/* Phone Field with Country Code */}
              <div className="w-full md:flex-1 md:min-w-0">
                <Label htmlFor="phone" className="block text-sm font-medium text-text-grey mb-2 text-center md:text-left">
                  Contact Number
                </Label>
                <div className="max-w-sm mx-auto md:max-w-none md:mx-0">
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
              <div className="w-full md:flex-shrink-0 flex justify-center md:justify-start">
                <div className="hidden md:block h-8 mb-2"></div> {/* Spacer to align with labels */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 bg-brand-green text-white px-6 rounded-md font-semibold hover:bg-opacity-90 transition-colors text-sm whitespace-nowrap"
                >
                  {isLoading ? "Sending..." : "Submit"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
