import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";
import { 
  HandshakeIcon, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Phone,
  Mail,
  MapPin,
  Star,
  Building2,
  Clock,
  Target
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import SEO from "@/components/SEO";

export default function BrokerReferrals() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    license: "",
    experience: "",
    location: "",
    clientVolume: "",
    referralInterest: "",
    message: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.company) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: "Broker Referral Partnership Application",
          message: `Company: ${formData.company}
License: ${formData.license}
Experience: ${formData.experience}
Location: ${formData.location}
Client Volume: ${formData.clientVolume}
Referral Interest: ${formData.referralInterest}

Additional Message:
${formData.message}`,
          source: "broker-referrals"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      // Track conversion event
      trackEvent('generate_lead', { 
        category: 'broker_referral', 
        label: 'broker_referral_form' 
      });

      toast({
        title: "Application submitted successfully!",
        description: "We'll contact you within 24 hours to discuss partnership opportunities.",
      });

      // Reset form
      setFormData({
        name: "", email: "", phone: "", company: "", license: "",
        experience: "", location: "", clientVolume: "", referralInterest: "", message: ""
      });
    } catch (error) {
      toast({
        title: "Error submitting application",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6 text-brand-green" />,
      title: "Competitive Commission",
      value: "Up to 25%",
      description: "Earn substantial commission on every successful referral"
    },
    {
      icon: <HandshakeIcon className="h-6 w-6 text-brand-green" />,
      title: "Trusted Partnership",
      value: "5000+",
      description: "Properties inspected across UAE by our expert team"
    },
    {
      icon: <Users className="h-6 w-6 text-brand-green" />,
      title: "Client Satisfaction",
      value: "4.9/5",
      description: "Average client rating for our professional services"
    },
    {
      icon: <Clock className="h-6 w-6 text-brand-green" />,
      title: "Fast Results",
      value: "24h",
      description: "Same-day detailed reports for all inspections"
    }
  ];

  return (
    <>
      <SEO 
        title="Broker Referral Program - Partner with UrbanGrid"
        description="Join UAE's leading property inspection referral program. Earn competitive commissions while providing your clients with world-class snagging and inspection services."
      />
      <Header />
      <FloatingButtons />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-zinc-950 text-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Partnerships</p>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-6">
              Partner with UAE's <br className="hidden md:block" />
              <span className="text-brand-green">Leading Inspectors</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Join our exclusive broker referral program and earn competitive commissions while providing your clients with world-class property inspection services.
            </p>
          </div>
        </section>

        {/* Benefits Section - Stats Strip Style */}
        <section className="bg-white border-b border-zinc-100">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
              {benefits.map((benefit, index) => (
                <div key={index} className="py-12 md:px-8 first:pl-0 last:pr-0">
                  <div className="text-3xl font-bold text-zinc-900 mb-1">{benefit.value}</div>
                  <div className="text-[10px] font-semibold tracking-[0.18em] text-zinc-400 uppercase mb-4">{benefit.title}</div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Process</p>
                <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                  Simple Steps to <br /> Start Earning
                </h2>
              </div>
              <div className="space-y-12">
                <div className="flex gap-8 pb-12 border-b border-zinc-100">
                  <span className="text-4xl font-bold text-zinc-100">01</span>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2">Refer Your Client</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">Simply share our contact details or submit a referral through our partnership portal.</p>
                  </div>
                </div>
                <div className="flex gap-8 pb-12 border-b border-zinc-100">
                  <span className="text-4xl font-bold text-zinc-100">02</span>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2">Professional Inspection</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">We handle the inspection, detailed reporting, and exceptional client service.</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <span className="text-4xl font-bold text-zinc-100">03</span>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2">Earn Commission</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">Receive your commission within 7 days of the completed inspection service.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-24 lg:py-32 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Application</p>
                <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight mb-8">
                  Broker Partnership Application
                </h2>
                <p className="text-sm text-zinc-500 leading-relaxed mb-8">
                  Join hundreds of successful agents already earning with UrbanGrid. Fill out the form and our team will contact you within 24 hours to discuss partnership terms.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 border border-zinc-200 bg-white">
                    <div className="text-2xl font-bold text-brand-green mb-1">25%</div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Max Commission</p>
                  </div>
                  <div className="p-6 border border-zinc-200 bg-white">
                    <div className="text-2xl font-bold text-brand-green mb-1">7 Days</div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Payment Terms</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 lg:p-12 border border-zinc-100">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2 block">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your full name"
                        required
                        className="rounded-none border-zinc-200 focus:border-brand-green h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2 block">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="rounded-none border-zinc-200 focus:border-brand-green h-12"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2 block">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+971 XX XXX XXXX"
                        required
                        className="rounded-none border-zinc-200 focus:border-brand-green h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2 block">Company/Agency *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Real estate company"
                        required
                        className="rounded-none border-zinc-200 focus:border-brand-green h-12"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="license" className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2 block">License Number</Label>
                      <Input
                        id="license"
                        value={formData.license}
                        onChange={(e) => handleInputChange("license", e.target.value)}
                        placeholder="Optional"
                        className="rounded-none border-zinc-200 focus:border-brand-green h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience" className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2 block">Experience</Label>
                      <Select onValueChange={(value) => handleInputChange("experience", value)}>
                        <SelectTrigger className="rounded-none border-zinc-200 focus:border-brand-green h-12">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                          <SelectItem value="0-2">0-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2 block">Additional Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell us about your business..."
                      rows={4}
                      className="rounded-none border-zinc-200 focus:border-brand-green min-h-[100px]"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-brand-green text-white hover:bg-opacity-90 rounded-none h-14 text-xs font-bold uppercase tracking-widest transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Apply for Partnership"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-24 lg:py-32 bg-zinc-950 text-white border-t border-zinc-900">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-12">Ready to Start Earning?</h2>
            <div className="flex flex-wrap justify-center gap-12">
              <a href="tel:+971585686852" className="group">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 group-hover:text-brand-green transition-colors">Call Us</p>
                <p className="text-lg font-bold">+971 58 568 6852</p>
              </a>
              <a href="mailto:partnerships@urbangrid.ae" className="group">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 group-hover:text-brand-green transition-colors">Email Us</p>
                <p className="text-lg font-bold">partnerships@urbangrid.ae</p>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}