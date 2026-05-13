import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

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

export function CalcXP() {
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
const LS_ALL  = "mk_ench_all";

export function CalcEnchant() {
  const [item, setItem] = useState<string>(() => localStorage.getItem(LS_ITEM) || "Меч");
  const [allSelected, setAllSelected] = useState<Record<string, Record<string, number>>>(() => {
    try { return JSON.parse(localStorage.getItem(LS_ALL) || "{}"); } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem(LS_ITEM, item); }, [item]);
  useEffect(() => { localStorage.setItem(LS_ALL, JSON.stringify(allSelected)); }, [allSelected]);

  const enchants = ENCHANTS[item] || {};
  const selected = allSelected[item] || {};

  const isDisabled = (name: string) => {
    const def = enchants[name];
    if (!def?.incompatible) return false;
    return def.incompatible.some(inc => selected[inc] !== undefined);
  };

  const toggle = (name: string) => {
    setAllSelected(prev => {
      const cur = prev[item] || {};
      if (cur[name] !== undefined) {
        const next = { ...cur }; delete next[name];
        return { ...prev, [item]: next };
      }
      if (isDisabled(name)) return prev;
      return { ...prev, [item]: { ...cur, [name]: enchants[name].maxLevel } };
    });
  };

  const setLevel = (name: string, level: number) => {
    setAllSelected(prev => ({
      ...prev,
      [item]: { ...(prev[item] || {}), [name]: level },
    }));
  };

  const clearAll = () => setAllSelected({});

  const totalEnchCount = Object.values(allSelected).reduce(
    (acc, enc) => acc + Object.keys(enc).length, 0
  );
  const totalLapis = totalEnchCount * 3;
  const totalLevels = Object.entries(allSelected).reduce((acc, [itName, encs]) => {
    return acc + Object.entries(encs).reduce((a, [eName, lvl]) => {
      return a + (ENCHANTS[itName]?.[eName]?.base || 0) * lvl;
    }, 0);
  }, 0);
  const hasAny = totalEnchCount > 0;

  const itemsWithEnchants = Object.entries(allSelected).filter(([, enc]) => Object.keys(enc).length > 0);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider">Предмет</label>
        {ITEM_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-[10px] text-[#f0e8d8]/30 uppercase tracking-widest mb-1">{group.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map(it => {
                const itEnchCount = Object.keys(allSelected[it] || {}).length;
                return (
                  <button key={it} onClick={() => setItem(it)}
                    className={`py-1 px-2.5 text-xs rounded border transition-colors flex items-center gap-1 relative ${item === it ? "bg-[#f59e0b] text-black border-[#f59e0b] font-bold" : "border-[#f59e0b]/20 text-[#f0e8d8]/60 hover:border-[#f59e0b]/50"}`}>
                    <span>{ITEM_ICONS[it]}</span>{it}
                    {itEnchCount > 0 && (
                      <span className={`ml-0.5 text-[10px] font-bold ${item === it ? "text-black/70" : "text-[#f59e0b]"}`}>
                        ·{itEnchCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <label className="text-xs text-[#f0e8d8]/50 uppercase tracking-wider">
          Зачарования <span className="text-[#f0e8d8]/30 normal-case font-normal">— {ITEM_ICONS[item]} {item}</span>
        </label>
        {hasAny && (
          <button onClick={clearAll}
            className="flex items-center gap-1 text-xs text-[#f0e8d8]/40 hover:text-red-400 border border-[#f59e0b]/10 hover:border-red-400/30 rounded px-2 py-0.5 transition-colors">
            <Icon name="X" size={10} />
            Очистить всё
          </button>
        )}
      </div>

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

      {hasAny && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
              <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-1">Уровней XP</p>
              <p className="text-lg font-bold text-[#f59e0b]">{totalLevels}</p>
            </div>
            <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
              <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-1">Лазурит</p>
              <p className="text-lg font-bold text-[#f59e0b]">{totalLapis}</p>
            </div>
            <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
              <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-1">Всего чар</p>
              <p className="text-lg font-bold text-[#f59e0b]">{totalEnchCount}</p>
            </div>
          </div>

          <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3 space-y-2">
            {itemsWithEnchants.map(([itName, encs]) => (
              <div key={itName}>
                <p className="text-[10px] text-[#f0e8d8]/40 mb-1 flex items-center gap-1.5">
                  <span>{ITEM_ICONS[itName]}</span>
                  <span className="font-semibold text-[#f0e8d8]/70">{itName}</span>
                  <span className="text-[#f0e8d8]/30">— {Object.keys(encs).length} чар</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(encs).map(([eName, lvl]) => (
                    <span key={eName} className="text-xs bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] px-2 py-0.5 rounded-full">
                      {eName}{ENCHANTS[itName]?.[eName]?.maxLevel > 1 ? ` ${ROMAN[lvl]}` : ""}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Nether / Overworld Calculator ────────────────────────────────────────────
export function CalcNether() {
  const [mode, setMode] = useState<"nether" | "overworld">("overworld");
  const [ix, setIx] = useState("");
  const [iz, setIz] = useState("");

  const x = parseFloat(ix);
  const z = parseFloat(iz);
  const valid = !isNaN(x) && !isNaN(z) && ix !== "" && iz !== "";

  const rx = mode === "overworld" ? Math.round(x / 8) : Math.round(x * 8);
  const rz = mode === "overworld" ? Math.round(z / 8) : Math.round(z * 8);

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

// ─── End Portal (Stronghold) Finder ───────────────────────────────────────────
export function CalcEndPortal() {
  const [version, setVersion] = useState<"java" | "bedrock">("java");
  const [seed, setSeed] = useState("");
  const [px, setPx] = useState("");
  const [pz, setPz] = useState("");

  const hasSeed = seed.trim() !== "";
  const hasPos  = px.trim() !== "" && pz.trim() !== "";

  const chunkbaseUrl = () => {
    const base = version === "java"
      ? "https://www.chunkbase.com/apps/stronghold-finder"
      : "https://www.chunkbase.com/apps/stronghold-finder";
    const params: string[] = [];
    if (hasSeed) params.push(`seed=${encodeURIComponent(seed)}`);
    if (hasPos)  params.push(`x=${px}&z=${pz}`);
    if (version === "bedrock") params.push("platform=bedrock");
    return params.length ? `${base}#${params.join("&")}` : base;
  };

  const rings = [
    { ring: 1, count: 8,  minR: 1280,  maxR: 2816  },
    { ring: 2, count: 24, minR: 4352,  maxR: 5888  },
    { ring: 3, count: 40, minR: 7424,  maxR: 8960  },
  ];

  const playerDist = hasPos
    ? Math.round(Math.sqrt(parseFloat(px) ** 2 + parseFloat(pz) ** 2))
    : null;

  const nearestRing = playerDist !== null
    ? rings.reduce((best, r) => {
        const midR = (r.minR + r.maxR) / 2;
        const bestMid = (best.minR + best.maxR) / 2;
        return Math.abs(midR - playerDist) < Math.abs(bestMid - playerDist) ? r : best;
      })
    : null;

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#f0e8d8]/40 leading-relaxed">
        Портал в Энд находится в крепости (Stronghold). Введи seed мира — откроем точную карту всех крепостей на Chunkbase.
      </p>

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
        <p className="text-[10px] text-[#f0e8d8]/25 mt-1">⚠️ Seed'ы Java и Bedrock несовместимы — выбери правильную версию</p>
      </div>

      <div>
        <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">
          Ключ мира (Seed)
          <span className="ml-2 text-[#f0e8d8]/25 normal-case font-normal">— /seed в чате игры</span>
        </label>
        <input value={seed} onChange={e => setSeed(e.target.value)}
          placeholder="Например: -1234567890" className="w-full bg-[#0f0d0a] border border-[#f59e0b]/20 rounded px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#f59e0b]/60 transition-colors" />
      </div>

      <div>
        <label className="block text-xs text-[#f0e8d8]/50 uppercase tracking-wider mb-1.5">
          Моя позиция <span className="text-[#f0e8d8]/25 normal-case font-normal">— необязательно, для расчёта ближайшей</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-[#f0e8d8]/30 mb-1">X</label>
            <input type="number" value={px} onChange={e => setPx(e.target.value)}
              placeholder="0" className="w-full bg-[#0f0d0a] border border-[#f59e0b]/20 rounded px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#f59e0b]/60 transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] text-[#f0e8d8]/30 mb-1">Z</label>
            <input type="number" value={pz} onChange={e => setPz(e.target.value)}
              placeholder="0" className="w-full bg-[#0f0d0a] border border-[#f59e0b]/20 rounded px-3 py-2 text-[#f0e8d8] text-sm focus:outline-none focus:border-[#f59e0b]/60 transition-colors" />
          </div>
        </div>
      </div>

      {nearestRing && playerDist !== null && (
        <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3 space-y-1">
          <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider">Ближайшее кольцо крепостей</p>
          <p className="text-sm text-[#f0e8d8]/70">
            <span className="text-[#f59e0b] font-bold">Кольцо {nearestRing.ring}</span> — {nearestRing.count} крепостей, {nearestRing.minR}–{nearestRing.maxR} блоков от центра
          </p>
          <p className="text-xs text-[#f0e8d8]/40">Ты сейчас в {playerDist} блоках от X:0 Z:0</p>
        </div>
      )}

      {hasSeed && (
        <a href={chunkbaseUrl()} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 w-full py-3 px-4 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded text-sm text-[#f59e0b] hover:bg-[#f59e0b]/20 transition-colors">
          <Icon name="ExternalLink" size={16} className="flex-shrink-0" />
          <div>
            <p className="font-semibold">Открыть карту крепостей на Chunkbase</p>
            <p className="text-xs text-[#f59e0b]/60">{version === "java" ? "Java Edition" : "Bedrock Edition"} · seed: {seed}</p>
          </div>
        </a>
      )}

      <div className="bg-[#0f0d0a] border border-[#f59e0b]/10 rounded p-3">
        <p className="text-[10px] text-[#f0e8d8]/40 uppercase tracking-wider mb-2">Кольца крепостей в Java Edition</p>
        <div className="space-y-1">
          {rings.map(r => (
            <div key={r.ring} className={`flex items-center justify-between text-xs py-1 px-2 rounded ${nearestRing?.ring === r.ring && playerDist !== null ? "bg-[#f59e0b]/10 text-[#f59e0b]" : "text-[#f0e8d8]/40"}`}>
              <span>Кольцо {r.ring} ({r.count} шт.)</span>
              <span>{r.minR}–{r.maxR} блоков</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
