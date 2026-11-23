/**
 * Privacy-friendly analytics (GoatCounter): no cookies, no personal data,
 * no cross-site tracking. Counts page views plus a few button clicks.
 */
export const GOATCOUNTER = "https://carryoverapp.goatcounter.com/count";

type GoatCounter = { count?: (v: { path: string; title?: string; event?: boolean }) => void };

export function track(event: "download-windows" | "download-mac" | "play-tour" | "demo-finished") {
  try {
    (window as unknown as { goatcounter?: GoatCounter }).goatcounter?.count?.({ path: event, title: event, event: true });
  } catch {
    /* analytics blocked or not loaded: nothing to do */
  }
}
