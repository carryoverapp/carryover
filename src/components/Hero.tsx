import { ArrowDown } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
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

  const shot = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: shot, offset: ["start end", "start 0.35"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

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
        <motion.a
          {...fade(0)}
          href="#download"
          className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur sm:text-[13px]"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          {t.hero.badge}
        </motion.a>

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
        <motion.p {...fade(0.3)} className="mt-4 text-[13px] text-muted-foreground">
          {t.hero.version.replace("{v}", version)} · Windows 10/11{release.hasMac ? " · macOS" : ` · ${t.hero.macSoon}`}
        </motion.p>

        <motion.div {...fade(0.36)} className="mx-auto mt-6 max-w-4xl">
          <HeroGraph />
        </motion.div>
      </div>

      <div id="demo" ref={shot} className="mx-auto mt-6 max-w-6xl px-4 [perspective:1400px] sm:px-6">
        <motion.div
          style={{ rotateX: rotate, scale }}
          className="overflow-hidden rounded-2xl border bg-card p-1.5 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.45)] sm:p-2"
        >
          <div className="flex items-center gap-1.5 px-3 pb-2 pt-1.5">
            <i className="size-2.5 rounded-full bg-[#ff5f57]" />
            <i className="size-2.5 rounded-full bg-[#febc2e]" />
            <i className="size-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs text-muted-foreground">Carryover</span>
          </div>
          <img
            src={`${import.meta.env.BASE_URL}screenshot.png`}
            alt={t.demo.caption}
            className="w-full rounded-xl border"
            loading="lazy"
            width={2040}
            height={1275}
          />
        </motion.div>
        <p className="mt-4 text-center text-sm text-muted-foreground">{t.demo.caption}</p>
      </div>
    </section>
  );
}
