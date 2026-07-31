"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { CrudPage } from "@/components/admin/CrudPage";
import { filieresAdmin, etablissementsAdmin, AdminFiliere, AdminEtablissement } from "@/lib/admin-api";
import { getSeries, Serie } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface FiliereForm extends Record<string, unknown> {
  nom: string;
  etablissement_id: number;
  quota_bourse: number;
  quota_aide_fpp: number;
  mode_entree: "classement" | "concours" | "dossier";
  series: number[];
  debouches: string[];
}

const MODES = [
  { value: "classement", label: "Classement" },
  { value: "concours", label: "Concours" },
  { value: "dossier", label: "Dossier" },
];

export default function AdminFilieresPage() {
  const [etablissements, setEtablissements] = useState<AdminEtablissement[]>([]);
  const [series, setSeries] = useState<Serie[]>([]);
  const [etablissementFiltre, setEtablissementFiltre] = useState("");

  useEffect(() => {
    etablissementsAdmin.list({ per_page: 500 }).then((res) => setEtablissements(res.data)).catch(() => {});
    getSeries().then(setSeries).catch(() => {});
  }, []);

  return (
    <CrudPage<AdminFiliere, FiliereForm>
      titre="Filières"
      description="Gérez les filières, leurs séries compatibles et leurs débouchés."
      service={filieresAdmin}
      valeursParDefaut={{
        nom: "",
        etablissement_id: etablissements[0]?.id ?? 0,
        quota_bourse: 0,
        quota_aide_fpp: 0,
        mode_entree: "classement",
        series: [],
        debouches: [],
      }}
      toFormValues={(f) => ({
        nom: f.nom,
        etablissement_id: f.etablissement_id,
        quota_bourse: f.quota_bourse,
        quota_aide_fpp: f.quota_aide_fpp,
        mode_entree: f.mode_entree,
        series: f.series?.map((s) => s.id) ?? [],
        debouches: f.debouches?.map((d) => d.libelle) ?? [],
      })}
      nomElement={(f) => f.nom}
      filtresExtra={{
        params: { etablissement_id: etablissementFiltre || undefined },
        slot: (
          <select
            value={etablissementFiltre}
            onChange={(e) => setEtablissementFiltre(e.target.value)}
            className="max-w-[240px] rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
          >
            <option value="">Tous les établissements</option>
            {etablissements.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nom}
              </option>
            ))}
          </select>
        ),
      }}
      colonnes={[
        { label: "Filière", render: (f) => <span className="font-medium">{f.nom}</span> },
        { label: "Établissement", render: (f) => f.etablissement?.nom ?? "—" },
        { label: "Mode d'entrée", render: (f) => f.mode_entree },
        { label: "Débouchés", render: (f) => f.debouches_count ?? f.debouches?.length ?? 0 },
      ]}
      champs={[
        { name: "nom", label: "Nom de la filière", type: "text", required: true },
        {
          name: "etablissement_id",
          label: "Établissement",
          type: "select",
          required: true,
          options: etablissements.map((e) => ({ value: e.id, label: e.nom })),
        },
        { name: "mode_entree", label: "Mode d'entrée", type: "select", required: true, options: MODES },
        { name: "quota_bourse", label: "Quota bourse", type: "number" },
        { name: "quota_aide_fpp", label: "Quota aide FPP", type: "number" },
        {
          name: "series",
          label: "Séries compatibles",
          type: "custom",
          render: (valeur: number[] = [], setValeur) => (
            <div className="flex flex-wrap gap-2">
              {series.map((s) => {
                const coche = valeur.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() =>
                      setValeur(coche ? valeur.filter((id) => id !== s.id) : [...valeur, s.id])
                    }
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      coche
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-border-strong text-muted-foreground hover:border-brand-500"
                    }`}
                  >
                    {s.code}
                  </button>
                );
              })}
            </div>
          ),
        },
        {
          name: "debouches",
          label: "Débouchés",
          type: "custom",
          render: (valeur: string[] = [], setValeur) => (
            <div className="flex flex-col gap-2">
              {valeur.map((libelle, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={libelle}
                    onChange={(e) => {
                      const copie = [...valeur];
                      copie[i] = e.target.value;
                      setValeur(copie);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setValeur(valeur.filter((_, idx) => idx !== i))}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-red-600 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setValeur([...valeur, ""])}
                className="self-start"
              >
                <Plus className="h-3.5 w-3.5" /> Ajouter un débouché
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
}
