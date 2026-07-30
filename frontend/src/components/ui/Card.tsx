"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import Link from "next/link";
import { forwardRef } from "react";

interface CardProps extends HTMLMotionProps<"div"> {
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, className = "", children, ...props }, ref) => {
    // Si le parent orchestre l'animation via `variants` (ex: apparition en
    // cascade d'une liste), on ne fixe pas notre propre initial/whileInView
    // pour laisser le composant hériter de l'état animate="visible" du parent.
    const animationParDefaut = props.variants
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.35, ease: "easeOut" as const },
        };

    return (
      <motion.div
        ref={ref}
        {...animationParDefaut}
        whileHover={hoverable ? { y: -3 } : undefined}
        className={`rounded-xl border border-border bg-surface p-5 transition-shadow ${
          hoverable ? "hover:border-brand-500/60" : ""
        } ${className}`}
        style={{
          boxShadow: "var(--card-shadow)",
          ...(props.style ?? {}),
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

export function CardLink({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group rounded-xl border border-border bg-surface transition-colors hover:border-brand-500/60"
      style={{ boxShadow: "var(--card-shadow)" }}
    >
      <Link href={href} className={`block p-5 ${className}`}>
        {children}
      </Link>
    </motion.div>
  );
}
