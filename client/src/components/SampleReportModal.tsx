import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowRight, X, FileText, CheckCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SampleReportModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/sample-report-download", formData);
      setStep("success");
      // Trigger download after a brief delay so user sees success state
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = "/sample-report.pdf";
        link.download = "UrbanGrid-Sample-Inspection-Report.pdf";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 500);
    } catch {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep("form");
    setFormData({ name: "", email: "", phone: "" });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="relative bg-white w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="bg-zinc-950 px-8 py-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-brand-green shrink-0" />
            <div>
              <p className="text-white text-sm font-bold">Download Sample Report</p>
              <p className="text-zinc-400 text-[11px] mt-0.5">See exactly what our clients receive</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-500 hover:text-white transition-colors mt-0.5"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          {step === "form" ? (
            <>
              <p className="text-zinc-500 text-xs leading-relaxed mb-8">
                Enter your details below and we'll give you instant access to a real UrbanGrid inspection report — so you know exactly what you're getting before you book.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-zinc-500 text-[10px] uppercase tracking-widest mb-2 block font-bold">
                    Full Name *
                  </Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                    required
                    className="h-11 px-0 bg-transparent border-0 border-b border-zinc-200 rounded-none focus-visible:ring-0 focus-visible:border-brand-green text-sm text-zinc-900 placeholder:text-zinc-300"
                  />
                </div>

                <div>
                  <Label className="text-zinc-500 text-[10px] uppercase tracking-widest mb-2 block font-bold">
                    Email Address *
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                    className="h-11 px-0 bg-transparent border-0 border-b border-zinc-200 rounded-none focus-visible:ring-0 focus-visible:border-brand-green text-sm text-zinc-900 placeholder:text-zinc-300"
                  />
                </div>

                <div>
                  <Label className="text-zinc-500 text-[10px] uppercase tracking-widest mb-2 block font-bold">
                    Phone Number *
                  </Label>
                  <div className="consultation-phone-input-wrapper-light">
                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry="AE"
                      value={formData.phone}
                      onChange={(val) => setFormData(p => ({ ...p, phone: val || "" }))}
                      placeholder="Enter phone number"
                      className="consultation-phone-input-light"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-brand-green text-white rounded-none font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-800 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /><span>Sending…</span></>
                    ) : (
                      <><span>Get the Sample Report</span><ArrowRight className="w-4 h-4" /></>
                    )}
                  </Button>
                  <p className="mt-4 text-[9px] text-zinc-400 uppercase tracking-tighter text-center">
                    Your details are protected. We'll never share them with third parties.
                  </p>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-4 gap-4">
              <CheckCircle className="w-12 h-12 text-brand-green" />
              <div>
                <p className="text-zinc-900 font-bold text-lg">Your report is downloading</p>
                <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
                  We've also sent your details to our team — expect a call within 24 hours if you'd like a quote for your property.
                </p>
              </div>
              <Button
                onClick={handleClose}
                className="mt-2 bg-brand-green text-white rounded-none font-semibold text-sm px-8 py-5 hover:bg-emerald-800"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
