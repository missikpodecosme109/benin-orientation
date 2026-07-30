"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  Heart,
  HeartOff,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  ApiError,
  Matiere,
  ResultatSimulation,
  Serie,
  ajouterFavori,
  creerSimulation,
  getMatieresDeSerie,
  getSeries,
} from "@/lib/api";
import { Stepper } from "@/components/Stepper";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { conteneurEnCascade, elementEnCascade } from "@/lib/motion";

type Etape = "serie" | "notes" | "resultats";
const INDEX_ETAPE: Record<Etape, number> = {
  serie: 0,
  notes: 1,
  resultats: 2,
};

export default function SimulationPage() {
  const [etape, setEtape] = useState<Etape>("serie");
  const [series, setSeries] = useState<Serie[]>([]);
  const [serieChoisie, setSerieChoisie] = useState<Serie | null>(null);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [afficherSpecifiques, setAfficherSpecifiques] = useState(false);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [resultats, setResultats] = useState<ResultatSimulation[] | null>(
    null
  );
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const hautDePage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getSeries()
      .then(setSeries)
      .catch(() => setErreur("Impossible de charger les séries de bac."));
  }, []);

  useEffect(() => {
    hautDePage.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [etape]);

  async function choisirSerie(serie: Serie) {
    setSerieChoisie(serie);
    setErreur(null);
    setChargement(true);
    try {
      const liste = await getMatieresDeSerie(serie.id);
      setMatieres(liste);
      setAfficherSpecifiques(false);
      setNotes({});
      setEtape("notes");
    } catch {
      setErreur("Impossible de charger les matières de cette série.");
    } finally {
      setChargement(false);
    }
  }

  async function lancerSimulation() {
    if (!serieChoisie) return;
    setErreur(null);

    const notesNumeriques: Record<number, number> = {};
    for (const m of matieres) {
      const brut = notes[m.id];
      if (brut === undefined || brut === "") continue;
      notesNumeriques[m.id] = Number(brut);
    }

    if (Object.keys(notesNumeriques).length === 0) {
      setErreur("Renseignez au moins une note pour lancer la simulation.");
      return;
    }

    setChargement(true);
    try {
      const res = await creerSimulation({
        serie_id: serieChoisie.id,
        notes: notesNumeriques,
      });
      setResultats(res.resultats);
      setEtape("resultats");
    } catch (err) {
      setErreur(
        err instanceof ApiError
          ? err.message
          : "Impossible de lancer la simulation pour le moment."
      );
    } finally {
      setChargement(false);
    }
  }

  function recommencer() {
    setEtape("serie");
    setSerieChoisie(null);
    setMatieres([]);
    setNotes({});
    setResultats(null);
    setErreur(null);
  }

  const matieresPrincipales = matieres.filter((m) => m.principale !== false);
  const matieresSpecifiques = matieres.filter((m) => m.principale === false);

  return (
    <div
      ref={hautDePage}
      className="mx-auto max-w-3xl px-4 py-12 sm:px-6 scroll-mt-20"
    >
      <PageHeader
        eyebrow="Assistant"
        title="Simulation d'orientation"
        subtitle="Trois étapes pour trouver les filières les plus compatibles avec votre profil."
        backgroundImage="/images/backgrounds/classroom.jpg"
      />
      <div className="mt-8">
        <Stepper etapeIndex={INDEX_ETAPE[etape]} />
      </div>

      {erreur && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600">
          {erreur}
        </p>
      )}

      {etape === "serie" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
        >
          <h2 className="text-lg font-semibold">
            Quelle est votre série de bac ?
          </h2>
          {series.length === 0 && !erreur && (
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner className="h-4 w-4" /> Chargement des séries...
            </p>
          )}
          <motion.div
            variants={conteneurEnCascade}
            initial="hidden"
            animate="visible"
            className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {series.map((serie) => {
              const enChargement = chargement && serieChoisie?.id === serie.id;
              return (
                <motion.button
                  key={serie.id}
                  variants={elementEnCascade}
                  whileHover={{ scale: chargement ? 1 : 1.03 }}
                  whileTap={{ scale: chargement ? 1 : 0.97 }}
                  onClick={() => choisirSerie(serie)}
                  disabled={chargement}
                  className={`relative rounded-xl border-2 bg-surface px-4 py-4 text-center transition-colors disabled:opacity-60 ${
                    enChargement
                      ? "border-brand-600"
                      : "border-border hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-800/10"
                  }`}
                  style={{ boxShadow: "var(--card-shadow)" }}
                >
                  {enChargement && (
                    <Spinner className="absolute right-2 top-2 h-4 w-4 text-brand-600" />
                  )}
                  <span className="block text-lg font-bold">{serie.code}</span>
                  {serie.libelle && (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {serie.libelle}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      )}

      {etape === "notes" && serieChoisie && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
        >
          <h2 className="text-lg font-semibold">
            Notes pour la série {serieChoisie.code} (sur 20)
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ces matières sont chargées automatiquement pour votre série.
            Renseignez uniquement celles dont vous connaissez la note.
          </p>

          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface" style={{ boxShadow: "var(--card-shadow)" }}>
            {matieresPrincipales.map((matiere, i) => (
              <ChampNote
                key={matiere.id}
                matiere={matiere}
                valeur={notes[matiere.id] ?? ""}
                dernier={i === matieresPrincipales.length - 1 && matieresSpecifiques.length === 0}
                onChange={(v) =>
                  setNotes((prev) => ({ ...prev, [matiere.id]: v }))
                }
              />
            ))}

            {matieresSpecifiques.length > 0 && (
              <>
                <button
                  onClick={() => setAfficherSpecifiques((v) => !v)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-800/10"
                >
                  <span>
                    {afficherSpecifiques ? "Masquer" : "Ajouter"} les matières
                    de filières spécialisées ({matieresSpecifiques.length})
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${afficherSpecifiques ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {afficherSpecifiques && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {matieresSpecifiques.map((matiere, i) => (
                        <ChampNote
                          key={matiere.id}
                          matiere={matiere}
                          valeur={notes[matiere.id] ?? ""}
                          dernier={i === matieresSpecifiques.length - 1}
                          onChange={(v) =>
                            setNotes((prev) => ({ ...prev, [matiere.id]: v }))
                          }
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={() => setEtape("serie")}>
              Retour
            </Button>
            <Button onClick={lancerSimulation} disabled={chargement}>
              {chargement && <Spinner className="h-4 w-4" />}
              {chargement ? "Calcul en cours..." : "Voir mon classement"}
            </Button>
          </div>
        </motion.div>
      )}

      {etape === "resultats" && resultats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3.5 dark:bg-brand-800/15">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-700 dark:text-brand-300">
              <Sparkles className="h-5 w-5" />
              {resultats.length} filière(s) compatible(s)
            </h2>
            <Button variant="ghost" size="sm" onClick={recommencer}>
              <RotateCcw className="h-3.5 w-3.5" />
              Refaire
            </Button>
          </div>

          <motion.div
            variants={conteneurEnCascade}
            initial="hidden"
            animate="visible"
            className="mt-4 flex flex-col gap-4"
          >
            {resultats.map((resultat) => (
              <ResultatCard key={resultat.filiere_id} resultat={resultat} />
            ))}
            {resultats.length === 0 && (
              <Card>
                <p className="text-sm text-muted-foreground">
                  Aucune filière compatible n&apos;a été trouvée avec les
                  notes renseignées.
                </p>
              </Card>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function ChampNote({
  matiere,
  valeur,
  dernier,
  onChange,
}: {
  matiere: Matiere;
  valeur: string;
  dernier: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${dernier ? "" : "border-b border-border"}`}
    >
      <label
        htmlFor={`matiere-${matiere.id}`}
        className="flex flex-1 items-center gap-2 text-sm font-medium"
      >
        {matiere.nom}
        {matiere.coefficient && (
          <span className="rounded-full bg-brand-600/10 px-2 py-0.5 text-xs font-semibold text-brand-600">
            coef. {matiere.coefficient}
          </span>
        )}
      </label>
      <input
        id={`matiere-${matiere.id}`}
        type="number"
        min={0}
        max={20}
        step={0.25}
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Note"
        className="w-24 rounded-lg border-2 border-border-strong bg-background px-3 py-1.5 text-sm font-medium outline-none focus:border-brand-500"
      />
    </div>
  );
}

function ResultatCard({ resultat }: { resultat: ResultatSimulation }) {
  const { user } = useAuth();
  const [statutFavori, setStatutFavori] = useState<
    "idle" | "envoi" | "ajoute" | "erreur"
  >("idle");

  async function ajouter() {
    setStatutFavori("envoi");
    try {
      await ajouterFavori(resultat.filiere_id);
      setStatutFavori("ajoute");
    } catch {
      setStatutFavori("erreur");
    }
  }

  return (
    <Card variants={elementEnCascade}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <Link
            href={`/filieres/${resultat.filiere_id}`}
            className="font-semibold hover:text-brand-600"
          >
            {resultat.filiere_nom}
          </Link>
          <p className="text-sm text-muted-foreground">
            {resultat.etablissement} · {resultat.universite}
          </p>
        </div>
        <span className="rounded-full bg-brand-600/10 px-3 py-1 text-sm font-bold text-brand-600">
          {resultat.compatibilite}%
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.08]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${resultat.compatibilite}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full rounded-full bg-brand-600"
        />
      </div>

      {(resultat.matieres_fortes.length > 0 ||
        resultat.matieres_faibles.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {resultat.matieres_fortes.map((m) => (
            <Badge key={`fort-${m}`} variant="brand">
              + {m}
            </Badge>
          ))}
          {resultat.matieres_faibles.map((m) => (
            <Badge key={`faible-${m}`} variant="danger">
              − {m}
            </Badge>
          ))}
        </div>
      )}

      {resultat.debouches.length > 0 && (
        <p className="mt-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Débouchés : </span>
          {resultat.debouches.join(", ")}
        </p>
      )}

      {user && (
        <button
          onClick={ajouter}
          disabled={statutFavori === "envoi" || statutFavori === "ajoute"}
          className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand-600 disabled:text-muted-foreground"
        >
          {statutFavori === "ajoute" ? (
            <>
              <Heart className="h-4 w-4 fill-current" /> Ajouté aux favoris
            </>
          ) : statutFavori === "erreur" ? (
            <>
              <HeartOff className="h-4 w-4" /> Erreur, réessayer
            </>
          ) : (
            <>
              <Heart className="h-4 w-4" /> Ajouter aux favoris
            </>
          )}
        </button>
      )}
    </Card>
  );
}
