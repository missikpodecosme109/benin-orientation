"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, Heart, History, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  Favori,
  Simulation,
  getFavoris,
  getSimulations,
  retirerFavori,
} from "@/lib/api";
import { Pagination } from "@/components/Pagination";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/Spinner";
import { conteneurEnCascade, elementEnCascade } from "@/lib/motion";

type Onglet = "favoris" | "historique";

export default function TableauDeBordPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [onglet, setOnglet] = useState<Onglet>("favoris");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/connexion");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-16 text-sm text-muted-foreground sm:px-6">
        <Spinner className="h-4 w-4" /> Chargement...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Bonjour {user.name}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Retrouvez vos filières favorites et l&apos;historique de vos
          simulations.
        </p>
      </motion.div>

      <div className="mt-8 flex gap-2 border-b border-border">
        <OngletBouton
          icon={Heart}
          actif={onglet === "favoris"}
          onClick={() => setOnglet("favoris")}
          label="Mes favoris"
        />
        <OngletBouton
          icon={History}
          actif={onglet === "historique"}
          onClick={() => setOnglet("historique")}
          label="Historique des simulations"
        />
      </div>

      <div className="mt-6">
        {onglet === "favoris" ? <ListeFavoris /> : <ListeHistorique />}
      </div>
    </div>
  );
}

function OngletBouton({
  icon: Icon,
  actif,
  onClick,
  label,
}: {
  icon: React.ElementType;
  actif: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
        actif
          ? "border-brand-600 text-brand-600"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function ListeFavoris() {
  const [favoris, setFavoris] = useState<Favori[] | null>(null);

  useEffect(() => {
    getFavoris()
      .then(setFavoris)
      .catch(() => setFavoris([]));
  }, []);

  async function retirer(id: number) {
    setFavoris((prev) => prev?.filter((f) => f.id !== id) ?? null);
    try {
      await retirerFavori(id);
    } catch {
      getFavoris().then(setFavoris);
    }
  }

  if (favoris === null) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="h-4 w-4" /> Chargement...
      </p>
    );
  }

  if (favoris.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
        Vous n&apos;avez pas encore de filière favorite.{" "}
        <Link href="/filieres" className="font-medium text-brand-600">
          Parcourir les filières
        </Link>
        .
      </div>
    );
  }

  return (
    <motion.div
      variants={conteneurEnCascade}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-3"
    >
      {favoris.map((favori) => (
        <Card
          key={favori.id}
          variants={elementEnCascade}
          className="flex items-center justify-between"
        >
          <div>
            <Link
              href={`/filieres/${favori.filiere.id}`}
              className="font-semibold hover:text-brand-600"
            >
              {favori.filiere.nom}
            </Link>
            <p className="text-sm text-muted-foreground">
              {favori.filiere.etablissement?.nom}
            </p>
          </div>
          <button
            onClick={() => retirer(favori.id)}
            className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline"
          >
            <Trash2 className="h-4 w-4" />
            Retirer
          </button>
        </Card>
      ))}
    </motion.div>
  );
}

function ListeHistorique() {
  const [page, setPage] = useState(1);
  const [simulations, setSimulations] = useState<Simulation[] | null>(null);
  const [dernierePage, setDernierePage] = useState(1);
  const [ouverte, setOuverte] = useState<number | null>(null);

  useEffect(() => {
    getSimulations(page)
      .then((res) => {
        setSimulations(res.data);
        setDernierePage(res.last_page);
      })
      .catch(() => setSimulations([]));
  }, [page]);

  if (simulations === null) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="h-4 w-4" /> Chargement...
      </p>
    );
  }

  if (simulations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
        Vous n&apos;avez pas encore lancé de simulation.{" "}
        <Link href="/simulation" className="font-medium text-brand-600">
          Faire ma simulation
        </Link>
        .
      </div>
    );
  }

  return (
    <div>
      <motion.div
        variants={conteneurEnCascade}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3"
      >
        {simulations.map((simulation) => (
          <Card key={simulation.id} variants={elementEnCascade} className="p-0">
            <button
              onClick={() =>
                setOuverte((prev) =>
                  prev === simulation.id ? null : simulation.id
                )
              }
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div>
                <p className="font-semibold">
                  Série {simulation.serie?.code ?? "?"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(simulation.created_at).toLocaleDateString(
                    "fr-FR",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}{" "}
                  · {simulation.resultats.length} filière(s)
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-brand-600 transition-transform ${ouverte === simulation.id ? "rotate-180" : ""}`}
              />
            </button>

            {ouverte === simulation.id && (
              <div className="flex flex-col gap-2 border-t border-border p-4">
                {simulation.resultats.slice(0, 10).map((r) => (
                  <div
                    key={r.filiere_id}
                    className="flex items-center justify-between text-sm"
                  >
                    <Link
                      href={`/filieres/${r.filiere_id}`}
                      className="hover:text-brand-600"
                    >
                      {r.filiere_nom}
                    </Link>
                    <span className="font-semibold text-brand-600">
                      {r.compatibilite}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </motion.div>

      <Pagination page={page} dernierePage={dernierePage} onChange={setPage} />
    </div>
  );
}
