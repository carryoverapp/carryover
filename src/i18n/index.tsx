import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import de from "./de";
import en, { type Dict } from "./en";
import es from "./es";
import fr from "./fr";
import hi from "./hi";

export const LANGS = [
  { code: "en", label: "English", dict: en },
  { code: "hi", label: "हिन्दी", dict: hi },
  { code: "es", label: "Español", dict: es },
  { code: "fr", label: "Français", dict: fr },
  { code: "de", label: "Deutsch", dict: de },
] as const;
export type Lang = (typeof LANGS)[number]["code"];

const KEY = "carryover-lang";

function initialLang(): Lang {
  const known = (c: string | null | undefined): c is Lang => LANGS.some((l) => l.code === c);
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (known(fromUrl)) return fromUrl;
  try {
    const saved = localStorage.getItem(KEY);
    if (known(saved)) return saved;
  } catch {
    /* storage blocked */
  }
  const nav = navigator.language?.slice(0, 2);
  return known(nav) ? nav : "en";
}

const Ctx = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void } | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const t = LANGS.find((l) => l.code === lang)!.dict;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.meta.title;
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* storage blocked */
    }
  }, [lang, t]);

  return <Ctx.Provider value={{ lang, t, setLang }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n outside I18nProvider");
  return v;
}
