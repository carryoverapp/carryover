import { Check, Play, Scale, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function Card({ className, title, body, children, i }: { className?: string; title: string; body: string; children: ReactNode; i: number }) {
  return (
    <motion.div
      {...reveal}
      transition={{ ...reveal.transition, delay: i * 0.06 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(400px circle at 50% 0%, var(--glow), transparent 70%)" }} />
      <div className="relative mb-5 min-h-36 flex-1">{children}</div>
      <h3 className="relative text-lg font-semibold tracking-tight">{title}</h3>
      <p className="relative mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
    </motion.div>
  );
}

const DOTS = [
  ["var(--claude)", 18, 30], ["var(--claude)", 28, 62], ["var(--chatgpt)", 44, 22], ["var(--chatgpt)", 52, 70],
  ["var(--claude-code)", 66, 38], ["var(--claude-code)", 78, 66], ["var(--codex)", 86, 28], ["var(--antigravity)", 36, 46],
  ["var(--codex)", 60, 54], ["var(--claude-code)", 72, 18],
] as const;

function GraphVisual() {
  return (
    <svg viewBox="0 0 100 90" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
      {DOTS.map(([, x, y], i) =>
        DOTS.slice(i + 1, i + 3).map(([, x2, y2], j) => (
          <line key={`${i}-${j}`} x1={x} y1={y} x2={x2} y2={y2} stroke="var(--border)" strokeWidth="0.4" />
        )),
      )}
      {DOTS.map(([c, x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r={i % 3 ? 2.2 : 3.2}
          fill={c}
          animate={{ cy: [y, y - 2.5, y] }}
          transition={{ duration: 3 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
        />
      ))}
    </svg>
  );
}

function CarryVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-between px-2">
      <div className="flex flex-col items-center gap-2">
        <div className="grid size-14 place-items-center rounded-2xl border bg-background"><span className="size-4 rounded-full bg-claude" /></div>
        <span className="text-xs text-muted-foreground">Claude</span>
      </div>
      <div className="relative mx-3 h-px flex-1 border-t border-dashed border-primary/50">
        <motion.div
          className="absolute -top-4 left-0 rounded-lg border border-primary/60 bg-background px-2 py-1 text-[11px] font-medium whitespace-nowrap shadow-sm"
          animate={{ left: ["-10%", "40%", "40%"], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut", times: [0, 0.7, 1] }}
        >
          Rate limiting the API
        </motion.div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="grid size-14 place-items-center rounded-2xl border bg-background"><span className="size-4 rounded-full bg-codex" /></div>
        <span className="text-xs text-muted-foreground">Codex</span>
      </div>
    </div>
  );
}

function CompareVisual() {
  const cols = [
    { name: "Claude", c: "bg-claude", w: [92, 78, 85, 60] },
    { name: "ChatGPT", c: "bg-chatgpt", w: [88, 70, 50, 74] },
  ];
  return (
    <div className="absolute inset-0 grid grid-cols-2 gap-3">
      {cols.map((col, i) => (
        <div key={col.name} className="rounded-xl border bg-background p-3">
          <div className="mb-3 flex items-center gap-1.5 text-[11px] font-medium"><span className={cn("size-2 rounded-full", col.c)} />{col.name}</div>
          {col.w.map((w, k) => (
            <motion.div
              key={k}
              className="mb-2 h-1.5 rounded-full bg-muted-foreground/25"
              initial={{ width: 0 }}
              whileInView={{ width: `${w}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 + k * 0.25 + i * 0.12, ease: "easeOut" }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function JudgeVisual({ winner }: { winner: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <motion.div animate={{ rotate: [-6, 6, -6] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        <Scale className="size-10 text-primary" strokeWidth={1.5} />
      </motion.div>
      <div className="flex gap-2 text-xs">
        <span className="rounded-md border bg-background px-2 py-1">Model A · 8</span>
        <span className="rounded-md border bg-background px-2 py-1 text-muted-foreground">Model B · 6</span>
      </div>
      <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-medium text-primary">{winner}: A ✓✓</span>
    </div>
  );
}

function MemoryVisual({ facts, keep, reject }: { facts: readonly string[]; keep: string; reject: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((v) => (v + 1) % (facts.length + 1)), 1600);
    return () => clearInterval(id);
  }, [facts.length]);
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2">
      <AnimatePresence initial={false}>
        {facts.slice(0, n).map((f, i) => (
          <motion.div
            key={f}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-between gap-2 rounded-lg border bg-background px-3 py-2 text-[13px]"
          >
            <span className="truncate">{f}</span>
            <span className="flex shrink-0 gap-1">
              <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px]", i === 1 ? "text-muted-foreground" : "bg-primary/15 text-primary")}>
                <Check className="size-3" /> {keep}
              </span>
              <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px]", i === 1 ? "bg-destructive/15 text-destructive" : "text-muted-foreground")}>
                <X className="size-3" /> {reject}
              </span>
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function SetupVisual() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2 font-mono text-[12px]">
      {["codex login", "claude auth login"].map((c, i) => (
        <div key={c} className="flex items-center justify-between rounded-lg border bg-background px-3 py-2">
          <span><span className="text-primary">$</span> {c}</span>
          <motion.span
            className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.8 }}
          >
            <Play className="size-3 fill-current" />
          </motion.span>
        </div>
      ))}
    </div>
  );
}

export function Features() {
  const { t } = useI18n();
  const f = t.features;
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
      <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">{f.eyebrow}</p>
        <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.05] tracking-[-0.04em]">
          <span className="text-muted-foreground">{f.title1}</span> <span className="text-primary">{f.title2}</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">{f.sub}</p>
      </motion.div>

      <div className="mt-14 grid gap-4 md:grid-cols-6">
        <Card i={0} className="md:col-span-4" title={f.graph.title} body={f.graph.body}><GraphVisual /></Card>
        <Card i={1} className="md:col-span-2" title={f.carry.title} body={f.carry.body}><CarryVisual /></Card>
        <Card i={2} className="md:col-span-2" title={f.compare.title} body={f.compare.body}><CompareVisual /></Card>
        <Card i={3} className="md:col-span-2" title={f.judge.title} body={f.judge.body}><JudgeVisual winner={f.winner} /></Card>
        <Card i={4} className="md:col-span-2" title={f.setup.title} body={f.setup.body}><SetupVisual /></Card>
        <Card i={5} className="md:col-span-6" title={f.memory.title} body={f.memory.body}>
          <div className="relative mx-auto h-36 max-w-xl"><MemoryVisual facts={f.demoFacts} keep={f.keep} reject={f.reject} /></div>
        </Card>
      </div>
    </section>
  );
}
