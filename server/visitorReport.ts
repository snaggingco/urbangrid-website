import { db } from "./db";
import { visitorLogs, conversionLogs } from "@shared/schema";
import { sql, gte, and, eq } from "drizzle-orm";
import nodemailer from "nodemailer";

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

async function getUniqueVisitorsLast24Hours(): Promise<{
  uniqueIps: string[];
  totalVisits: number;
  topPages: { path: string; count: number }[];
  googleAdsIps: string[];
  whatsappClicks: number;
  whatsappAdsClicks: number;
}> {
  const twentyFourHoursAgo = new Date(Date.now() - TWENTY_FOUR_HOURS);

  const uniqueIpsResult = await db
    .selectDistinct({ ipAddress: visitorLogs.ipAddress })
    .from(visitorLogs)
    .where(gte(visitorLogs.createdAt, twentyFourHoursAgo));

  const googleAdsIpsResult = await db
    .selectDistinct({ ipAddress: visitorLogs.ipAddress })
    .from(visitorLogs)
    .where(
      and(
        gte(visitorLogs.createdAt, twentyFourHoursAgo),
        sql`${visitorLogs.path} LIKE '%utm_source=google%'`
      )
    );

  const totalVisitsResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(visitorLogs)
    .where(gte(visitorLogs.createdAt, twentyFourHoursAgo));

  const whatsappClicksResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(conversionLogs)
    .where(
      and(
        gte(conversionLogs.createdAt, twentyFourHoursAgo),
        eq(conversionLogs.conversionType, 'whatsapp_click')
      )
    );

  const whatsappAdsClicksResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(conversionLogs)
    .where(
      and(
        gte(conversionLogs.createdAt, twentyFourHoursAgo),
        eq(conversionLogs.conversionType, 'whatsapp_click'),
        sql`${conversionLogs.path} LIKE '%utm_source=google%'`
      )
    );

  const topPagesResult = await db
    .select({
      path: visitorLogs.path,
      count: sql<number>`count(*)::int`,
    })
    .from(visitorLogs)
    .where(
      and(
        gte(visitorLogs.createdAt, twentyFourHoursAgo),
        sql`${visitorLogs.path} NOT LIKE '/@%'`,
        sql`${visitorLogs.path} NOT LIKE '/@fs%'`,
        sql`${visitorLogs.path} NOT LIKE '/src/%'`,
        sql`${visitorLogs.path} NOT LIKE '/node_modules/%'`,
        sql`${visitorLogs.path} != '/favicon.ico'`
      )
    )
    .groupBy(visitorLogs.path)
    .orderBy(sql`count(*) DESC`)
    .limit(10);

  return {
    uniqueIps: uniqueIpsResult.map((r) => r.ipAddress),
    totalVisits: Number(totalVisitsResult[0]?.count || 0),
    topPages: topPagesResult.map((r) => ({ path: r.path, count: r.count })),
    googleAdsIps: googleAdsIpsResult.map((r) => r.ipAddress),
    whatsappClicks: Number(whatsappClicksResult[0]?.count || 0),
    whatsappAdsClicks: Number(whatsappAdsClicksResult[0]?.count || 0),
  };
}

async function sendVisitorReport() {
  const recipientEmail = process.env.VISITOR_REPORT_EMAIL || "info@snagging.me";

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("[Visitor Report] SMTP not configured, skipping email report");
    return;
  }

  try {
    const { uniqueIps, totalVisits, topPages, googleAdsIps, whatsappClicks, whatsappAdsClicks } = await getUniqueVisitorsLast24Hours();

    const now = new Date();
    const yesterday = new Date(Date.now() - TWENTY_FOUR_HOURS);

    const formatDate = (date: Date) =>
      date.toLocaleDateString("en-AE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Dubai",
      });

    const topPagesHtml = topPages
      .map(
        (p, i) =>
          `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">${i + 1}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${p.path}</td><td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${p.count}</td></tr>`
      )
      .join("");

    const googleAdsIpsHtml = googleAdsIps
      .map(
        (ip) =>
          `<tr><td style="padding: 6px 12px; border-bottom: 1px solid #eee; font-family: monospace; color: #064E3B; font-weight: bold;">${ip}</td></tr>`
      )
      .join("");

    const uniqueIpsHtml = uniqueIps
      .map(
        (ip) =>
          `<tr><td style="padding: 6px 12px; border-bottom: 1px solid #eee; font-family: monospace;">${ip}</td></tr>`
      )
      .join("");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #064E3B; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">UrbanGrid Daily Visitor Report</h1>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <p style="color: #666; margin: 0;">
            Report Period: <strong>${formatDate(yesterday)}</strong> to <strong>${formatDate(now)}</strong>
          </p>
        </div>
        
        <div style="padding: 20px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
            <div style="background: #25D366; color: white; padding: 20px; border-radius: 8px; text-align: center;">
              <div style="font-size: 36px; font-weight: bold;">${whatsappClicks}</div>
              <div style="font-size: 14px;">WhatsApp Clicks</div>
              <div style="font-size: 11px; margin-top: 5px; opacity: 0.9;">(${whatsappAdsClicks} from Google Ads)</div>
            </div>
            <div style="background: #4285F4; color: white; padding: 20px; border-radius: 8px; text-align: center;">
              <div style="font-size: 36px; font-weight: bold;">${googleAdsIps.length}</div>
              <div style="font-size: 14px;">Ads Visitors (IPs)</div>
            </div>
            <div style="background: #1a1a1a; color: white; padding: 20px; border-radius: 8px; text-align: center;">
              <div style="font-size: 36px; font-weight: bold;">${uniqueIps.length}</div>
              <div style="font-size: 14px;">Total Visitors</div>
            </div>
            <div style="background: #064E3B; color: white; padding: 20px; border-radius: 8px; text-align: center;">
              <div style="font-size: 36px; font-weight: bold;">${totalVisits}</div>
              <div style="font-size: 14px;">Total Page Views</div>
            </div>
          </div>

          ${googleAdsIps.length > 0 ? `
          <h2 style="color: #064E3B; border-bottom: 2px solid #064E3B; padding-bottom: 10px;">Google Ads Visitor IPs</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; background-color: #f0fdf4;">
            <tbody>
              ${googleAdsIpsHtml}
            </tbody>
          </table>
          ` : ''}
          
          <h2 style="color: #064E3B; border-bottom: 2px solid #064E3B; padding-bottom: 10px;">Top 10 Pages</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background: #f0f0f0;">
                <th style="padding: 10px; text-align: left;">#</th>
                <th style="padding: 10px; text-align: left;">Page</th>
                <th style="padding: 10px; text-align: center;">Views</th>
              </tr>
            </thead>
            <tbody>
              ${topPagesHtml || '<tr><td colspan="3" style="padding: 10px; text-align: center;">No page data</td></tr>'}
            </tbody>
          </table>
          
          <h2 style="color: #064E3B; border-bottom: 2px solid #064E3B; padding-bottom: 10px;">All Unique Visitor IPs (${uniqueIps.length})</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              ${uniqueIpsHtml || '<tr><td style="padding: 10px; text-align: center;">No visitors in this period</td></tr>'}
            </tbody>
          </table>
        </div>
        
        <div style="background: #f0f0f0; padding: 15px; text-align: center; color: #666; font-size: 12px;">
          <p>This is an automated report from UrbanGrid Property Inspection</p>
          <p>© ${new Date().getFullYear()} UrbanGrid. All rights reserved.</p>
        </div>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV !== "development",
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: recipientEmail,
      subject: `UrbanGrid Daily Visitor Report - ${uniqueIps.length} Unique Visitors`,
      html: htmlContent,
    });

    console.log(`[Visitor Report] Successfully sent daily report to ${recipientEmail}`);
  } catch (error) {
    console.error("[Visitor Report] Failed to send daily report:", error);
  }
}

export function startVisitorReportScheduler() {
  console.log("[Visitor Report] Scheduler started - reports will be sent every 24 hours");

  setInterval(() => {
    sendVisitorReport();
  }, TWENTY_FOUR_HOURS);

  const now = new Date();
  const nextRun = new Date();
  nextRun.setHours(8, 0, 0, 0);
  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1);
  }
  const msUntilFirstRun = nextRun.getTime() - now.getTime();

  console.log(`[Visitor Report] First report scheduled for ${nextRun.toLocaleString("en-AE", { timeZone: "Asia/Dubai" })} (Dubai time)`);

  setTimeout(() => {
    sendVisitorReport();
    setInterval(() => {
      sendVisitorReport();
    }, TWENTY_FOUR_HOURS);
  }, msUntilFirstRun);
}

export { sendVisitorReport };
