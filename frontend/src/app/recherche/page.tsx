"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Building2, Search, SearchX } from "lucide-react";
import { Etablissement, Filiere, getEtablissements, getFilieres } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardLink } from "@/components/ui/Card";
import { conteneurEnCascade, elementEnCascade } from "@/lib/motion";
import { FiliereIcon } from "@/components/FiliereIcon";

export default function RecherchePage() {
  const [terme, setTerme] = useState("");
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [chargement, setChargement] = useState(false);
  const [aRecherche, setARecherche] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      if (terme.trim().length < 2) {
        setFilieres([]);
        setEtablissements([]);
        setARecherche(false);
        return;
      }

      setChargement(true);
      setARecherche(true);
      Promise.all([
        getFilieres({ q: terme, page: 1 }),
        getEtablissements({ q: terme, page: 1 }),
      ])
        .then(([f, e]) => {
          setFilieres(f.data);
          setEtablissements(e.data);
        })
        .catch(() => {
          setFilieres([]);
          setEtablissements([]);
        })
        .finally(() => setChargement(false));
    }, 350);
    return () => clearTimeout(id);
  }, [terme]);

  const total = filieres.length + etablissements.length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <PageHeader
        eyebrow="Explorer"
        title="Recherche"
        subtitle="Recherchez une filière ou un établissement par nom."
        backgroundImage="/images/backgrounds/classroom.jpg"
      />

      <div className="relative mt-8">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          value={terme}
          onChange={(e) => setTerme(e.target.value)}
          placeholder="Ex : génie informatique, EPAC, droit..."
          className="w-full rounded-xl border-2 border-border-strong bg-surface py-3.5 pl-11 pr-4 text-sm outline-none focus:border-brand-500"
        />
      </div>

      {aRecherche && !chargement && (
        <p className="mt-4 text-sm text-muted-foreground">
          {total} résultat(s) pour « {terme} »
        </p>
      )}

      {filieres.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Filières
          </h2>
          <motion.div
            variants={conteneurEnCascade}
            initial="hidden"
            animate="visible"
            className="mt-2 flex flex-col gap-2"
          >
            {filieres.map((f) => (
              <motion.div key={f.id} variants={elementEnCascade}>
                <CardLink href={`/filieres/${f.id}`}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-800/30 dark:text-brand-300">
                      <FiliereIcon nom={f.nom} className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium group-hover:text-brand-600">{f.nom}</p>
                      <p className="text-sm text-muted-foreground">
                        {f.etablissement?.nom}
                      </p>
                    </div>
                  </div>
                </CardLink>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {etablissements.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Établissements
          </h2>
          <motion.div
            variants={conteneurEnCascade}
            initial="hidden"
            animate="visible"
            className="mt-2 flex flex-col gap-2"
          >
            {etablissements.map((e) => (
              <motion.div key={e.id} variants={elementEnCascade}>
                <CardLink href={`/etablissements/${e.id}`}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-800/30 dark:text-brand-300">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium group-hover:text-brand-600">
                        {e.sigle ? `${e.sigle} · ${e.nom}` : e.nom}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {e.universite?.nom}
                      </p>
                    </div>
                  </div>
                </CardLink>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {aRecherche && !chargement && total === 0 && (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          <SearchX className="h-8 w-8" />
          Aucun résultat pour « {terme} ».
        </div>
      )}
    </div>
  );
}
