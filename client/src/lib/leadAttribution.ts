/** Browser-side, first-party campaign attribution for lead forms only. */
const KEY="urbangrid_lead_attribution_v1";
const allowed=["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","gbraid","wbraid","msclkid","fbclid"] as const;

type Stored={attribution:Record<string,string>;landingPage:string;referrer:string};
function cleanPath(url: string): string {
  try {
    const parsed=new URL(url,window.location.origin);
    return parsed.origin===window.location.origin ? parsed.pathname : parsed.origin;
  } catch { return ""; }
}
export function captureLandingAttribution(): void {
  if(typeof window==="undefined")return;
  try {
    const existing=JSON.parse(sessionStorage.getItem(KEY)||"null") as Stored|null;
    const qs=new URLSearchParams(window.location.search);
    const additions=Object.fromEntries(allowed.flatMap(key=>{
      const value=(qs.get(key)||"").slice(0,256);
      return value ? [[key,value]] : [];
    }));
    const next:Stored={
      attribution:{...(existing?.attribution||{}),...additions},
      landingPage:existing?.landingPage||window.location.pathname,
      referrer:existing?.referrer||cleanPath(document.referrer)
    };
    sessionStorage.setItem(KEY,JSON.stringify(next));
  } catch { /* Browser privacy settings may block storage; forms still work. */ }
}
export function websiteLeadContext() {
  captureLandingAttribution();
  let saved:Stored|null=null;
  try {saved=JSON.parse(sessionStorage.getItem(KEY)||"null") as Stored|null;}
  catch { /* optional attribution */ }
  return {
    sourcePage:window.location.pathname+window.location.search,
    attribution:saved?.attribution||{},
    landingPage:saved?.landingPage||window.location.pathname,
    referrer:saved?.referrer||""
  };
}
