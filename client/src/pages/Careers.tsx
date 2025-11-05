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
      
      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-brand-green to-emerald-700 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Join Our Professional Team
              </h1>
              <p className="text-xl text-green-100 leading-relaxed">
                Build your career in property inspection with UAE's trusted snagging experts. 
                We're always looking for qualified professionals to join our growing team.
              </p>
            </div>
          </div>
        </section>

        {/* Why Work With Us Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
                Why Choose UrbanGrid?
              </h2>
              <p className="text-lg text-text-grey max-w-2xl mx-auto">
                Join a company that values professional growth, quality work, and team collaboration
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-users text-white text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-brand-black mb-3">Professional Growth</h3>
                  <p className="text-text-grey">Continuous training and development opportunities in the latest inspection technologies and methods.</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-award text-white text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-brand-black mb-3">Industry Recognition</h3>
                  <p className="text-text-grey">Work with InterNACHI certified team and gain recognition in UAE's property inspection industry.</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-handshake text-white text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-brand-black mb-3">Competitive Benefits</h3>
                  <p className="text-text-grey">Attractive compensation packages with health benefits and performance-based incentives.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section className="py-16 bg-light-grey">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
                  Submit Your Application
                </h2>
                <p className="text-lg text-text-grey">
                  Tell us about yourself and why you'd be a great addition to our team
                </p>
              </div>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-brand-black">Career Application Form</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
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
                      <Label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                        Position of Interest *
                      </Label>
                      <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position you're interested in" />
                        </SelectTrigger>
                        <SelectContent>
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
                      <Label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                        Experience Level *
                      </Label>
                      <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent>
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
                      <Label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Letter / Why do you want to join us? *
                      </Label>
                      <Textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                        placeholder="Tell us about your experience, skills, and why you'd be a great fit for our team..."
                        required
                        rows={6}
                        className="w-full"
                      />
                    </div>

                    {/* Resume Upload */}
                    <div>
                      <Label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                        Resume/CV (Optional)
                      </Label>
                      <Input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleInputChange("resume", e.target.files?.[0] || null)}
                        className="w-full"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Accepted formats: PDF, DOC, DOCX (Max 5MB)
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-brand-green text-white hover:bg-opacity-90 py-3 text-lg font-semibold"
                    >
                      Submit Application
                    </Button>

                    <p className="text-sm text-gray-500 text-center">
                      We respect your privacy and will only use your information for recruitment purposes.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        
      </main>

      <Footer />
    </>
  );
}