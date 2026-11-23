import { ArrowRight, Check } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { WindowsIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { track } from "@/lib/track";
import { ASSETS, downloadUrl } from "@/lib/release";
import { cn } from "@/lib/utils";

const reveal = {
  initial: { opacity: 0, y: 28, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

/** The light page rises over the black hero as a rounded sheet. */
export function Sheet({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.2"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [72, 40]);
  return (
    <motion.div
      ref={ref}
      style={{ scale, borderTopLeftRadius: radius, borderTopRightRadius: radius }}
      className="relative z-10 -mt-24 origin-top bg-background shadow-[0_-30px_80px_-20px_rgba(0,0,0,0.6)]"
    >
      {children}
    </motion.div>
  );
}

const APPS = [
  ["Claude", "var(--claude)"],
  ["ChatGPT", "var(--chatgpt)"],
  ["Claude Code", "var(--claude-code)"],
  ["Codex", "var(--codex)"],
  ["Antigravity", "var(--antigravity)"],
] as const;

function UsersVisual() {
  return (
    <div className="space-y-2 text-[12px]">
      {[
        ["Claude", "var(--claude)", "Trip plan for Lisbon"],
        ["ChatGPT", "var(--chatgpt)", "Cricket stats notebook"],
        ["Claude", "var(--claude)", "Rate limiting the API"],
      ].map(([app, c, title], i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.12 }}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2"
        >
          <span className="size-2 rounded-full" style={{ background: c }} />
          <span className="truncate text-white/90">{title}</span>
          <span className="ml-auto text-white/40">{app}</span>
        </motion.div>
      ))}
    </div>
  );
}

function DevsVisual() {
  return (
    <div className="rounded-lg border border-white/10 bg-black/60 p-3 font-mono text-[11.5px] leading-relaxed text-white/80">
      <div className="mb-2 flex gap-1.5">
        <i className="size-2 rounded-full bg-white/20" />
        <i className="size-2 rounded-full bg-white/20" />
        <i className="size-2 rounded-full bg-white/20" />
      </div>
      <div><span className="text-primary">$</span> claude mcp add carryover</div>
      <div className="text-white/40">✓ Added carryover (stdio)</div>
      <div className="mt-2 text-white/40">## AGENTS.md</div>
      <div>- Prefers Rust for CLI tools</div>
      <div>- Writes tests first</div>
    </div>
  );
}

function PathCard({ title, sub, points, cta, href, primary, visual, i }: { title: string; sub: string; points: readonly string[]; cta: ReactNode; href: string; primary?: boolean; visual: ReactNode; i: number }) {
  return (
    <motion.div {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }} className="dark group relative overflow-hidden rounded-3xl border bg-[oklch(0.16_0.006_260)] p-7 text-foreground sm:p-8">
      <div
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
      />
      <div className="relative grid gap-7 sm:grid-cols-[1fr_0.9fr] sm:items-center">
        <div>
          <h3 className="text-2xl font-medium tracking-tight">{title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{sub}</p>
          <ul className="mt-6 space-y-2.5 text-sm">
            {points.map((p) => (
              <li key={p} className="flex gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-foreground/85">{p}</span>
              </li>
            ))}
          </ul>
          <Button asChild variant={primary ? "default" : "secondary"} className="mt-7 h-11 rounded-xl px-5">
            <a href={href} onClick={() => href.includes("/download/") && track("download-windows")}>{cta}</a>
          </Button>
        </div>
        <div>{visual}</div>
      </div>
    </motion.div>
  );
}

export function Paths() {
  const { t } = useI18n();
  const p = t.paths;
  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
        <h2 className="text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.05] tracking-[-0.04em]">
          <span className="text-muted-foreground">{p.title1}</span> <span className="text-primary">{p.title2}</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">{p.sub}</p>
      </motion.div>
      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        <PathCard
          i={0}
          primary
          title={p.users.title}
          sub={p.users.sub}
          points={p.users.points}
          href={downloadUrl(ASSETS.windows)}
          cta={<><WindowsIcon /> {p.users.cta}</>}
          visual={<UsersVisual />}
        />
        <PathCard
          i={1}
          title={p.devs.title}
          sub={p.devs.sub}
          points={p.devs.points}
          href="#features"
          cta={<>{p.devs.cta} <ArrowRight /></>}
          visual={<DevsVisual />}
        />
      </div>
    </section>
  );
}

/* ---------- sticky scroll story ---------- */

const POS = [
  [18, 22], [80, 18], [12, 74], [86, 72], [50, 90],
] as const;

function StoryVisual({ step }: { step: number }) {
  const center = [50, 48];
  return (
    <div className="dark relative aspect-square w-full max-w-[520px] overflow-hidden rounded-[2rem] border bg-black">
      <div className="bg-grid absolute inset-0 opacity-70" />
      <motion.div
        className="absolute left-1/2 top-[48%] size-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        animate={{ opacity: step === 0 ? 0 : 0.6 }}
        style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
      />
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
        {APPS.map(([, c], i) => (
          <motion.line
            key={i}
            x1={POS[i]![0]}
            y1={POS[i]![1]}
            x2={center[0]}
            y2={center[1]}
            stroke={c}
            strokeWidth="0.35"
            strokeDasharray="1.5 1.5"
            initial={false}
            animate={{ pathLength: step >= 1 ? 1 : 0, opacity: step >= 1 ? 0.7 : 0 }}
            transition={{ duration: 0.8, delay: i * 0.08 }}
          />
        ))}
        <motion.path
          d={`M${POS[0][0]},${POS[0][1]} Q50,0 ${POS[3][0]},${POS[3][1]}`}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="0.5"
          strokeDasharray="2 1.5"
          initial={false}
          animate={{ pathLength: step >= 2 ? 1 : 0, opacity: step >= 2 ? 1 : 0 }}
          transition={{ duration: 0.9 }}
        />
      </svg>

      {APPS.map(([name, c], i) => (
        <motion.div
          key={name}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${POS[i]![0]}%`, top: `${POS[i]![1]}%` }}
          animate={
            step === 0
              ? { x: [0, i % 2 ? 6 : -6, 0], y: [0, i % 3 ? -5 : 5, 0], opacity: 1 }
              : { x: 0, y: 0, opacity: step === 2 && i !== 0 && i !== 3 ? 0.35 : 1 }
          }
          transition={step === 0 ? { duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.5 }}
        >
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur sm:text-[13px]">
            <span className="size-2 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
            {name}
          </div>
        </motion.div>
      ))}

      <motion.div
        className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2"
        initial={false}
        animate={{ scale: step >= 1 ? 1 : 0.4, opacity: step >= 1 ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 16 }}
      >
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" className="size-20 rounded-2xl shadow-[0_0_60px_-10px_var(--glow)] sm:size-24" />
      </motion.div>

      <AnimatePresence>
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-[4%] left-1/2 w-[64%] -translate-x-1/2 rounded-xl border border-primary/40 bg-black/80 p-3 font-mono text-[10.5px] leading-relaxed text-white/80 backdrop-blur sm:text-[11.5px]"
          >
            <div className="mb-1 flex items-center gap-1.5 text-primary">Claude → Codex</div>
            Goal: add rate limiting to the public API.
            <br />
            Next step: return 429 with Retry-After.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Story() {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setStep(Math.min(2, Math.floor(v * 3))));

  return (
    <section id="how" ref={ref} className="relative h-[300vh] scroll-mt-0">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 pt-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="space-y-6 sm:space-y-9">
            {t.story.map((it, i) => (
              <motion.div key={i} animate={{ opacity: step === i ? 1 : 0.28, filter: step === i ? "blur(0px)" : "blur(1.5px)" }} transition={{ duration: 0.4 }}>
                <p className="text-[clamp(1.5rem,3.4vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.035em]">
                  <span className={cn(step === i && "text-primary")}>{it.lead}</span> {it.rest}
                </p>
                <AnimatePresence initial={false}>
                  {step === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="max-w-md overflow-hidden pt-3 text-muted-foreground sm:text-lg"
                    >
                      {it.body}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center max-lg:[&>div]:max-w-[340px]">
            <StoryVisual step={step} />
          </div>
        </div>
      </div>
    </section>
  );
}
