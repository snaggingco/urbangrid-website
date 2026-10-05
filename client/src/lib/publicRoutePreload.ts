import type { ComponentType } from "react";

let dubaiModule: { default: ComponentType } | undefined;
let dubaiPromise: Promise<{ default: ComponentType }> | undefined;

export function loadDubaiPage() {
  return dubaiPromise ??= import("@/pages/locations/Dubai").then(module => {
    dubaiModule = module;
    return module;
  });
}

export function getDubaiPage() {
  return dubaiModule?.default;
}

export function preloadPublicRoute(pathname: string) {
  return pathname.replace(/\/$/, "") === "/locations/dubai" ? loadDubaiPage() : undefined;
}