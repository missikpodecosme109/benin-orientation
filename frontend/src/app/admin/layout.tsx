"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Spinner } from "@/components/Spinner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [menuOuvert, setMenuOuvert] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/connexion");
    } else if (user.role !== "admin") {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-4 py-24 text-center text-sm text-muted-foreground">
        {loading || !user ? (
          <>
            <Spinner className="h-5 w-5" /> Chargement...
          </>
        ) : (
          <>
            <ShieldAlert className="h-8 w-8 text-red-500" />
            Accès réservé aux administrateurs. Redirection...
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl">
      <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-64 shrink-0 border-r border-border md:block">
        <AdminSidebar />
      </aside>

      <AnimatePresence>
        {menuOuvert && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setMenuOuvert(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-surface md:hidden"
            >
              <AdminSidebar onNavigate={() => setMenuOuvert(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3 md:hidden">
          <button
            onClick={() => setMenuOuvert(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border"
            aria-label="Ouvrir le menu d'administration"
          >
            <Menu className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold">Administration</span>
        </div>
        <div className="px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
