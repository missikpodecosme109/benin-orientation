type Variante = "brand" | "neutral" | "accent" | "danger";

const VARIANTES: Record<Variante, string> = {
  brand:
    "bg-brand-100 text-brand-700 dark:bg-brand-800/30 dark:text-brand-200",
  neutral: "bg-black/[0.05] text-foreground/80 dark:bg-white/[0.08]",
  accent: "bg-accent-500/15 text-accent-600 dark:text-accent-400",
  danger: "bg-red-500/10 text-red-600",
};

export function Badge({
  variant = "neutral",
  className = "",
  children,
}: {
  variant?: Variante;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${VARIANTES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
