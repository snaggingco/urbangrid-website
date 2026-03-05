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
        <section className="relative min-h-[80vh] flex items-center pt-20">
          <div className="absolute inset-0 bg-zinc-950" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-green/10 via-transparent to-transparent opacity-50" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <div className="max-w-4xl">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">Partnerships</p>
              <h1 className="text-6xl sm:text-7xl lg:text-[7rem] xl:text-[8rem] font-bold leading-[0.95] tracking-tight text-white mb-8">
                Partner with <br />UAE's <span className="text-brand-green">Leading <br />Inspectors</span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-light max-w-2xl">
                Join our exclusive broker referral program and earn competitive commissions while providing your clients with world-class property inspection services.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Strip - Dramatic */}
        <section className="bg-zinc-950 border-y border-zinc-900">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-900">
              {benefits.map((benefit, index) => (
                <div key={index} className="py-20 md:px-12 first:pl-0 last:pr-0">
                  <div className="text-6xl lg:text-7xl font-bold text-brand-green leading-none mb-4">{benefit.value}</div>
                  <div className="text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">{benefit.title}</div>
                  <p className="text-sm text-zinc-600 mt-6 leading-relaxed font-light">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-28 lg:py-40 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start mb-24">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">Process</p>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight">
                  Simple Steps to <br />Start Earning
                </h2>
              </div>
              <div className="space-y-0 divide-y divide-zinc-100">
                <div className="flex gap-10 py-12">
                  <span className="text-6xl font-bold text-zinc-100 leading-none shrink-0">01</span>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-4">Refer Your Client</h3>
                    <p className="text-base text-zinc-500 leading-relaxed font-light">Simply share our contact details or submit a referral through our partnership portal.</p>
                  </div>
                </div>
                <div className="flex gap-10 py-12">
                  <span className="text-6xl font-bold text-zinc-100 leading-none shrink-0">02</span>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-4">Professional Inspection</h3>
                    <p className="text-base text-zinc-500 leading-relaxed font-light">We handle the inspection, detailed reporting, and exceptional client service.</p>
                  </div>
                </div>
                <div className="flex gap-10 py-12">
                  <span className="text-6xl font-bold text-zinc-100 leading-none shrink-0">03</span>
                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-4">Earn Commission</h3>
                    <p className="text-base text-zinc-500 leading-relaxed font-light">Receive your commission within 7 days of the completed inspection service.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-28 lg:py-40 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-20 lg:gap-32">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">Application</p>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight mb-10">
                  Broker Partnership <br />Application
                </h2>
                <p className="text-lg text-zinc-500 leading-relaxed font-light mb-12">
                  Join hundreds of successful agents already earning with UrbanGrid. Fill out the form and our team will contact you within 24 hours to discuss partnership terms.
                </p>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-10 bg-white border border-zinc-100 shadow-sm">
                    <div className="text-5xl font-bold text-brand-green mb-3">25%</div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold">Max Commission</p>
                  </div>
                  <div className="p-10 bg-white border border-zinc-100 shadow-sm">
                    <div className="text-5xl font-bold text-brand-green mb-3">7 Days</div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-semibold">Payment Terms</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 lg:p-16 border border-zinc-100 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <Label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-3 block font-semibold">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your full name"
                        required
                        className="rounded-none border-zinc-200 focus:border-brand-green h-14 bg-zinc-50/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-3 block font-semibold">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="rounded-none border-zinc-200 focus:border-brand-green h-14 bg-zinc-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <Label htmlFor="phone" className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-3 block font-semibold">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+971 XX XXX XXXX"
                        required
                        className="rounded-none border-zinc-200 focus:border-brand-green h-14 bg-zinc-50/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company" className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-3 block font-semibold">Company/Agency *</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Real estate company"
                        required
                        className="rounded-none border-zinc-200 focus:border-brand-green h-14 bg-zinc-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <Label htmlFor="license" className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-3 block font-semibold">License Number</Label>
                      <Input
                        id="license"
                        value={formData.license}
                        onChange={(e) => handleInputChange("license", e.target.value)}
                        placeholder="Optional"
                        className="rounded-none border-zinc-200 focus:border-brand-green h-14 bg-zinc-50/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience" className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-3 block font-semibold">Experience</Label>
                      <Select onValueChange={(value) => handleInputChange("experience", value)}>
                        <SelectTrigger className="rounded-none border-zinc-200 focus:border-brand-green h-14 bg-zinc-50/50">
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
                    <Label htmlFor="message" className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-3 block font-semibold">Additional Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell us about your business..."
                      className="rounded-none border-zinc-200 focus:border-brand-green min-h-[140px] bg-zinc-50/50 py-4"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-brand-green text-white hover:bg-brand-green/90 rounded-none h-16 text-xs font-bold uppercase tracking-[0.2em] transition-all"
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
        <section className="py-28 lg:py-40 bg-zinc-950 text-white border-t border-zinc-900 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-green/5 blur-[120px] rounded-full translate-x-1/2" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-20 tracking-tight">Ready to <br />Start Earning?</h2>
            <div className="flex flex-wrap justify-center gap-16 lg:gap-32">
              <a href="tel:+971585686852" className="group">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4 group-hover:text-brand-green transition-colors font-semibold">Call Us</p>
                <p className="text-2xl sm:text-3xl font-bold">+971 58 568 6852</p>
              </a>
              <a href="mailto:partnerships@urbangrid.ae" className="group">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4 group-hover:text-brand-green transition-colors font-semibold">Email Us</p>
                <p className="text-2xl sm:text-3xl font-bold">partnerships@urbangrid.ae</p>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}