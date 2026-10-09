import nodemailer from "nodemailer";
import type { ContactSubmission } from "@shared/schema";

/** UK credentials and recipients only. Inherited UAE mail settings are unused. */
export async function sendUkEnquiryNotification(lead: ContactSubmission): Promise<boolean> {
  const to = process.env.URBANGRID_GB_NOTIFICATION_EMAIL;
  const from = process.env.URBANGRID_GB_EMAIL_FROM;
  const host = process.env.URBANGRID_GB_SMTP_HOST;
  const user = process.env.URBANGRID_GB_SMTP_USER;
  const pass = process.env.URBANGRID_GB_SMTP_PASS;
  if (!to || !from || !host || !user || !pass) return false;
  const port = Number(process.env.URBANGRID_GB_SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host, port, secure: port === 465, auth: { user, pass },
    tls: { rejectUnauthorized: true },
  });
  try {
    await transport.sendMail({
      to, from, subject: `UrbanGrid UK enquiry ${lead.id}`,
      text: `Service: ${lead.enquiryType || "General enquiry"}\nName: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone || "Not supplied"}\n\n${lead.message}`,
    });
    return true;
  } catch {
    console.warn("UK enquiry email delivery failed; saved enquiry remains available to staff.");
    return false;
  } finally { transport.close(); }
}
