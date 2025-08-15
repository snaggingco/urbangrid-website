import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function ConsultationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+971",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiRequest("POST", "/api/consultation", {
        name: formData.name,
        email: formData.email,
        phone: `${formData.countryCode}${formData.phone}`,
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
        countryCode: "+971",
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
          
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4 items-end justify-center">
            {/* Name Field */}
            <div className="flex-1 max-w-xs">
              <Label htmlFor="name" className="block text-sm font-medium text-text-grey mb-2 text-left">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
            </div>
            
            {/* Email Field */}
            <div className="flex-1 max-w-xs">
              <Label htmlFor="email" className="block text-sm font-medium text-text-grey mb-2 text-left">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
            </div>
            
            {/* Phone Field with Country Code */}
            <div className="flex-1 max-w-xs">
              <Label htmlFor="phone" className="block text-sm font-medium text-text-grey mb-2 text-left">
                Contact Number
              </Label>
              <PhoneInput
                id="phone"
                name="phone"
                value={formData.phone}
                countryCode={formData.countryCode}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                onCountryCodeChange={(code) => handleInputChange("countryCode", code)}
                placeholder="501234567"
                required
              />
            </div>
            
            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-brand-green text-white px-8 py-3 rounded-md font-semibold hover:bg-opacity-90 transition-colors whitespace-nowrap"
              >
                {isLoading ? "Sending..." : "Get Free Consultation"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
