import { useState } from "react";
import Icon from "@/components/ui/icon";

const NAV_LINKS = ["Главная", "Инструменты", "Гайды", "Контакты"];

// ─── XP Calculator ────────────────────────────────────────────────────────────
function xpForLevel(level: number): number {
  if (level <= 16) return level * level + 6 * level;
  if (level <= 31) return 2.5 * level * level - 40.5 * level + 360;
  return 4.5 * level * level - 162.5 * level + 2220;
}
function xpToNextLevel(level: number): number {
  if (level <= 15) return 2 * level + 7;
  if (level <= 30) return 5 * level - 38;
  return 9 * level - 158;
}

function CalcXP() {
  const [current, setCurrent] = useState("");
  const [target, setTarget] = useState("");
  const currentN = parseInt(current) || 0;
  const targetN = parseInt(target) || 0;
  const diff = targetN > currentN ? xpForLevel(targetN) - xpForLevel(currentN) : null;
  const toNext = xpToNextLevel(currentN);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">Текущий уровень</label>
          <input type="number" min={0} max={200} value={current} onChange={e => setCurrent(e.target.value)}
            placeholder="0" className="w-full bg-[#0f0d0a] border border-[#f59e0b]/20 rounded px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#f59e0b]/60 transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">Цель</label>
          <input type="number" min={0} max={200} value={target} onChange={e => setTarget(e.target.value)}
            placeholder="30" className="w-full bg-[#0f0d0a] border border-[#f59e0b]/20 rounded px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#f59e0b]/60 transition-colors" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
          <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-1">До следующего</p>
          <p className="text-lg font-bold text-[#f59e0b]">{toNext} <span className="text-xs font-normal text-[#f0e8d8]/50">XP</span></p>
        </div>
        <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
          <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-1">До цели</p>
          <p className="text-lg font-bold text-[#f59e0b]">
            {diff !== null ? <>{diff} <span className="text-xs font-normal text-[#f0e8d8]/50">XP</span></> : <span className="text-sm text-[#f0e8d8]/30">—</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Enchantment Calculator ────────────────────────────────────────────────────
// Структура: { название: { maxLevel, incompatibleWith[], lapisCost } }
// Стоимость уровней рассчитывается по формуле: базовый_уровень × выбранный_уровень
type EnchantDef = { maxLevel: number; base: number; incompatible?: string[] };

const ENCHANTS: Record<string, Record<string, EnchantDef>> = {
  Меч: {
    "Острота":         { maxLevel: 5, base: 5, incompatible: ["Иссушение", "Урон по нежити"] },
    "Иссушение":       { maxLevel: 5, base: 5, incompatible: ["Острота", "Урон по нежити"] },
    "Урон по нежити":  { maxLevel: 5, base: 5, incompatible: ["Острота", "Иссушение"] },
    "Отбрасывание":    { maxLevel: 2, base: 4 },
    "Огненный аспект": { maxLevel: 2, base: 6 },
    "Добыча":          { maxLevel: 3, base: 6 },
    "Заметание":       { maxLevel: 3, base: 5 },
    "Неломкость":      { maxLevel: 3, base: 4 },
    "Починка":         { maxLevel: 1, base: 10 },
    "Проклятие несохранения": { maxLevel: 1, base: 2 },
  },
  Кирка: {
    "Эффективность":   { maxLevel: 5, base: 4 },
    "Удача":           { maxLevel: 3, base: 7, incompatible: ["Шёлковое касание"] },
    "Шёлковое касание":{ maxLevel: 1, base: 8, incompatible: ["Удача"] },
    "Неломкость":      { maxLevel: 3, base: 4 },
    "Починка":         { maxLevel: 1, base: 10 },
    "Проклятие несохранения": { maxLevel: 1, base: 2 },
  },
  Лук: {
    "Сила":            { maxLevel: 5, base: 4 },
    "Отдача":          { maxLevel: 2, base: 5 },
    "Пламя":           { maxLevel: 1, base: 6 },
    "Бесконечность":   { maxLevel: 1, base: 10, incompatible: ["Починка"] },
    "Неломкость":      { maxLevel: 3, base: 4 },
    "Починка":         { maxLevel: 1, base: 10, incompatible: ["Бесконечность"] },
    "Проклятие несохранения": { maxLevel: 1, base: 2 },
  },
  Шлем: {
    "Защита":          { maxLevel: 4, base: 4, incompatible: ["Огнестойкость", "Защита от снарядов", "Взрывозащита"] },
    "Огнестойкость":   { maxLevel: 4, base: 4, incompatible: ["Защита", "Защита от снарядов", "Взрывозащита"] },
    "Защита от снарядов": { maxLevel: 4, base: 4, incompatible: ["Защита", "Огнестойкость", "Взрывозащита"] },
    "Взрывозащита":    { maxLevel: 4, base: 4, incompatible: ["Защита", "Огнестойкость", "Защита от снарядов"] },
    "Дыхание":         { maxLevel: 3, base: 6 },
    "Водное сродство": { maxLevel: 1, base: 6 },
    "Шипы":            { maxLevel: 3, base: 5 },
    "Неломкость":      { maxLevel: 3, base: 4 },
    "Починка":         { maxLevel: 1, base: 10 },
    "Проклятие несохранения":   { maxLevel: 1, base: 2 },
    "Проклятие исчезновения":   { maxLevel: 1, base: 2 },
  },
  Нагрудник: {
    "Защита":          { maxLevel: 4, base: 4, incompatible: ["Огнестойкость", "Защита от снарядов", "Взрывозащита"] },
    "Огнестойкость":   { maxLevel: 4, base: 4, incompatible: ["Защита", "Защита от снарядов", "Взрывозащита"] },
    "Защита от снарядов": { maxLevel: 4, base: 4, incompatible: ["Защита", "Огнестойкость", "Взрывозащита"] },
    "Взрывозащита":    { maxLevel: 4, base: 4, incompatible: ["Защита", "Огнестойкость", "Защита от снарядов"] },
    "Шипы":            { maxLevel: 3, base: 5 },
    "Неломкость":      { maxLevel: 3, base: 4 },
    "Починка":         { maxLevel: 1, base: 10 },
    "Проклятие несохранения":   { maxLevel: 1, base: 2 },
    "Проклятие исчезновения":   { maxLevel: 1, base: 2 },
  },
  Поножи: {
    "Защита":          { maxLevel: 4, base: 4, incompatible: ["Огнестойкость", "Защита от снарядов", "Взрывозащита"] },
    "Огнестойкость":   { maxLevel: 4, base: 4, incompatible: ["Защита", "Защита от снарядов", "Взрывозащита"] },
    "Защита от снарядов": { maxLevel: 4, base: 4, incompatible: ["Защита", "Огнестойкость", "Взрывозащита"] },
    "Взрывозащита":    { maxLevel: 4, base: 4, incompatible: ["Защита", "Огнестойкость", "Защита от снарядов"] },
    "Шипы":            { maxLevel: 3, base: 5 },
    "Быстрые ноги":    { maxLevel: 3, base: 4 },
    "Неломкость":      { maxLevel: 3, base: 4 },
    "Починка":         { maxLevel: 1, base: 10 },
    "Проклятие несохранения":   { maxLevel: 1, base: 2 },
    "Проклятие исчезновения":   { maxLevel: 1, base: 2 },
  },
  Ботинки: {
    "Защита":          { maxLevel: 4, base: 4, incompatible: ["Огнестойкость", "Защита от снарядов", "Взрывозащита"] },
    "Огнестойкость":   { maxLevel: 4, base: 4, incompatible: ["Защита", "Защита от снарядов", "Взрывозащита"] },
    "Защита от снарядов": { maxLevel: 4, base: 4, incompatible: ["Защита", "Огнестойкость", "Взрывозащита"] },
    "Взрывозащита":    { maxLevel: 4, base: 4, incompatible: ["Защита", "Огнестойкость", "Защита от снарядов"] },
    "Шипы":            { maxLevel: 3, base: 5 },
    "Хождение по воде":{ maxLevel: 3, base: 6 },
    "Мягкое падение":  { maxLevel: 4, base: 4 },
    "Ледяная поступь": { maxLevel: 2, base: 4 },
    "Неломкость":      { maxLevel: 3, base: 4 },
    "Починка":         { maxLevel: 1, base: 10 },
    "Проклятие несохранения":   { maxLevel: 1, base: 2 },
    "Проклятие исчезновения":   { maxLevel: 1, base: 2 },
  },
};

const ROMAN = ["", "I", "II", "III", "IV", "V"];
const ITEM_ICONS: Record<string, string> = {
  Меч: "⚔️", Кирка: "⛏️", Лук: "🏹",
  Шлем: "🪖", Нагрудник: "🛡️", Поножи: "🩲", Ботинки: "👟",
};

function CalcEnchant() {
  const [item, setItem] = useState("Меч");
  const [selected, setSelected] = useState<Record<string, number>>({});

  const enchants = ENCHANTS[item] || {};

  const isDisabled = (name: string) => {
    const def = enchants[name];
    if (!def?.incompatible) return false;
    return def.incompatible.some(inc => selected[inc] !== undefined);
  };

  const toggle = (name: string) => {
    setSelected(prev => {
      if (prev[name] !== undefined) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      if (isDisabled(name)) return prev;
      return { ...prev, [name]: enchants[name].maxLevel };
    });
  };

  const setLevel = (name: string, level: number) => {
    setSelected(prev => ({ ...prev, [name]: level }));
  };

  const switchItem = (it: string) => { setItem(it); setSelected({}); };

  const totalLevels = Object.entries(selected).reduce((acc, [name, lvl]) => {
    return acc + (enchants[name]?.base || 0) * lvl;
  }, 0);

  const totalLapis = Object.keys(selected).length * 3;
  const clampedLevels = Math.min(totalLevels, 30);

  return (
    <div className="space-y-4">
      {/* Item selector */}
      <div>
        <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">Предмет</label>
        <div className="grid grid-cols-4 gap-1.5 mb-1">
          {["Меч", "Кирка", "Лук"].map(it => (
            <button key={it} onClick={() => switchItem(it)}
              className={`py-1.5 text-xs rounded border transition-colors flex items-center justify-center gap-1 ${item === it ? "bg-[#f59e0b] text-black border-[#f59e0b] font-bold" : "border-[#f59e0b]/20 text-[#f0e8d8]/60 hover:border-[#f59e0b]/50"}`}>
              <span>{ITEM_ICONS[it]}</span> {it}
            </button>
          ))}
          <div />
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {["Шлем", "Нагрудник", "Поножи", "Ботинки"].map(it => (
            <button key={it} onClick={() => switchItem(it)}
              className={`py-1.5 text-xs rounded border transition-colors flex items-center justify-center gap-1 ${item === it ? "bg-[#f59e0b] text-black border-[#f59e0b] font-bold" : "border-[#f59e0b]/20 text-[#f0e8d8]/60 hover:border-[#f59e0b]/50"}`}>
              <span>{ITEM_ICONS[it]}</span> {it}
            </button>
          ))}
        </div>
      </div>

      {/* Enchantments list */}
      <div>
        <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">Зачарования</label>
        <div className="space-y-1.5">
          {Object.entries(enchants).map(([name, def]) => {
            const checked = selected[name] !== undefined;
            const disabled = !checked && isDisabled(name);
            const curLevel = selected[name] ?? def.maxLevel;
            return (
              <div key={name} className={`rounded border transition-colors ${disabled ? "border-[#f59e0b]/5 opacity-40" : checked ? "border-[#f59e0b]/50 bg-[#f59e0b]/5" : "border-[#f59e0b]/10 hover:border-[#f59e0b]/30"}`}>
                <label className={`flex items-center gap-3 px-3 py-2 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
                  <input type="checkbox" checked={checked} disabled={disabled}
                    onChange={() => toggle(name)} className="accent-[#f59e0b] flex-shrink-0" />
                  <span className={`text-sm flex-1 ${checked ? "text-[#f0e8d8]" : "text-[#f0e8d8]/70"}`}>{name}</span>
                  {def.maxLevel > 1 ? (
                    <span className="text-xs text-[#f59e0b]/50">макс {ROMAN[def.maxLevel]}</span>
                  ) : (
                    <span className="text-xs text-[#f59e0b]/50">I</span>
                  )}
                </label>
                {/* Level selector — показываем только если чара выбрана и макс уровень > 1 */}
                {checked && def.maxLevel > 1 && (
                  <div className="px-3 pb-2 flex items-center gap-1.5">
                    <span className="text-[10px] text-[#f0e8d8]/40 mr-1">Уровень:</span>
                    {Array.from({ length: def.maxLevel }, (_, i) => i + 1).map(lvl => (
                      <button key={lvl} onClick={() => setLevel(name, lvl)}
                        className={`w-7 h-6 text-xs rounded border transition-colors ${curLevel === lvl ? "bg-[#f59e0b] text-black border-[#f59e0b] font-bold" : "border-[#f59e0b]/20 text-[#f0e8d8]/50 hover:border-[#f59e0b]/50"}`}>
                        {ROMAN[lvl]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {Object.keys(selected).length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
              <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-1">Уровней XP</p>
              <p className="text-lg font-bold text-[#f59e0b]">{clampedLevels}</p>
            </div>
            <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
              <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-1">Лазурит</p>
              <p className="text-lg font-bold text-[#f59e0b]">{totalLapis}</p>
            </div>
            <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
              <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-1">Чар выбрано</p>
              <p className="text-lg font-bold text-[#f59e0b]">{Object.keys(selected).length}</p>
            </div>
          </div>
          {/* Selected summary */}
          <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
            <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-2">Итоговый набор</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(selected).map(([name, lvl]) => (
                <span key={name} className="text-xs bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] px-2 py-0.5 rounded-full">
                  {name} {ENCHANTS[item][name]?.maxLevel > 1 ? ROMAN[lvl] : ""}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── End Portal Calculator ─────────────────────────────────────────────────────
function CalcEndPortal() {
  const [ex, setEx] = useState("");
  const [ez, setEz] = useState("");

  const x = parseFloat(ex);
  const z = parseFloat(ez);

  const hasCoords = !isNaN(x) && !isNaN(z) && ex !== "" && ez !== "";
  const dist = hasCoords ? Math.round(Math.sqrt(x * x + z * z)) : null;
  const angleDeg = hasCoords ? Math.round(Math.atan2(z, x) * 180 / Math.PI) : null;

  const dirLabel = (deg: number) => {
    const dirs = ["Восток", "Северо-восток", "Север", "Северо-запад", "Запад", "Юго-запад", "Юг", "Юго-восток"];
    const idx = Math.round(((deg % 360) + 360) % 360 / 45) % 8;
    return dirs[idx];
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#f0e8d8]/40 leading-relaxed">
        Брось глаз эндера и запомни свои координаты X и Z. Введи их ниже — калькулятор покажет расстояние до крепости.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">Моя X</label>
          <input type="number" value={ex} onChange={e => setEx(e.target.value)}
            placeholder="0" className="w-full bg-[#0f0d0a] border border-[#f59e0b]/20 rounded px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#f59e0b]/60 transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">Моя Z</label>
          <input type="number" value={ez} onChange={e => setEz(e.target.value)}
            placeholder="0" className="w-full bg-[#0f0d0a] border border-[#f59e0b]/20 rounded px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#f59e0b]/60 transition-colors" />
        </div>
      </div>
      {hasCoords && dist !== null && angleDeg !== null ? (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
              <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-1">Расстояние</p>
              <p className="text-lg font-bold text-[#f59e0b]">{dist} <span className="text-xs font-normal text-[#f0e8d8]/40">бл.</span></p>
            </div>
            <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
              <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-1">Угол</p>
              <p className="text-lg font-bold text-[#f59e0b]">{angleDeg}°</p>
            </div>
            <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
              <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-1">Сторона</p>
              <p className="text-sm font-bold text-[#f59e0b]">{dirLabel(angleDeg)}</p>
            </div>
          </div>
          <div className="bg-[#1a1510] border border-[#f59e0b]/20 rounded p-3 text-xs text-[#f0e8d8]/50 leading-relaxed">
            Иди на <span className="text-[#f59e0b]">{dirLabel(angleDeg)}</span> ~<span className="text-[#f59e0b]">{dist}</span> блоков. Бросай глаза каждые 50–100 блоков для уточнения.
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ─── Nether / Overworld Calculator ────────────────────────────────────────────
function CalcNether() {
  const [mode, setMode] = useState<"nether" | "overworld">("overworld");
  const [ix, setIx] = useState("");
  const [iz, setIz] = useState("");

  const x = parseFloat(ix);
  const z = parseFloat(iz);
  const valid = !isNaN(x) && !isNaN(z) && ix !== "" && iz !== "";

  const rx = mode === "overworld" ? Math.round(x / 8) : Math.round(x * 8);
  const rz = mode === "overworld" ? Math.round(z / 8) : Math.round(z * 8);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">У меня координаты из</label>
        <div className="grid grid-cols-2 gap-2">
          {(["overworld", "nether"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`py-2 text-xs rounded border transition-colors ${mode === m ? "bg-[#f59e0b] text-black border-[#f59e0b] font-bold" : "border-[#f59e0b]/20 text-[#f0e8d8]/60 hover:border-[#f59e0b]/50"}`}>
              {m === "overworld" ? "🌍 Обычный мир" : "🔥 Ад (Незер)"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">X</label>
          <input type="number" value={ix} onChange={e => setIx(e.target.value)}
            placeholder="0" className="w-full bg-[#0f0d0a] border border-[#f59e0b]/20 rounded px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#f59e0b]/60 transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">Z</label>
          <input type="number" value={iz} onChange={e => setIz(e.target.value)}
            placeholder="0" className="w-full bg-[#0f0d0a] border border-[#f59e0b]/20 rounded px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#f59e0b]/60 transition-colors" />
        </div>
      </div>
      {valid && (
        <div className="space-y-2">
          <div className="bg-[#0f0d0a] border border-[#f59e0b]/20 rounded p-4">
            <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-2">
              Координаты в {mode === "overworld" ? "Незере" : "Обычном мире"}
            </p>
            <p className="text-xl font-bold text-[#f59e0b] font-['Oswald',sans-serif] tracking-wider">
              X: {rx} &nbsp;·&nbsp; Z: {rz}
            </p>
          </div>
          <p className="text-xs text-[#f0e8d8]/30 px-1">
            {mode === "overworld"
              ? "Построй портал в Незере на этих X/Z — он свяжется с твоей точкой в обычном мире."
              : "При выходе из портала ты окажешься на этих координатах в обычном мире."}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Tools config ─────────────────────────────────────────────────────────────
const TOOLS = [
  { id: "xp", icon: "Star", name: "Калькулятор XP", tag: "Опыт", desc: "Сколько опыта нужно для нужного уровня", component: <CalcXP /> },
  { id: "enchant", icon: "Sparkles", name: "Зачарование предмета", tag: "Магия", desc: "Подбери зачарования и узнай нужные уровни и лазурит", component: <CalcEnchant /> },
  { id: "end", icon: "Navigation", name: "Координаты портала в Край", tag: "Край", desc: "Найди крепость по своим координатам и глазу эндера", component: <CalcEndPortal /> },
  { id: "nether", icon: "Flame", name: "Ад ↔ Обычный мир", tag: "Незер", desc: "Конвертируй координаты между Незером и обычным миром", component: <CalcNether /> },
];

// ─── Guides ───────────────────────────────────────────────────────────────────
const GUIDES = [
  {
    icon: "⭐",
    title: "Как пользоваться калькулятором XP",
    body: `Калькулятор XP помогает понять, сколько очков опыта нужно для нужного уровня.

Введи текущий уровень персонажа и целевой уровень. Калькулятор покажет:
• Сколько XP нужно до следующего уровня
• Общий XP от текущего до целевого уровня

Совет: уровень 30 — оптимальный для максимальных зачарований за столом зачарований. Фармить XP лучше всего в ферме мобов или в Незере.`,
  },
  {
    icon: "✨",
    title: "Как пользоваться калькулятором зачарований",
    body: `Выбери тип предмета (Меч, Кирка, Броня или Лук) и отметь нужные зачарования.

Калькулятор покажет:
• Суммарные уровни опыта — столько нужно иметь на персонаже
• Примерное количество лазурита (lapis lazuli)

Совет: комбинируй зачарования через наковальню с книгами — это дешевле. Книги с зачарованиями можно найти в сундуках крепостей и деревень.`,
  },
  {
    icon: "🌀",
    title: "Поиск портала в Край: как работает расчёт",
    body: `Портал в Край находится в крепости под землёй. Чтобы найти её:

1. Возьми глаза эндера (крафт: жемчуг эндера + зелье огня)
2. Брось глаз — он полетит в сторону крепости
3. Запомни свои X и Z в момент броска
4. Введи координаты в калькулятор

Как работает расчёт: крепости генерируются кольцами вокруг X:0, Z:0. Калькулятор вычисляет вектор от тебя до ближайшей зоны спавна и показывает расстояние и направление. Бросай глаза каждые 100 блоков — чем ближе, тем точнее.`,
  },
  {
    icon: "🔥",
    title: "Конвертер координат Незер ↔ Мир",
    body: `Каждый блок в Незере = 8 блоков в обычном мире. Это делает Незер идеальным для быстрых путешествий.

Как использовать калькулятор:
• Выбери «Обычный мир» → введи координаты точки назначения → получи где строить портал в Незере
• Выбери «Ад» → введи свои координаты в Незере → узнай куда выйдешь в обычном мире

Важно: Y-координата НЕ пересчитывается — строй порталы на высоте Y 60–90 в Незере. Координаты X и Z просто делятся или умножаются на 8.`,
  },
];

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function Index() {
  const [activeSection, setActiveSection] = useState("Главная");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openTool, setOpenTool] = useState<string | null>(null);
  const [openGuide, setOpenGuide] = useState<number | null>(null);

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
                className={`text-sm font-medium tracking-wider uppercase transition-all duration-200 hover:text-[#f59e0b] ${activeSection === link ? "text-[#f59e0b]" : "text-[#f0e8d8]/70"}`}>
                {link}
              </button>
            ))}
          </div>
          <button className="md:hidden text-[#f0e8d8]" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-black/90 border-t border-[#f59e0b]/20 px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map(link => (
              <button key={link} onClick={() => { setActiveSection(link); scrollTo(sectionIds[link]); }}
                className="text-left text-sm font-medium tracking-wider uppercase text-[#f0e8d8]/80 hover:text-[#f59e0b] transition-colors">
                {link}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
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
            <button onClick={() => scrollTo("tools")}
              className="px-8 py-4 bg-[#f59e0b] text-black font-bold text-sm tracking-widest uppercase rounded transition-all duration-300 hover:bg-[#fbbf24] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] active:scale-95">
              Инструменты
            </button>
            <button onClick={() => scrollTo("guides")}
              className="px-8 py-4 border border-[#f0e8d8]/30 text-[#f0e8d8] font-medium text-sm tracking-widest uppercase rounded transition-all duration-300 hover:border-[#f59e0b]/60 hover:text-[#f59e0b] backdrop-blur-sm">
              Гайды
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <Icon name="ChevronDown" size={28} className="text-[#f59e0b]/60" />
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#f59e0b] text-xs tracking-[0.4em] uppercase mb-3">Раздел</p>
          <h2 className="font-['Oswald',sans-serif] text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">Инструменты</h2>
          <div className="mt-4 w-16 h-0.5 bg-[#f59e0b] mx-auto" />
          <p className="mt-4 text-[#f0e8d8]/40 text-sm">Нажми на карточку, чтобы открыть калькулятор</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOOLS.map(tool => (
            <div key={tool.id} className="bg-[#1a1510] border border-[#f59e0b]/10 rounded-lg overflow-hidden transition-all duration-300 hover:border-[#f59e0b]/30">
              <button onClick={() => setOpenTool(openTool === tool.id ? null : tool.id)}
                className="w-full flex items-center gap-4 p-5 text-left group">
                <div className="flex-shrink-0 w-10 h-10 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded flex items-center justify-center group-hover:bg-[#f59e0b]/20 transition-colors">
                  <Icon name={tool.icon} size={18} className="text-[#f59e0b]" fallback="Wrench" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-white text-sm">{tool.name}</span>
                    <span className="text-[10px] bg-[#f59e0b]/10 text-[#f59e0b] px-2 py-0.5 rounded-full border border-[#f59e0b]/20">{tool.tag}</span>
                  </div>
                  <p className="text-[#f0e8d8]/40 text-xs">{tool.desc}</p>
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

      {/* GUIDES */}
      <section id="guides" className="py-24 px-6 bg-[#130f0a] border-t border-b border-[#f59e0b]/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#f59e0b] text-xs tracking-[0.4em] uppercase mb-3">Раздел</p>
            <h2 className="font-['Oswald',sans-serif] text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">Гайды</h2>
            <div className="mt-4 w-16 h-0.5 bg-[#f59e0b] mx-auto" />
          </div>
          <div className="space-y-4">
            {GUIDES.map((guide, i) => (
              <div key={i} className="bg-[#1a1510] border border-[#f59e0b]/10 rounded-lg overflow-hidden transition-all duration-300 hover:border-[#f59e0b]/30">
                <button onClick={() => setOpenGuide(openGuide === i ? null : i)}
                  className="w-full flex items-center gap-4 p-5 text-left">
                  <span className="text-2xl flex-shrink-0">{guide.icon}</span>
                  <span className="flex-1 font-semibold text-white text-sm">{guide.title}</span>
                  <Icon name={openGuide === i ? "ChevronUp" : "ChevronDown"} size={16} className="text-[#f59e0b]/40 flex-shrink-0" />
                </button>
                {openGuide === i && (
                  <div className="px-5 pb-5 border-t border-[#f59e0b]/10 pt-4">
                    <div className="text-sm text-[#f0e8d8]/60 leading-relaxed whitespace-pre-line">
                      {guide.body}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 px-6 max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#f59e0b] text-xs tracking-[0.4em] uppercase mb-3">Раздел</p>
          <h2 className="font-['Oswald',sans-serif] text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">Контакты</h2>
          <div className="mt-4 w-16 h-0.5 bg-[#f59e0b] mx-auto" />
          <p className="mt-6 text-[#f0e8d8]/50 text-sm">Присоединяйся к сообществу или напиши нам</p>
        </div>

        <a href="https://t.me/+diThugKNH0o4ZTIy" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-4 p-6 bg-[#1a1510] border border-[#f59e0b]/10 rounded-lg mb-6 transition-all duration-300 hover:border-[#229ed9]/50 hover:bg-[#1a1f25] group">
          <div className="w-12 h-12 bg-[#229ed9]/10 border border-[#229ed9]/30 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#229ed9]/20 transition-colors">
            <span className="text-2xl">✈️</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white mb-0.5 group-hover:text-[#229ed9] transition-colors">Telegram-канал MineKit</p>
            <p className="text-sm text-[#f0e8d8]/40">Обновления, советы и общение с игроками</p>
          </div>
          <Icon name="ArrowRight" size={18} className="text-[#f0e8d8]/20 group-hover:text-[#229ed9] transition-colors" />
        </a>

        <div className="bg-[#1a1510] border border-[#f59e0b]/10 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded flex items-center justify-center">
              <Icon name="Lightbulb" size={15} className="text-[#f59e0b]" />
            </div>
            <p className="font-semibold text-white text-sm">Есть идеи?</p>
          </div>
          <p className="text-sm text-[#f0e8d8]/50 leading-relaxed mb-4">
            Пиши идеи для новых калькуляторов и гайдов — добавляем инструменты по запросам игроков.
          </p>
          <a href="https://t.me/+diThugKNH0o4ZTIy" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f59e0b] text-black font-bold text-xs tracking-widest uppercase rounded transition-all duration-300 hover:bg-[#fbbf24] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <span>Написать в Telegram</span>
            <Icon name="ArrowRight" size={14} />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#f59e0b]/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⛏️</span>
            <span className="font-['Oswald',sans-serif] font-bold tracking-widest text-[#f59e0b] text-sm">MINEKIT</span>
          </div>
          <p className="text-[#f0e8d8]/30 text-xs">© 2026 MineKit — Набор инструментов игрока</p>
          <div className="flex gap-6">
            {["Инструменты", "Гайды", "Контакты"].map(l => (
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