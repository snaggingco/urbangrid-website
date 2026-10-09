import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import { sendBookingConfirmationEmail } from './email';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();

    // processWebhook verifies the Stripe signature and throws on failure.
    // We call it first so that any subsequent logic only runs on verified events.
    await sync.processWebhook(payload, signature);

    // Parse the event from the already-verified payload
    let event: any;
    try {
      event = JSON.parse(payload.toString('utf8'));
    } catch {
      // Malformed JSON — signature was valid but we can't parse; nothing more to do
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data?.object;
      if (!session) return;

      const customerEmail: string | null =
        session.customer_details?.email ?? session.customer_email ?? null;

      if (!customerEmail) {
        console.warn('[Webhook] checkout.session.completed — no customer email, skipping confirmation email');
        return;
      }

      // Fetch line items and invoice URL from Stripe
      let lineItems: Array<{ description: string; amount: number; quantity: number }> = [];
      let invoiceUrl: string | null = null;
      let invoicePdfUrl: string | null = null;

      try {
        const stripe = await getUncachableStripeClient();
        const expanded = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items', 'invoice'],
        });
        lineItems = (expanded.line_items?.data ?? []).map((li: any) => ({
          description: li.description ?? li.price?.product?.name ?? 'Inspection Service',
          amount: li.amount_total ?? 0,
          quantity: li.quantity ?? 1,
        }));

        // invoice_creation: { enabled: true } causes Stripe to auto-generate an invoice
        const invoice = (expanded as any).invoice;
        if (invoice && typeof invoice === 'object') {
          invoiceUrl = invoice.hosted_invoice_url ?? null;
          invoicePdfUrl = invoice.invoice_pdf ?? null;
        }
      } catch (err: any) {
        console.warn('[Webhook] Could not expand session — sending email without full details:', err?.message);
      }

      await sendBookingConfirmationEmail({
        customerEmail,
        sessionId: session.id,
        amountTotal: session.amount_total ?? 0,
        currency: session.currency ?? 'aed',
        lineItems,
        invoiceUrl,
        invoicePdfUrl,
      });
    }
  }
}
