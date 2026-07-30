"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Building2, SearchX } from "lucide-react";
import { Etablissement, Universite, getEtablissements, getUniversites } from "@/lib/api";
import { Pagination } from "@/components/Pagination";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardLink } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { conteneurEnCascade, elementEnCascade } from "@/lib/motion";

export default function EtablissementsPage() {
  const [universites, setUniversites] = useState<Universite[]>([]);
  const [q, setQ] = useState("");
  const [universiteId, setUniversiteId] = useState("");
  const [page, setPage] = useState(1);
  const [resultat, setResultat] = useState<{
    data: Etablissement[];
    total: number;
    dernierePage: number;
  }>({ data: [], total: 0, dernierePage: 1 });
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    getUniversites().then(setUniversites).catch(() => {});
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      setChargement(true);
      getEtablissements({
        q: q || undefined,
        universite_id: universiteId ? Number(universiteId) : undefined,
        page,
      })
        .then((res) =>
          setResultat({
            data: res.data,
            total: res.total,
            dernierePage: res.last_page,
          })
        )
        .catch(() => setResultat({ data: [], total: 0, dernierePage: 1 }))
        .finally(() => setChargement(false));
    }, 300);
    return () => clearTimeout(id);
  }, [q, universiteId, page]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader
        eyebrow="Catalogue"
        title="Établissements"
        subtitle={`${resultat.total} établissement(s) référencé(s).`}
        backgroundImage="/images/backgrounds/classroom.jpg"
      />

      <div className="mt-8 flex flex-wrap gap-3">
        <div className="min-w-[240px] flex-1">
          <Input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="Rechercher un établissement..."
          />
        </div>
        <select
          value={universiteId}
          onChange={(e) => {
            setPage(1);
            setUniversiteId(e.target.value);
          }}
          className="rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
        >
          <option value="">Toutes les universités</option>
          {universites.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nom}
            </option>
          ))}
        </select>
      </div>

      {chargement ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <motion.div
          variants={conteneurEnCascade}
          initial="hidden"
          animate="visible"
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {resultat.data.map((etab) => (
            <motion.div key={etab.id} variants={elementEnCascade}>
              <CardLink href={`/etablissements/${etab.id}`}>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-800/30 dark:text-brand-300">
                  <Building2 className="h-5 w-5" />
                </span>
                <h2 className="mt-3 font-semibold leading-snug group-hover:text-brand-600">
                  {etab.sigle ? `${etab.sigle} · ${etab.nom}` : etab.nom}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {etab.universite?.nom}
                </p>
                <p className="mt-3 text-xs font-medium text-brand-600">
                  {etab.filieres_count ?? 0} filière(s)
                </p>
              </CardLink>
            </motion.div>
          ))}
          {resultat.data.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              <SearchX className="h-8 w-8" />
              Aucun établissement ne correspond à ces critères.
            </div>
          )}
        </motion.div>
      )}

      <Pagination
        page={page}
        dernierePage={resultat.dernierePage}
        onChange={setPage}
      />
    </div>
  );
}
