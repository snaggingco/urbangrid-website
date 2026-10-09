import { z } from "zod";

/** Existing public build-info shape, deliberately excludes configuration and secrets. */
export const buildInfoSchema = z.object({
  commit: z.string().regex(/^[a-f0-9]{40}$|^unknown$|^unbuilt$/),
  builtAt: z.string(),
});
export function buildMatchesRelease(value: unknown, approvedSha: string): boolean {
  const parsed = buildInfoSchema.safeParse(value);
  return /^[a-f0-9]{40}$/.test(approvedSha) && parsed.success && parsed.data.commit === approvedSha;
}
