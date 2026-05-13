import Icon from "@/components/ui/icon";

interface HeroSectionProps {
  onScrollTo: (id: string) => void;
}

export default function HeroSection({ onScrollTo }: HeroSectionProps) {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(https://cdn.poehali.dev/projects/ee879c41-1322-40fb-bfe9-87eea92a266b/bucket/1818af93-0551-4d17-a043-6c7b801315e5.jpg)` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0a] via-[#0f0d0a]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)]" />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="inline-block mb-4 px-4 py-1 border border-[#f59e0b]/40 rounded-full text-xs tracking-[0.3em] uppercase text-[#f59e0b]/80 bg-black/30"
          style={{ backdropFilter: "blur(8px)" }}>
          Набор инструментов игрока
        </div>
        <h1 className="font-['Oswald',sans-serif] text-6xl md:text-8xl font-bold tracking-widest uppercase mb-6 leading-none"
          style={{ textShadow: "0 0 60px rgba(245,158,11,0.4), 0 4px 20px rgba(0,0,0,0.8)", color: "#ffffff" }}>
          Mine<span style={{ color: "#f59e0b", textShadow: "0 0 40px rgba(245,158,11,0.8), 0 0 80px rgba(245,158,11,0.3)" }}>Kit</span>
        </h1>
        <p className="text-lg md:text-xl text-[#f0e8d8]/70 mb-10 max-w-xl mx-auto leading-relaxed">
          Всё для игры в одном месте — калькуляторы, гайды и инструменты для настоящего выживальщика
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => onScrollTo("tools")}
            className="px-8 py-4 bg-[#f59e0b] text-black font-bold text-sm tracking-widest uppercase rounded transition-all duration-300 hover:bg-[#fbbf24] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-95">
            Инструменты
          </button>
          <button onClick={() => onScrollTo("guides")}
            className="px-8 py-4 border border-[#f0e8d8]/30 text-[#f0e8d8] font-medium text-sm tracking-widest uppercase rounded transition-all duration-300 hover:border-[#f59e0b]/60 hover:text-[#f59e0b] backdrop-blur-sm">
            Гайды
          </button>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <Icon name="ChevronDown" size={28} className="text-[#f59e0b]/60" />
      </div>
    </section>
  );
}
