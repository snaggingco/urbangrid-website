import nodemailer from 'nodemailer';
import { formatAed, residentialServices } from "@shared/inspectionPricing";
import type { BookingRow } from "./bookingService";

export async function sendResidentialBookingEmail(input: {
  booking: BookingRow; email: string; paid: number; balanceUrl: string;
}): Promise<boolean> {
  const b = input.booking;
  const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
  const service = residentialServices.find(s => s.key === b.service)?.label || b.service;
  const html = `<div style="font-family:Arial,sans-serif;color:#153f32;background:#faf7ef;padding:28px">
    <h1>UrbanGrid — Inspection booking confirmed</h1><p>Reference: <strong>${esc(b.bookingReference)}</strong></p>
    <p>${esc(service)} · ${esc(b.propertyType)} · ${b.areaHundredths / 100} sq.ft</p>
    <p>${esc(b.project)} · ${esc(b.location)} · ${esc(b.emirate)}</p>
    <p>Preferred inspection: ${esc(b.inspectionDate)} ${esc(b.timeWindow || "")}. Our team will confirm availability.</p>
    <p>Base excluding VAT: ${formatAed(b.baseMinor)}<br>VAT 5%: ${formatAed(b.vatMinor)}<br>
    Total including VAT: <strong>${formatAed(b.quoteTotalMinor)}</strong><br>
    Total cash received: ${formatAed(input.paid)}<br>
    Amount outstanding: <strong>${formatAed(Math.max(b.quoteTotalMinor - input.paid, 0))}</strong></p>
    <p>100% payment after inspection and before release of the final report. No upfront payment is required.
    The payment path is activated by staff only after the physical inspection is completed. Reports are not automatically released.</p>
    <a href="${esc(input.balanceUrl)}">View your booking</a></div>`;
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  if (!from) return false;
  const subject = `UrbanGrid booking ${b.bookingReference} — inspection confirmed`;
  const bcc = process.env.BOOKING_CONFIRMATION_BCC || "info@urbangrid.ae";
  return await sendViaSendGrid(input.email, from, subject, html, bcc) ||
    await sendViaSmtp(input.email, from, subject, html, bcc);
}

// ── Email sender ─────────────────────────────────────────────────────────────
// Prefers SendGrid when SENDGRID_API_KEY is set; falls back to SMTP.
// BCC for booking confirmations is controlled by BOOKING_CONFIRMATION_BCC
// (defaults to info@urbangrid.ae).

async function sendViaSendGrid(
  to: string,
  from: string,
  subject: string,
  html: string,
  bcc?: string
): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) return false;

  try {
    const sgMail = (await import('@sendgrid/mail')).default;
    sgMail.setApiKey(apiKey);

    const msg: Parameters<typeof sgMail.send>[0] = {
      to,
      from,
      subject,
      html,
    };
    if (bcc) (msg as any).bcc = bcc;

    await sgMail.send(msg);
    console.log(`[Email/SendGrid] Sent to ${to}: ${subject}`);
    return true;
  } catch (err: any) {
    console.error(`[Email/SendGrid] Failed to send to ${to}:`, err?.message || err);
    return false;
  }
}

function createSmtpTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpHost || !smtpUser || !smtpPass) return null;
  return nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: (process.env.SMTP_PORT || '465') === '465',
    auth: { user: smtpUser, pass: smtpPass },
    tls: { rejectUnauthorized: process.env.NODE_ENV !== 'development' },
  });
}

async function sendViaSmtp(
  to: string,
  from: string,
  subject: string,
  html: string,
  bcc?: string
): Promise<boolean> {
  const transporter = createSmtpTransporter();
  if (!transporter) return false;
  try {
    await transporter.sendMail({ from, to, bcc, subject, html });
    console.log(`[Email/SMTP] Sent to ${to}: ${subject}`);
    return true;
  } catch (err: any) {
    console.error(`[Email/SMTP] Failed to send to ${to}:`, err?.message || err);
    return false;
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  bcc?: string
): Promise<boolean> {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || 'no-reply@urbangrid.ae';

  // Try SendGrid first (API key route)
  if (process.env.SENDGRID_API_KEY) {
    return sendViaSendGrid(to, from, subject, html, bcc);
  }

  // Fall back to SMTP
  const smtpOk = await sendViaSmtp(to, from, subject, html, bcc);
  if (!smtpOk) {
    console.error('[Email] No email provider configured (set SENDGRID_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS) — email not sent');
  }
  return smtpOk;
}

// ── Booking confirmation ──────────────────────────────────────────────────────

interface BookingConfirmationData {
  customerEmail: string;
  sessionId: string;
  amountTotal: number;
  currency: string;
  lineItems: Array<{ description: string; amount: number; quantity: number }>;
  invoiceUrl?: string | null;
  invoicePdfUrl?: string | null;
}

export async function sendBookingConfirmationEmail(data: BookingConfirmationData): Promise<boolean> {
  const { customerEmail, sessionId, amountTotal, lineItems, invoiceUrl, invoicePdfUrl } = data;

  const refNumber = sessionId.replace(/^cs_(test|live)_/, '').slice(0, 12).toUpperCase();

  const lineItemsHtml = lineItems
    .map(
      (li) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; color: #374151; font-size: 15px;">
          ${li.description}${li.quantity > 1 ? ` × ${li.quantity}` : ''}
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #E5E7EB; text-align: right; font-weight: 600; color: #111827; font-size: 15px;">
          AED ${(li.amount / 100).toLocaleString()}
        </td>
      </tr>`
    )
    .join('');

  const totalFormatted = `AED ${(amountTotal / 100).toLocaleString()}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F9FAFB; padding: 32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #064E3B; padding: 32px 40px; text-align: center;">
              <p style="margin: 0; font-size: 22px; font-weight: bold; color: #ffffff; letter-spacing: -0.3px;">UrbanGrid Property Inspection</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #6EE7B7;">Professional Property Inspection UAE</p>
            </td>
          </tr>

          <!-- Success banner -->
          <tr>
            <td style="background-color: #ECFDF5; padding: 24px 40px; text-align: center; border-bottom: 1px solid #D1FAE5;">
              <p style="margin: 0; font-size: 28px;">&#x2705;</p>
              <h1 style="margin: 8px 0 4px; font-size: 20px; color: #064E3B; font-weight: bold;">Booking Confirmed!</h1>
              <p style="margin: 0; font-size: 14px; color: #059669;">Your payment was successful and your inspection has been booked.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 40px;">

              <p style="margin: 0 0 24px; font-size: 15px; color: #374151; line-height: 1.6;">
                Thank you for booking with UrbanGrid. Our team will contact you within <strong>24 hours</strong> to confirm your inspection appointment.
              </p>

              <!-- Order summary -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                <tr>
                  <td colspan="2" style="background-color: #F9FAFB; padding: 12px 16px; border-bottom: 1px solid #E5E7EB;">
                    <p style="margin: 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.08em; color: #6B7280;">Order Summary</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 0 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${lineItemsHtml}
                      <tr>
                        <td style="padding: 12px 0 4px; font-weight: bold; color: #111827; font-size: 15px;">Total Paid</td>
                        <td style="padding: 12px 0 4px; text-align: right; font-weight: bold; color: #064E3B; font-size: 16px;">${totalFormatted}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 8px 16px 12px; border-top: 1px solid #E5E7EB;">
                    <p style="margin: 0; font-size: 12px; color: #9CA3AF;">Reference: <span style="font-family: monospace; color: #6B7280;">${refNumber}</span></p>
                  </td>
                </tr>
              </table>

              <!-- What happens next -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                <tr>
                  <td style="background-color: #F9FAFB; padding: 12px 16px; border-bottom: 1px solid #E5E7EB;">
                    <p style="margin: 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.08em; color: #6B7280;">What Happens Next</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align: top; padding: 6px 0; width: 28px;">
                          <span style="display: inline-block; width: 22px; height: 22px; background-color: #064E3B; border-radius: 50%; text-align: center; line-height: 22px; font-size: 11px; font-weight: bold; color: white;">1</span>
                        </td>
                        <td style="padding: 6px 0; font-size: 14px; color: #374151;">Our team reviews your booking and assigns an inspector.</td>
                      </tr>
                      <tr>
                        <td style="vertical-align: top; padding: 6px 0; width: 28px;">
                          <span style="display: inline-block; width: 22px; height: 22px; background-color: #064E3B; border-radius: 50%; text-align: center; line-height: 22px; font-size: 11px; font-weight: bold; color: white;">2</span>
                        </td>
                        <td style="padding: 6px 0; font-size: 14px; color: #374151;">We call or WhatsApp you to confirm your preferred slot.</td>
                      </tr>
                      <tr>
                        <td style="vertical-align: top; padding: 6px 0; width: 28px;">
                          <span style="display: inline-block; width: 22px; height: 22px; background-color: #064E3B; border-radius: 50%; text-align: center; line-height: 22px; font-size: 11px; font-weight: bold; color: white;">3</span>
                        </td>
                        <td style="padding: 6px 0; font-size: 14px; color: #374151;">Inspector arrives on-site with professional equipment.</td>
                      </tr>
                      <tr>
                        <td style="vertical-align: top; padding: 6px 0; width: 28px;">
                          <span style="display: inline-block; width: 22px; height: 22px; background-color: #064E3B; border-radius: 50%; text-align: center; line-height: 22px; font-size: 11px; font-weight: bold; color: white;">4</span>
                        </td>
                        <td style="padding: 6px 0; font-size: 14px; color: #374151;">Comprehensive report delivered within 1&ndash;3 working days.</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Invoice download -->
              ${invoiceUrl || invoicePdfUrl ? `
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 16px 20px;">
                    <p style="margin: 0 0 12px; font-size: 13px; font-weight: bold; color: #064E3B;">&#x1F4CB; Your Invoice</p>
                    <p style="margin: 0 0 14px; font-size: 13px; color: #374151; line-height: 1.5;">Your official invoice has been generated. You can view or download it using the links below.</p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        ${invoiceUrl ? `<td style="padding-right: 8px;"><a href="${invoiceUrl}" style="display: inline-block; background-color: #064E3B; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: bold; padding: 10px 20px; border-radius: 6px;">View Invoice</a></td>` : ''}
                        ${invoicePdfUrl ? `<td><a href="${invoicePdfUrl}" style="display: inline-block; background-color: #ffffff; color: #064E3B; text-decoration: none; font-size: 13px; font-weight: bold; padding: 10px 20px; border-radius: 6px; border: 1px solid #064E3B;">Download PDF</a></td>` : ''}
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>` : ''}

              <!-- Contact -->
              <p style="margin: 0 0 8px; font-size: 14px; color: #374151;">Have questions? Contact us:</p>
              <p style="margin: 0 0 4px; font-size: 14px; color: #374151;">&#128222; <a href="tel:+971585686852" style="color: #064E3B; text-decoration: none; font-weight: 600;">+971 58 568 6852</a></p>
              <p style="margin: 0; font-size: 14px; color: #374151;">&#128172; <a href="https://wa.me/971567427634" style="color: #064E3B; text-decoration: none; font-weight: 600;">WhatsApp us</a></p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 20px 40px; border-top: 1px solid #E5E7EB; text-align: center;">
              <p style="margin: 0 0 4px; font-size: 12px; color: #9CA3AF;">&copy; ${new Date().getFullYear()} UrbanGrid Property Inspection LLC. All rights reserved.</p>
              <p style="margin: 0; font-size: 12px; color: #9CA3AF;">Dubai, United Arab Emirates &middot; <a href="https://urbangrid.ae" style="color: #9CA3AF;">urbangrid.ae</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const subject = `Your UrbanGrid Inspection is Confirmed — Ref ${refNumber}`;
  const bcc = process.env.BOOKING_CONFIRMATION_BCC || 'info@urbangrid.ae';

  return sendEmail(customerEmail, subject, html, bcc);
}
