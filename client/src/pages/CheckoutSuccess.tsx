import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { Link } from "wouter";
import { CheckCircle, Phone, MessageCircle, ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import SEO from "@/components/SEO";

interface OrderLine {
  description: string;
  amount: number;
  quantity: number;
}

interface OrderSummary {
  status: string;
  customerEmail: string | null;
  amountTotal: number;
  currency: string;
  lineItems: OrderLine[];
}

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const sessionId = params.get("session_id");

  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    clearCart();
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    setLoadingOrder(true);
    fetch(`/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status) setOrder(data);
      })
      .catch(() => {})
      .finally(() => setLoadingOrder(false));
  }, [sessionId]);

  return (
    <>
      <SEO
        title="Booking Confirmed | UrbanGrid"
        description="Your inspection booking has been confirmed. Our team will contact you shortly."
      />
      <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-brand-green" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-zinc-900">Booking Confirmed!</h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Thank you for your payment. Our team will contact you within 24 hours to confirm your inspection appointment.
            </p>
          </div>

          {/* Order summary from Stripe */}
          {loadingOrder ? (
            <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm py-4">
              <Loader2 size={15} className="animate-spin" /> Loading order details…
            </div>
          ) : order ? (
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-left space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Order summary</p>
              {order.lineItems.map((li, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-700">{li.description} × {li.quantity}</span>
                  <span className="font-semibold text-zinc-900">
                    AED {(li.amount / 100).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="border-t border-zinc-200 pt-2 flex items-center justify-between text-sm font-bold">
                <span>Total paid</span>
                <span className="text-brand-green">AED {(order.amountTotal / 100).toLocaleString()}</span>
              </div>
              {order.customerEmail && (
                <p className="text-xs text-zinc-400">
                  Booking confirmation sent to <span className="font-medium text-zinc-600">{order.customerEmail}</span>
                </p>
              )}
            </div>
          ) : null}

          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-left space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">What happens next</p>
            <ol className="text-sm text-zinc-700 space-y-2 list-none">
              <li className="flex items-start gap-2"><span className="text-brand-green font-bold">1.</span> Our team reviews your booking and assigns an inspector.</li>
              <li className="flex items-start gap-2"><span className="text-brand-green font-bold">2.</span> We call or WhatsApp you to confirm your preferred slot.</li>
              <li className="flex items-start gap-2"><span className="text-brand-green font-bold">3.</span> Inspector arrives on-site with professional equipment.</li>
              <li className="flex items-start gap-2"><span className="text-brand-green font-bold">4.</span> Comprehensive report delivered within 1–3 working days.</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <a
              href="tel:+971585686852"
              className="flex-1 flex items-center justify-center gap-2 bg-brand-green text-white text-sm font-semibold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-colors"
            >
              <Phone size={15} />
              Call us
            </a>
            <a
              href="https://wa.me/971585686852"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white text-sm font-semibold py-3 px-4 rounded-xl hover:bg-opacity-90 transition-colors"
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
          </div>

          <Link href="/">
            <span className="inline-flex items-center gap-1.5 text-sm text-brand-green font-medium hover:underline cursor-pointer">
              Back to homepage <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
