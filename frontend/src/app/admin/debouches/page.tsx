"use client";

import { useEffect, useState } from "react";
import { CrudPage } from "@/components/admin/CrudPage";
import { debouchesAdmin, filieresAdmin, Debouche, AdminFiliere } from "@/lib/admin-api";

export default function AdminDebouchesPage() {
  const [filieres, setFilieres] = useState<AdminFiliere[]>([]);
  const [filiereId, setFiliereId] = useState("");

  useEffect(() => {
    filieresAdmin
      .list({ per_page: 500 })
      .then((res) => setFilieres(res.data))
      .catch(() => {});
  }, []);

  return (
    <CrudPage<Debouche, { libelle: string; filiere_id: number }>
      titre="Débouchés"
      description="Gérez les débouchés professionnels associés à chaque filière."
      service={debouchesAdmin}
      valeursParDefaut={{ libelle: "", filiere_id: filieres[0]?.id ?? 0 }}
      nomElement={(d) => d.libelle}
      filtresExtra={{
        params: { filiere_id: filiereId || undefined },
        slot: (
          <select
            value={filiereId}
            onChange={(e) => setFiliereId(e.target.value)}
            className="max-w-[240px] rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
          >
            <option value="">Toutes les filières</option>
            {filieres.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nom}
              </option>
            ))}
          </select>
        ),
      }}
      colonnes={[
        { label: "Débouché", render: (d) => <span className="font-medium">{d.libelle}</span> },
        { label: "Filière", render: (d) => d.filiere?.nom ?? "—" },
      ]}
      champs={[
        { name: "libelle", label: "Débouché", type: "text", required: true },
        {
          name: "filiere_id",
          label: "Filière",
          type: "select",
          required: true,
          options: filieres.map((f) => ({ value: f.id, label: f.nom })),
        },
      ]}
    />
  );
}
