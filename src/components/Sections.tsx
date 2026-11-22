import { ArrowUpRight, Check, Info, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { AppleIcon, GithubIcon, WindowsIcon } from "@/components/icons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { ASSETS, ISSUES_URL, RELEASES_URL, downloadUrl, type Release } from "@/lib/release";
import { cn } from "@/lib/utils";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

const APPS = [
  ["Claude", "bg-claude"],
  ["ChatGPT", "bg-chatgpt"],
  ["Claude Code", "bg-claude-code"],
  ["Codex", "bg-codex"],
  ["Antigravity", "bg-antigravity"],
  ["Gemini CLI", "bg-[#4f8df5]"],
  ["Ollama", "bg-muted-foreground"],
  ["LM Studio", "bg-muted-foreground"],
] as const;

export function AppStrip() {
  const { t } = useI18n();
  const row = [...APPS, ...APPS];
  return (
    <section aria-label={t.hero.worksWith} className="border-y bg-card/40 py-8">
      <p className="mb-5 text-center text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{t.hero.worksWith}</p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
          {row.map(([name, c], i) => (
            <span key={i} className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm whitespace-nowrap">
              <span className={cn("size-2.5 rounded-full", c)} />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function How() {
  const { t } = useI18n();
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <motion.div {...reveal} className="max-w-2xl">
        <p className="text-sm font-medium text-primary">{t.how.eyebrow}</p>
        <h2 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-tight tracking-[-0.03em]">{t.how.title}</h2>
      </motion.div>
      <ol className="relative mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
        <div className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
        {t.how.steps.map((s, i) => (
          <motion.li key={i} {...reveal} transition={{ ...reveal.transition, delay: i * 0.12 }} className="relative">
            <span className="relative grid size-10 place-items-center rounded-full border bg-background font-mono text-sm font-semibold text-primary shadow-[0_0_0_6px_var(--background)]">
              0{i + 1}
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

export function Privacy() {
  const { t } = useI18n();
  const p = t.privacy;
  return (
    <section id="privacy" className="scroll-mt-20 border-y bg-card/40">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.15fr_1fr]">
        <motion.div {...reveal}>
          <p className="flex items-center gap-2 text-sm font-medium text-primary"><ShieldCheck className="size-4" />{p.eyebrow}</p>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.8rem)] font-medium leading-[1.08] tracking-[-0.04em]">{p.title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{p.sub}</p>
          <ul className="mt-8 space-y-4">
            {p.points.map((pt) => (
              <li key={pt.b} className="flex gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary"><Check className="size-3.5" /></span>
                <span className="text-muted-foreground"><b className="font-medium text-foreground">{pt.b}</b> {pt.t}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-2xl" style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }} />
          <div className="rounded-2xl border bg-card p-2 shadow-xl">
            <div className="rounded-xl border bg-background p-5 font-mono text-[13px]">
              <div className="mb-4 flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-full bg-primary" /> carryover.db · local</div>
              {p.glance.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 border-b border-dashed py-3 last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-right font-medium text-primary">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DownloadCard({ icon, title, desc, href, cta, soon, notes }: { icon: React.ReactNode; title: string; desc: string; href?: string; cta: string; soon: string; notes: string[] }) {
  return (
    <div className={cn("flex flex-col rounded-2xl border bg-card p-6", !href && "opacity-80")}>
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl border bg-background [&_svg]:size-5">{icon}</span>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className="mt-6">
        {href ? (
          <Button asChild size="lg" className="h-11 w-full rounded-full"><a href={href}>{cta}</a></Button>
        ) : (
          <Button size="lg" variant="outline" disabled className="h-11 w-full rounded-full">{soon}</Button>
        )}
      </div>
      {notes.map((n) => (
        <p key={n} className="mt-3 flex gap-2 text-[13px] leading-relaxed text-muted-foreground first-of-type:mt-4"><Info className="mt-0.5 size-3.5 shrink-0" />{n}</p>
      ))}
    </div>
  );
}

export function DownloadSection({ release }: { release: Release }) {
  const { t } = useI18n();
  const d = t.download;
  return (
    <section id="download" className="relative scroll-mt-20 overflow-hidden px-4 py-28 sm:px-6">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" className="mx-auto size-16 rounded-2xl shadow-lg" width={64} height={64} />
        <h2 className="mt-6 text-[clamp(2.4rem,6vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.045em]">
          <span className="text-fade">{t.final.title1}</span> <span className="text-primary">{t.final.title2}</span>
        </h2>
      </motion.div>
      <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
        <DownloadCard icon={<WindowsIcon />} title="Windows" desc={d.windowsDesc} href={downloadUrl(ASSETS.windows)} cta={t.hero.windows} soon={d.soon} notes={[]} />
        <DownloadCard icon={<AppleIcon />} title="macOS" desc={d.macDesc} href={release.hasMac ? downloadUrl(ASSETS.mac) : undefined} cta={t.hero.mac} soon={d.soon} notes={[d.gatekeeper]} />
      </motion.div>
      <p className="mt-8 text-center text-sm">
        <a href={RELEASES_URL} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">{d.allReleases} <ArrowUpRight className="size-3.5" /></a>
      </p>
    </section>
  );
}

export function Faq() {
  const { t } = useI18n();
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 pb-8 pt-24 sm:px-6">
      <motion.div {...reveal} className="text-center">
        <p className="text-sm font-medium text-primary">{t.faq.eyebrow}</p>
        <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.4rem)] font-medium tracking-[-0.04em]">{t.faq.title}</h2>
      </motion.div>
      <Accordion type="single" collapsible className="mt-10">
        {t.faq.items.map((it, i) => (
          <AccordionItem key={i} value={`q${i}`}>
            <AccordionTrigger className="text-base">{it.q}</AccordionTrigger>
            <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">{it.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2.5">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" className="size-6 rounded-md" width={24} height={24} />
          <span>© 2026 Carryover · {t.footer.made}</span>
        </div>
        <div className="flex items-center gap-5">
          <a href={RELEASES_URL} className="hover:text-foreground">{t.footer.releases}</a>
          <a href={ISSUES_URL} className="hover:text-foreground">{t.footer.issues}</a>
          <a href={RELEASES_URL.replace("/releases", "")} aria-label="GitHub" className="hover:text-foreground"><GithubIcon className="size-4" /></a>
        </div>
      </div>
    </footer>
  );
}
