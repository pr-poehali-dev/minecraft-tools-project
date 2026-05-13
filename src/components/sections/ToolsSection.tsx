import Icon from "@/components/ui/icon";
import { CalcXP, CalcEnchant, CalcEndPortal, CalcNether } from "@/components/calculators/Calculators";

const TOOLS_DATA = [
  { id: "xp",     icon: "Star",       name: "Калькулятор XP",            tag: "Опыт",  desc: "Рассчитай сколько XP нужно для нужного уровня",           component: <CalcXP /> },
  { id: "ench",   icon: "Sparkles",   name: "Зачарование предмета",      tag: "Стол",  desc: "Подбери зачарования и узнай стоимость в уровнях",         component: <CalcEnchant /> },
  { id: "end",    icon: "Navigation", name: "Координаты портала в Энд",  tag: "Энд",   desc: "Найди крепость с порталом в Энд по seed через Chunkbase",  component: <CalcEndPortal /> },
  { id: "nether", icon: "Flame",      name: "Ад ↔ Обычный мир",         tag: "Незер", desc: "Конвертируй координаты между Незером и обычным миром",     component: <CalcNether /> },
];

interface ToolsSectionProps {
  openTool: string | null;
  setOpenTool: (id: string | null) => void;
}

export default function ToolsSection({ openTool, setOpenTool }: ToolsSectionProps) {
  return (
    <section id="tools" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-[#f59e0b] text-xs tracking-[0.4em] uppercase mb-3">Раздел</p>
        <h2 className="font-['Oswald',sans-serif] text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">Инструменты</h2>
        <div className="mt-4 w-16 h-0.5 bg-[#f59e0b] mx-auto" />
        <p className="mt-4 text-[#f0e8d8]/40 text-sm">Нажми на карточку, чтобы открыть калькулятор</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TOOLS_DATA.map(tool => (
          <div key={tool.id}
            className="bg-[#1a1510] border border-[#f59e0b]/10 rounded-lg overflow-hidden transition-all duration-300 hover:border-[#f59e0b]/30"
            style={{ alignSelf: "start" }}>
            <button onClick={() => setOpenTool(openTool === tool.id ? null : tool.id)}
              className="w-full flex items-center gap-4 p-5 text-left group">
              <div className="flex-shrink-0 w-10 h-10 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded flex items-center justify-center group-hover:bg-[#f59e0b]/20 transition-colors">
                <Icon name={tool.icon} size={18} className="text-[#f59e0b]" fallback="Wrench" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-white text-sm">{tool.name}</p>
                  <span className="text-[10px] px-1.5 py-0.5 bg-[#f59e0b]/10 text-[#f59e0b]/70 rounded border border-[#f59e0b]/10">{tool.tag}</span>
                </div>
                <p className="text-xs text-[#f0e8d8]/40 truncate">{tool.desc}</p>
              </div>
              <Icon name={openTool === tool.id ? "ChevronUp" : "ChevronDown"} size={16} className="text-[#f59e0b]/40 flex-shrink-0" />
            </button>
            {openTool === tool.id && (
              <div className="px-5 pb-5 border-t border-[#f59e0b]/10 pt-4">
                {tool.component}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
