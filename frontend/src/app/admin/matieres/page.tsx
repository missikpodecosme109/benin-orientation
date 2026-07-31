"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { matieresAdmin } from "@/lib/admin-api";
import { Matiere } from "@/lib/api";

export default function AdminMatieresPage() {
  return (
    <CrudPage<Matiere, { nom: string }>
      titre="Matières"
      description="Gérez les matières utilisées dans les simulations et les filières."
      service={matieresAdmin}
      valeursParDefaut={{ nom: "" }}
      nomElement={(m) => m.nom}
      colonnes={[{ label: "Nom", render: (m) => <span className="font-medium">{m.nom}</span> }]}
      champs={[{ name: "nom", label: "Nom", type: "text", required: true }]}
    />
  );
}
