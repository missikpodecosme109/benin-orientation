const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("bo_token");
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("bo_token", token);
  else localStorage.removeItem("bo_token");
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message || "Une erreur est survenue", body.errors);
  }

  if (res.status === 204) return null as T;

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
  }
}

export interface Serie {
  id: number;
  code: string;
  libelle: string | null;
}

export interface Matiere {
  id: number;
  nom: string;
  principale?: boolean;
  coefficient?: number;
}

export interface Universite {
  id: number;
  nom: string;
  etablissements_count?: number;
}

export interface Etablissement {
  id: number;
  nom: string;
  sigle: string | null;
  universite_id: number;
  universite?: Universite;
  filieres_count?: number;
}

export interface Filiere {
  id: number;
  nom: string;
  quota_bourse: number;
  quota_aide_fpp: number;
  mode_entree: "classement" | "concours" | "dossier";
  etablissement?: Etablissement;
  series?: Serie[];
  debouches?: { id: number; libelle: string }[];
}

export interface ResultatSimulation {
  filiere_id: number;
  filiere_nom: string;
  etablissement: string;
  universite: string;
  compatibilite: number;
  score: number;
  matieres_fortes: string[];
  matieres_faibles: string[];
  debouches: string[];
}

export interface Simulation {
  id: number;
  serie_id: number;
  serie?: Serie;
  notes: Record<string, number>;
  resultats: ResultatSimulation[];
  created_at: string;
}

export interface Favori {
  id: number;
  filiere_id: number;
  filiere: Filiere;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "candidat" | "admin";
}

export interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

// --- Authentification ---

export function register(data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  return api<{ user: User; token: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(data: { email: string; password: string }) {
  return api<{ user: User; token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logout() {
  return api<{ message: string }>("/auth/logout", { method: "POST" });
}

export function me() {
  return api<User>("/auth/me");
}

// --- Séries et matières ---

export function getSeries() {
  return api<Serie[]>("/series");
}

export function getMatieresDeSerie(serieId: number) {
  return api<Matiere[]>(`/series/${serieId}/matieres`);
}

// --- Universités ---

export function getUniversites() {
  return api<Universite[]>("/universites");
}

export function getUniversite(id: number) {
  return api<
    Universite & {
      etablissements: (Etablissement & { filieres: Filiere[] })[];
    }
  >(`/universites/${id}`);
}

// --- Établissements ---

export function getEtablissements(params: {
  q?: string;
  universite_id?: number;
  page?: number;
} = {}) {
  return api<Paginated<Etablissement>>(
    `/etablissements${toQueryString(params)}`
  );
}

export function getEtablissement(id: number) {
  return api<
    Etablissement & { filieres: (Filiere & { debouches: { id: number; libelle: string }[]; series: Serie[] })[] }
  >(`/etablissements/${id}`);
}

// --- Filières ---

export function getFilieres(params: {
  q?: string;
  serie_id?: number;
  etablissement_id?: number;
  mode_entree?: string;
  page?: number;
} = {}) {
  return api<Paginated<Filiere>>(`/filieres${toQueryString(params)}`);
}

export function getFiliere(id: number) {
  return api<Filiere>(`/filieres/${id}`);
}

// --- Simulations ---

export function creerSimulation(data: {
  serie_id: number;
  notes: Record<number, number>;
}) {
  return api<{
    simulation_id: number;
    serie: string;
    resultats: ResultatSimulation[];
  }>("/simulations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getSimulations(page = 1) {
  return api<Paginated<Simulation>>(`/simulations${toQueryString({ page })}`);
}

export function getSimulation(id: number) {
  return api<Simulation>(`/simulations/${id}`);
}

// --- Favoris ---

export function getFavoris() {
  return api<Favori[]>("/favoris");
}

export function ajouterFavori(filiereId: number) {
  return api<Favori>("/favoris", {
    method: "POST",
    body: JSON.stringify({ filiere_id: filiereId }),
  });
}

export function retirerFavori(id: number) {
  return api<null>(`/favoris/${id}`, { method: "DELETE" });
}

function toQueryString(params: Record<string, string | number | undefined>) {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== ""
  );
  if (entries.length === 0) return "";
  const search = new URLSearchParams(
    entries.map(([key, value]) => [key, String(value)])
  );
  return `?${search.toString()}`;
}
