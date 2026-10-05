export const canonicalOrigin = "https://urbangrid.ae";
export const centralLoginUrl = "https://app.stratasurveyor.com/";

export function canonicalUrl(path: string) {
  const url = new URL(path, canonicalOrigin);
  const pathname = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
  return `${canonicalOrigin}${pathname}`;
}

export function isNonIndexablePath(path: string) {
  return /^\/(?:admin|api|login|book-inspection|checkout|booking-access)(?:\/|$)/.test(path);
}