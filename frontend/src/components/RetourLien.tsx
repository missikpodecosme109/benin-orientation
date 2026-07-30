"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function RetourLien({
  fallbackHref,
  label,
}: {
  fallbackHref: string;
  label: string;
}) {
  const router = useRouter();

  function revenir() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button
      type="button"
      onClick={revenir}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
