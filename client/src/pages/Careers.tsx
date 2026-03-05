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

  const handleInputChange = (field: string, value: any) => {
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
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105" 
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80')`,
            }} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/50 to-zinc-950" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <div className="max-w-4xl">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">Careers</p>
              <h1 className="text-6xl sm:text-7xl lg:text-[7rem] xl:text-[8rem] font-bold leading-[0.95] tracking-tight text-white mb-8">
                Join Our <br />Professional <br />Team
              </h1>
              <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-light max-w-2xl">
                Build your career in property inspection with UAE's trusted snagging experts. 
                We're always looking for qualified professionals to join our growing team.
              </p>
            </div>
          </div>
        </section>

        {/* Why Work With Us Section */}
        <section className="py-28 lg:py-40 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start mb-24">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">Why Choose UrbanGrid?</p>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight">
                  Excellence in Every Inspection
                </h2>
              </div>
              <div className="pt-4">
                <p className="text-lg text-zinc-500 leading-relaxed font-light">
                  Join a company that values professional growth, quality work, and team collaboration. We provide the tools and training you need to excel in the competitive UAE property market.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-100 border-t border-b border-zinc-100">
              <div className="py-16 md:px-12 first:pl-0 last:pr-0">
                <div className="text-5xl font-bold text-zinc-100 leading-none mb-8">01</div>
                <h3 className="text-xl font-bold text-zinc-900 mb-6">Professional Growth</h3>
                <p className="text-base text-zinc-500 leading-relaxed font-light">Continuous training and development opportunities in the latest inspection technologies and methods.</p>
              </div>

              <div className="py-16 md:px-12">
                <div className="text-5xl font-bold text-zinc-100 leading-none mb-8">02</div>
                <h3 className="text-xl font-bold text-zinc-900 mb-6">Industry Recognition</h3>
                <p className="text-base text-zinc-500 leading-relaxed font-light">Work with InterNACHI certified team and gain recognition in UAE's property inspection industry.</p>
              </div>

              <div className="py-16 md:px-12 last:pr-0">
                <div className="text-5xl font-bold text-zinc-100 leading-none mb-8">03</div>
                <h3 className="text-xl font-bold text-zinc-900 mb-6">Competitive Benefits</h3>
                <p className="text-base text-zinc-500 leading-relaxed font-light">Attractive compensation packages with health benefits and performance-based incentives.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section className="py-28 lg:py-40 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-20 lg:gap-32">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">Join Us</p>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight mb-10">
                  Submit Your <br />Application
                </h2>
                <p className="text-lg text-zinc-500 leading-relaxed font-light mb-12">
                  Tell us about yourself and why you'd be a great addition to our team. We review every application carefully and will get back to you if there's a match.
                </p>
                
                <div className="space-y-0 divide-y divide-zinc-200">
                  <div className="flex items-center gap-8 py-8">
                    <span className="text-5xl font-bold text-zinc-200 leading-none shrink-0">01</span>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 mb-1 uppercase tracking-wider">Reviewing Applications</h3>
                      <p className="text-sm text-zinc-500">Initial screening of your professional background.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 py-8">
                    <span className="text-5xl font-bold text-zinc-200 leading-none shrink-0">02</span>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 mb-1 uppercase tracking-wider">Initial Interview</h3>
                      <p className="text-sm text-zinc-500">A conversation about your experience and expectations.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 py-8">
                    <span className="text-5xl font-bold text-zinc-200 leading-none shrink-0">03</span>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 mb-1 uppercase tracking-wider">Technical Assessment</h3>
                      <p className="text-sm text-zinc-500">Evaluating your specific inspection skills and knowledge.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 lg:p-16 border border-zinc-100 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-8">
                    {/* Full Name */}
                    <div>
                      <Label htmlFor="fullName" className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-3 block font-semibold">
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
                        className="w-full rounded-none border-zinc-200 focus:border-brand-green h-14 bg-zinc-50/50"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-3 block font-semibold">
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
                        className="w-full rounded-none border-zinc-200 focus:border-brand-green h-14 bg-zinc-50/50"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone" className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-3 block font-semibold">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Position */}
                      <div>
                        <Label htmlFor="position" className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-3 block font-semibold">
                          Position *
                        </Label>
                        <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                          <SelectTrigger className="rounded-none border-zinc-200 focus:border-brand-green h-14 bg-zinc-50/50">
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
                        <Label htmlFor="experience" className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-3 block font-semibold">
                          Experience *
                        </Label>
                        <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                          <SelectTrigger className="rounded-none border-zinc-200 focus:border-brand-green h-14 bg-zinc-50/50">
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
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <Label htmlFor="coverLetter" className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-3 block font-semibold">
                        Cover Letter *
                      </Label>
                      <Textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                        placeholder="Tell us about your experience..."
                        required
                        className="w-full rounded-none border-zinc-200 focus:border-brand-green min-h-[180px] bg-zinc-50/50 py-4"
                      />
                    </div>

                    {/* Resume Upload */}
                    <div>
                      <Label htmlFor="resume" className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-3 block font-semibold">
                        Resume/CV (Optional)
                      </Label>
                      <Input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleInputChange("resume", e.target.files?.[0] || null)}
                        className="w-full rounded-none border-zinc-200 focus:border-brand-green h-auto py-3 bg-zinc-50/50"
                      />
                      <p className="text-[10px] uppercase tracking-[0.1em] text-zinc-400 mt-3 font-medium">
                        Accepted formats: PDF, DOC, DOCX (Max 5MB)
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-brand-green text-white hover:bg-brand-green/90 rounded-none h-16 text-xs font-bold uppercase tracking-[0.2em] transition-all"
                  >
                    Submit Application
                  </Button>

                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 text-center leading-relaxed font-medium">
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