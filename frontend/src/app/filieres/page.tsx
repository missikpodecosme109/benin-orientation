"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Building2, SearchX } from "lucide-react";
import { Filiere, Serie, getFilieres, getSeries } from "@/lib/api";
import { Pagination } from "@/components/Pagination";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardLink } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { conteneurEnCascade, elementEnCascade } from "@/lib/motion";
import { FiliereIcon } from "@/components/FiliereIcon";

const MODES_ENTREE = [
  { value: "", label: "Tous les modes d'entrée" },
  { value: "classement", label: "Classement" },
  { value: "concours", label: "Concours" },
  { value: "dossier", label: "Dossier" },
];

export default function FilieresPage() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [q, setQ] = useState("");
  const [serieId, setSerieId] = useState("");
  const [modeEntree, setModeEntree] = useState("");
  const [page, setPage] = useState(1);
  const [resultat, setResultat] = useState<{
    data: Filiere[];
    total: number;
    dernierePage: number;
  }>({ data: [], total: 0, dernierePage: 1 });
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    getSeries().then(setSeries).catch(() => {});
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      setChargement(true);
      getFilieres({
        q: q || undefined,
        serie_id: serieId ? Number(serieId) : undefined,
        mode_entree: modeEntree || undefined,
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
  }, [q, serieId, modeEntree, page]);

  function onFiltreChange<T>(setter: (v: T) => void) {
    return (valeur: T) => {
      setPage(1);
      setter(valeur);
    };
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader
        eyebrow="Catalogue"
        title="Filières"
        subtitle={`${resultat.total} filière(s) référencée(s) dans le guide officiel d'orientation du Bénin.`}
        backgroundImage="/images/backgrounds/library.jpg"
      />

      <div className="mt-8 flex flex-wrap gap-3">
        <div className="min-w-[240px] flex-1">
          <Input
            value={q}
            onChange={(e) => onFiltreChange(setQ)(e.target.value)}
            placeholder="Rechercher une filière..."
          />
        </div>
        <select
          value={serieId}
          onChange={(e) => onFiltreChange(setSerieId)(e.target.value)}
          className="rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
        >
          <option value="">Toutes les séries</option>
          {series.map((s) => (
            <option key={s.id} value={s.id}>
              {s.code}
            </option>
          ))}
        </select>
        <select
          value={modeEntree}
          onChange={(e) => onFiltreChange(setModeEntree)(e.target.value)}
          className="rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
        >
          {MODES_ENTREE.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
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
          {resultat.data.map((filiere) => (
            <motion.div key={filiere.id} variants={elementEnCascade}>
              <CardLink href={`/filieres/${filiere.id}`}>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-800/30 dark:text-brand-300">
                  <FiliereIcon nom={filiere.nom} />
                </span>
                <h2 className="mt-3 font-semibold leading-snug group-hover:text-brand-600">
                  {filiere.nom}
                </h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5" />
                  {filiere.etablissement?.nom}
                </p>
                <Badge variant="neutral" className="mt-3 capitalize">
                  {filiere.mode_entree}
                </Badge>
              </CardLink>
            </motion.div>
          ))}
          {resultat.data.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              <SearchX className="h-8 w-8" />
              Aucune filière ne correspond à ces critères.
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
