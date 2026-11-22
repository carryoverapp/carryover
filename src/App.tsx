import { Demo } from "@/components/Demo";
import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { AppStrip, DownloadSection, Faq, Footer, How, Privacy } from "@/components/Sections";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/i18n";
import { useRelease } from "@/lib/release";
import { ThemeProvider } from "@/lib/theme";

function Page() {
  const release = useRelease();
  return (
    <>
      <Nav />
      <main>
        <Hero release={release} />
        <Demo />
        <div className="mt-24"><AppStrip /></div>
        <Features />
        <How />
        <Privacy />
        <Faq />
        <DownloadSection release={release} />
      </main>
      <Footer />
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
