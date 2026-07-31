"use client";

import { CrudPage } from "@/components/admin/CrudPage";
import { utilisateursAdmin, AdminUser } from "@/lib/admin-api";
import { Badge } from "@/components/ui/Badge";

interface UtilisateurForm extends Record<string, unknown> {
  name: string;
  email: string;
  password?: string;
  role: "candidat" | "admin";
}

export default function AdminUtilisateursPage() {
  return (
    <CrudPage<AdminUser, UtilisateurForm>
      titre="Utilisateurs"
      description="Gérez les comptes candidats et administrateurs."
      service={utilisateursAdmin}
      valeursParDefaut={{ name: "", email: "", password: "", role: "candidat" }}
      toFormValues={(u) => ({ name: u.name, email: u.email, password: "", role: u.role })}
      nomElement={(u) => u.name}
      colonnes={[
        { label: "Nom", render: (u) => <span className="font-medium">{u.name}</span> },
        { label: "Email", render: (u) => u.email },
        {
          label: "Rôle",
          render: (u) => (
            <Badge variant={u.role === "admin" ? "brand" : "neutral"}>{u.role}</Badge>
          ),
        },
        { label: "Simulations", render: (u) => u.simulations_count ?? 0 },
        { label: "Favoris", render: (u) => u.favoris_count ?? 0 },
      ]}
      champs={[
        { name: "name", label: "Nom", type: "text", required: true },
        { name: "email", label: "Email", type: "text", required: true },
        {
          name: "password",
          label: "Mot de passe",
          type: "text",
          placeholder: "Laisser vide pour ne pas changer",
        },
        {
          name: "role",
          label: "Rôle",
          type: "select",
          required: true,
          options: [
            { value: "candidat", label: "Candidat" },
            { value: "admin", label: "Administrateur" },
          ],
        },
      ]}
    />
  );
}
