import type { ComponentType } from "react";

let londonModule: { default: ComponentType } | undefined;
let londonPromise: Promise<{ default: ComponentType }> | undefined;

export function loadLondonPage() {
  return londonPromise ??= import("@/pages/locations/Dubai").then(module => {
    londonModule = module;
    return module;
  });
}

export function getLondonPage() {
  return londonModule?.default;
}

export function preloadPublicRoute(pathname: string) {
  return pathname.replace(/\/$/, "") === "/locations/london" ? loadLondonPage() : undefined;
}