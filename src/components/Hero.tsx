import { ArrowDown, HardDrive, KeyRound, Sparkle } from "lucide-react";
import { motion } from "motion/react";
import { HeroGraph } from "@/components/HeroGraph";
import { AppleIcon, WindowsIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { ASSETS, detectOs, downloadUrl, type Release } from "@/lib/release";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero({ release }: { release: Release }) {
  const { t } = useI18n();
  const os = detectOs();
  const macFirst = os === "mac" && release.hasMac;
  const version = release.version ?? "0.1.0";
  const pointIcons = [Sparkle, HardDrive, KeyRound];

  const win = (
    <Button asChild size="lg" className="h-12 rounded-full px-6 text-[15px] shadow-[0_8px_30px_var(--glow)]">
      <a href={downloadUrl(ASSETS.windows)}>
        <WindowsIcon /> {t.hero.windows}
      </a>
    </Button>
  );
  const mac = release.hasMac ? (
    <Button asChild size="lg" variant={macFirst ? "default" : "outline"} className="h-12 rounded-full px-6 text-[15px]">
      <a href={downloadUrl(ASSETS.mac)}>
        <AppleIcon /> {t.hero.mac}
      </a>
    </Button>
  ) : null;

  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10" />
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
      />

      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <motion.div {...fade(0)} className="inline-flex items-center gap-3 text-[13px] text-muted-foreground">
          <span className="flex -space-x-1.5" aria-hidden>
            {["--claude", "--chatgpt", "--claude-code", "--codex", "--antigravity"].map((c) => (
              <span key={c} className="size-5 rounded-full border-2 border-background" style={{ background: `var(${c})` }} />
            ))}
          </span>
          <span>
            {t.hero.worksWith} <span className="text-foreground">Claude, ChatGPT, Claude Code, Codex</span> & <span className="text-foreground">Antigravity</span>
          </span>
        </motion.div>

        <motion.h1
          {...fade(0.08)}
          className="mx-auto mt-6 max-w-4xl text-[clamp(2.6rem,7vw,5.2rem)] font-semibold leading-[1.02] tracking-[-0.035em]"
        >
          {t.hero.title1}{" "}
          <span className="text-gradient inline-block whitespace-nowrap pr-2 font-serif font-normal italic tracking-[-0.01em]">{t.hero.title2}</span>
        </motion.h1>

        <motion.p {...fade(0.16)} className="mx-auto mt-6 max-w-2xl text-[clamp(1rem,1.6vw,1.2rem)] leading-relaxed text-muted-foreground">
          {t.hero.lead}
        </motion.p>

        <motion.div {...fade(0.24)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          {macFirst ? (
            <>
              {mac}
              {win}
            </>
          ) : (
            <>
              {win}
              {mac}
            </>
          )}
          {!release.hasMac && (
            <Button asChild size="lg" variant="ghost" className="h-12 rounded-full px-5 text-[15px]">
              <a href="#demo">
                {t.hero.see} <ArrowDown />
              </a>
            </Button>
          )}
        </motion.div>
        <motion.ul {...fade(0.3)} className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
          {t.hero.points.map((p, i) => {
            const Icon = pointIcons[i]!;
            return (
              <li key={p} className="flex items-center gap-1.5">
                <Icon className="size-3.5 text-primary" /> {p}
              </li>
            );
          })}
        </motion.ul>
        <motion.p {...fade(0.34)} className="mt-2 text-xs text-muted-foreground/80">
          {t.hero.version.replace("{v}", version)} · Windows 10/11{release.hasMac ? " · macOS" : ` · ${t.hero.macSoon}`}
        </motion.p>

        <motion.div {...fade(0.36)} className="mx-auto mt-6 max-w-4xl">
          <HeroGraph />
        </motion.div>
      </div>

    </section>
  );
}
