export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-black/[0.06] dark:bg-white/[0.08] ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div
      className="rounded-xl border border-border bg-surface p-5"
      style={{ boxShadow: "var(--card-shadow)" }}
    >
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="mt-3 h-4 w-1/2" />
      <Skeleton className="mt-4 h-4 w-1/3" />
    </div>
  );
}
