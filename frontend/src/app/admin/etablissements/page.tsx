"use client";

import { useEffect, useState } from "react";
import { CrudPage } from "@/components/admin/CrudPage";
import { etablissementsAdmin, AdminEtablissement } from "@/lib/admin-api";
import { getUniversites, Universite } from "@/lib/api";

export default function AdminEtablissementsPage() {
  const [universites, setUniversites] = useState<Universite[]>([]);
  const [universiteId, setUniversiteId] = useState("");

  useEffect(() => {
    getUniversites().then(setUniversites).catch(() => {});
  }, []);

  return (
    <CrudPage<AdminEtablissement, { nom: string; sigle?: string; universite_id: number }>
      titre="Établissements"
      description="Gérez les établissements rattachés à chaque université."
      service={etablissementsAdmin}
      valeursParDefaut={{ nom: "", sigle: "", universite_id: universites[0]?.id ?? 0 }}
      nomElement={(e) => e.nom}
      filtresExtra={{
        params: { universite_id: universiteId || undefined },
        slot: (
          <select
            value={universiteId}
            onChange={(e) => setUniversiteId(e.target.value)}
            className="rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
          >
            <option value="">Toutes les universités</option>
            {universites.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nom}
              </option>
            ))}
          </select>
        ),
      }}
      colonnes={[
        { label: "Nom", render: (e) => <span className="font-medium">{e.nom}</span> },
        { label: "Sigle", render: (e) => e.sigle ?? "—" },
        { label: "Université", render: (e) => e.universite?.nom ?? "—" },
        { label: "Filières", render: (e) => e.filieres_count ?? 0 },
      ]}
      champs={[
        { name: "nom", label: "Nom", type: "text", required: true },
        { name: "sigle", label: "Sigle", type: "text" },
        {
          name: "universite_id",
          label: "Université",
          type: "select",
          required: true,
          options: universites.map((u) => ({ value: u.id, label: u.nom })),
        },
      ]}
    />
  );
}
