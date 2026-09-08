import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cartStore";
import { ShoppingCart, Trash2, Loader2, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function CartDrawer() {
  const { items, removeItem, clearCart, totalAmount, totalItems, isCartOpen, closeCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (items.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest("POST", "/api/checkout", {
        items: items.map((i) => ({
          serviceKey: i.serviceKey,
          quantity: i.quantity,
          unitAmount: i.unitAmount,
          quoteToken: i.quoteToken,
        })),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.message || "Failed to create checkout session. Please try again.");
      }
    } catch {
      setError("Unable to connect to payment server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:w-[420px] flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b border-zinc-100">
          <SheetTitle className="flex items-center gap-2 text-base font-semibold">
            <ShoppingCart size={18} className="text-brand-green" />
            Your Inspection Cart
            {totalItems > 0 && (
              <span className="ml-auto text-xs font-medium bg-brand-green text-white px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
              <ShoppingCart size={40} className="text-zinc-200" />
              <p className="text-zinc-400 text-sm">Your cart is empty.</p>
              <p className="text-zinc-400 text-xs">Ask Nova AI for a price estimate, then add a service to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Remove all items from your cart?')) clearCart();
                  }}
                  className="text-xs text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md px-2 py-1 transition-all cursor-pointer"
                >
                  Clear all
                </button>
              </div>
              {items.map((item) => (
                <div key={item.serviceKey} className="flex items-start gap-3 bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 truncate">{item.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-brand-green mt-1">
                      AED {(item.unitAmount * item.quantity).toLocaleString()}
                      <span className="text-xs font-normal text-zinc-400 ml-1">incl. VAT</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.serviceKey);
                    }}
                    className="text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all p-1.5 flex-shrink-0 cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-zinc-100 px-5 py-4 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Total (incl. VAT)</span>
              <span className="text-lg font-bold text-zinc-900">AED {totalAmount.toLocaleString()}</span>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg p-3">
                <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-brand-green text-white text-sm font-semibold py-3 rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Processing…</>
              ) : (
                "Proceed to Checkout"
              )}
            </button>
            <p className="text-[10px] text-zinc-400 text-center">
              Secure payment powered by Stripe. You will be redirected to complete payment.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
