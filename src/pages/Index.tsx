import { useState } from "react";
import Icon from "@/components/ui/icon";

const NAV_LINKS = ["Главная", "Инструменты", "Гайды", "Контакты"];

const TOOLS = [
  {
    icon: "Sword",
    name: "Калькулятор урона",
    desc: "Рассчитай урон оружия с учётом зачарований и брони противника",
    tag: "Бой",
  },
  {
    icon: "Pickaxe",
    name: "Гайд по шахтам",
    desc: "Оптимальные уровни добычи алмазов, изумрудов и руд в новом мире",
    tag: "Добыча",
  },
  {
    icon: "Hammer",
    name: "Крафт-таблица",
    desc: "Быстрый поиск рецептов крафта любого предмета в игре",
    tag: "Крафт",
  },
  {
    icon: "Map",
    name: "Генератор семян",
    desc: "Найди идеальное семя для своего мира — деревни, храмы, биомы",
    tag: "Мир",
  },
  {
    icon: "Zap",
    name: "Зачарования",
    desc: "Подбери лучшие зачарования для оружия, инструментов и брони",
    tag: "Магия",
  },
  {
    icon: "BarChart2",
    name: "XP-калькулятор",
    desc: "Сколько опыта нужно для следующего уровня и зачарования",
    tag: "Опыт",
  },
];

const GUIDES = [
  {
    icon: "🏠",
    title: "Первая ночь выживания",
    desc: "Полный гайд для новичков: от дерева до первого дома за 10 минут",
    time: "10 мин",
  },
  {
    icon: "⚔️",
    title: "Фарм End-кристаллов",
    desc: "Как победить Дракона Края и получить максимум ресурсов",
    time: "25 мин",
  },
  {
    icon: "🌾",
    title: "Автоматическая ферма",
    desc: "Строим редстоун-ферму пшеницы без лишних усилий",
    time: "15 мин",
  },
  {
    icon: "🧙",
    title: "Все зачарования книг",
    desc: "Полный список зачарований, где найти и как комбинировать",
    time: "8 мин",
  },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("Главная");
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const sectionIds: Record<string, string> = {
    Главная: "hero",
    Инструменты: "tools",
    Гайды: "guides",
    Контакты: "contacts",
  };

  return (
    <div className="min-h-screen bg-[#0f0d0a] text-[#f0e8d8] font-['Rubik',sans-serif]">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-[#f59e0b]/20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollTo("hero")}
          >
            <span className="text-2xl">⛏️</span>
            <span
              className="font-['Oswald',sans-serif] text-xl font-bold tracking-widest text-[#f59e0b]"
              style={{ textShadow: "0 0 20px rgba(245,158,11,0.5)" }}
            >
              MINEKIT
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => {
                  setActiveSection(link);
                  scrollTo(sectionIds[link]);
                }}
                className={`text-sm font-medium tracking-wider uppercase transition-all duration-200 hover:text-[#f59e0b] ${
                  activeSection === link
                    ? "text-[#f59e0b]"
                    : "text-[#f0e8d8]/70"
                }`}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden text-[#f0e8d8]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-black/90 border-t border-[#f59e0b]/20 px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => {
                  setActiveSection(link);
                  scrollTo(sectionIds[link]);
                }}
                className="text-left text-sm font-medium tracking-wider uppercase text-[#f0e8d8]/80 hover:text-[#f59e0b] transition-colors"
              >
                {link}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://cdn.poehali.dev/projects/ee879c41-1322-40fb-bfe9-87eea92a266b/bucket/1818af93-0551-4d17-a043-6c7b801315e5.jpg)`,
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0a] via-[#0f0d0a]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

        {/* Warm glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div
            className="inline-block mb-4 px-4 py-1 border border-[#f59e0b]/40 rounded-full text-xs tracking-[0.3em] uppercase text-[#f59e0b]/80 bg-black/30"
            style={{ backdropFilter: "blur(8px)" }}
          >
            Набор инструментов игрока
          </div>

          <h1
            className="font-['Oswald',sans-serif] text-6xl md:text-8xl font-bold tracking-widest uppercase mb-6 leading-none"
            style={{
              textShadow:
                "0 0 60px rgba(245,158,11,0.4), 0 4px 20px rgba(0,0,0,0.8)",
              color: "#ffffff",
            }}
          >
            Mine
            <span
              style={{
                color: "#f59e0b",
                textShadow:
                  "0 0 40px rgba(245,158,11,0.8), 0 0 80px rgba(245,158,11,0.3)",
              }}
            >
              Kit
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#f0e8d8]/70 mb-10 max-w-xl mx-auto leading-relaxed">
            Всё для игры в одном месте — калькуляторы, гайды и инструменты для
            настоящего выживальщика
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollTo("tools")}
              className="px-8 py-4 bg-[#f59e0b] text-black font-bold text-sm tracking-widest uppercase rounded transition-all duration-300 hover:bg-[#fbbf24] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-95"
            >
              Инструменты
            </button>
            <button
              onClick={() => scrollTo("guides")}
              className="px-8 py-4 border border-[#f0e8d8]/30 text-[#f0e8d8] font-medium text-sm tracking-widest uppercase rounded transition-all duration-300 hover:border-[#f59e0b]/60 hover:text-[#f59e0b] backdrop-blur-sm"
            >
              Гайды
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <Icon name="ChevronDown" size={28} className="text-[#f59e0b]/60" />
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#f59e0b] text-xs tracking-[0.4em] uppercase mb-3">
            Раздел
          </p>
          <h2 className="font-['Oswald',sans-serif] text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">
            Инструменты
          </h2>
          <div className="mt-4 w-16 h-0.5 bg-[#f59e0b] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="group relative bg-[#1a1510] border border-[#f59e0b]/10 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:border-[#f59e0b]/40 hover:bg-[#1f1a12] hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(245,158,11,0.1)]"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded flex items-center justify-center group-hover:bg-[#f59e0b]/20 transition-colors">
                  <Icon
                    name={tool.icon}
                    size={18}
                    className="text-[#f59e0b]"
                    fallback="Wrench"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white text-sm">
                      {tool.name}
                    </h3>
                    <span className="text-[10px] bg-[#f59e0b]/10 text-[#f59e0b] px-2 py-0.5 rounded-full border border-[#f59e0b]/20 ml-2 flex-shrink-0">
                      {tool.tag}
                    </span>
                  </div>
                  <p className="text-[#f0e8d8]/50 text-xs leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[#f59e0b]/50 text-xs group-hover:text-[#f59e0b] transition-colors">
                <span>Открыть</span>
                <Icon name="ArrowRight" size={12} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GUIDES */}
      <section
        id="guides"
        className="py-24 px-6 bg-[#130f0a] border-t border-b border-[#f59e0b]/10"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#f59e0b] text-xs tracking-[0.4em] uppercase mb-3">
              Раздел
            </p>
            <h2 className="font-['Oswald',sans-serif] text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">
              Гайды
            </h2>
            <div className="mt-4 w-16 h-0.5 bg-[#f59e0b] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GUIDES.map((guide, i) => (
              <div
                key={guide.title}
                className="group flex gap-5 bg-[#1a1510] border border-[#f59e0b]/10 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:border-[#f59e0b]/40 hover:bg-[#1f1a12]"
              >
                <div className="text-3xl flex-shrink-0 mt-1">{guide.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white group-hover:text-[#f59e0b] transition-colors">
                      {guide.title}
                    </h3>
                    <span className="text-xs text-[#f0e8d8]/40 flex-shrink-0 flex items-center gap-1">
                      <Icon name="Clock" size={11} />
                      {guide.time}
                    </span>
                  </div>
                  <p className="text-[#f0e8d8]/50 text-sm leading-relaxed">
                    {guide.desc}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-[#f59e0b]/40 text-xs group-hover:text-[#f59e0b] transition-colors">
                    <span>Читать гайд</span>
                    <Icon name="ArrowRight" size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 px-6 max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#f59e0b] text-xs tracking-[0.4em] uppercase mb-3">
            Раздел
          </p>
          <h2 className="font-['Oswald',sans-serif] text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">
            Контакты
          </h2>
          <div className="mt-4 w-16 h-0.5 bg-[#f59e0b] mx-auto" />
          <p className="mt-6 text-[#f0e8d8]/50 text-sm">
            Есть идеи или нашёл ошибку? Напиши нам!
          </p>
        </div>

        {contactSent ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">⛏️</div>
            <h3 className="font-['Oswald',sans-serif] text-2xl text-[#f59e0b] mb-2">
              Сообщение отправлено!
            </h3>
            <p className="text-[#f0e8d8]/50 text-sm">
              Мы ответим в ближайшее время
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setContactSent(true);
            }}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-2">
                Имя
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Стив"
                required
                className="w-full bg-[#1a1510] border border-[#f59e0b]/20 rounded px-4 py-3 text-[#f0e8d8] text-sm placeholder-[#f0e8d8]/20 focus:outline-none focus:border-[#f59e0b]/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="steve@minecraft.com"
                required
                className="w-full bg-[#1a1510] border border-[#f59e0b]/20 rounded px-4 py-3 text-[#f0e8d8] text-sm placeholder-[#f0e8d8]/20 focus:outline-none focus:border-[#f59e0b]/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-2">
                Сообщение
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Предложение, вопрос или идея..."
                required
                rows={5}
                className="w-full bg-[#1a1510] border border-[#f59e0b]/20 rounded px-4 py-3 text-[#f0e8d8] text-sm placeholder-[#f0e8d8]/20 focus:outline-none focus:border-[#f59e0b]/60 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-[#f59e0b] text-black font-bold text-sm tracking-widest uppercase rounded transition-all duration-300 hover:bg-[#fbbf24] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-95"
            >
              Отправить
            </button>
          </form>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#f59e0b]/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⛏️</span>
            <span className="font-['Oswald',sans-serif] font-bold tracking-widest text-[#f59e0b] text-sm">
              MINEKIT
            </span>
          </div>
          <p className="text-[#f0e8d8]/30 text-xs">
            © 2026 MineKit — Набор инструментов игрока
          </p>
          <div className="flex gap-6">
            {["Инструменты", "Гайды", "Контакты"].map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(sectionIds[l])}
                className="text-xs text-[#f0e8d8]/40 hover:text-[#f59e0b] transition-colors uppercase tracking-wider"
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
