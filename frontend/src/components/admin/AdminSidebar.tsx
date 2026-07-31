"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FileSpreadsheet,
  GraduationCap,
  LayoutDashboard,
  ListTree,
  School,
  Sparkles,
  Users,
  X,
} from "lucide-react";

const LIENS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/universites", label: "Universités", icon: School },
  { href: "/admin/etablissements", label: "Établissements", icon: Building2 },
  { href: "/admin/filieres", label: "Filières", icon: GraduationCap },
  { href: "/admin/series", label: "Séries", icon: ListTree },
  { href: "/admin/matieres", label: "Matières", icon: ListTree },
  { href: "/admin/debouches", label: "Débouchés", icon: ListTree },
  { href: "/admin/simulations", label: "Simulations", icon: Sparkles },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/import-export", label: "Import / Export", icon: FileSpreadsheet },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      <div className="mb-2 flex items-center justify-between px-2 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Administration
        </span>
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.06] md:hidden"
            aria-label="Fermer le menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {LIENS.map((lien) => {
        const actif = lien.exact ? pathname === lien.href : pathname.startsWith(lien.href);
        return (
          <Link
            key={lien.href}
            href={lien.href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              actif
                ? "bg-brand-600 text-white"
                : "text-foreground/80 hover:bg-black/[0.04] hover:text-brand-600 dark:hover:bg-white/[0.06]"
            }`}
          >
            <lien.icon className="h-4 w-4 shrink-0" />
            {lien.label}
          </Link>
        );
      })}
    </nav>
  );
}
