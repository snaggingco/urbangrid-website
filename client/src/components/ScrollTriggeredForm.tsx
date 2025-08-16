import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X } from "lucide-react";

export default function ScrollTriggeredForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (hasShown) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;

      if (scrollPercentage >= 40) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasShown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiRequest("POST", "/api/quick-contact", {
        name: formData.name,
        email: formData.email,
      });

      toast({
        title: "Success! 🎉",
        description: "Thank you! We'll contact you soon to help make your move-in defect-free!",
        variant: "default",
      });

      // Reset form and close modal
      setFormData({
        name: "",
        email: "",
      });
      setIsVisible(false);
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

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <Dialog open={isVisible} onOpenChange={setIsVisible}>
      <DialogContent className="sm:max-w-md mx-auto bg-white border-0 shadow-2xl rounded-2xl p-0 overflow-hidden">
        {/* Header with close button */}
        <div className="relative bg-gradient-to-r from-brand-green to-emerald-600 text-white p-6 pb-4">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
          
          <DialogHeader className="text-center space-y-3">
            <DialogTitle className="text-2xl font-bold">
              🔍 Snag now, Move-In Defect Free! 😃
            </DialogTitle>
            <p className="text-green-100 text-lg">
              Let us contact you today:
            </p>
          </DialogHeader>
        </div>

        {/* Form content */}
        <div className="p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <Label htmlFor="popup-name" className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </Label>
              <Input
                id="popup-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green"
              />
            </div>
            
            {/* Email Field */}
            <div>
              <Label htmlFor="popup-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </Label>
              <Input
                id="popup-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green"
              />
            </div>
            
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-brand-green to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-brand-green transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                "Submit"
              )}
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              We respect your privacy and will never share your information.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}