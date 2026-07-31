"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { universitesAdmin, AdminEtablissement } from "@/lib/admin-api";
import { Universite } from "@/lib/api";

interface UniversiteAvecCompte extends Universite {
  etablissements_count?: number;
  etablissements?: AdminEtablissement[];
}

export default function AdminUniversitesPage() {
  return (
    <CrudPage<UniversiteAvecCompte, { nom: string; sigle?: string }>
      titre="Universités"
      description="Gérez les universités référencées sur la plateforme."
      service={universitesAdmin}
      valeursParDefaut={{ nom: "", sigle: "" }}
      nomElement={(u) => u.nom}
      colonnes={[
        { label: "Nom", render: (u) => <span className="font-medium">{u.nom}</span> },
        { label: "Sigle", render: (u) => u.sigle ?? "—" },
        { label: "Établissements", render: (u) => u.etablissements_count ?? 0 },
      ]}
      champs={[
        { name: "nom", label: "Nom", type: "text", required: true },
        { name: "sigle", label: "Sigle", type: "text" },
      ]}
    />
  );
}
