import { isIP } from "node:net";

export const validIntegrationKey = (key: string | undefined): key is string =>
  Boolean(key && key.length >= 48 && /^[\x21-\x7e]+$/.test(key));

/** Existing booking recipient rules, shared without changing its accepted URLs. */
export function integrationEndpoint(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash ||
        isIP(url.hostname.replace(/^\[|\]$/g, "")) || !url.hostname.includes(".") ||
        /(^|\.)localhost$|\.local$|\.internal$/i.test(url.hostname)) return null;
    return url.toString();
  } catch { return null; }
}
