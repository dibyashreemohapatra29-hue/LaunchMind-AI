import { buildLaunchContext, BuildLaunchContextInput } from "./ContextBuilder";
import { LaunchContext } from "../types/LaunchContext";

// ---------------------------------------------------------------------------
// ContextEngine — the single entry point future Intelligence Modules should
// import. It wraps ContextBuilder with a short-lived in-memory cache so
// repeated reads within the same session don't re-fetch history/integration
// status unnecessarily. Nothing outside this file should call
// ContextBuilder.buildLaunchContext directly.
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 30_000;

let cachedContext: LaunchContext | null = null;
let cachedAt = 0;

function isCacheFresh(): boolean {
  return cachedContext !== null && Date.now() - cachedAt < CACHE_TTL_MS;
}

/**
 * Returns the current LaunchContext, aggregating analysis, history, and
 * integration status. Pass `currentAnalysis` when calling from a page that
 * already has fresh analysis data in memory (e.g. Results) to avoid an
 * extra history round-trip; omit it to fall back to the latest saved
 * history entry.
 *
 * Set `forceRefresh` to bypass the short-lived cache (e.g. after an export
 * or a Slack share, so `launchMetrics.reportExported` / `slackShared`
 * reflect the latest state).
 */
export async function getLaunchContext(
  input: BuildLaunchContextInput & { forceRefresh?: boolean } = {}
): Promise<LaunchContext> {
  const { forceRefresh, ...builderInput } = input;

  if (!forceRefresh && !builderInput.currentAnalysis && isCacheFresh()) {
    return cachedContext as LaunchContext;
  }

  const context = await buildLaunchContext(builderInput);
  cachedContext = context;
  cachedAt = Date.now();
  return context;
}

export function invalidateLaunchContextCache(): void {
  cachedContext = null;
  cachedAt = 0;
}

export type { LaunchContext } from "../types/LaunchContext";
