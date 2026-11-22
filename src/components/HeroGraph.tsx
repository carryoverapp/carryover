import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "@/i18n";

type P = { x: number; y: number };
const CORE: P = { x: 500, y: 270 };

const APPS = [
  { id: "claude", label: "Claude", color: "var(--claude)", at: { x: 150, y: 120 } },
  { id: "chatgpt", label: "ChatGPT", color: "var(--chatgpt)", at: { x: 110, y: 400 } },
  { id: "claude-code", label: "Claude Code", color: "var(--claude-code)", at: { x: 500, y: 490 } },
  { id: "codex", label: "Codex", color: "var(--codex)", at: { x: 880, y: 390 } },
  { id: "antigravity", label: "Antigravity", color: "var(--antigravity)", at: { x: 850, y: 115 } },
] as const;

/** Points along a quadratic curve from a to b, bent toward `bend`. */
function curve(a: P, b: P, bend: P, n = 24) {
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    xs.push((1 - t) ** 2 * a.x + 2 * (1 - t) * t * bend.x + t ** 2 * b.x);
    ys.push((1 - t) ** 2 * a.y + 2 * (1 - t) * t * bend.y + t ** 2 * b.y);
  }
  return { xs, ys };
}
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

export function HeroGraph() {
  const { t } = useI18n();
  const still = useReducedMotion();
  const from = APPS[0].at;
  const to = APPS[3].at;
  const carry = curve(from, to, { x: 520, y: -40 }, 40);

  return (
    <svg viewBox="0 0 1000 560" className="h-auto w-full select-none" role="img" aria-label={t.graph.memory}>
      <defs>
        <radialGradient id="core-glow">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
        <clipPath id="core-clip">
          <rect x={CORE.x - 42} y={CORE.y - 42} width="84" height="84" rx="22" />
        </clipPath>
      </defs>

      {/* links from each app into the core */}
      {APPS.map((app) => {
        const c = mid(app.at, CORE, 30);
        return (
          <g key={app.id}>
            <path d={pathD(app.at, CORE, c)} fill="none" stroke={app.color} strokeOpacity="0.28" strokeWidth="1.5" />
            <motion.path
              d={pathD(app.at, CORE, c)}
              fill="none"
              stroke={app.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 14"
              initial={{ strokeDashoffset: 0 }}
              animate={still ? undefined : { strokeDashoffset: -200 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              opacity={0.7}
            />
          </g>
        );
      })}

      {/* chats flowing into memory */}
      {!still &&
        APPS.map((app, i) => {
          const { xs, ys } = curve(app.at, CORE, mid(app.at, CORE, 30));
          return [0, 1].map((n) => (
            <motion.circle
              key={`${app.id}-${n}`}
              r="4"
              fill={app.color}
              initial={{ cx: xs[0], cy: ys[0], opacity: 0 }}
              animate={{ cx: xs, cy: ys, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.7 + n * 1.6, ease: "easeInOut" }}
            />
          ));
        })}

      {/* satellites */}
      {SATELLITES.map(({ app, k, x, y }) => (
        <motion.circle
          key={`${app.id}-s${k}`}
          cx={x}
          cy={y}
          r={k % 3 === 0 ? 3.5 : 2.5}
          fill={app.color}
          opacity={0.55}
          animate={still ? undefined : { cy: [y, y - 5, y] }}
          transition={{ duration: 3 + (k % 4), repeat: Infinity, ease: "easeInOut", delay: k * 0.3 }}
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
      {!still && (
        <motion.circle
          cx={CORE.x}
          cy={CORE.y}
          r="56"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.5"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
          style={{ transformOrigin: `${CORE.x}px ${CORE.y}px` }}
        />
      )}
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

      {/* a chat being carried from Claude to Codex */}
      <path
        d={pathD(from, to, { x: 520, y: -40 })}
        fill="none"
        stroke="var(--primary)"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        strokeDasharray="4 6"
      />
      {!still && (
        <motion.g
          initial={{ x: carry.xs[0], y: carry.ys[0], opacity: 0 }}
          animate={{ x: carry.xs, y: carry.ys, opacity: [0, 1, 1, 1, 1, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
        >
          <rect x="-62" y="-17" width="124" height="34" rx="10" fill="var(--card)" stroke="var(--primary)" strokeWidth="1.5" />
          <circle cx="-46" cy="0" r="5" fill="var(--claude)" />
          <text x="-34" y="5" className="fill-foreground text-[13px] font-medium" style={{ fontFamily: "var(--font-sans)" }}>
            SSO with JWT
          </text>
        </motion.g>
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
