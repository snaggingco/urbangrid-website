import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import SEO from "@/components/SEO";

export default function Careers() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    coverLetter: "",
    resume: null as File | null,
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Show immediate success feedback
    toast({
      title: "Application Submitted! 🎉",
      description: "Thank you for your application. We'll review it and get back to you soon.",
      variant: "default",
    });

    // Store form data for background submission
    const submissionData = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      experience: formData.experience,
      coverLetter: formData.coverLetter,
      hasResume: formData.resume !== null,
      resumeFileName: formData.resume?.name || "",
    };

    // Reset form immediately
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      coverLetter: "",
      resume: null,
    });

    // Submit in background without blocking UI
    apiRequest("POST", "/api/career-application", submissionData).catch(error => {
      console.error("Background submission failed:", error);
    });
  };

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const positions = [
    "Property Inspector",
    "Senior Property Inspector",
    "Snagging Specialist", 
    "Quality Control Inspector",
    "Field Supervisor",
    "Administrative Assistant",
    "Business Development Manager",
    "Other"
  ];

  const experienceLevels = [
    "Entry Level (0-2 years)",
    "Mid Level (2-5 years)",
    "Senior Level (5-10 years)",
    "Expert Level (10+ years)"
  ];

  return (
    <>
      <SEO 
        title="Careers - Join Our Property Inspection Team | UrbanGrid"
        description="Join UrbanGrid's professional property inspection team in UAE. We're hiring qualified inspectors, snagging specialists, and quality control experts across Dubai, Abu Dhabi, and Sharjah."
        keywords="property inspector jobs dubai, snagging specialist careers, inspection jobs UAE, property inspection careers, construction quality jobs"
        canonical="https://urbangrid.ae/careers"
      />
      
      <Header />
      <FloatingButtons />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-zinc-950 text-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Careers</p>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-6">
              Join Our Professional Team
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Build your career in property inspection with UAE's trusted snagging experts. 
              We're always looking for qualified professionals to join our growing team.
            </p>
          </div>
        </section>

        {/* Why Work With Us Section */}
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Why Choose UrbanGrid?</p>
                <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                  Excellence in Every Inspection
                </h2>
              </div>
              <div>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Join a company that values professional growth, quality work, and team collaboration. We provide the tools and training you need to excel in the competitive UAE property market.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-100 border-t border-b border-zinc-100">
              <div className="py-12 md:px-8 first:pl-0 last:pr-0">
                <div className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-6">01</div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Professional Growth</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">Continuous training and development opportunities in the latest inspection technologies and methods.</p>
              </div>

              <div className="py-12 md:px-8">
                <div className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-6">02</div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Industry Recognition</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">Work with InterNACHI certified team and gain recognition in UAE's property inspection industry.</p>
              </div>

              <div className="py-12 md:px-8 last:pr-0">
                <div className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-6">03</div>
                <h3 className="text-lg font-bold text-zinc-900 mb-4">Competitive Benefits</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">Attractive compensation packages with health benefits and performance-based incentives.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section className="py-24 lg:py-32 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Join Us</p>
                <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight mb-8">
                  Submit Your Application
                </h2>
                <p className="text-sm text-zinc-500 leading-relaxed mb-8">
                  Tell us about yourself and why you'd be a great addition to our team. We review every application carefully and will get back to you if there's a match.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-900">01</div>
                    <p className="text-xs font-medium text-zinc-900 uppercase tracking-wider">Reviewing Applications</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-900">02</div>
                    <p className="text-xs font-medium text-zinc-900 uppercase tracking-wider">Initial Interview</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-900">03</div>
                    <p className="text-xs font-medium text-zinc-900 uppercase tracking-wider">Technical Assessment</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 lg:p-12 border border-zinc-100">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <Label htmlFor="fullName" className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2 block">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="w-full rounded-none border-zinc-200 focus:border-brand-green h-12"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2 block">
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
                        className="w-full rounded-none border-zinc-200 focus:border-brand-green h-12"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone" className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2 block">
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

                    {/* Position */}
                    <div>
                      <Label htmlFor="position" className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2 block">
                        Position of Interest *
                      </Label>
                      <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                        <SelectTrigger className="rounded-none border-zinc-200 focus:border-brand-green h-12">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                          {positions.map((position) => (
                            <SelectItem key={position} value={position}>
                              {position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Experience Level */}
                    <div>
                      <Label htmlFor="experience" className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2 block">
                        Experience Level *
                      </Label>
                      <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                        <SelectTrigger className="rounded-none border-zinc-200 focus:border-brand-green h-12">
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                          {experienceLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <Label htmlFor="coverLetter" className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2 block">
                        Cover Letter *
                      </Label>
                      <Textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                        placeholder="Tell us about your experience..."
                        required
                        rows={6}
                        className="w-full rounded-none border-zinc-200 focus:border-brand-green min-h-[150px]"
                      />
                    </div>

                    {/* Resume Upload */}
                    <div>
                      <Label htmlFor="resume" className="text-[10px] uppercase tracking-wide text-zinc-400 mb-2 block">
                        Resume/CV (Optional)
                      </Label>
                      <Input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleInputChange("resume", e.target.files?.[0] || null)}
                        className="w-full rounded-none border-zinc-200 focus:border-brand-green h-auto py-2"
                      />
                      <p className="text-[10px] uppercase tracking-wider text-zinc-400 mt-2">
                        Accepted formats: PDF, DOC, DOCX (Max 5MB)
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-brand-green text-white hover:bg-opacity-90 rounded-none h-14 text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Submit Application
                  </Button>

                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 text-center leading-relaxed">
                    We respect your privacy and will only use your information for recruitment purposes.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}