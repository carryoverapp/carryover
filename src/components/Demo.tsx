import {
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { ArrowRight, Check, Copy, Hand, Maximize, Minus, MousePointerClick, Plus, RotateCcw, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

/* ---------- sample graph ---------- */

type AppId = "claude" | "chatgpt" | "claude-code" | "codex" | "antigravity";
const APPS: Record<AppId, { label: string; color: string; at: [number, number] }> = {
  claude: { label: "Claude", color: "var(--claude)", at: [140, 250] },
  "claude-code": { label: "Claude Code", color: "var(--claude-code)", at: [470, 90] },
  chatgpt: { label: "ChatGPT", color: "var(--chatgpt)", at: [400, 450] },
  antigravity: { label: "Antigravity", color: "var(--antigravity)", at: [700, 470] },
  codex: { label: "Codex", color: "var(--codex)", at: [820, 230] },
};

const TARGET = "chat-rate";
const CHATS: { id: string; app: AppId; title: string; msgs: number; angle: number }[] = [
  { id: TARGET, app: "claude", title: "Rate limiting the API", msgs: 4, angle: 20 },
  { id: "c2", app: "claude", title: "Trip plan for Lisbon", msgs: 31, angle: 130 },
  { id: "c3", app: "claude", title: "LoRA fine-tuning plan", msgs: 12, angle: 240 },
  { id: "cc1", app: "claude-code", title: "SQLite migrations in Rust", msgs: 88, angle: 200 },
  { id: "cc2", app: "claude-code", title: "Fix flaky login test", msgs: 46, angle: 340 },
  { id: "g1", app: "chatgpt", title: "Cricket stats notebook", msgs: 23, angle: 160 },
  { id: "g2", app: "chatgpt", title: "RAG eval pipeline", msgs: 57, angle: 20 },
  { id: "a1", app: "antigravity", title: "Design tokens for dark mode", msgs: 19, angle: 60 },
  { id: "x1", app: "codex", title: "Kubernetes ingress setup", msgs: 64, angle: 300 },
  { id: "x2", app: "codex", title: "React version upgrade", msgs: 39, angle: 70 },
];
const CHAT_W = 168;
const CHAT_H = 50;
const HUB = 64;

const chatPos = (app: AppId, angle: number): [number, number] => {
  const [x, y] = APPS[app].at;
  const r = (angle * Math.PI) / 180;
  return [x + Math.cos(r) * 150 - CHAT_W / 2 + HUB / 2, y + Math.sin(r) * 105 - CHAT_H / 2 + HUB / 2];
};
const home = Object.fromEntries(CHATS.map((c) => [c.id, chatPos(c.app, c.angle)]));
const COPY_POS = chatPos("codex", 175);

type HubData = { app: AppId };
type ChatData = { app: AppId; title: string; msgs: number; copy?: boolean };

/* Shared UI state the custom nodes read. */
const Live = createContext<{ step: number; dragging: boolean; selected: string | null; t: ReturnType<typeof useI18n>["t"] }>(null!);

function HubNode({ data }: NodeProps<Node<HubData>>) {
  const { step, dragging } = useContext(Live);
  const app = APPS[data.app];
  const isTarget = data.app === "codex" && step === 1;
  return (
    <div className="relative flex flex-col items-center" style={{ width: HUB }}>
      <Handle type="source" position={Position.Top} className="!opacity-0" style={{ top: HUB / 2 }} />
      <Handle type="target" position={Position.Top} className="!opacity-0" style={{ top: HUB / 2 }} />
      {isTarget && (
        <motion.span
          className="absolute rounded-full"
          style={{ width: HUB, height: HUB, border: `2px solid ${app.color}` }}
          animate={{ scale: [1, 1.7], opacity: [0.8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      )}
      <motion.div
        animate={{ scale: dragging ? (data.app === "codex" ? 1.25 : 1.08) : 1 }}
        className="grid place-items-center rounded-full border-2 bg-card shadow-sm"
        style={{ width: HUB, height: HUB, borderColor: app.color, boxShadow: dragging ? `0 0 0 6px color-mix(in oklch, ${app.color} 20%, transparent)` : undefined }}
      >
        <span className="size-5 rounded-full" style={{ background: app.color }} />
      </motion.div>
      <span className="mt-2 whitespace-nowrap rounded-full bg-background/80 px-2 text-[13px] font-semibold backdrop-blur">{app.label}</span>
    </div>
  );
}

function ChatNode({ id, data }: NodeProps<Node<ChatData>>) {
  const { step, selected, t } = useContext(Live);
  const app = APPS[data.app];
  const pulse = id === TARGET && step === 0;
  return (
    <div
      className={cn(
        "relative cursor-grab rounded-xl border bg-card px-3 py-2 shadow-sm transition-shadow active:cursor-grabbing",
        selected === id && "ring-2 ring-primary",
        data.copy && "border-dashed",
      )}
      style={{ width: CHAT_W, borderLeft: `3px solid ${app.color}` }}
    >
      <Handle type="target" position={Position.Left} className="!opacity-0" />
      <Handle type="source" position={Position.Right} className="!opacity-0" />
      {pulse && (
        <motion.span
          className="pointer-events-none absolute -inset-1 rounded-[14px] border-2 border-primary"
          animate={{ opacity: [0.9, 0.2, 0.9] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      )}
      <div className="truncate text-[12.5px] font-medium leading-tight">{data.title}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">
        {data.copy ? `↪ Claude · ${app.label}` : t.demo.messages.replace("{n}", String(data.msgs))}
      </div>
    </div>
  );
}

const nodeTypes = { hub: HubNode, chat: ChatNode };

function initialNodes(): Node[] {
  return [
    ...(Object.keys(APPS) as AppId[]).map<Node<HubData>>((id) => ({
      id: `hub-${id}`,
      type: "hub",
      position: { x: APPS[id].at[0], y: APPS[id].at[1] },
      data: { app: id },
      draggable: false,
      selectable: false,
    })),
    ...CHATS.map<Node<ChatData>>((c) => ({
      id: c.id,
      type: "chat",
      position: { x: home[c.id]![0], y: home[c.id]![1] },
      data: { app: c.app, title: c.title, msgs: c.msgs },
    })),
  ];
}

/* ---------- the demo ---------- */

function Canvas() {
  const { t } = useI18n();
  const d = t.demo;
  const flow = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes());
  const [step, setStep] = useState(0); // 0 open · 1 drag · 2 write · 3 continue · 4 done
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [typed, setTyped] = useState(0);
  const [writing, setWriting] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const summary = d.summaryText;
  const box = useRef<HTMLDivElement>(null);

  /** Fits the graph into the part of the canvas the side panel leaves free. */
  const frame = useCallback(
    (panel: boolean) => {
      const el = box.current;
      if (!el) return;
      const W = el.clientWidth;
      const H = el.clientHeight;
      const wide = W >= 640;
      const freeW = panel && wide ? W - 340 : W;
      const freeH = panel && !wide ? H * 0.36 : H;
      const b = flow.getNodesBounds(flow.getNodes());
      const pad = 24;
      const zoom = Math.min((freeW - pad * 2) / b.width, (freeH - pad * 2) / b.height, 1.1);
      void flow.setViewport(
        { x: pad + (freeW - pad * 2 - b.width * zoom) / 2 - b.x * zoom, y: pad + (freeH - pad * 2 - b.height * zoom) / 2 - b.y * zoom, zoom },
        { duration: 500 },
      );
    },
    [flow],
  );

  useEffect(() => () => window.clearInterval(timer.current), []);
  // Language changes restart the typing so the text matches.
  useEffect(() => setTyped((n) => (n ? summary.length : 0)), [summary]);

  const edges = useMemo<Edge[]>(() => {
    const list: Edge[] = CHATS.map((c) => ({
      id: `e-${c.id}`,
      source: `hub-${c.app}`,
      target: c.id,
      type: "straight",
      style: { stroke: APPS[c.app].color, strokeOpacity: 0.35, strokeWidth: 1.5 },
    }));
    if (step >= 4) {
      list.push(
        { id: "e-copy-hub", source: "hub-codex", target: "copy", type: "straight", style: { stroke: APPS.codex.color, strokeOpacity: 0.5, strokeWidth: 1.5 } },
        { id: "e-link", source: TARGET, target: "copy", animated: true, style: { stroke: "var(--primary)", strokeWidth: 2, strokeDasharray: "6 5" } },
      );
    }
    return list;
  }, [step]);

  const open = useCallback(
    (id: string) => {
      setSelected(id);
      if (id === TARGET && step === 0) setStep(1);
      frame(true);
    },
    [frame, step],
  );

  const snapBack = useCallback(
    (id: string) => setNodes((ns) => ns.map((n) => (n.id === id && home[id] ? { ...n, position: { x: home[id]![0], y: home[id]![1] } } : n))),
    [setNodes],
  );

  const dropped = useCallback(
    (id: string, onHub: string | undefined) => {
      snapBack(id);
      if (id !== TARGET) {
        setHint(d.steps[0]!.hint);
        return;
      }
      if (onHub === "hub-codex" && step <= 1) {
        setSelected(TARGET);
        setStep(2);
        setHint(null);
      } else if (onHub && onHub !== "hub-claude") {
        setHint(d.steps[1]!.hint);
      }
    },
    [d.steps, snapBack, step],
  );

  const write = useCallback(() => {
    if (writing) return;
    setWriting(true);
    setTyped(0);
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      setTyped((n) => {
        if (n + 3 >= summary.length) {
          window.clearInterval(timer.current);
          setWriting(false);
          setStep(3);
          return summary.length;
        }
        return n + 3;
      });
    }, 16);
  }, [summary.length, writing]);

  const proceed = useCallback(() => {
    setNodes((ns) =>
      ns.some((n) => n.id === "copy")
        ? ns
        : [
            ...ns,
            {
              id: "copy",
              type: "chat",
              position: { x: COPY_POS[0], y: COPY_POS[1] },
              data: { app: "codex", title: "Rate limiting the API", msgs: 4, copy: true },
              draggable: false,
            } satisfies Node<ChatData>,
          ],
    );
    setStep(4);
    window.setTimeout(() => frame(true), 60);
  }, [frame, setNodes]);

  /** Animates the target chat onto Codex, as if the user dragged it. */
  const autoDrag = useCallback(() => {
    const from = nodes.find((n) => n.id === TARGET)!.position;
    const to = { x: APPS.codex.at[0] - CHAT_W / 2 + HUB / 2, y: APPS.codex.at[1] + 8 };
    const start = performance.now();
    setDragging(true);
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 1100);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      const lift = Math.sin(k * Math.PI) * -90;
      setNodes((ns) => ns.map((n) => (n.id === TARGET ? { ...n, position: { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e + lift } } : n)));
      if (k < 1) requestAnimationFrame(tick);
      else {
        setDragging(false);
        window.setTimeout(() => dropped(TARGET, "hub-codex"), 250);
      }
    };
    requestAnimationFrame(tick);
  }, [dropped, nodes, setNodes]);

  const showMe = () => {
    if (step === 0) open(TARGET);
    else if (step === 1) autoDrag();
    else if (step === 2) write();
    else if (step === 3) proceed();
  };

  const restart = () => {
    window.clearInterval(timer.current);
    setNodes(initialNodes());
    setStep(0);
    setSelected(null);
    setTyped(0);
    setWriting(false);
    setHint(null);
    window.setTimeout(() => frame(false), 0);
  };

  const panelOpen = selected !== null;
  const chat = CHATS.find((c) => c.id === selected);

  return (
    <Live.Provider value={{ step, dragging, selected, t }}>
      <div className="flex flex-col gap-3">
        {/* steps */}
        <ol className="grid grid-cols-4 gap-2" aria-label={d.label}>
          {d.steps.map((s, i) => {
            const state = step > i ? "done" : step === i ? "now" : "next";
            return (
              <li
                key={i}
                className={cn(
                  "relative overflow-hidden rounded-xl border px-3 py-2.5 transition-colors",
                  state === "now" ? "border-primary/50 bg-primary/[0.07]" : "bg-card/50",
                  state === "next" && "text-muted-foreground",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full border text-[11px] font-semibold",
                      state === "done" && "border-primary bg-primary text-primary-foreground",
                      state === "now" && "border-primary text-primary",
                    )}
                  >
                    {state === "done" ? <Check className="size-3" /> : i + 1}
                  </span>
                  <span className="hidden truncate text-sm font-medium sm:inline">{s.title}</span>
                </div>
                {state === "now" && (
                  <motion.span layoutId="step-bar" className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />
                )}
              </li>
            );
          })}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3",
              step >= 4 ? "border-primary/50 bg-primary/[0.08]" : "bg-card/50",
            )}
          >
            {step < 4 ? (
              <>
                <p className="text-sm">
                  <span className="font-semibold sm:hidden">{d.steps[step]!.title}: </span>
                  <span className="text-muted-foreground">{d.steps[step]!.hint}</span>
                </p>
                <div className="flex items-center gap-1">
                  {step > 0 && (
                    <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={restart} aria-label={d.restart}>
                      <RotateCcw />
                    </Button>
                  )}
                  <Button size="sm" className="rounded-full" onClick={showMe} disabled={writing || dragging}>
                    {step === 1 ? <Hand /> : <MousePointerClick />} {d.showMe}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm">
                  <span className="mr-1.5 inline-flex items-center gap-1.5 font-semibold"><Sparkles className="size-4 text-primary" />{d.doneTitle}</span>
                  <span className="text-muted-foreground">{d.doneBody}</span>
                </p>
                <Button variant="outline" size="sm" className="rounded-full" onClick={restart}>
                  <RotateCcw /> {d.restart}
                </Button>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* canvas, inside a laptop */}
        <div className="dark relative text-foreground">
          <div className="rounded-[20px] border border-white/10 bg-[#0a0b0d] p-1.5 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.55)] sm:rounded-[28px] sm:p-3">
            <div className="overflow-hidden rounded-[14px] border border-white/[0.06] bg-[oklch(0.15_0.005_260)] sm:rounded-[18px]">
              <div className="relative flex items-center border-b border-white/[0.06] px-4 py-2.5">
                <div className="flex gap-1.5">
                  <i className="size-3 rounded-full bg-[#ff5f57]" />
                  <i className="size-3 rounded-full bg-[#febc2e]" />
                  <i className="size-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="absolute left-1/2 -translate-x-1/2 truncate text-xs text-muted-foreground">Carryover · {d.label}</span>
              </div>
              <div className="hidden items-center gap-2 border-b border-white/[0.06] px-4 py-2 text-xs sm:flex">
                <span className="rounded-md border px-2.5 py-1 text-muted-foreground">View <b className="font-medium text-foreground">Tool</b> ▾</span>
                <span className={cn("rounded-md border px-2.5 py-1", step >= 1 && step < 4 ? "border-primary/50 text-primary" : "text-muted-foreground")}>⇄ Transfer</span>
                <span className="w-48 rounded-md border px-2.5 py-1 text-muted-foreground/70">Search all chats…</span>
                <span className="ml-auto flex gap-1.5">
                  {(Object.keys(APPS) as AppId[]).map((id) => (
                    <span key={id} className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                      <span className="size-1.5 rounded-full" style={{ background: APPS[id].color }} />
                      {APPS[id].label} · {CHATS.filter((c) => c.app === id).length + (id === "codex" && step >= 4 ? 1 : 0)}
                    </span>
                  ))}
                </span>
              </div>
        <div ref={box} className="relative h-[440px] overflow-hidden sm:h-[540px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onNodeClick={(_, n) => n.type === "chat" && n.id !== "copy" && open(n.id)}
            onNodeDragStart={() => {
              setDragging(true);
              setHint(null);
            }}
            onNodeDragStop={(_, n) => {
              setDragging(false);
              const hub = flow.getIntersectingNodes(n).find((x) => x.type === "hub");
              dropped(n.id, hub?.id);
            }}
            onPaneClick={() => {
              if (step === 2 || step === 3 || selected === null) return;
              setSelected(null);
              frame(false);
            }}
            fitView
            fitViewOptions={{ padding: 0.12 }}
            minZoom={0.4}
            maxZoom={1.8}
            zoomOnScroll={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
            nodesConnectable={false}
            elementsSelectable={false}
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1.2} color="var(--border)" />
          </ReactFlow>

          <ZoomBar />

          <AnimatePresence>
            {hint && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-16 left-1/2 w-max max-w-[90%] -translate-x-1/2 rounded-full border bg-popover px-4 py-2 text-sm shadow-lg"
              >
                {hint}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {panelOpen && chat && (
              <motion.aside
                key="panel"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="absolute inset-x-2 bottom-2 flex max-h-[62%] flex-col overflow-hidden rounded-xl border bg-popover shadow-2xl sm:inset-x-auto sm:right-3 sm:top-3 sm:bottom-3 sm:max-h-none sm:w-[320px]"
              >
                <header className="flex items-start justify-between gap-2 border-b p-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{step >= 2 && chat.id === TARGET ? d.carryTo : chat.title}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="size-2 rounded-full" style={{ background: APPS[chat.app].color }} />
                      {APPS[chat.app].label} · {d.messages.replace("{n}", String(chat.msgs))}
                    </p>
                  </div>
                  {(step < 2 || step >= 4 || chat.id !== TARGET) && (
                    <button onClick={() => { setSelected(null); frame(false); }} aria-label={d.close} className="rounded-md p-1 text-muted-foreground hover:bg-accent">
                      <X className="size-4" />
                    </button>
                  )}
                </header>

                <div className="flex-1 space-y-3 overflow-y-auto p-4 text-[13px] leading-relaxed">
                  {(step < 2 || chat.id !== TARGET) && (
                    <>
                      {chat.id === TARGET ? (
                        d.chat.map(([role, text], i) => (
                          <div key={i} className={cn("rounded-lg p-2.5", role === "user" ? "bg-accent" : "border")}>
                            <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{role === "user" ? d.you : "Claude"}</p>
                            {text}
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">{d.steps[0]!.hint}</p>
                      )}
                      {chat.id === TARGET && step === 1 && (
                        <p className="flex items-center gap-2 rounded-lg border border-dashed border-primary/50 p-2.5 text-primary">
                          <Hand className="size-4 shrink-0" /> {d.dragHint}
                        </p>
                      )}
                    </>
                  )}

                  {chat.id === TARGET && step >= 2 && (
                    <>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full border px-2 py-0.5">Claude</span>
                        <ArrowRight className="size-3.5" />
                        <span className="rounded-full border px-2 py-0.5" style={{ borderColor: APPS.codex.color }}>Codex</span>
                      </div>
                      {typed === 0 && !writing ? (
                        <Button className="w-full rounded-full" onClick={write}><Sparkles /> {d.write}</Button>
                      ) : (
                        <div>
                          <p className="mb-1.5 text-xs font-medium text-muted-foreground">{writing ? d.writing : d.summary}</p>
                          <div className="whitespace-pre-wrap rounded-lg border bg-background p-3 font-mono text-[12px]">
                            {summary.slice(0, typed)}
                            {writing && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-primary align-middle" />}
                          </div>
                        </div>
                      )}
                      {step === 3 && (
                        <Button className="w-full rounded-full" onClick={proceed}>{d.continue} <ArrowRight /></Button>
                      )}
                      {step >= 4 && (
                        <p className="flex items-center gap-2 rounded-lg bg-primary/10 p-2.5 font-medium text-primary">
                          <Copy className="size-4" /> {d.continued}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
            </div>
          </div>
          <div className="relative mx-[-2.5%] h-3 rounded-b-[16px] bg-gradient-to-b from-[#3a3d44] to-[#15161a] shadow-[0_18px_30px_-12px_rgba(0,0,0,0.6)] sm:h-4">
            <div className="mx-auto h-1.5 w-20 rounded-b-md bg-black/50 sm:w-28" />
          </div>
        </div>
      </div>
    </Live.Provider>
  );
}

function ZoomBar() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const btn = "grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground";
  return (
    <div className="absolute bottom-3 left-3 flex gap-0.5 rounded-lg border bg-background/90 p-1 backdrop-blur">
      <button className={btn} onClick={() => void zoomOut()} aria-label="Zoom out"><Minus className="size-4" /></button>
      <button className={btn} onClick={() => void zoomIn()} aria-label="Zoom in"><Plus className="size-4" /></button>
      <button className={btn} onClick={() => void fitView({ padding: 0.12, duration: 400 })} aria-label="Fit"><Maximize className="size-4" /></button>
    </div>
  );
}

export function Demo() {
  const { t } = useI18n();
  return (
    <section id="demo" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-20 sm:px-6 sm:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-8 max-w-2xl"
      >
        <p className="text-sm font-medium text-primary">{t.demo.eyebrow}</p>
        <h2 className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.05] tracking-[-0.04em]">{t.demo.title}</h2>
        <p className="mt-3 text-lg text-muted-foreground">{t.demo.sub}</p>
      </motion.div>
      <ReactFlowProvider>
        <Canvas />
      </ReactFlowProvider>
    </section>
  );
}
