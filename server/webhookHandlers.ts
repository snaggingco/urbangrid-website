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

      // Line items may not be embedded in the event payload — fetch them from Stripe
      let lineItems: Array<{ description: string; amount: number; quantity: number }> = [];
      try {
        const stripe = await getUncachableStripeClient();
        const expanded = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items'],
        });
        lineItems = (expanded.line_items?.data ?? []).map((li: any) => ({
          description: li.description ?? li.price?.product?.name ?? 'Inspection Service',
          amount: li.amount_total ?? 0,
          quantity: li.quantity ?? 1,
        }));
      } catch (err: any) {
        console.warn('[Webhook] Could not expand line items — sending email without item breakdown:', err?.message);
      }

      await sendBookingConfirmationEmail({
        customerEmail,
        sessionId: session.id,
        amountTotal: session.amount_total ?? 0,
        currency: session.currency ?? 'aed',
        lineItems,
      });
    }
  }
}
