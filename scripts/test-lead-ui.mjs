// Render the actual protected component using an isolated, in-memory query
// cache. This neither bypasses application auth nor signs in/submits forms.
import assert from "node:assert/strict";
import { build } from "esbuild";
import vm from "node:vm";
import { createRequire } from "node:module";
import path from "node:path";

const harness = `
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClientProvider } from "@tanstack/react-query";
import { Router } from "wouter";
import { queryClient } from "./client/src/lib/queryClient";
import ManageLeads from "./client/src/pages/admin/ManageLeads";
import Bookings from "./client/src/pages/admin/Bookings";
queryClient.setQueryData(["/api/auth/user"], { id: "fixture", role: "admin" });
const touch = { landingPage: "https://example.invalid/test", capturedAt: "2026-10-01T10:00:00Z",
  gclid: "fixture-gclid", gbraid: "fixture-gbraid", wbraid: "fixture-wbraid",
  utm_source: "google", utm_medium: "cpc", utm_campaign: "Fixture", utm_term: "inspection", utm_content: "test", utm_id: "fixture" };
const lead = { id: 1, name: "Synthetic fixture", email: "fixture@example.invalid", phone: null,
  message: "Isolated rendering test", leadSource: "contact", stage: "new",
  createdAt: "2026-10-01T10:00:00Z", stageUpdatedAt: "2026-10-01T10:00:00Z",
  quoteValueMinor: 100000, quoteCurrency: "AED", revenueAmountMinor: null, revenueCurrency: "AED",
  qualifiedAt: null, quotedAt: null, bookedAt: null, completedAt: null, lostAt: null,
  inspectionDate: null, bookingReference: null, lostReason: null, attribution: { firstTouch: touch, lastTouch: touch } };
queryClient.setQueryData(["/api/admin/leads","includeNonSales=false&offset=0"], { leads: [lead], total: 1 });
queryClient.setQueryData(["/api/admin/marketing-summary","includeNonSales=false"], {
  range: { from: null, to: null, timezone: "Asia/Dubai", basis: "lead_created_date_cohort" },
  includeNonSales: false, totalLeads: 1, countsByStage: { new: 1, qualified: 0, quoted: 0, booked: 0, completed: 0, lost: 0 },
  countsBySource: { contact: 1 }, sources: ["contact"],
  funnel: { leads: 1, qualified: 0, quoted: 0, booked: 0, completed: 0, lost: 0, leadToBookingRate: 0 },
  activity: { new: 0, qualified: 0, quoted: 0, booked: 0, completed: 0, lost: 0 },
  valuesByCurrency: [{currency:"AED",quoteValueMinor:100000,quotedLeads:1,bookedRevenueMinor:0,completedRevenueMinor:0,bookedOrCompletedRevenueMinor:0,revenueRecordedLeads:0}],
  attribution: {withAttribution:1,withFirstAndLastTouch:1,withUtmSource:1,withGclid:1,withGbraid:1,withWbraid:1,withAnyClickId:1,completenessRate:1},
  legacyLifecycleWithoutTimestamps: 0, notes: []
});
globalThis.renderedLeadHtml = renderToStaticMarkup(<Router ssrPath="/admin/leads"><QueryClientProvider client={queryClient}><ManageLeads /></QueryClientProvider></Router>);
const df = days => { const d = new Date(); d.setDate(d.getDate() - days); return d.toLocaleDateString("en-CA", {timeZone:"Asia/Dubai"}); };
queryClient.setQueryData(["admin-bookings",new URLSearchParams({from:df(30),to:df(0)}).toString()], {
  bookings: [{id:1,leadId:1,bookingReference:"UG-2026-AABBCCDDEEFF",service:"new-build-snagging",propertyType:"Villa",
    areaSqft:1234.56,bedrooms:"3",project:"Synthetic project",location:"Test community",emirate:"Dubai",
    inspectionDate:"2026-10-10",timeWindow:"Morning",status:"booked",leadStage:"booked",baseMinor:111110,vatMinor:5556,
    quoteTotalMinor:116666,currency:"AED",cashCollectedMinor:0,amountOutstandingMinor:116666,paymentStatus:"unpaid",
    paymentSetup:"online payment setup pending",reportStatus:"Awaiting physical inspection",inspectionCompletedAt:null,
    payments:[],leadSource:"residential_booking",campaign:"Fixture",gclid:"fixture-gclid"}],
  summary:{bookedValueMinor:116666,cashCollectedMinor:0,paymentOutstandingMinor:116666,completedRevenueMinor:0,
    bySource:[{source:"google",campaign:"Fixture",gclidPresent:true,bookings:1,bookedValueMinor:116666,cashCollectedMinor:0}]},
  paymentSetup:{onlinePaymentEnabled:false,testMode:true,webhookEnabled:false}
});
globalThis.renderedBookingHtml = renderToStaticMarkup(<Router ssrPath="/admin/bookings"><QueryClientProvider client={queryClient}><Bookings /></QueryClientProvider></Router>);
`;
const result = await build({
  stdin: { contents: harness, loader: "tsx", resolveDir: process.cwd(), sourcefile: "lead-ui-harness.tsx" },
  bundle: true, write: false, platform: "node", format: "cjs", jsx: "automatic", logLevel: "silent",
});
const context = vm.createContext({
  require: createRequire(path.resolve("package.json")), module: { exports: {} }, exports: {},
  console, process, Buffer, URL, URLSearchParams, TextEncoder, TextDecoder,
  setTimeout, clearTimeout, setInterval, clearInterval, setImmediate, performance, AbortController,
  fetch: () => { throw new Error("Rendering test must not make network requests"); },
});
vm.runInContext(result.outputFiles[0].text, context);
const html = context.renderedLeadHtml;
assert.equal(typeof html, "string");
for (const text of ["New", "Qualified", "Quoted", "Booked", "Completed", "Lost",
  "Quote value", "Actual revenue", "Inspection date", "Booking reference", "Lost reason",
  "First touch", "Last touch", "gclid", "gbraid", "wbraid",
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id",
  "Synthetic fixture"]) assert(html.includes(text), `Missing rendered UI: ${text}`);
assert.match(html, /type="date"/);
assert.match(html, /type="checkbox"/);
assert(!html.includes("Could not load"));
console.log("PASS protected sales-funnel component renders six stages, real fields, filters and all attribution keys with an isolated fixture.");
assert.match(context.renderedBookingHtml, /UG-2026-AABBCCDDEEFF/);
assert.match(context.renderedBookingHtml, /1,166\.66/);
assert.match(context.renderedBookingHtml, /Quoted total \/ outstanding/);
assert.match(context.renderedBookingHtml, /residential_booking/);
assert.match(context.renderedBookingHtml, /New offline booking/);
assert.doesNotMatch(context.renderedBookingHtml, /50%|Deposit collected|Secure with 50/);
console.log("PASS protected booking component renders exact quote/outstanding/source fields and offline operations with an isolated fixture.");
context.queryClient?.clear?.();