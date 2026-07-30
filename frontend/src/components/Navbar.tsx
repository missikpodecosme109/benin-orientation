"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ThemeToggle";

const LIENS = [
  { href: "/simulation", label: "Ma simulation", icon: Sparkles },
  { href: "/filieres", label: "Filières", icon: GraduationCap },
  { href: "/etablissements", label: "Établissements", icon: Building2 },
  { href: "/recherche", label: "Recherche", icon: Search },
];

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const [ouvert, setOuvert] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            BO
          </span>
          <span className="hidden sm:inline">Bénin Orientation</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LIENS.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-black/[0.04] hover:text-brand-600 dark:hover:bg-white/[0.06]"
            >
              <lien.icon className="h-4 w-4" />
              {lien.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {loading ? null : user ? (
            <>
              <Link
                href="/tableau-de-bord"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-black/[0.04] hover:text-brand-600 dark:hover:bg-white/[0.06]"
              >
                <LayoutDashboard className="h-4 w-4" />
                {user.name}
              </Link>
              <Button variant="secondary" size="sm" onClick={() => logout()}>
                <LogOut className="h-3.5 w-3.5" /> Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:text-brand-600"
              >
                Connexion
              </Link>
              <ButtonLink href="/inscription" size="sm">
                Créer un compte
              </ButtonLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border"
            onClick={() => setOuvert((v) => !v)}
            aria-label="Ouvrir le menu"
          >
            {ouvert ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {ouvert && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {LIENS.map((lien) => (
                <Link
                  key={lien.href}
                  href={lien.href}
                  className="flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm font-medium hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  onClick={() => setOuvert(false)}
                >
                  <lien.icon className="h-4 w-4" />
                  {lien.label}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-2">
                {user ? (
                  <>
                    <Link
                      href="/tableau-de-bord"
                      className="flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm font-medium hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                      onClick={() => setOuvert(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Tableau de bord ({user.name})
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setOuvert(false);
                      }}
                      className="flex items-center gap-2 rounded-lg px-2 py-2.5 text-left text-sm font-medium hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                    >
                      <LogOut className="h-4 w-4" />
                      Se déconnecter
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/connexion"
                      className="rounded-lg px-2 py-2.5 text-sm font-medium hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                      onClick={() => setOuvert(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/inscription"
                      className="rounded-lg bg-brand-600 px-2 py-2.5 text-center text-sm font-semibold text-white"
                      onClick={() => setOuvert(false)}
                    >
                      Créer un compte
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
