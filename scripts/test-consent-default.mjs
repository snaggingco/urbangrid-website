// No submissions, advertising requests, or database writes: GTM is simulated.
// Run: node scripts/test-consent-default.mjs [development-preview-url]
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

function verify(html, label) {
  // Vite's injected module scripts defer execution; the first classic script
  // must establish consent synchronously while the HTML is being parsed.
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(match => !/\btype\s*=\s*["']module["']/i.test(match[1]))
    .map(match => match[2]);
  const consent = scripts[0];
  assert(consent.includes('"consent", "default"'), `${label}: consent must be the first script`);
  const loader = scripts.find(script => script.includes("new Date().getTime(),event:'gtm.js'"));
  assert(loader, `${label}: original GTM initialization is preserved`);
  assert(html.includes("GTM-NGVDWWRF"));
  assert(!html.includes("G-6LDP4K8LQZ"));

  const expected = {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  };
  for (const hostname of ["urbangrid.ae", "www.urbangrid.ae", "preview.replit.dev"]) {
    let loaded = false;
    const callbacks = [];
    const listeners = new Map();
    const window = {
      addEventListener(name, callback) {
        if (name === "load") callbacks.push(callback);
        else assert(["storage", "ug:consent-change"].includes(name));
        const entries = listeners.get(name) || [];
        entries.push(callback); listeners.set(name, entries);
      },
      dispatchEvent(event) {
        for (const callback of listeners.get(event.type) || []) callback(event);
      },
    };
    const document = {
      createElement: () => ({}),
      getElementsByTagName: () => [{
        parentNode: {
          insertBefore(script) {
            assert.equal(script.src, "https://www.googletagmanager.com/gtm.js?id=GTM-NGVDWWRF");
            assert.equal(window.dataLayer[0][0], "consent", "Default must precede GTM script insertion");
            assert.equal(window.dataLayer.at(-1).event, "gtm.js");
            loaded = true;
          },
        },
      }],
    };
    class CustomEvent {
      constructor(type, options) { this.type = type; this.detail = options?.detail; }
    }
    const context = vm.createContext({ window, document, CustomEvent, location: { hostname } });
    vm.runInContext(consent, context);
    assert.equal(window.dataLayer.length, 1);
    assert.equal(window.dataLayer[0][0], "consent");
    assert.equal(window.dataLayer[0][1], "default");
    assert.equal(Object.prototype.toString.call(window.dataLayer[0]), "[object Arguments]");
    assert.deepEqual(JSON.parse(JSON.stringify(window.dataLayer[0][2])), expected);
    assert.equal(window.gtag, undefined, "No direct Google tag configuration/function introduced");
    vm.runInContext(loader, context);
    assert.equal(callbacks.length, hostname === "preview.replit.dev" ? 0 : 1);
    callbacks[0]?.();
    assert.equal(loaded, false, "Denied consent prevents GTM initialization");
    window.urbanGridConsent.setChoice("accepted");
    callbacks[0]?.();
    assert.equal(loaded, hostname !== "preview.replit.dev", "Accepted production only");
    assert.equal(window.dataLayer.filter(item => item[0] === "consent").length, 2);
    assert(!window.dataLayer.some(item => item[0] === "event" || item[0] === "config"));
  }
}

verify(await readFile("client/index.html", "utf8"), "source");
verify(await readFile("dist/public/index.html", "utf8"), "production build");
if (process.argv[2]) {
  const base = new URL(process.argv[2]);
  assert(base.hostname.endsWith(".replit.dev") || ["localhost", "127.0.0.1"].includes(base.hostname));
  for (const path of ["/", "/locations/dubai", "/contact"]) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200, `${path}: development page must exist`);
    verify(await response.text(), path);
  }
}
console.log("PASS: Denied consent default is first, once per page, before GTM initialization; original container and development guard retained; no tag configuration or conversion commands added.");