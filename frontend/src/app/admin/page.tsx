"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Building2,
  GraduationCap,
  ListTree,
  School,
  Sparkles,
  Users,
} from "lucide-react";
import { getDashboard, DashboardStats } from "@/lib/admin-api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { conteneurEnCascade, elementEnCascade } from "@/lib/motion";

const TUILES = [
  { key: "universites", label: "Universités", icon: School, href: "/admin/universites" },
  { key: "etablissements", label: "Établissements", icon: Building2, href: "/admin/etablissements" },
  { key: "filieres", label: "Filières", icon: GraduationCap, href: "/admin/filieres" },
  { key: "series", label: "Séries", icon: ListTree, href: "/admin/series" },
  { key: "matieres", label: "Matières", icon: ListTree, href: "/admin/matieres" },
  { key: "utilisateurs", label: "Utilisateurs", icon: Users, href: "/admin/utilisateurs" },
  { key: "simulations", label: "Simulations", icon: Sparkles, href: "/admin/simulations" },
] as const;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Tableau de bord"
        subtitle="Vue d'ensemble du contenu et de l'activité de la plateforme."
      />

      <motion.div
        variants={conteneurEnCascade}
        initial="hidden"
        animate="visible"
        className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        {TUILES.map((tuile) => (
          <motion.div key={tuile.key} variants={elementEnCascade}>
            <Link href={tuile.href} className="block">
              <Card hoverable className="flex flex-col gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-800/30 dark:text-brand-300">
                  <tuile.icon className="h-4.5 w-4.5" />
                </span>
                {stats ? (
                  <span className="text-2xl font-bold tracking-tight">
                    {stats.totaux[tuile.key]}
                  </span>
                ) : (
                  <Skeleton className="h-8 w-12" />
                )}
                <span className="text-sm text-muted-foreground">{tuile.label}</span>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Filières les plus mises en favori</h2>
          <div className="mt-4 flex flex-col gap-3">
            {!stats ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)
            ) : stats.filieres_les_plus_demandees.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune donnée pour l&apos;instant.</p>
            ) : (
              stats.filieres_les_plus_demandees.map((f) => (
                <div key={f.id} className="flex items-center justify-between text-sm">
                  <span>{f.nom}</span>
                  <span className="font-semibold text-brand-600">{f.nb_favoris}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">Séries les plus simulées</h2>
          <div className="mt-4 flex flex-col gap-3">
            {!stats ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-5 w-full" />)
            ) : stats.series_les_plus_utilisees.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune donnée pour l&apos;instant.</p>
            ) : (
              stats.series_les_plus_utilisees.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span>Série {s.code}</span>
                  <span className="font-semibold text-brand-600">{s.nb_simulations}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="font-semibold">Derniers utilisateurs inscrits</h2>
          <div className="mt-4 flex flex-col divide-y divide-border">
            {!stats ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="my-2 h-5 w-full" />)
            ) : stats.derniers_utilisateurs.length === 0 ? (
              <p className="py-2 text-sm text-muted-foreground">Aucun utilisateur pour l&apos;instant.</p>
            ) : (
              stats.derniers_utilisateurs.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-muted-foreground">{u.email}</p>
                  </div>
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    {u.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
