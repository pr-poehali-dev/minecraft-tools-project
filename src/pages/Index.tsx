import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import HeroSection from "@/components/sections/HeroSection";
import ToolsSection from "@/components/sections/ToolsSection";
import GuidesSection from "@/components/sections/GuidesSection";

const NAV_LINKS = ["Главная", "Инструменты", "Гайды"];

export default function Index() {
  const [activeSection, setActiveSection] = useState("Главная");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openTool, setOpenTool] = useState<string | null>(null);
  const [openGuide, setOpenGuide] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sectionIds: Record<string, string> = {
    Главная: "hero", Инструменты: "tools", Гайды: "guides",
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      const ids = Object.values(sectionIds);
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          const name = Object.keys(sectionIds).find(k => sectionIds[k] === ids[i]);
          if (name) setActiveSection(name);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0d0a] text-[#f0e8d8] font-['Rubik',sans-serif]">

      {showScrollTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-[#f59e0b] text-black rounded-full flex items-center justify-center shadow-lg hover:bg-[#fbbf24] transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]">
          <Icon name="ChevronUp" size={20} />
        </button>
      )}

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-[#f59e0b]/20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("hero")}>
            <span className="text-2xl">⛏️</span>
            <span className="font-['Oswald',sans-serif] text-xl font-bold tracking-widest text-[#f59e0b]"
              style={{ textShadow: "0 0 20px rgba(245,158,11,0.5)" }}>
              MINEKIT
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <button key={link} onClick={() => { setActiveSection(link); scrollTo(sectionIds[link]); }}
                className={`text-sm font-medium tracking-wider uppercase transition-colors ${activeSection === link ? "text-[#f59e0b]" : "text-[#f0e8d8]/50 hover:text-[#f0e8d8]"}`}>
                {link}
              </button>
            ))}
          </div>
          <button className="md:hidden text-[#f0e8d8]/60 hover:text-[#f59e0b] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-black/90 border-t border-[#f59e0b]/10 px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map(link => (
              <button key={link} onClick={() => { setActiveSection(link); scrollTo(sectionIds[link]); }}
                className={`text-sm font-medium tracking-wider uppercase text-left transition-colors ${activeSection === link ? "text-[#f59e0b]" : "text-[#f0e8d8]/50"}`}>
                {link}
              </button>
            ))}
          </div>
        )}
      </nav>

      <HeroSection onScrollTo={scrollTo} />

      <ToolsSection openTool={openTool} setOpenTool={setOpenTool} />

      <GuidesSection openGuide={openGuide} setOpenGuide={setOpenGuide} />

      {/* FOOTER */}
      <footer className="border-t border-[#f59e0b]/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⛏️</span>
            <span className="font-['Oswald',sans-serif] font-bold tracking-widest text-[#f59e0b] text-sm">MINEKIT</span>
          </div>
          <p className="text-[#f0e8d8]/30 text-xs">© 2026 MineKit — Набор инструментов игрока</p>
          <div className="flex gap-6">
            {["Инструменты", "Гайды"].map(l => (
              <button key={l} onClick={() => scrollTo(sectionIds[l])}
                className="text-xs text-[#f0e8d8]/40 hover:text-[#f59e0b] transition-colors uppercase tracking-wider">
                {l}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
