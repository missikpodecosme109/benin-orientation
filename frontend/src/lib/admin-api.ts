import { api, API_URL, getToken, ApiError, Paginated, Universite, Etablissement, Filiere, Serie, Matiere, Simulation, User } from "@/lib/api";

export interface AdminEtablissement extends Etablissement {
  universite: Universite;
}

export interface AdminFiliere extends Filiere {
  etablissement: AdminEtablissement;
  debouches_count?: number;
}

export interface AdminSerie extends Serie {
  filieres_count?: number;
}

export interface AdminUser extends User {
  created_at: string;
  simulations_count?: number;
  favoris_count?: number;
}

export interface AdminSimulation extends Simulation {
  user: { id: number; name: string; email: string } | null;
}

export interface DashboardStats {
  totaux: {
    universites: number;
    etablissements: number;
    filieres: number;
    series: number;
    matieres: number;
    utilisateurs: number;
    simulations: number;
  };
  simulations_par_jour: { jour: string; total: number }[];
  filieres_les_plus_demandees: { id: number; nom: string; nb_favoris: number }[];
  series_les_plus_utilisees: { id: number; code: string; nb_simulations: number }[];
  derniers_utilisateurs: { id: number; name: string; email: string; role: string; created_at: string }[];
}

export function getDashboard() {
  return api<DashboardStats>("/admin/dashboard");
}

// --- Fabrique générique de CRUD pour les ressources simples ---

function crud<T, TCreate = Partial<T>>(resource: string) {
  return {
    list: (params: Record<string, string | number | undefined> = {}) =>
      api<Paginated<T>>(`/admin/${resource}${toQueryString(params)}`),
    get: (id: number) => api<T>(`/admin/${resource}/${id}`),
    create: (data: TCreate) =>
      api<T>(`/admin/${resource}`, { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: TCreate) =>
      api<T>(`/admin/${resource}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id: number) => api<null>(`/admin/${resource}/${id}`, { method: "DELETE" }),
  };
}

export const universitesAdmin = crud<Universite, { nom: string; sigle?: string }>("universites");

export const etablissementsAdmin = crud<
  AdminEtablissement,
  { nom: string; sigle?: string; universite_id: number }
>("etablissements");

export const filieresAdmin = crud<
  AdminFiliere,
  {
    nom: string;
    etablissement_id: number;
    quota_bourse?: number;
    quota_aide_fpp?: number;
    mode_entree: "classement" | "concours" | "dossier";
    series?: number[];
    debouches?: string[];
  }
>("filieres");

export const seriesAdmin = crud<AdminSerie, { code: string; libelle?: string }>("series");

export const matieresAdmin = crud<Matiere, { nom: string }>("matieres");

export interface Debouche {
  id: number;
  libelle: string;
  filiere_id: number;
  filiere?: Filiere;
}

export const debouchesAdmin = crud<Debouche, { libelle: string; filiere_id: number }>("debouches");

export const utilisateursAdmin = crud<
  AdminUser,
  { name: string; email: string; password?: string; role: "candidat" | "admin" }
>("utilisateurs");

// --- Simulations (lecture + suppression uniquement) ---

export function getSimulationsAdmin(params: { page?: number; serie_id?: number; user_id?: number } = {}) {
  return api<Paginated<AdminSimulation>>(`/admin/simulations${toQueryString(params)}`);
}

export function supprimerSimulationAdmin(id: number) {
  return api<null>(`/admin/simulations/${id}`, { method: "DELETE" });
}

// --- Import / export CSV ---

export type TypeExport = "universites" | "etablissements" | "filieres" | "series" | "matieres";

export async function telechargerExportCsv(type: TypeExport) {
  const token = getToken();
  const res = await fetch(`${API_URL}/admin/export/${type}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new ApiError(res.status, "Échec de l'export.");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${type}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export interface ResultatImport {
  crees: number;
  modifies: number;
  erreurs: string[];
}

export async function importerFilieresCsv(fichier: File): Promise<ResultatImport> {
  const token = getToken();
  const formData = new FormData();
  formData.append("fichier", fichier);

  const res = await fetch(`${API_URL}/admin/import/filieres`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, body.message || "Échec de l'import.", body.errors);

  return body as ResultatImport;
}

function toQueryString(params: Record<string, string | number | undefined>) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "");
  if (entries.length === 0) return "";
  return `?${new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()}`;
}
