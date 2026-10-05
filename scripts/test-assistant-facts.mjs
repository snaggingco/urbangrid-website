// Real chat route in isolation: no database, email, credentials or submissions.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(file, imports = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText, { exports, require: n => imports[n] ?? require(n), console });
  return exports;
}
const pricing = load("shared/inspectionPricing.ts");
const residential = load("server/residentialChat.ts", { "@shared/inspectionPricing": pricing });
const knowledge = load("server/assistantKnowledge.ts", {
  "@shared/inspectionPricing": pricing, "./residentialChat": residential,
  "@shared/publicFAQs": load("shared/publicFAQs.ts"),
  "@shared/companyRegistration": load("shared/companyRegistration.ts"),
});
const source = fs.readFileSync("server/routes.ts", "utf8");
const chunk = source.slice(source.indexOf("  app.post('/api/chat',"), source.indexOf("  // ─── Chat lead email endpoint"));
assert(chunk.includes("verifiedAssistantReply") && !chunk.includes("RETIRED_URBANGRID_SYSTEM_PROMPT"));
let handler, modelInput, generated = "Please confirm property access with the team at /contact.";
vm.runInNewContext(ts.transpileModule(chunk, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText, {
  ...knowledge, ...residential, console,
  app: { post: (_url, fn) => { handler = fn; } },
  openaiClient: { chat: { completions: { create: async input => {
    modelInput = input;
    return (async function* () { yield { choices: [{ delta: { content: generated } }] }; })();
  } } } },
});
async function request(content, history = []) {
  const res = { headersSent: false, code: 200, text: "", setHeader() {}, write(s) { this.headersSent = true; this.text += s; }, end() {}, status(n) { this.code = n; return this; }, json(v) { this.text = JSON.stringify(v); } };
  await handler({ body: { messages: [...history, { role: "user", content }] } }, res);
  assert.equal(res.code, 200);
  const events = res.text.split("\n").filter(l => l.startsWith("data: ")).map(l => JSON.parse(l.slice(6)));
  assert(events.some(e => e.done), "Missing successful SSE completion");
  return events.map(e => e.content || "").join("");
}

const credentials = await request("Are you RERA approved? Give only verified credentials.");
assert(/cannot verify/i.test(credentials) && /issuer-verifiable/.test(credentials));
assert(credentials.includes("registered with the Real Estate Regulatory Agency (RERA)"));
assert(credentials.includes("60346") && credentials.includes("1254374"));
assert(credentials.includes("9 November 2027") && credentials.includes("/about#regulatory-registration"));
assert(!/Yes|all inspectors are|is RERA regulated/i.test(credentials));
console.log("PASS credentials: verified company RERA registration, no unsupported endorsement or individual credentials");
for (const q of ["Are you MRICS qualified?", "Are you InterNACHI certified?", "Is your company ISO certified?", "Are you approved by Dubai Municipality?", "What is your real estate office registration number?"]) {
  const r = await request(q);
  assert(r.includes("60346") && r.includes("cannot verify") && r.includes("not RERA approval"));
}
const timing = await request("What is the report turnaround and when is it released?");
assert(/Physical inspection comes first/.test(timing) && /100% payment after inspection/.test(timing));
assert(/full payment/.test(timing) && /24 hours/.test(timing) && /not a guaranteed/.test(timing));
assert(!/1.to.3|lifetime/i.test(timing));
console.log("PASS report: physical inspection → 100% payment → ready report release; qualified current target");
const dlp = await request("Does the DLP inspection guarantee that the developer must repair all defects for free?");
assert(/depends on.*contract\/warranty/.test(dlp) && /does not guarantee free repairs/.test(dlp));
assert(!/obligated|at no cost to you/i.test(dlp));
console.log("PASS DLP: conditional contractual responsibility; no free-repair or legal promise");
const sample = await request("Show me a sample inspection report without asking for contact details.");
assert(sample.includes("/sample-report") && sample.includes("/sample-report.pdf"));
assert(!/faulty sockets|photos attached|Client Name|Insert Address/i.test(sample));
console.log("PASS sample: actual page/PDF links, no invented findings or attachments");

const ask = await request("Get a price estimate");
assert(/Which residential inspection/.test(ask));
const areaAsk = await request("resale", [{ role: "user", content: "Get a price estimate" }, { role: "assistant", content: ask }]);
assert(/area in square feet/.test(areaAsk));
const price = await request("1500", [{ role: "user", content: "resale" }, { role: "assistant", content: areaAsk }]);
const expected = pricing.calculateInspectionPrice("secondary-market-inspection", 1500);
assert(price.includes(pricing.formatAed(expected.totalMinor)) && price.includes("[SHOW_BOOKING_LINK]"));
const areaFirst = await request("resale", [{ role: "user", content: "price for 1500 sqft" }, { role: "assistant", content: ask }]);
assert(areaFirst.includes(pricing.formatAed(expected.totalMinor)));
for (const s of pricing.residentialServices) {
  const r = await request(`${s.label} price for 650 sqft`);
  assert(r.includes(pricing.formatAed(pricing.calculateInspectionPrice(s.key, 650).totalMinor)), s.key);
}
assert((await request("new-build price for 0 sqft")).includes("valid area"));
assert((await request("Book 2 apartments 1500 sqft")).includes("[SHOW_CUSTOM_QUOTE_LINK]"));
assert((await request("Commercial inspection price")).includes("[SHOW_CUSTOM_QUOTE_LINK]"));
console.log("PASS pricing: minimal conversational inputs; all 6 services use unchanged calculator; invalid/multi-unit/custom guards");
assert((await request("Do you offer fit-out construction services?")).includes("cannot confirm"));
assert((await request("What does snagging include?")).includes("accessible"));
assert((await request("Talk to a person")).includes("https://wa.me/971567427634"));
await request("How should I prepare access?");
assert(modelInput.messages.filter(m => m.role === "system").every(m => m.content === knowledge.assistantSystemPrompt));
assert(!knowledge.assistantSystemPrompt.includes("every inspector holds"));
generated = "All inspectors are InterNACHI certified.";
assert((await request("Why choose UrbanGrid?")).includes("cannot verify"));
for (const claim of ["UrbanGrid is RERA Registered.", "All inspection reports are RERA approved."]) {
  generated = claim;
  const r = await request("Why choose UrbanGrid?");
  assert(r.includes("60346") && r.includes("1254374") && r.includes("not RERA approval"));
}
for (const claim of ["RERA approved inspection reports.", "ISO certified company.", "Approved by Dubai Municipality."]) {
  generated = claim;
  assert((await request("Why choose UrbanGrid?")).includes("cannot verify"));
}
generated = "An inspection costs AED 999.";
assert(!(await request("Describe your appointment process")).includes("999"));
console.log("PASS generated response guards and approved-only system grounding; booking/cart protection unchanged");