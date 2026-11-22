import { Check, Download, Languages, Monitor, Moon, Sun } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGS, useI18n } from "@/i18n";
import { useTheme, type Theme } from "@/lib/theme";

const base = import.meta.env.BASE_URL;

export function Nav() {
  const { t, lang, setLang } = useI18n();
  const { theme, setTheme } = useTheme();
  const { scrollY } = useScroll();
  const border = useTransform(scrollY, [0, 40], [0, 1]);
  const themes: { id: Theme; label: string; icon: typeof Sun }[] = [
    { id: "light", label: t.theme.light, icon: Sun },
    { id: "dark", label: t.theme.dark, icon: Moon },
    { id: "system", label: t.theme.system, icon: Monitor },
  ];
  const ThemeIcon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-background/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2.5 font-semibold tracking-tight">
            <img src={`${base}logo.png`} alt="" className="size-8 rounded-lg" width={32} height={32} />
            <span className="text-[17px]">Carryover</span>
          </a>
          <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="#features">{t.nav.features}</a>
            <a className="transition-colors hover:text-foreground" href="#how">{t.nav.how}</a>
            <a className="transition-colors hover:text-foreground" href="#privacy">{t.nav.privacy}</a>
            <a className="transition-colors hover:text-foreground" href="#faq">{t.nav.faq}</a>
          </div>
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t.lang.label}>
                  <Languages />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-40">
                <DropdownMenuLabel>{t.lang.label}</DropdownMenuLabel>
                {LANGS.map((l) => (
                  <DropdownMenuItem key={l.code} onSelect={() => setLang(l.code)} lang={l.code}>
                    {l.label}
                    {lang === l.code && <Check className="ml-auto" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t.theme.label}>
                  <ThemeIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-36">
                <DropdownMenuLabel>{t.theme.label}</DropdownMenuLabel>
                {themes.map(({ id, label, icon: Icon }) => (
                  <DropdownMenuItem key={id} onSelect={() => setTheme(id)}>
                    <Icon /> {label}
                    {theme === id && <Check className="ml-auto" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild size="sm" className="ml-1 rounded-full px-4">
              <a href="#download">
                <Download /> <span className="hidden sm:inline">{t.nav.download}</span>
              </a>
            </Button>
          </div>
        </nav>
      </div>
      <motion.div style={{ opacity: border }} className="h-px bg-border" />
    </header>
  );
}
