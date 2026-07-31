"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Pencil, Plus, SearchX, Trash2 } from "lucide-react";
import { Paginated, ApiError } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/Pagination";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export type ChampType = "text" | "number" | "select" | "textarea" | "custom";

export interface ChampConfig {
  name: string;
  label: string;
  type: ChampType;
  required?: boolean;
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (valeur: any, setValeur: (v: any) => void) => React.ReactNode;
}

export interface ColonneConfig<T> {
  label: string;
  render: (item: T) => React.ReactNode;
}

interface Service<T, TCreate> {
  list: (params: Record<string, string | number | undefined>) => Promise<Paginated<T>>;
  create: (data: TCreate) => Promise<T>;
  update: (id: number, data: TCreate) => Promise<T>;
  remove: (id: number) => Promise<null>;
}

export function CrudPage<T extends { id: number }, TCreate extends Record<string, unknown>>({
  titre,
  description,
  colonnes,
  champs,
  service,
  valeursParDefaut,
  toFormValues,
  filtresExtra,
  nomElement = (item: T) => `#${item.id}`,
}: {
  titre: string;
  description?: string;
  colonnes: ColonneConfig<T>[];
  champs: ChampConfig[];
  service: Service<T, TCreate>;
  valeursParDefaut: TCreate;
  toFormValues?: (item: T) => TCreate;
  filtresExtra?: {
    params: Record<string, string | number | undefined>;
    slot: React.ReactNode;
  };
  nomElement?: (item: T) => string;
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [resultat, setResultat] = useState<Paginated<T> | null>(null);
  const [chargement, setChargement] = useState(true);

  const [modalOuvert, setModalOuvert] = useState(false);
  const [edition, setEdition] = useState<T | null>(null);
  const [valeurs, setValeurs] = useState<TCreate>(valeursParDefaut);
  const [erreurs, setErreurs] = useState<Record<string, string[]>>({});
  const [envoi, setEnvoi] = useState(false);

  const [aSupprimer, setASupprimer] = useState<T | null>(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  const filtresKey = JSON.stringify(filtresExtra?.params ?? {});

  function charger() {
    setChargement(true);
    service
      .list({ q: q || undefined, page, ...(filtresExtra?.params ?? {}) })
      .then(setResultat)
      .catch(() => setResultat({ data: [], current_page: 1, last_page: 1, total: 0, per_page: 20 }))
      .finally(() => setChargement(false));
  }

  useEffect(() => {
    const id = setTimeout(charger, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, page, filtresKey]);

  function ouvrirCreation() {
    setEdition(null);
    setValeurs(valeursParDefaut);
    setErreurs({});
    setModalOuvert(true);
  }

  function ouvrirEdition(item: T) {
    setEdition(item);
    setValeurs(toFormValues ? toFormValues(item) : ({ ...(item as unknown as TCreate) }));
    setErreurs({});
    setModalOuvert(true);
  }

  async function soumettre(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreurs({});
    try {
      if (edition) {
        await service.update(edition.id, valeurs);
      } else {
        await service.create(valeurs);
      }
      setModalOuvert(false);
      charger();
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setErreurs(err.errors);
      }
    } finally {
      setEnvoi(false);
    }
  }

  async function confirmerSuppression() {
    if (!aSupprimer) return;
    setSuppressionEnCours(true);
    try {
      await service.remove(aSupprimer.id);
      setASupprimer(null);
      charger();
    } finally {
      setSuppressionEnCours(false);
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Administration" title={titre} subtitle={description} />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <div className="min-w-[220px]">
            <Input
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
              placeholder="Rechercher..."
            />
          </div>
          {filtresExtra?.slot}
        </div>
        <Button onClick={ouvrirCreation}>
          <Plus className="h-4 w-4" /> Ajouter
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-black/[0.02] text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground dark:bg-white/[0.03]">
              {colonnes.map((col) => (
                <th key={col.label} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {chargement ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  {colonnes.map((col) => (
                    <td key={col.label} className="px-4 py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                  ))}
                  <td className="px-4 py-3" />
                </tr>
              ))
            ) : resultat?.data.length ? (
              resultat.data.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-border last:border-0 hover:bg-black/[0.015] dark:hover:bg-white/[0.02]"
                >
                  {colonnes.map((col) => (
                    <td key={col.label} className="px-4 py-3">
                      {col.render(item)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => ouvrirEdition(item)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-800/20"
                        aria-label="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setASupprimer(item)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-500/10"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={colonnes.length + 1} className="px-4 py-16">
                  <div className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground">
                    <SearchX className="h-8 w-8" />
                    Aucun résultat.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {resultat && (
        <Pagination page={page} dernierePage={resultat.last_page} onChange={setPage} />
      )}

      <Modal
        ouvert={modalOuvert}
        onFermer={() => setModalOuvert(false)}
        titre={edition ? `Modifier ${nomElement(edition)}` : "Ajouter"}
      >
        <form onSubmit={soumettre} className="flex flex-col gap-4">
          {champs.map((champ) => (
            <div key={champ.name}>
              {champ.type === "custom" ? (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {champ.label}
                  </label>
                  {champ.render?.(valeurs[champ.name], (v) =>
                    setValeurs((prev) => ({ ...prev, [champ.name]: v }))
                  )}
                </div>
              ) : champ.type === "select" ? (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {champ.label}
                  </label>
                  <select
                    required={champ.required}
                    value={(valeurs[champ.name] as string | number | undefined) ?? ""}
                    onChange={(e) =>
                      setValeurs((v) => ({ ...v, [champ.name]: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
                  >
                    <option value="" disabled>
                      Sélectionner...
                    </option>
                    {champ.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {erreurs[champ.name]?.map((msg) => (
                    <p key={msg} className="mt-1 text-xs text-red-600">
                      {msg}
                    </p>
                  ))}
                </div>
              ) : champ.type === "textarea" ? (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {champ.label}
                  </label>
                  <textarea
                    required={champ.required}
                    placeholder={champ.placeholder}
                    value={(valeurs[champ.name] as string | undefined) ?? ""}
                    onChange={(e) =>
                      setValeurs((v) => ({ ...v, [champ.name]: e.target.value }))
                    }
                    rows={3}
                    className="w-full rounded-lg border border-border-strong bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
                  />
                  {erreurs[champ.name]?.map((msg) => (
                    <p key={msg} className="mt-1 text-xs text-red-600">
                      {msg}
                    </p>
                  ))}
                </div>
              ) : (
                <Input
                  label={champ.label}
                  type={champ.type}
                  required={champ.required}
                  placeholder={champ.placeholder}
                  erreurs={erreurs[champ.name]}
                  value={(valeurs[champ.name] as string | number | undefined) ?? ""}
                  onChange={(e) =>
                    setValeurs((v) => ({
                      ...v,
                      [champ.name]: champ.type === "number" ? Number(e.target.value) : e.target.value,
                    }))
                  }
                />
              )}
            </div>
          ))}

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setModalOuvert(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={envoi}>
              {envoi ? "Enregistrement..." : edition ? "Enregistrer" : "Ajouter"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        ouvert={!!aSupprimer}
        titre="Supprimer cet élément ?"
        description={aSupprimer ? `« ${nomElement(aSupprimer)} » sera définitivement supprimé.` : ""}
        enCours={suppressionEnCours}
        onAnnuler={() => setASupprimer(null)}
        onConfirmer={confirmerSuppression}
      />
    </div>
  );
}
