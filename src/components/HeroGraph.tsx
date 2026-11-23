import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n";

/*
 * The hero animation runs on the browser's own animation engine (SVG
 * <animateMotion> and CSS keyframes), not JavaScript per frame, so it stays
 * smooth while the page scrolls. Each moving thing follows its path in one
 * eased curve instead of many small eased steps (which looked stop-and-go).
 * Everything pauses while the hero is off screen.
 */

type P = { x: number; y: number };
const CORE: P = { x: 500, y: 270 };

const APPS = [
  { id: "claude", label: "Claude", color: "var(--claude)", at: { x: 150, y: 120 } },
  { id: "chatgpt", label: "ChatGPT", color: "var(--chatgpt)", at: { x: 110, y: 400 } },
  { id: "claude-code", label: "Claude Code", color: "var(--claude-code)", at: { x: 500, y: 490 } },
  { id: "codex", label: "Codex", color: "var(--codex)", at: { x: 880, y: 390 } },
  { id: "antigravity", label: "Antigravity", color: "var(--antigravity)", at: { x: 850, y: 115 } },
] as const;

const mid = (a: P, b: P, lift = 0): P => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - lift });
const pathD = (a: P, b: P, c: P) => `M${a.x},${a.y} Q${c.x},${c.y} ${b.x},${b.y}`;

/** Small chat dots scattered around each hub (fixed, so renders are stable). */
const SATELLITES = APPS.flatMap((app, i) =>
  Array.from({ length: 7 }, (_, k) => {
    const ang = (k / 7) * Math.PI * 2 + i;
    const r = 34 + ((k * 13 + i * 7) % 22);
    return { app, k, x: app.at.x + Math.cos(ang) * r * 1.35, y: app.at.y + Math.sin(ang) * r };
  }),
);

const EASE = "0.45 0 0.25 1"; // one smooth ease-in-out over the whole path
const CARRY_PATH = pathD(APPS[0].at, APPS[3].at, { x: 520, y: -40 });

const CSS = `
.hg-flow { animation: hg-dash 6s linear infinite; }
@keyframes hg-dash { to { stroke-dashoffset: -200; } }
.hg-bob { transform-box: fill-box; animation: hg-bob 4s ease-in-out infinite; }
@keyframes hg-bob { 50% { transform: translateY(-5px); } }
.hg-pulse { transform-box: fill-box; transform-origin: center; animation: hg-pulse 2.6s ease-out infinite; }
@keyframes hg-pulse { from { transform: scale(1); opacity: .6; } to { transform: scale(1.9); opacity: 0; } }
.hg-paused * { animation-play-state: paused !important; }
`;

export function HeroGraph() {
  const { t } = useI18n();
  const still = useReducedMotion();
  const svg = useRef<SVGSVGElement>(null);

  // Pause both CSS and SVG animations while the hero isn't visible.
  useEffect(() => {
    const el = svg.current;
    if (!el || still) return;
    const io = new IntersectionObserver(([e]) => {
      const visible = !!e?.isIntersecting;
      el.classList.toggle("hg-paused", !visible);
      if (visible) el.unpauseAnimations();
      else el.pauseAnimations();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [still]);

  return (
    <svg ref={svg} viewBox="0 0 1000 560" className="h-auto w-full select-none" role="img" aria-label={t.graph.memory}>
      <style>{CSS}</style>
      <defs>
        <radialGradient id="core-glow">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
        <clipPath id="core-clip">
          <rect x={CORE.x - 42} y={CORE.y - 42} width="84" height="84" rx="22" />
        </clipPath>
        {APPS.map((app) => (
          <path key={app.id} id={`hg-path-${app.id}`} d={pathD(app.at, CORE, mid(app.at, CORE, 30))} />
        ))}
        <path id="hg-carry" d={CARRY_PATH} />
      </defs>

      {/* links from each app into the core */}
      {APPS.map((app) => {
        const d = pathD(app.at, CORE, mid(app.at, CORE, 30));
        return (
          <g key={app.id}>
            <path d={d} fill="none" stroke={app.color} strokeOpacity="0.28" strokeWidth="1.5" />
            <path
              d={d}
              className={still ? undefined : "hg-flow"}
              fill="none"
              stroke={app.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 14"
              opacity={0.7}
            />
          </g>
        );
      })}

      {/* chats flowing into memory: each glides the whole way in one smooth curve */}
      {!still &&
        APPS.map((app, i) =>
          [0, 1].map((n) => {
            const begin = `${(i * 0.7 + n * 1.6).toFixed(1)}s`;
            return (
              <circle key={`${app.id}-${n}`} r="4" fill={app.color} opacity="0">
                <animateMotion dur="3.2s" begin={begin} repeatCount="indefinite" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines={EASE}>
                  <mpath href={`#hg-path-${app.id}`} />
                </animateMotion>
                <animate attributeName="opacity" dur="3.2s" begin={begin} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.15;0.85;1" />
              </circle>
            );
          }),
        )}

      {/* satellites */}
      {SATELLITES.map(({ app, k, x, y }) => (
        <circle
          key={`${app.id}-s${k}`}
          className={still ? undefined : "hg-bob"}
          style={{ animationDuration: `${3 + (k % 4)}s`, animationDelay: `${-k * 0.4}s` }}
          cx={x}
          cy={y}
          r={k % 3 === 0 ? 3.5 : 2.5}
          fill={app.color}
          opacity={0.55}
        />
      ))}

      {/* hubs */}
      {APPS.map((app, i) => (
        <motion.g
          key={app.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 180, damping: 18 }}
          style={{ transformOrigin: `${app.at.x}px ${app.at.y}px` }}
        >
          <circle cx={app.at.x} cy={app.at.y} r="22" fill={app.color} opacity="0.14" />
          <circle cx={app.at.x} cy={app.at.y} r="9" fill={app.color} />
          <text
            x={app.at.x}
            y={app.at.y + 44}
            textAnchor="middle"
            className="fill-foreground text-[17px] font-medium"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {app.label}
          </text>
        </motion.g>
      ))}

      {/* the memory core */}
      <circle cx={CORE.x} cy={CORE.y} r="120" fill="url(#core-glow)" />
      {!still && <circle className="hg-pulse" cx={CORE.x} cy={CORE.y} r="56" fill="none" stroke="var(--primary)" strokeWidth="1.5" />}
      <rect x={CORE.x - 46} y={CORE.y - 46} width="92" height="92" rx="25" fill="var(--card)" stroke="var(--border)" />
      <image
        href={`${import.meta.env.BASE_URL}logo.png`}
        x={CORE.x - 42}
        y={CORE.y - 42}
        width="84"
        height="84"
        clipPath="url(#core-clip)"
      />
      <text
        x={CORE.x}
        y={CORE.y + 76}
        textAnchor="middle"
        className="fill-muted-foreground text-[15px]"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {t.graph.memory}
      </text>

      {/* a chat being carried from Claude to Codex: 4.5 s of travel, then a short rest */}
      <path d={CARRY_PATH} fill="none" stroke="var(--primary)" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 6" />
      {!still && (
        <g opacity="0">
          <animateMotion
            dur="6.3s"
            begin="0.8s"
            repeatCount="indefinite"
            calcMode="spline"
            keyPoints="0;1;1"
            keyTimes="0;0.714;1"
            keySplines={`${EASE};0 0 1 1`}
          >
            <mpath href="#hg-carry" />
          </animateMotion>
          <animate attributeName="opacity" dur="6.3s" begin="0.8s" repeatCount="indefinite" values="0;1;1;0;0" keyTimes="0;0.06;0.66;0.714;1" />
          <rect x="-84" y="-17" width="168" height="34" rx="10" fill="var(--card)" stroke="var(--primary)" strokeWidth="1.5" />
          <circle cx="-68" cy="0" r="5" fill="var(--claude)" />
          <text x="-56" y="5" className="fill-foreground text-[13px] font-medium" style={{ fontFamily: "var(--font-sans)" }}>
            LoRA fine-tuning plan
          </text>
        </g>
      )}
      <text
        x="515"
        y="40"
        textAnchor="middle"
        className="fill-primary text-[14px] font-medium"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {t.graph.carrying} →
      </text>
    </svg>
  );
}
