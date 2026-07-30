const ETAPES = ["Série", "Notes", "Résultats"];

export function Stepper({ etapeIndex }: { etapeIndex: number }) {
  return (
    <ol className="mt-6 flex items-center">
      {ETAPES.map((label, index) => {
        const estActive = index === etapeIndex;
        const estFaite = index < etapeIndex;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  estFaite
                    ? "bg-brand-600 text-white"
                    : estActive
                      ? "bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-700/30"
                      : "bg-black/5 text-foreground/40 dark:bg-white/10"
                }`}
              >
                {estFaite ? "✓" : index + 1}
              </span>
              <span
                className={`text-xs font-medium ${
                  estActive || estFaite
                    ? "text-foreground"
                    : "text-foreground/40"
                }`}
              >
                {label}
              </span>
            </div>
            {index < ETAPES.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 rounded transition-colors ${
                  estFaite ? "bg-brand-600" : "bg-black/10 dark:bg-white/10"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
