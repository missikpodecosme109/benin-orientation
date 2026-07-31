"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { seriesAdmin, AdminSerie } from "@/lib/admin-api";

export default function AdminSeriesPage() {
  return (
    <CrudPage<AdminSerie, { code: string; libelle?: string }>
      titre="Séries"
      description="Gérez les séries du baccalauréat (C, D, A1, G2...)."
      service={seriesAdmin}
      valeursParDefaut={{ code: "", libelle: "" }}
      nomElement={(s) => s.code}
      colonnes={[
        { label: "Code", render: (s) => <span className="font-medium">{s.code}</span> },
        { label: "Libellé", render: (s) => s.libelle ?? "—" },
        { label: "Filières", render: (s) => s.filieres_count ?? 0 },
      ]}
      champs={[
        { name: "code", label: "Code", type: "text", required: true, placeholder: "ex: D" },
        { name: "libelle", label: "Libellé", type: "text" },
      ]}
    />
  );
}
