import crypto from "node:crypto";
import { z } from "zod";
const intentSchema = z.object({
  id: z.string().min(1).max(255), amount: z.number().int().positive(),
  currency_code: z.string(), status: z.enum(["requires_payment_instrument", "requires_user_action", "pending", "completed", "failed", "canceled"]),
  operation_id: z.string().optional(), account_id: z.string().optional(), redirect_url: z.string().url().optional(),
});
export type ZiinaIntent = z.infer<typeof intentSchema>;
export interface PaymentProvider {
  enabled(): boolean; testMode(): boolean;
  create(amountMinor: number, reference: string, operationId: string, origin: string): Promise<ZiinaIntent>;
  retrieve(id: string): Promise<ZiinaIntent>;
}
async function ziinaRequest(path: string, body?: unknown): Promise<ZiinaIntent> {
  if (!process.env.ZIINA_API_TOKEN) throw new Error("Online payment setup pending");
  const res = await fetch(`https://api-v2.ziina.com/api${path}`, {
    method: body ? "POST" : "GET", signal: AbortSignal.timeout(15000),
    headers: { Authorization: `Bearer ${process.env.ZIINA_API_TOKEN}`, "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) throw new Error(`Ziina returned HTTP ${res.status}; payment was not confirmed`);
  return intentSchema.parse(await res.json());
}
export const ziina: PaymentProvider = {
  enabled: () => Boolean(process.env.ZIINA_API_TOKEN),
  // Fail-safe default. Live charging requires the explicit string "false".
  testMode: () => process.env.ZIINA_TEST_MODE !== "false",
  create: (amountMinor, reference, operationId, origin) => {
    const back = `${origin}/book-inspection/return?booking=${encodeURIComponent(reference)}`;
    return ziinaRequest("/payment_intent", { amount: amountMinor, currency_code: "AED", operation_id: operationId,
      message: `UrbanGrid ${reference} — inspection payment`, test: ziina.testMode(), allow_tips: false,
      success_url: `${back}&result=success`, cancel_url: `${back}&result=canceled`, failure_url: `${back}&result=failed` });
  },
  retrieve: id => ziinaRequest(`/payment_intent/${encodeURIComponent(id)}`),
};
export function verifyZiinaSignature(rawBody: Buffer, signature: string, secret: string) {
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest();
  return crypto.timingSafeEqual(expected, Buffer.from(signature, "hex"));
}
export const ziinaWebhookIps = ["3.29.184.186", "3.29.190.95", "20.233.47.127", "13.202.161.181"];