import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-text-grey leading-relaxed">
              Ready to schedule your property inspection? Contact our team of experts today for professional service across the UAE.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Information */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <Card className="h-full">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-brand-black mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-brand-black">Office Address</h3>
                        <p className="text-text-grey">Office 1205, Business Bay<br />Dubai, UAE</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                        <i className="fas fa-phone"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-brand-black">Phone Number</h3>
                        <a 
                          href="tel:+971501234567" 
                          className="text-text-grey hover:text-brand-green transition-colors"
                        >
                          +971 50 123 4567
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-brand-black">Email Address</h3>
                        <a 
                          href="mailto:info@urbangrid.ae" 
                          className="text-text-grey hover:text-brand-green transition-colors"
                        >
                          info@urbangrid.ae
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-brand-black">Working Hours</h3>
                        <p className="text-text-grey">Sunday - Thursday: 8:00 AM - 6:00 PM<br />Friday - Saturday: By Appointment</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Service Areas */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="font-semibold text-brand-black mb-4">Service Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {serviceAreas.map((area) => (
                        <span 
                          key={area}
                          className="bg-brand-green text-white px-3 py-1 rounded-full text-sm"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quick Contact Buttons */}
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="font-semibold text-brand-black mb-4">Quick Contact</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href="tel:+971501234567"
                        className="flex items-center justify-center px-4 py-2 bg-brand-green text-white rounded-md hover:bg-opacity-90 transition-colors"
                      >
                        <i className="fas fa-phone mr-2"></i>
                        Call Now
                      </a>
                      
                      <a
                        href="https://wa.me/971501234567?text=Hello! I'm interested in your property inspection services."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        <i className="fab fa-whatsapp mr-2"></i>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Form */}
            <div>
              <Card className="h-full">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold text-brand-black mb-6">Send Us a Message</h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="block text-sm font-medium text-text-grey mb-2">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="Enter your name"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="block text-sm font-medium text-text-grey mb-2">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="Enter your email"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="block text-sm font-medium text-text-grey mb-2">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register("phone")}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="enquiryType" className="block text-sm font-medium text-text-grey mb-2">
                        Enquiry Type
                      </Label>
                      <Select onValueChange={(value) => setValue("enquiryType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select enquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {enquiryTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="block text-sm font-medium text-text-grey mb-2">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        {...register("message")}
                        rows={4}
                        placeholder="Tell us about your property inspection needs..."
                        className={errors.message ? "border-red-500" : ""}
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                      )}
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-brand-green text-white hover:bg-opacity-90"
                    >
                      {isLoading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Our Location
            </h2>
            <p className="text-text-grey">
              Visit us at our office in the heart of Business Bay, Dubai
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.231048063958!2d55.26356331501744!3d25.188447583901076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2sBusiness%20Bay%2C%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1635789123456!5m2!1sen!2s"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="UrbanGrid Office Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Schedule Your Inspection?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Don't wait – protect your property investment with professional inspection services from UAE's most trusted experts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+971501234567"
              className="inline-flex items-center bg-white text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-phone mr-2"></i>
              Call Now: +971 50 123 4567
            </a>
            
            <a 
              href="https://wa.me/971501234567?text=Hello! I'm ready to schedule my property inspection."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
