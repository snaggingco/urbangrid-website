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
      trackEvent('generate_lead', 'broker_referral', 'broker_referral_form');

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
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      title: "Competitive Commission",
      description: "Earn substantial commission on every successful referral with transparent payment terms"
    },
    {
      icon: <HandshakeIcon className="h-8 w-8 text-blue-600" />,
      title: "Trusted Partnership",
      description: "Join UAE's leading property inspection company with proven track record of excellence"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Client Satisfaction",
      description: "Your clients receive professional service that enhances your reputation as a trusted agent"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      title: "Revenue Growth",
      description: "Add a new revenue stream to your real estate business with minimal effort"
    },
    {
      icon: <Award className="h-8 w-8 text-red-600" />,
      title: "Professional Support",
      description: "Comprehensive marketing materials and ongoing support for your referrals"
    },
    {
      icon: <Target className="h-8 w-8 text-indigo-600" />,
      title: "Quick Processing",
      description: "Fast referral processing and prompt commission payments"
    }
  ];

  const serviceHighlights = [
    "NFPA, ASHRAE & ASTM Certified Inspections",
    "Same-Day Detailed Reports",
    "Professional Photography",
    "Warranty Support Documentation",
    "Pre-Purchase & Post-Purchase Services",
    "Developer Handover Assistance"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-200">
              Partnership Opportunity
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Partner with UAE's
              <span className="text-green-600 block">Leading Property Inspectors</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join our exclusive broker referral program and earn competitive commissions while providing your clients with world-class property inspection services across Dubai, Abu Dhabi, and Sharjah.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-sm">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="font-semibold">4.9/5 Client Rating</span>
              </div>
              <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-sm">
                <Building2 className="h-5 w-5 text-blue-500 mr-2" />
                <span className="font-semibold">5000+ Properties Inspected</span>
              </div>
              <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-sm">
                <Clock className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-semibold">Same-Day Reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Top Agents Choose UrbanGrid
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enhance your client relationships and grow your revenue with our proven partnership program
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Commission & Process Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Simple Process, Guaranteed Results
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Refer Your Client</h3>
                    <p className="text-gray-600">Simply share our contact details or submit a referral through our portal</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">We Handle Everything</h3>
                    <p className="text-gray-600">Professional inspection, detailed report, and exceptional client service</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Earn Commission</h3>
                    <p className="text-gray-600">Receive your commission within 7 days of completed inspection</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="bg-white shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl text-center">Commission Structure</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">Up to 25%</div>
                    <p className="text-gray-600">Commission on every referral</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">New Build Snagging</span>
                      <Badge variant="secondary">20-25%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Pre-Purchase Inspection</span>
                      <Badge variant="secondary">15-20%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Technical Inspections</span>
                      <Badge variant="secondary">20-25%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">RERA Services</span>
                      <Badge variant="secondary">15-20%</Badge>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500 text-center">
                      *Commission rates based on service type and volume
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              World-Class Services Your Clients Deserve
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              International standards compliance ensures your clients receive the highest quality inspection services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceHighlights.map((service, index) => (
              <div key={index} className="flex items-center bg-gray-50 rounded-lg p-4">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                <span className="font-medium text-gray-900">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Start Your Partnership Today
            </h2>
            <p className="text-lg text-gray-600">
              Join hundreds of successful agents already earning with UrbanGrid
            </p>
          </div>
          
          <Card className="shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl text-center">Broker Partnership Application</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your full name"
                      required
                      data-testid="input-broker-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                      required
                      data-testid="input-broker-email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+971 XX XXX XXXX"
                      required
                      data-testid="input-broker-phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Agency *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="Your real estate company"
                      required
                      data-testid="input-broker-company"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="license">Real Estate License</Label>
                    <Input
                      id="license"
                      value={formData.license}
                      onChange={(e) => handleInputChange("license", e.target.value)}
                      placeholder="License number (optional)"
                      data-testid="input-broker-license"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Select onValueChange={(value) => handleInputChange("experience", value)}>
                      <SelectTrigger data-testid="select-broker-experience">
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-2">0-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="6-10">6-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Primary Location</Label>
                    <Select onValueChange={(value) => handleInputChange("location", value)}>
                      <SelectTrigger data-testid="select-broker-location">
                        <SelectValue placeholder="Select primary location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dubai">Dubai</SelectItem>
                        <SelectItem value="abu-dhabi">Abu Dhabi</SelectItem>
                        <SelectItem value="sharjah">Sharjah</SelectItem>
                        <SelectItem value="ajman">Ajman</SelectItem>
                        <SelectItem value="other">Other Emirates</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientVolume">Monthly Client Volume</Label>
                    <Select onValueChange={(value) => handleInputChange("clientVolume", value)}>
                      <SelectTrigger data-testid="select-broker-volume">
                        <SelectValue placeholder="Select volume" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 clients</SelectItem>
                        <SelectItem value="6-15">6-15 clients</SelectItem>
                        <SelectItem value="16-30">16-30 clients</SelectItem>
                        <SelectItem value="30+">30+ clients</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referralInterest">Referral Interest</Label>
                  <Select onValueChange={(value) => handleInputChange("referralInterest", value)}>
                    <SelectTrigger data-testid="select-broker-interest">
                      <SelectValue placeholder="What services interest you most?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-build">New Build Snagging</SelectItem>
                      <SelectItem value="pre-purchase">Pre-Purchase Inspections</SelectItem>
                      <SelectItem value="technical">Technical Inspections</SelectItem>
                      <SelectItem value="rera">RERA Services</SelectItem>
                      <SelectItem value="all">All Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Tell us about your business and referral expectations..."
                    rows={4}
                    data-testid="textarea-broker-message"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 text-lg"
                  disabled={isSubmitting}
                  data-testid="button-broker-submit"
                >
                  {isSubmitting ? "Submitting Application..." : "Apply for Partnership"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join our partner network today and start earning commissions on every referral
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="tel:+971585686852"
              className="flex items-center bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              data-testid="link-broker-phone"
            >
              <Phone className="h-5 w-5 mr-2" />
              +971 58 568 6852
            </a>
            <a
              href="mailto:partnerships@urbangrid.ae"
              className="flex items-center bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              data-testid="link-broker-email"
            >
              <Mail className="h-5 w-5 mr-2" />
              partnerships@urbangrid.ae
            </a>
            <div className="flex items-center bg-white text-green-600 px-6 py-3 rounded-lg font-semibold">
              <MapPin className="h-5 w-5 mr-2" />
              Dubai, UAE
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}