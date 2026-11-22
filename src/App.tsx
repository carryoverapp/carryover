import { Demo } from "@/components/Demo";
import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { DownloadSection, Faq, Footer, Privacy } from "@/components/Sections";
import { Paths, Sheet, Story } from "@/components/Story";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/i18n";
import { useRelease } from "@/lib/release";
import { ThemeProvider } from "@/lib/theme";

function Page() {
  const release = useRelease();
  return (
    <>
      <Nav />
      <main className="bg-black">
        <Hero release={release} />
        <Sheet>
          <Demo />
          <Paths />
          <Story />
          <Features />
          <Privacy />
          <Faq />
          <DownloadSection release={release} />
          <Footer />
        </Sheet>
      </main>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <TooltipProvider>
          <Page />
        </TooltipProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
