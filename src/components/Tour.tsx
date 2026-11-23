import { Play } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { useI18n } from "@/i18n";
import { track } from "@/lib/track";

const base = import.meta.env.BASE_URL;

/**
 * The video tour. Only the 30 KB poster loads with the page; the video
 * (2.6 MB, 720p, fast-start MP4) is fetched when someone presses play.
 */
export function Tour() {
  const { t } = useI18n();
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  return (
    <section id="tour" className="mx-auto max-w-5xl scroll-mt-20 px-4 pt-20 sm:px-6 sm:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <p className="text-sm font-medium text-primary">{t.tour.eyebrow}</p>
        <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.05] tracking-[-0.04em]">{t.tour.title}</h2>
        <p className="mt-3 text-lg text-muted-foreground">{t.tour.sub}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,0.5)]"
      >
        <div className="relative aspect-video">
          {playing ? (
            <video
              ref={video}
              className="absolute inset-0 size-full"
              src={`${base}tour.mp4`}
              poster={`${base}tour-poster.webp`}
              controls
              autoPlay
              playsInline
              preload="auto"
            >
              <track kind="captions" src={`${base}tour.en.vtt`} srcLang="en" label="English" />
            </video>
          ) : (
            <button
              type="button"
              onClick={() => {
                setPlaying(true);
                track("play-tour");
              }}
              aria-label={t.tour.play}
              className="group absolute inset-0 size-full cursor-pointer"
            >
              <img
                src={`${base}tour-poster.webp`}
                alt=""
                width={1280}
                height={720}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 transition-opacity group-hover:opacity-80" />
              <span className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_0_10px_color-mix(in_oklch,var(--primary)_25%,transparent),0_20px_60px_-10px_var(--glow)] transition-transform duration-300 group-hover:scale-110 sm:size-24">
                <Play className="ml-1 size-8 fill-current sm:size-10" />
              </span>
              <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur sm:bottom-6 sm:left-6">
                <Play className="size-3.5 fill-current" /> {t.tour.play} · 1:22
              </span>
            </button>
          )}
        </div>
      </motion.div>
    </section>
  );
}
