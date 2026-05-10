import { useState, useEffect, useRef, useCallback } from "react";
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
type EnchantDef = { maxLevel: number; base: number; incompatible?: string[] };

const UNB  = { "Прочность":  { maxLevel: 3, base: 4 } as EnchantDef };
const MEND = { "Починка":    { maxLevel: 1, base: 10 } as EnchantDef };

const mkProt = (): Record<string, EnchantDef> => ({
  "Защита":               { maxLevel: 4, base: 4, incompatible: ["Огнестойкость","Взрывоустойчивость","Защита от снарядов"] },
  "Огнестойкость":        { maxLevel: 4, base: 4, incompatible: ["Защита","Взрывоустойчивость","Защита от снарядов"] },
  "Взрывоустойчивость":   { maxLevel: 4, base: 4, incompatible: ["Защита","Огнестойкость","Защита от снарядов"] },
  "Защита от снарядов":   { maxLevel: 4, base: 4, incompatible: ["Защита","Огнестойкость","Взрывоустойчивость"] },
});

const THORNS: Record<string, EnchantDef> = { "Шипы": { maxLevel: 3, base: 5 } };

const ENCHANTS: Record<string, Record<string, EnchantDef>> = {
  // ── ОРУЖИЕ ──────────────────────────────────────────────────────────────────
  "Меч": {
    "Острота":                  { maxLevel: 5, base: 5, incompatible: ["Небесная кара","Бич членистоногих"] },
    "Небесная кара":            { maxLevel: 5, base: 5, incompatible: ["Острота","Бич членистоногих"] },
    "Бич членистоногих":        { maxLevel: 5, base: 5, incompatible: ["Острота","Небесная кара"] },
    "Отбрасывание":             { maxLevel: 2, base: 4 },
    "Заговор огня":             { maxLevel: 2, base: 6 },
    "Добыча":                   { maxLevel: 3, base: 6 },
    "Разящий клинок":           { maxLevel: 3, base: 5 },
    ...UNB, ...MEND,
  },
  "Топор": {
    "Острота":                  { maxLevel: 5, base: 5, incompatible: ["Небесная кара","Бич членистоногих"] },
    "Небесная кара":            { maxLevel: 5, base: 5, incompatible: ["Острота","Бич членистоногих"] },
    "Бич членистоногих":        { maxLevel: 5, base: 5, incompatible: ["Острота","Небесная кара"] },
    "Эффективность":            { maxLevel: 5, base: 4 },
    "Удача":                    { maxLevel: 3, base: 7, incompatible: ["Шёлковое касание"] },
    "Шёлковое касание":         { maxLevel: 1, base: 8, incompatible: ["Удача"] },
    ...UNB, ...MEND,
  },
  "Трезубец": {
    "Верность":                 { maxLevel: 3, base: 5, incompatible: ["Тягун"] },
    "Тягун":                    { maxLevel: 3, base: 5, incompatible: ["Верность"] },
    ...UNB, ...MEND,
  },
  "Копьё": {
    "Острота":                  { maxLevel: 5, base: 5, incompatible: ["Небесная кара","Бич членистоногих"] },
    "Небесная кара":            { maxLevel: 5, base: 5, incompatible: ["Острота","Бич членистоногих"] },
    "Бич членистоногих":        { maxLevel: 5, base: 5, incompatible: ["Острота","Небесная кара"] },
    "Заговор огня":             { maxLevel: 2, base: 6 },
    "Отбрасывание":             { maxLevel: 2, base: 4 },
    "Рывок":                    { maxLevel: 3, base: 5 },
    "Добыча":                   { maxLevel: 3, base: 6 },
    ...UNB, ...MEND,
  },
  "Булава": {
    "Плотность":                { maxLevel: 5, base: 5, incompatible: ["Небесная кара","Бич членистоногих","Пробитие"] },
    "Небесная кара":            { maxLevel: 5, base: 5, incompatible: ["Плотность","Бич членистоногих","Пробитие"] },
    "Бич членистоногих":        { maxLevel: 5, base: 5, incompatible: ["Плотность","Небесная кара","Пробитие"] },
    "Заговор огня":             { maxLevel: 2, base: 6 },
    "Порыв ветра":              { maxLevel: 3, base: 5 },
    "Пробитие":                 { maxLevel: 5, base: 4, incompatible: ["Плотность","Небесная кара","Бич членистоногих"] },
    ...UNB, ...MEND,
  },
  // ── ИНСТРУМЕНТЫ ─────────────────────────────────────────────────────────────
  "Кирка": {
    "Эффективность":        { maxLevel: 5, base: 4 },
    "Удача":                { maxLevel: 3, base: 7, incompatible: ["Шёлковое касание"] },
    "Шёлковое касание":     { maxLevel: 1, base: 8, incompatible: ["Удача"] },
    ...UNB, ...MEND,
  },
  "Лопата": {
    "Эффективность":        { maxLevel: 5, base: 4 },
    "Удача":                { maxLevel: 3, base: 7, incompatible: ["Шёлковое касание"] },
    "Шёлковое касание":     { maxLevel: 1, base: 8, incompatible: ["Удача"] },
    ...UNB, ...MEND,
  },
  "Мотыга": {
    "Эффективность":        { maxLevel: 5, base: 4 },
    "Удача":                { maxLevel: 3, base: 7, incompatible: ["Шёлковое касание"] },
    "Шёлковое касание":     { maxLevel: 1, base: 8, incompatible: ["Удача"] },
    ...UNB, ...MEND,
  },
  "Ножницы": {
    "Эффективность":        { maxLevel: 5, base: 4 },
    "Удача":                { maxLevel: 3, base: 7, incompatible: ["Шёлковое касание"] },
    "Шёлковое касание":     { maxLevel: 1, base: 8, incompatible: ["Удача"] },
    ...UNB, ...MEND,
  },
  "Удочка": {
    "Приманка":             { maxLevel: 3, base: 6, incompatible: ["Везучий рыбак"] },
    "Везучий рыбак":        { maxLevel: 3, base: 6, incompatible: ["Приманка"] },
    ...UNB, ...MEND,
  },
  // ── ДАЛЬНОБОЙНОЕ ────────────────────────────────────────────────────────────
  "Лук": {
    "Сила":                 { maxLevel: 5, base: 4 },
    "Откидывание":          { maxLevel: 2, base: 5 },
    "Воспламенение":        { maxLevel: 1, base: 6 },
    "Бесконечность":        { maxLevel: 1, base: 10, incompatible: ["Починка"] },
    ...UNB,
    "Починка":              { maxLevel: 1, base: 10, incompatible: ["Бесконечность"] },
  },
  "Арбалет": {
    "Быстрая перезарядка":  { maxLevel: 3, base: 5 },
    "Тройной выстрел":      { maxLevel: 1, base: 8, incompatible: ["Пронзающая стрела"] },
    "Пронзающая стрела":    { maxLevel: 4, base: 5, incompatible: ["Тройной выстрел"] },
    ...UNB, ...MEND,
  },
  // ── БРОНЯ ───────────────────────────────────────────────────────────────────
  "Шлем": {
    ...mkProt(),
    "Подводное дыхание":    { maxLevel: 3, base: 6 },
    "Подводник":            { maxLevel: 1, base: 6 },
    ...THORNS, ...UNB, ...MEND,
  },
  "Нагрудник": {
    ...mkProt(),
    ...THORNS, ...UNB, ...MEND,
  },
  "Поножи": {
    ...mkProt(),
    "Проворство":           { maxLevel: 3, base: 4 },
    ...THORNS, ...UNB, ...MEND,
  },
  "Ботинки": {
    ...mkProt(),
    "Подводная ходьба":     { maxLevel: 3, base: 5 },
    "Невесомость":          { maxLevel: 4, base: 4 },
    "Ледоход":              { maxLevel: 2, base: 4 },
    "Скорость души":        { maxLevel: 3, base: 4 },
    ...THORNS, ...UNB, ...MEND,
  },
  // ── ДРУГОЕ ──────────────────────────────────────────────────────────────────
  "Элитры": {
    ...UNB, ...MEND,
  },
  "Щит": {
    ...UNB, ...MEND,
  },
};

const ITEM_GROUPS: { label: string; items: string[] }[] = [
  { label: "Оружие",       items: ["Меч", "Топор", "Трезубец", "Копьё", "Булава"] },
  { label: "Инструменты",  items: ["Кирка", "Лопата", "Мотыга", "Ножницы", "Удочка"] },
  { label: "Дальнобой",    items: ["Лук", "Арбалет"] },
  { label: "Броня",        items: ["Шлем", "Нагрудник", "Поножи", "Ботинки"] },
  { label: "Другое",       items: ["Элитры", "Щит"] },
];

const ITEM_ICONS: Record<string, string> = {
  Меч: "⚔️", Топор: "🪓", Трезубец: "🔱", "Копьё": "🗡️", Булава: "🏏",
  Кирка: "⛏️", Лопата: "🪣", Мотыга: "🌾", Ножницы: "✂️", Удочка: "🎣",
  Лук: "🏹", Арбалет: "🎯",
  Шлем: "🪖", Нагрудник: "🛡️", Поножи: "🩲", Ботинки: "👟",
  Элитры: "🪂", Щит: "🔰",
};

const ROMAN = ["", "I", "II", "III", "IV", "V"];
const LS_ITEM = "mk_ench_item";
const LS_SEL  = "mk_ench_sel";

function CalcEnchant() {
  const [item, setItem] = useState<string>(() => localStorage.getItem(LS_ITEM) || "Меч");
  const [selected, setSelected] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem(LS_SEL) || "{}"); } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem(LS_ITEM, item); }, [item]);
  useEffect(() => { localStorage.setItem(LS_SEL, JSON.stringify(selected)); }, [selected]);

  const enchants = ENCHANTS[item] || {};

  const isDisabled = (name: string) => {
    const def = enchants[name];
    if (!def?.incompatible) return false;
    return def.incompatible.some(inc => selected[inc] !== undefined);
  };

  const toggle = (name: string) => {
    setSelected(prev => {
      if (prev[name] !== undefined) {
        const next = { ...prev }; delete next[name]; return next;
      }
      if (isDisabled(name)) return prev;
      return { ...prev, [name]: enchants[name].maxLevel };
    });
  };

  const setLevel = (name: string, level: number) => {
    setSelected(prev => ({ ...prev, [name]: level }));
  };

  const switchItem = (it: string) => { setItem(it); setSelected({}); };
  const clearAll = () => setSelected({});

  const totalLevels = Object.entries(selected).reduce((acc, [name, lvl]) => {
    return acc + (enchants[name]?.base || 0) * lvl;
  }, 0);
  const totalLapis = Object.keys(selected).length * 3;
  const clampedLevels = Math.min(totalLevels, 30);
  const hasSelected = Object.keys(selected).length > 0;

  return (
    <div className="space-y-4">
      {/* Item groups */}
      <div className="space-y-2">
        <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider">Предмет</label>
        {ITEM_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-[10px] text-[#f0e8d8]/30 uppercase tracking-widest mb-1">{group.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map(it => (
                <button key={it} onClick={() => switchItem(it)}
                  className={`py-1 px-2.5 text-xs rounded border transition-colors flex items-center gap-1 ${item === it ? "bg-[#f59e0b] text-black border-[#f59e0b] font-bold" : "border-[#f59e0b]/20 text-[#f0e8d8]/60 hover:border-[#f59e0b]/50"}`}>
                  <span>{ITEM_ICONS[it]}</span>{it}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Header: title + clear button */}
      <div className="flex items-center justify-between">
        <label className="text-xs text-[#f0e8d8]/50 uppercase tracking-wider">
          Зачарования <span className="text-[#f0e8d8]/30 normal-case font-normal">— {ITEM_ICONS[item]} {item}</span>
        </label>
        {hasSelected && (
          <button onClick={clearAll}
            className="flex items-center gap-1 text-xs text-[#f0e8d8]/40 hover:text-red-400 border border-[#f59e0b]/10 hover:border-red-400/30 rounded px-2 py-0.5 transition-colors">
            <Icon name="X" size={10} />
            Очистить
          </button>
        )}
      </div>

      {/* Enchantments list */}
      <div className="space-y-1.5">
        {Object.entries(enchants).map(([name, def]) => {
          const checked = selected[name] !== undefined;
          const disabled = !checked && isDisabled(name);
          const curLevel = selected[name] ?? def.maxLevel;
          return (
            <div key={name} className={`rounded border transition-colors ${disabled ? "border-[#f59e0b]/5 opacity-35" : checked ? "border-[#f59e0b]/50 bg-[#f59e0b]/5" : "border-[#f59e0b]/10 hover:border-[#f59e0b]/30"}`}>
              <label className={`flex items-center gap-3 px-3 py-2 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
                <input type="checkbox" checked={checked} disabled={disabled}
                  onChange={() => toggle(name)} className="accent-[#f59e0b] flex-shrink-0" />
                <span className={`text-sm flex-1 ${checked ? "text-[#f0e8d8]" : "text-[#f0e8d8]/70"}`}>{name}</span>
                <span className="text-xs text-[#f59e0b]/40 flex-shrink-0">
                  {def.maxLevel > 1 ? `макс ${ROMAN[def.maxLevel]}` : "I"}
                </span>
              </label>
              {checked && def.maxLevel > 1 && (
                <div className="px-3 pb-2 flex items-center gap-1.5 flex-wrap">
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

      {/* Results */}
      {hasSelected && (
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
          <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
            <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-2">Итоговый набор</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(selected).map(([name, lvl]) => (
                <span key={name} className="text-xs bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] px-2 py-0.5 rounded-full">
                  {name}{ENCHANTS[item][name]?.maxLevel > 1 ? ` ${ROMAN[lvl]}` : ""}
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
    return dirs[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
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
      {hasCoords && dist !== null && angleDeg !== null && (
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
      )}
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

  // Погрешность: 1 блок в незере = 8 блоков в мире, значит округление даёт ±4 блока в мире (или ±0.5 в незере)
  const errWorld = mode === "overworld" ? 4 : 0.5;
  const errLabel = mode === "overworld"
    ? `±${errWorld} блока в обычном мире`
    : `±${errWorld} блока в Незере`;

  const inputLabel = mode === "overworld" ? "Обычный мир" : "Ад (Незер)";
  const outputLabel = mode === "overworld" ? "Ад (Незер)" : "Обычный мир";

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">У меня координаты из</label>
        <div className="grid grid-cols-2 gap-2">
          {(["overworld", "nether"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`py-1.5 text-xs rounded border transition-colors ${mode === m ? "bg-[#f59e0b] text-black border-[#f59e0b] font-bold" : "border-[#f59e0b]/20 text-[#f0e8d8]/60 hover:border-[#f59e0b]/50"}`}>
              {m === "overworld" ? "Обычный мир" : "Ад (Незер)"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">{inputLabel} X</label>
          <input type="number" value={ix} onChange={e => setIx(e.target.value)}
            placeholder="0" className="w-full bg-[#0f0d0a] border border-[#f59e0b]/20 rounded px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#f59e0b]/60 transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">{inputLabel} Z</label>
          <input type="number" value={iz} onChange={e => setIz(e.target.value)}
            placeholder="0" className="w-full bg-[#0f0d0a] border border-[#f59e0b]/20 rounded px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#f59e0b]/60 transition-colors" />
        </div>
      </div>
      {valid && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
              <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-1">{outputLabel} X</p>
              <p className="text-lg font-bold text-[#f59e0b]">{rx}</p>
            </div>
            <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
              <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-1">{outputLabel} Z</p>
              <p className="text-lg font-bold text-[#f59e0b]">{rz}</p>
            </div>
          </div>
          <div className="bg-[#1a1510] border border-[#f59e0b]/10 rounded p-3 flex items-center gap-2">
            <Icon name="AlertCircle" size={14} className="text-[#f59e0b]/50 flex-shrink-0" />
            <p className="text-xs text-[#f0e8d8]/40">Погрешность из-за округления: <span className="text-[#f59e0b]/70">{errLabel}</span>. Y-координата не пересчитывается.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Heaven Portal Calculator ─────────────────────────────────────────────────
function CalcHeaven() {
  const [version, setVersion] = useState<"java" | "bedrock">("java");
  const [seed, setSeed] = useState("");
  const [wx, setWx] = useState("");
  const [wz, setWz] = useState("");

  const hasSeed = seed.trim() !== "";
  const hasCoords = wx.trim() !== "" && wz.trim() !== "";

  const chunkbaseUrl = hasSeed
    ? `https://www.chunkbase.com/apps/nether-fortress-finder#${encodeURIComponent(seed)}`
    : "https://www.chunkbase.com/apps/nether-fortress-finder";

  // В Java Edition координаты Рая = координаты обычного мира (без деления)
  // Рай (The End) - игровая зона, портал всегда на 0,0 в End
  // Крепости (Stronghold) в обычном мире → через них попадают в Край
  // "Рай" в контексте Minecraft часто означает Nether — уточняем: это Nether Fortress finder
  const nfX = hasCoords ? Math.round(parseFloat(wx) / 8) : null;
  const nfZ = hasCoords ? Math.round(parseFloat(wz) / 8) : null;

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#f0e8d8]/40 leading-relaxed">
        Введи ключ мира (seed) чтобы открыть карту крепостей Незера на Chunkbase, или конвертируй координаты обычного мира в координаты Незера.
      </p>

      {/* Version */}
      <div>
        <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">Версия игры</label>
        <div className="grid grid-cols-2 gap-2">
          {([["java","Java Edition"],["bedrock","Bedrock Edition"]] as const).map(([v, label]) => (
            <button key={v} onClick={() => setVersion(v)}
              className={`py-1.5 text-xs rounded border transition-colors ${version === v ? "bg-[#f59e0b] text-black border-[#f59e0b] font-bold" : "border-[#f59e0b]/20 text-[#f0e8d8]/60 hover:border-[#f59e0b]/50"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Seed */}
      <div>
        <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">Ключ мира (Seed)</label>
        <input value={seed} onChange={e => setSeed(e.target.value)}
          placeholder="Введи seed мира..." className="w-full bg-[#0f0d0a] border border-[#f59e0b]/20 rounded px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#f59e0b]/60 transition-colors" />
        {hasSeed && (
          <a href={chunkbaseUrl} target="_blank" rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 w-full py-2 px-3 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded text-xs text-[#f59e0b] hover:bg-[#f59e0b]/20 transition-colors">
            <Icon name="ExternalLink" size={12} />
            Открыть карту Незера на Chunkbase ({version === "java" ? "Java" : "Bedrock"})
          </a>
        )}
      </div>

      {/* Coords */}
      <div>
        <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">Мои координаты в обычном мире</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-[#f0e8d8]/30 mb-1">X</label>
            <input type="number" value={wx} onChange={e => setWx(e.target.value)}
              placeholder="0" className="w-full bg-[#0f0d0a] border border-[#f59e0b]/20 rounded px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#f59e0b]/60 transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] text-[#f0e8d8]/30 mb-1">Z</label>
            <input type="number" value={wz} onChange={e => setWz(e.target.value)}
              placeholder="0" className="w-full bg-[#0f0d0a] border border-[#f59e0b]/20 rounded px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#f59e0b]/60 transition-colors" />
          </div>
        </div>
        {hasCoords && nfX !== null && nfZ !== null && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
              <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-1">Незер X</p>
              <p className="text-lg font-bold text-[#f59e0b]">{nfX}</p>
            </div>
            <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
              <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-1">Незер Z</p>
              <p className="text-lg font-bold text-[#f59e0b]">{nfZ}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tools list ────────────────────────────────────────────────────────────────
const TOOLS_DATA = [
  { id: "xp",      icon: "Star",       name: "Калькулятор XP",              tag: "Опыт",  desc: "Рассчитай сколько XP нужно для нужного уровня",              component: <CalcXP /> },
  { id: "ench",    icon: "Sparkles",   name: "Зачарование предмета",        tag: "Стол",  desc: "Подбери зачарования и узнай стоимость в уровнях",            component: <CalcEnchant /> },
  { id: "end",     icon: "Navigation", name: "Координаты портала в Край",   tag: "Край",  desc: "Найди крепость по своим координатам и глазу эндера",         component: <CalcEndPortal /> },
  { id: "nether",  icon: "Flame",      name: "Ад ↔ Обычный мир",           tag: "Незер", desc: "Конвертируй координаты между Незером и обычным миром",        component: <CalcNether /> },
  { id: "heaven",  icon: "Compass",    name: "Координаты в Незере (Seed)",  tag: "Незер", desc: "Найди крепости Незера по ключу мира через Chunkbase",         component: <CalcHeaven /> },
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
    title: "Гайд по зачарованиям предметов",
    body: `Выбери предмет из одной из групп: Оружие, Инструменты, Дальнобой, Броня или Другое.

Доступные предметы и их ключевые зачарования:

⚔️ Меч — Острота (V), Небесная кара (V), Бич членистоногих (V), Заговор огня (II), Разящий клинок (III), Добыча (III)
🪓 Топор — Острота (V), Небесная кара (V), Бич членистоногих (V), Эффективность (V)
🔱 Трезубец — Верность (III) несовместима с Тягуном (III)
🗡️ Копьё — Острота (V), Заговор огня (II), Рывок (III), Добыча (III)
🏏 Булава — Плотность (V), Небесная кара (V), Бич членистоногих (V), Порыв ветра (III), Пробитие (V)
   ⚠️ Пробитие несовместимо с Плотностью, Небесной карой и Бичом членистоногих

🏹 Лук — Сила (V), Откидывание (II), Воспламенение (I), Бесконечность (I) — несовм. с Починкой
🎯 Арбалет — Быстрая перезарядка (III), Тройной выстрел (I) vs Пронзающая стрела (IV)

🪖 Шлем — Подводное дыхание (III), Подводник (I), + защита
🛡️ Нагрудник — только защита и Шипы
🩲 Поножи — Проворство (III) + защита
👟 Ботинки — Подводная ходьба (III), Невесомость (IV), Ледоход (II), Скорость души (III)

Зачарование сохраняется автоматически между сессиями. Кнопка «Очистить» сбрасывает все выборы.

Совет: несовместимые зачарования подсвечиваются и блокируются автоматически.`,
  },
  {
    icon: "🌀",
    title: "Поиск портала в Край: как работает расчёт",
    body: `Портал в Край находится в крепости под землёй. Чтобы найти её:

1. Возьми глаза эндера (крафт: жемчуг эндера + зелье огня)
2. Брось глаз — он полетит в сторону крепости
3. Запомни свои X и Z в момент броска
4. Введи координаты в калькулятор

Как работает расчёт: калькулятор вычисляет вектор и расстояние от тебя до ближайшей зоны спавна крепостей. Бросай глаза каждые 100 блоков — чем ближе, тем точнее.`,
  },
  {
    icon: "🔥",
    title: "Конвертер координат Незер ↔ Мир",
    body: `Каждый блок в Незере = 8 блоков в обычном мире. Это делает Незер идеальным для быстрых путешествий.

Как использовать калькулятор:
• Выбери «Обычный мир» → введи координаты точки назначения → получи где строить портал в Незере
• Выбери «Ад» → введи свои координаты в Незере → узнай куда выйдешь в обычном мире

Погрешность: из-за округления результат может отличаться до ±4 блоков в обычном мире (или ±0.5 в Незере). Y-координата НЕ пересчитывается — строй порталы на высоте Y 60–90 в Незере.`,
  },
  {
    icon: "🧭",
    title: "Поиск крепостей Незера по Seed (Chunkbase)",
    body: `Инструмент «Координаты в Незере» позволяет найти крепости Незера по ключу мира.

Как использовать:
1. Узнай seed мира: введи /seed в чате (если есть права) или найди в настройках мира
2. Выбери версию игры (Java или Bedrock — seed'ы у них разные!)
3. Введи seed в поле — появится кнопка открытия карты на Chunkbase
4. На карте Chunkbase будут отмечены все крепости Незера

Также можно конвертировать свои текущие координаты в координаты Незера прямо в этом инструменте.`,
  },
];

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function Index() {
  const [activeSection, setActiveSection] = useState("Главная");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openTool, setOpenTool] = useState<string | null>(null);
  const [openGuide, setOpenGuide] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollTab, setScrollTab] = useState<string | null>(null);
  const scrollTabTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toolsOrder = TOOLS_DATA.map(t => t.id);

  const sectionIds: Record<string, string> = {
    Главная: "hero", Инструменты: "tools", Гайды: "guides", Контакты: "contacts",
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  // Кнопка наверх + отслеживание секции
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

  // Скролл колесом — переключение вкладок инструментов
  const handleToolsWheel = useCallback((e: React.WheelEvent) => {
    if (!openTool) return;
    const idx = toolsOrder.indexOf(openTool);
    if (idx === -1) return;
    const next = e.deltaY > 0
      ? toolsOrder[Math.min(idx + 1, toolsOrder.length - 1)]
      : toolsOrder[Math.max(idx - 1, 0)];
    if (next === openTool) return;
    e.preventDefault();
    setOpenTool(next);
    const tool = TOOLS_DATA.find(t => t.id === next);
    if (tool) {
      setScrollTab(tool.name);
      if (scrollTabTimer.current) clearTimeout(scrollTabTimer.current);
      scrollTabTimer.current = setTimeout(() => setScrollTab(null), 1800);
    }
  }, [openTool, toolsOrder]);

  return (
    <div className="min-h-screen bg-[#0f0d0a] text-[#f0e8d8] font-['Rubik',sans-serif]">

      {/* Scroll tab indicator */}
      {scrollTab && (
        <div className="fixed top-20 right-4 z-50 bg-black/80 border border-[#f59e0b]/30 rounded-lg px-4 py-2 text-xs text-[#f59e0b] backdrop-blur-md pointer-events-none animate-fade-in">
          {scrollTab}
        </div>
      )}

      {/* Scroll to top button */}
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
      <section id="tools" className="py-24 px-6 max-w-6xl mx-auto" onWheel={handleToolsWheel}>
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
