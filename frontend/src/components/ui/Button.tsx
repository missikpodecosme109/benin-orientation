"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import Link from "next/link";
import { forwardRef } from "react";

type Variante = "primary" | "secondary" | "ghost" | "danger";
type Taille = "sm" | "md" | "lg";

const VARIANTES: Record<Variante, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-900/10",
  secondary:
    "border border-border-strong bg-surface text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.06]",
  ghost: "text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-800/20",
  danger: "text-red-600 hover:bg-red-500/10",
};

const TAILLES: Record<Taille, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-lg gap-2",
  lg: "px-6 py-3.5 text-base rounded-lg gap-2",
};

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: Variante;
  size?: Taille;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: props.disabled ? 1 : 1.02 }}
        whileTap={{ scale: props.disabled ? 1 : 0.97 }}
        transition={{ duration: 0.15 }}
        className={`inline-flex items-center justify-center font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none ${VARIANTES[variant]} ${TAILLES[size]} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

interface ButtonLinkProps {
  href: string;
  variant?: Variante;
  size?: Taille;
  className?: string;
  children: React.ReactNode;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: ButtonLinkProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="inline-block"
    >
      <Link
        href={href}
        className={`inline-flex items-center justify-center font-semibold transition-colors ${VARIANTES[variant]} ${TAILLES[size]} ${className}`}
      >
        {children}
      </Link>
    </motion.div>
  );
}
