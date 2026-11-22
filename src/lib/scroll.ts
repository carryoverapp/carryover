/**
 * Smooth scrolling to #anchors that always arrives.
 *
 * The browser's own smooth scroll gets cancelled when content resizes while it
 * runs (the scroll story and the rising sheet both do), so it can stop halfway.
 * This one re-measures the target on every frame.
 */
const NAV = 72;

function targetY(el: HTMLElement) {
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - NAV);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = window.scrollY;
  const dist = Math.abs(targetY(el) - start);
  const duration = reduce ? 0 : Math.min(1400, 450 + dist / 8);
  const t0 = performance.now();
  const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);

  const step = (now: number) => {
    const k = duration ? Math.min(1, (now - t0) / duration) : 1;
    const to = targetY(el);
    window.scrollTo(0, start + (to - start) * ease(k));
    if (k < 1) requestAnimationFrame(step);
    else settle(el, 8);
  };
  requestAnimationFrame(step);
}

/** A few more frames to catch late layout changes (reveal animations, the sheet). */
function settle(el: HTMLElement, frames: number) {
  if (frames <= 0) return;
  requestAnimationFrame(() => {
    const to = targetY(el);
    if (Math.abs(window.scrollY - to) > 2) window.scrollTo(0, to);
    settle(el, frames - 1);
  });
}

/** Routes clicks on in-page links through scrollToId. */
export function installAnchorScrolling() {
  document.addEventListener("click", (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const id = a.getAttribute("href")!.slice(1);
    if (!id || !document.getElementById(id)) return;
    e.preventDefault();
    history.replaceState(null, "", `#${id}`);
    scrollToId(id);
  });
}
