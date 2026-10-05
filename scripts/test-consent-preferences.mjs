// Read-only regression tests: simulated browser/GTM/pixel, no submissions.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const KEY = "ug_privacy_consent_v1";
const TYPES = ["ad_storage", "analytics_storage", "ad_user_data", "ad_personalization"];
const plain = value => JSON.parse(JSON.stringify(value));

function browser(html, { saved, blockedRead = false, blockedWrite = false } = {}) {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(m => !/application\/ld\+json|type=["']module/.test(m[1]))
    .map(m => m[2]);
  const consent = scripts.find(s => s.includes('"consent", "default"'));
  const pixel = scripts.find(s => s.includes("startPixel"));
  const gtm = scripts.find(s => s.includes("new Date().getTime(),event:'gtm.js'"));
  assert(consent && pixel && gtm, "Existing initialization scripts must remain");
  assert.equal(scripts[0], consent);
  const values = new Map(saved === undefined ? [] : [[KEY, saved]]);
  const listeners = new Map();
  const clicks = [];
  const inserted = [];
  const window = {
    localStorage: {
      getItem(key) {
        if (blockedRead) throw Error("Storage unavailable");
        return values.get(key) ?? null;
      },
      setItem(key, value) {
        if (blockedWrite) throw Error("Storage unavailable");
        values.set(key, value);
      },
    },
    addEventListener(type, callback) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(callback);
    },
    dispatchEvent(event) {
      for (const listener of listeners.get(event.type) ?? []) listener(event);
    },
  };
  const document = {
    addEventListener(type, callback) {
      assert.equal(type, "click");
      clicks.push(callback);
    },
    createElement: () => ({}),
    getElementsByTagName: () => [{
      parentNode: { insertBefore(script) { inserted.push(script.src); } },
    }],
  };
  class CustomEvent {
    constructor(type, options) { this.type = type; this.detail = options?.detail; }
  }
  const context = vm.createContext({ window, document, CustomEvent, URL, location: { hostname: "urbangrid.ae" } });
  vm.runInContext(consent, context);
  vm.runInContext(pixel, context);
  vm.runInContext(gtm, context);
  const commands = () => window.dataLayer.filter(x => x[0] === "consent");
  const assertPermission = permission => {
    const settings = commands().at(-1)[2];
    for (const type of TYPES) assert.equal(settings[type], permission);
  };
  return {
    window, values, commands, assertPermission, inserted, clicks, context, pixel,
    load() { window.dispatchEvent({ type: "load" }); },
    click(url) {
      const link = { href: url };
      for (const listener of clicks) listener({ target: { closest: () => link } });
    },
  };
}

for (const file of ["client/index.html", "dist/public/index.html"]) {
  const html = await readFile(file, "utf8");
  for (const saved of [undefined, "accepted", "rejected", "garbage", '{"choice":"accepted"}']) {
    const b = browser(html, { saved });
    const valid = saved === "accepted" || saved === "rejected";
    assert.deepEqual(plain(b.window.urbanGridConsent.getState()), { choice: valid ? saved : null, persisted: valid });
    assert.equal(b.commands().length, valid ? 2 : 1);
    assert.equal(b.commands()[0][1], "default");
    assert.equal(b.commands()[0][2].wait_for_update, 500);
    b.assertPermission(saved === "accepted" ? "granted" : "denied");
    const before = b.commands().length;
    b.load();
    if (saved === "accepted") assert.equal(b.window.dataLayer[before].event, "gtm.js", "Restoration must precede GTM");
    assert.equal(b.inserted.filter(x => x.includes("GTM-NGVDWWRF")).length, saved === "accepted" ? 1 : 0);
    assert.equal(b.inserted.filter(x => x.includes("oaiq.min.js")).length, saved === "accepted" ? 1 : 0);
    assert(!b.window.dataLayer.some(x => x[0] === "config" || x[0] === "event"), "Consent must not initialize tags or conversions");
  }

  for (const choice of ["accepted", "rejected"]) {
    const b = browser(html);
    let changes = 0;
    b.window.addEventListener("ug:consent-change", () => changes++);
    b.load();
    const result = b.window.urbanGridConsent.setChoice(choice);
    assert.deepEqual(plain(result), { choice, persisted: true });
    assert.equal(b.values.get(KEY), choice);
    assert.equal(changes, 1);
    b.assertPermission(choice === "accepted" ? "granted" : "denied");
    assert.equal(b.commands().length, 2);
    b.window.urbanGridConsent.setChoice(choice);
    assert.equal(b.commands().length, 2, "Repeated choices must not duplicate updates");
    assert.throws(() => b.window.urbanGridConsent.setChoice("granted"), /Invalid consent/);
  }

  const b = browser(html);
  b.click("https://wa.me/971567427634");
  assert.equal(b.window.oaiq, undefined, "Optional pixel must wait for consent");
  b.window.urbanGridConsent.setChoice("accepted");
  b.click("https://wa.me/?text=share");
  assert.equal(b.window.oaiq.q.length, 1, "Sharing is not a contact conversion");
  b.click("https://wa.me/971567427634");
  assert.equal(b.window.oaiq.q.length, 2);
  assert.equal(b.window.oaiq.q[1][3].custom_event_name, "whatsapp_click");
  b.window.urbanGridConsent.setChoice("rejected");
  b.click("https://wa.me/971567427634");
  assert.equal(b.window.oaiq.q.length, 2, "Rejection stops subsequent pixel click measurement");
  b.window.urbanGridConsent.setChoice("accepted");
  vm.runInContext(b.pixel, b.context);
  assert.equal(b.clicks.length, 1, "Only one pixel click listener");
  assert.equal(b.inserted.filter(x => x.includes("oaiq.min.js")).length, 1);
  assert.equal(b.window.oaiq.q.filter(x => x[0] === "init").length, 1);

  const blocked = browser(html, { blockedRead: true, blockedWrite: true });
  blocked.assertPermission("denied");
  assert.deepEqual(plain(blocked.window.urbanGridConsent.setChoice("accepted")), { choice: "accepted", persisted: false });
  blocked.assertPermission("granted");
  blocked.window.urbanGridConsent.setChoice("rejected");
  blocked.assertPermission("denied");

  const tabs = browser(html, { saved: "accepted" });
  tabs.window.dispatchEvent({ type: "storage", key: "unrelated", newValue: "rejected" });
  tabs.assertPermission("granted");
  tabs.window.dispatchEvent({ type: "storage", key: KEY, newValue: "rejected" });
  tabs.assertPermission("denied");
  tabs.window.dispatchEvent({ type: "storage", key: KEY, newValue: "accepted" });
  tabs.assertPermission("granted");
  tabs.window.dispatchEvent({ type: "storage", key: null, newValue: null });
  tabs.assertPermission("denied");
  assert.equal(tabs.window.urbanGridConsent.getState().choice, null);
}

console.log("PASS: First-party consent choices, early restoration, default order, invalid/blocked storage, cross-tab changes, GTM ownership, and optional pixel deduplication.");