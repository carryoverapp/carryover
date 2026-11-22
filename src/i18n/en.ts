const en = {
  meta: {
    title: "Carryover: one memory for all your AIs",
  },
  nav: { features: "Features", how: "How it works", privacy: "Privacy", faq: "FAQ", download: "Download" },
  theme: { label: "Theme", light: "Light", dark: "Dark", system: "System" },
  lang: { label: "Language" },
  hero: {
    points: ["Free", "Runs on your computer", "No API keys"],
    title1: "One memory for",
    title2: "all your AIs",
    lead: "Carryover brings your Claude, ChatGPT, Claude Code, Codex and Antigravity chats into one private memory graph. Compare models side by side, carry a chat from one AI to another, and keep what they've learned about you in one place.",
    windows: "Download for Windows",
    mac: "Download for Mac",
    macSoon: "Mac: coming soon",
    otherOs: "Other platforms",
    see: "See it in action",
    version: "Version {v}",
    worksWith: "Works with",
  },
  graph: { memory: "Your memory", carrying: "Carrying a chat to Codex" },
  demo: {
    eyebrow: "Try it",
    title: "Carry a chat from Claude to Codex",
    sub: "A live demo with sample chats. Drag, zoom and click, just like in the app.",
    label: "Interactive demo · sample chats",
    steps: [
      {
        title: "Open a chat",
        hint: "Click “Rate limiting the API” under Claude to read it.",
      },
      {
        title: "Carry it over",
        hint: "Drag the chat onto the Codex circle.",
      },
      {
        title: "Write a handoff",
        hint: "Press “Write handoff summary”. A model sums up the chat.",
      },
      {
        title: "Continue in Codex",
        hint: "Press “Continue in Codex”. The chat now shows under both apps.",
      },
    ],
    showMe: "Show me",
    restart: "Start over",
    doneTitle: "That's Carryover.",
    doneBody: "The original stays in Claude, a linked copy appears under Codex, and you pick up where you left off. In the app this works on your real chats.",
    dragHint: "Drag this chat onto another app to carry it over.",
    messages: "{n} messages",
    you: "You",
    carryTo: "Carry over to Codex",
    write: "Write handoff summary",
    writing: "Writing…",
    summary: "Handoff summary",
    continue: "Continue in Codex",
    continued: "Opened in Codex",
    close: "Close",
    chat: [
      ["user", "My API gets hammered at peak hours. How should I add rate limiting?"],
      [
        "assistant",
        "Use a token bucket per API key, kept in Redis so every server shares the same counts.",
      ],
      ["user", "Go with Redis. Free users get 100 requests a minute."],
      ["assistant", "Done. Next, return 429 with a Retry-After header and add tests for the limits."],
    ],
    summaryText: "Goal: add rate limiting to the public API.\nDecided: token bucket per API key, stored in Redis. Free plan: 100 requests a minute.\nOpen question: limits for paid plans.\nNext step: return 429 with a Retry-After header, then add tests.",
  },
  paths: {
    title1: "Choose your",
    title2: "path",
    sub: "Carryover fits how you use AI, whether that's in a browser or in a terminal.",
    users: {
      title: "For everyday AI users",
      sub: "Claude and ChatGPT, together at last.",
      points: [
        "Import your official Claude and ChatGPT exports",
        "See every chat on one searchable map",
        "Hit a limit? Carry the chat to another AI",
      ],
      cta: "Download for Windows",
    },
    devs: {
      title: "For developers",
      sub: "Claude Code, Codex and Antigravity, one memory.",
      points: [
        "Sessions import on their own, by project",
        "Approved memories go into CLAUDE.md and AGENTS.md",
        "Built-in MCP server for any MCP client",
      ],
      cta: "See the features",
    },
  },
  story: [
    {
      lead: "Your AIs",
      rest: "don't talk to each other.",
      body: "Every app keeps its own history. Switch tools and you start from zero.",
    },
    {
      lead: "Carryover",
      rest: "connects what you already have.",
      body: "It reads your existing chats into one private graph on your computer.",
    },
    {
      lead: "Your context",
      rest: "goes wherever you go.",
      body: "Carry a chat or your memory to any AI, and pick up where you left off.",
    },
  ],
  features: {
    eyebrow: "What it does",
    title1: "Every AI you use,",
    title2: "finally talking to each other",
    sub: "Each AI app keeps its own history and forgets the others. Carryover connects them on your machine.",
    graph: { title: "Memory graph", body: "All your chats as one map, grouped by app, topic, project or time. Search everything and click any node to read the chat." },
    carry: { title: "Carry a chat over", body: "Hit a usage limit? Drag a chat onto another app. Carryover writes a handoff summary so you continue where you left off, instead of starting over." },
    compare: { title: "Compare models", body: "One prompt, several models, answers streaming side by side." },
    judge: { title: "A fair judge", body: "A model you pick scores the answers without knowing who wrote them, twice with the order swapped." },
    memory: { title: "One memory, your rules", body: "Short facts about how you work, learned from your own messages. You approve each one before it's shared." },
    setup: { title: "Set up in a click", body: "Finds the AI apps on your computer and runs install or sign-in steps after you approve them." },
    demoFacts: ["Prefers Rust for CLI tools", "Deploys on Fridays", "Writes tests first"],
    keep: "Keep",
    reject: "Reject",
    winner: "Winner",
  },
  how: {
    eyebrow: "How it works",
    title: "Three steps, no account",
    steps: [
      { title: "Install and pick your apps", body: "Carryover finds Claude Code, Codex and Antigravity on its own. For Claude and ChatGPT, drop in the .zip from their official data export." },
      { title: "See everything in one graph", body: "Every chat lands in one searchable map. Group by topic with a local model, or by app, project and time." },
      { title: "Carry on anywhere", body: "Move a chat to another AI with a handoff summary, compare answers, and share only the memories you approved." },
    ],
  },
  privacy: {
    eyebrow: "Private by design",
    title: "Your chats stay on your computer unless you send them",
    sub: "Carryover has no account, no server and no tracking. It reads chat history you already have and stores it in a database on your own disk.",
    points: [
      { b: "Works with free local models.", t: "Use Ollama and nothing goes online at all." },
      { b: "Asks before anything is sent.", t: "Pick an online model and Carryover names the company the text goes to first." },
      { b: "Removes secrets first.", t: "A local filter strips emails, phone numbers, API keys, tokens and card numbers." },
      { b: "Never touches your apps' history.", t: "It only reads. Forget a chat in Carryover and the original stays where it was." },
      { b: "Encrypted backups.", t: "Everything in one password-locked file that you keep." },
    ],
    glance: [
      ["Account", "None"],
      ["Price", "Free"],
      ["Paid API keys", "Not needed"],
      ["Your data lives", "On your computer"],
      ["Models", "claude · codex · gemini · Ollama"],
    ],
  },
  download: {
    eyebrow: "Download",
    title: "Get Carryover",
    windowsDesc: "Windows 10 and 11 · 64-bit · installs without admin rights",
    macDesc: "macOS · Apple silicon and Intel",
    soon: "Coming soon",
    smartscreen: "Windows may show \"Windows protected your PC\". That's normal for new apps that aren't code-signed yet: click More info, then Run anyway.",
    chrome: "Chrome may show \"Unverified download blocked\" because the app is new and not code-signed yet. Click the arrow next to it and choose Download unverified file.",
    gatekeeper: "On Mac, the first time: right-click Carryover in Applications, choose Open, then Open again.",
    allReleases: "All releases",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions",
    items: [
      { q: "Does Carryover upload my chats anywhere?", a: "No. There's no Carryover server. Your chats are stored on your computer. Text only goes online when you choose an online model for a task, and Carryover tells you which company receives it before anything is sent." },
      { q: "Do I need API keys or a paid plan?", a: "No. Carryover uses the AI tools you already have and are signed in to (Claude Code, Codex, Gemini CLI), or free local models through Ollama." },
      { q: "Can it move a chat from Claude to ChatGPT?", a: "It carries it over. Carryover writes a short handoff summary of the chat (goal, decisions, open questions, next step) and opens the other app so you can continue. The original stays where it was, because Carryover never writes to or deletes from other apps." },
      { q: "How do Claude and ChatGPT chats get in?", a: "Through their official data exports. Request your export in Claude or ChatGPT settings, then drop the .zip into Carryover. Nothing is scraped." },
      { q: "Is it open source?", a: "Not yet. The app is free to download and use, and this site and the installers are public on GitHub." },
    ],
  },
  final: { title1: "Stop starting over", title2: "with every AI" },
  footer: { releases: "Releases", issues: "Report a problem", made: "Made for people who use more than one AI." },
};

export default en;

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };
export type Dict = Widen<typeof en>;
