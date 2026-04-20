"use client";

interface PreferenceStepProps {
  title: string;
  options: string[] | { label: string; desc?: string; value: string }[];
  selectedValue: string | string[];
  onSelect: (value: string) => void;
  onSkip: () => void;
  onBack: () => void;
  ariaLabel: string;
  multiSelect?: boolean;
  columns?: number;
}

export function PreferenceStep({
  title,
  options,
  selectedValue,
  onSelect,
  onSkip,
  onBack,
  ariaLabel,
  multiSelect = false,
  columns = 1,
}: PreferenceStepProps) {
  const gridClass = columns === 3
    ? "grid grid-cols-3 gap-3"
    : columns === 2
      ? "grid grid-cols-2 gap-3"
      : "grid grid-cols-1 gap-3";

  return (
    <div>
      <p className="text-zinc-400 text-sm mb-1">Preferences</p>
      <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>
      {multiSelect && (
        <p className="text-zinc-400 text-sm mb-6">Select all that apply</p>
      )}
      <div role="group" aria-label={ariaLabel} className={multiSelect ? `${gridClass} mb-6` : gridClass}>
        {options.map((opt) => {
          const isObject = typeof opt === "object";
          const value = isObject ? opt.value : opt;
          const label = isObject ? opt.label : opt;
          const desc = isObject ? opt.desc : undefined;
          const selected = multiSelect
            ? Array.isArray(selectedValue) && selectedValue.includes(label)
            : selectedValue === (isObject ? label : opt);

          return (
            <button
              key={value}
              onClick={() => onSelect(isObject ? label : opt)}
              aria-pressed={multiSelect ? selected : undefined}
              className={`p-${multiSelect ? "3" : "4"} rounded-xl border-2 font-medium ${multiSelect ? "text-sm" : ""} transition-all ${!multiSelect ? "text-left" : ""} ${
                selected
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {multiSelect && selected ? "✓ " : ""}
              {desc ? (
                <>
                  <div className="font-semibold">{label}</div>
                  <div className="text-sm text-zinc-400 mt-0.5">{desc}</div>
                </>
              ) : (
                label
              )}
            </button>
          );
        })}
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={onBack}
          className={multiSelect
            ? "px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl transition-colors"
            : "px-4 py-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          }
          aria-label="Go back to previous step"
        >
          ← Back
        </button>
        <button
          onClick={onSkip}
          className={multiSelect
            ? "flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-colors"
            : "flex-1 py-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          }
        >
          {multiSelect ? "Continue →" : "Skip →"}
        </button>
      </div>
    </div>
  );
}
