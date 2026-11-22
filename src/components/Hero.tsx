import { ArrowDown, HardDrive, KeyRound, Sparkle } from "lucide-react";
import { motion } from "motion/react";
import { HeroGraph } from "@/components/HeroGraph";
import { AppleIcon, WindowsIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { ASSETS, detectOs, downloadUrl, type Release } from "@/lib/release";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const APP_VARS = ["--claude", "--chatgpt", "--claude-code", "--codex", "--antigravity"];

/** Five app colours orbiting, sized to the headline's text. */
function AppsGlyph() {
  return (
    <span className="relative inline-block size-[0.82em] shrink-0 align-middle" aria-hidden>
      <span className="absolute inset-0 rounded-full opacity-60 blur-xl" style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }} />
      <motion.span className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
        {APP_VARS.map((v, i) => {
          const a = (i / APP_VARS.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <span
              key={v}
              className="absolute size-[0.24em] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ left: `${50 + Math.cos(a) * 36}%`, top: `${50 + Math.sin(a) * 36}%`, background: `var(${v})`, boxShadow: `0 0 0.18em var(${v})` }}
            />
          );
        })}
      </motion.span>
      <span className="absolute left-1/2 top-1/2 size-[0.14em] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_0.3em_var(--primary)]" />
    </span>
  );
}

/** The Carryover logo as a glowing glyph inside the headline. */
function LogoGlyph() {
  return (
    <span className="relative inline-block size-[0.86em] shrink-0 align-middle" aria-hidden>
      <span className="absolute -inset-[20%] rounded-full opacity-80 blur-2xl" style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }} />
      <motion.img
        src={`${import.meta.env.BASE_URL}logo.png`}
        alt=""
        className="relative size-full rounded-[0.22em] shadow-[0_0_0.5em_-0.1em_var(--glow)]"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </span>
  );
}

export function Hero({ release }: { release: Release }) {
  const { t } = useI18n();
  const os = detectOs();
  const macFirst = os === "mac" && release.hasMac;
  const version = release.version ?? "0.1.0";
  const pointIcons = [Sparkle, HardDrive, KeyRound];

  const win = (
    <Button asChild size="lg" variant={macFirst ? "outline" : "default"} className="h-12 rounded-xl px-6 text-[15px] font-medium shadow-[0_10px_40px_-10px_var(--glow)]">
      <a href={downloadUrl(ASSETS.windows)}>
        <WindowsIcon /> {t.hero.windows}
      </a>
    </Button>
  );
  const mac = release.hasMac ? (
    <Button asChild size="lg" variant={macFirst ? "default" : "outline"} className="h-12 rounded-xl px-6 text-[15px] font-medium">
      <a href={downloadUrl(ASSETS.mac)}>
        <AppleIcon /> {t.hero.mac}
      </a>
    </Button>
  ) : null;

  return (
    <section id="top" className="dark relative overflow-hidden bg-black pb-40 pt-32 text-foreground sm:pt-40">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute bottom-[-30%] left-1/2 h-[700px] w-[1100px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--glow), transparent)" }}
      />

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <motion.h1 {...fade(0)} className="mx-auto max-w-5xl text-[clamp(2.9rem,8.5vw,6.6rem)] font-medium leading-[0.98] tracking-[-0.045em]">
          <span className="text-fade block pb-[0.06em]">{t.hero.title1}</span>
          <span className="mt-[0.04em] inline-flex flex-wrap items-center justify-center gap-x-[0.22em]">
            <AppsGlyph />
            <span>{t.hero.title2}</span>
            <LogoGlyph />
          </span>
        </motion.h1>

        <motion.p {...fade(0.12)} className="mx-auto mt-8 max-w-2xl text-[clamp(1rem,1.5vw,1.15rem)] leading-relaxed text-muted-foreground">
          {t.hero.lead}
        </motion.p>

        <motion.div {...fade(0.22)} className="mt-10 flex flex-wrap items-center justify-center gap-3">
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
          <Button asChild size="lg" variant="ghost" className="glow-ring h-12 rounded-xl bg-white/[0.03] px-6 text-[15px] font-medium hover:bg-white/[0.07]">
            <a href="#demo">
              {t.hero.see} <ArrowDown />
            </a>
          </Button>
        </motion.div>

        <motion.ul {...fade(0.3)} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
          {t.hero.points.map((p, i) => {
            const Icon = pointIcons[i]!;
            return (
              <li key={p} className="flex items-center gap-1.5">
                <Icon className="size-3.5 text-primary" /> {p}
              </li>
            );
          })}
          <li className="text-muted-foreground/70">
            {t.hero.version.replace("{v}", version)} · Windows{release.hasMac ? " · macOS" : ""}
          </li>
        </motion.ul>

        <motion.div {...fade(0.4)} className="mx-auto mt-14 max-w-4xl">
          <HeroGraph />
        </motion.div>
      </div>
    </section>
  );
}
