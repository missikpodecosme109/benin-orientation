"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
  backgroundImage,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  backgroundImage?: string;
}) {
  if (backgroundImage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative isolate overflow-hidden rounded-2xl"
      >
        <Image
          src={backgroundImage}
          alt=""
          fill
          priority
          sizes="(min-width: 1152px) 1152px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

        <div className="relative flex flex-wrap items-start justify-between gap-4 px-6 py-12 sm:px-10 sm:py-16">
          <div>
            {eyebrow && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-200">
                {eyebrow}
              </p>
            )}
            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 max-w-2xl text-base text-white/90">
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-wrap items-start justify-between gap-4"
    >
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-600">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </motion.div>
  );
}
