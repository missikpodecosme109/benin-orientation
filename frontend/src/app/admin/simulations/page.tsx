"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { getSimulationsAdmin, supprimerSimulationAdmin, AdminSimulation } from "@/lib/admin-api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/Pagination";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export default function AdminSimulationsPage() {
  const [page, setPage] = useState(1);
  const [simulations, setSimulations] = useState<AdminSimulation[] | null>(null);
  const [dernierePage, setDernierePage] = useState(1);
  const [aSupprimer, setASupprimer] = useState<AdminSimulation | null>(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  function charger() {
    getSimulationsAdmin({ page })
      .then((res) => {
        setSimulations(res.data);
        setDernierePage(res.last_page);
      })
      .catch(() => setSimulations([]));
  }

  useEffect(charger, [page]);

  async function confirmerSuppression() {
    if (!aSupprimer) return;
    setSuppressionEnCours(true);
    try {
      await supprimerSimulationAdmin(aSupprimer.id);
      setASupprimer(null);
      charger();
    } finally {
      setSuppressionEnCours(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Simulations"
        subtitle="Historique des simulations d'orientation lancées par les candidats."
      />

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-black/[0.02] text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground dark:bg-white/[0.03]">
              <th className="px-4 py-3">Candidat</th>
              <th className="px-4 py-3">Série</th>
              <th className="px-4 py-3">Résultats</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {simulations === null ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-4 py-3" colSpan={5}>
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))
            ) : simulations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center text-sm text-muted-foreground">
                  Aucune simulation pour l&apos;instant.
                </td>
              </tr>
            ) : (
              simulations.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    {s.user ? (
                      <div>
                        <p className="font-medium">{s.user.name}</p>
                        <p className="text-xs text-muted-foreground">{s.user.email}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Invité</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{s.serie?.code ?? "—"}</td>
                  <td className="px-4 py-3">
                    {s.resultats.length} filière(s)
                    {s.resultats[0] && (
                      <Link
                        href={`/filieres/${s.resultats[0].filiere_id}`}
                        className="ml-2 text-xs font-medium text-brand-600 hover:underline"
                      >
                        voir la 1ère
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(s.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setASupprimer(s)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-500/10"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} dernierePage={dernierePage} onChange={setPage} />

      <ConfirmDialog
        ouvert={!!aSupprimer}
        titre="Supprimer cette simulation ?"
        description="Cette simulation sera définitivement supprimée de l'historique."
        enCours={suppressionEnCours}
        onAnnuler={() => setASupprimer(null)}
        onConfirmer={confirmerSuppression}
      />
    </div>
  );
}
