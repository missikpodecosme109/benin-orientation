"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [sombre, setSombre] = useState(false);

  useEffect(() => {
    setSombre(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  function basculer() {
    const nouveau = !sombre;
    setSombre(nouveau);
    document.documentElement.setAttribute("data-theme", nouveau ? "dark" : "light");
    localStorage.setItem("theme", nouveau ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={basculer}
      aria-label={sombre ? "Passer en mode jour" : "Passer en mode nuit"}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground/70 transition-colors hover:bg-black/[0.04] hover:text-brand-600 dark:hover:bg-white/[0.06] ${className}`}
    >
      {sombre ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
