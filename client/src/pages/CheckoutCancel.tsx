import { Link } from "wouter";
import { XCircle, ArrowRight, ShoppingCart } from "lucide-react";
import SEO from "@/components/SEO";

export default function CheckoutCancel() {
  return (
    <>
      <SEO
        title="Payment Cancelled | UrbanGrid"
        description="Your payment was cancelled. You can try again anytime."
      />
      <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-zinc-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-zinc-900">Payment Cancelled</h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              No charges were made. Your cart is still saved — you can complete your booking whenever you're ready.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/services">
              <span className="flex items-center justify-center gap-2 w-full bg-brand-green text-white text-sm font-semibold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-colors cursor-pointer">
                <ShoppingCart size={15} />
                Back to Services
              </span>
            </Link>
            <Link href="/contact">
              <span className="flex items-center justify-center gap-2 w-full border border-zinc-200 text-zinc-700 text-sm font-medium py-3 px-4 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer">
                Contact us instead <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
