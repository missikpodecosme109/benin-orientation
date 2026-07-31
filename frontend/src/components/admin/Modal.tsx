"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect } from "react";

export function Modal({
  ouvert,
  onFermer,
  titre,
  children,
}: {
  ouvert: boolean;
  onFermer: () => void;
  titre: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onFermer();
    }
    if (ouvert) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [ouvert, onFermer]);

  return (
    <AnimatePresence>
      {ouvert && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onFermer}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none flex w-full max-w-lg items-center justify-center"
            >
              <div
                className="pointer-events-auto w-full max-w-lg rounded-xl border border-border bg-surface p-6"
                style={{ boxShadow: "var(--card-shadow)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{titre}</h2>
                  <button
                    onClick={onFermer}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
                    aria-label="Fermer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
