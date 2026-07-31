"use client";

import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { telechargerExportCsv, importerFilieresCsv, ResultatImport, TypeExport } from "@/lib/admin-api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/Spinner";

const EXPORTS: { type: TypeExport; label: string }[] = [
  { type: "universites", label: "Universités" },
  { type: "etablissements", label: "Établissements" },
  { type: "filieres", label: "Filières" },
  { type: "series", label: "Séries" },
  { type: "matieres", label: "Matières" },
];

export default function AdminImportExportPage() {
  const [exportEnCours, setExportEnCours] = useState<TypeExport | null>(null);
  const [importEnCours, setImportEnCours] = useState(false);
  const [resultatImport, setResultatImport] = useState<ResultatImport | null>(null);
  const [erreurImport, setErreurImport] = useState<string | null>(null);
  const inputFichier = useRef<HTMLInputElement>(null);

  async function exporter(type: TypeExport) {
    setExportEnCours(type);
    try {
      await telechargerExportCsv(type);
    } finally {
      setExportEnCours(null);
    }
  }

  async function importerFichier(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) return;

    setImportEnCours(true);
    setResultatImport(null);
    setErreurImport(null);
    try {
      const resultat = await importerFilieresCsv(fichier);
      setResultatImport(resultat);
    } catch {
      setErreurImport("L'import a échoué. Vérifiez le format du fichier CSV.");
    } finally {
      setImportEnCours(false);
      if (inputFichier.current) inputFichier.current.value = "";
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Import / Export"
        subtitle="Exportez le contenu en CSV, ou importez des filières en masse."
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Export CSV</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Téléchargez le contenu actuel d&apos;une table au format CSV.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {EXPORTS.map((exp) => (
              <Button
                key={exp.type}
                variant="secondary"
                onClick={() => exporter(exp.type)}
                disabled={exportEnCours !== null}
                className="justify-start"
              >
                {exportEnCours === exp.type ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {exp.label}
              </Button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">Import de filières</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Importez un CSV avec les colonnes : <code>id, nom, etablissement_id, quota_bourse,
            quota_aide_fpp, mode_entree</code>. Une ligne avec un <code>id</code> existant met à
            jour la filière, sinon elle est créée. Utilisez l&apos;export « Filières » comme modèle.
          </p>
          <div className="mt-4">
            <input
              ref={inputFichier}
              type="file"
              accept=".csv,text/csv"
              onChange={importerFichier}
              disabled={importEnCours}
              className="hidden"
              id="import-filieres"
            />
            <Button
              variant="secondary"
              disabled={importEnCours}
              onClick={() => inputFichier.current?.click()}
            >
              {importEnCours ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
              Choisir un fichier CSV
            </Button>
          </div>

          {erreurImport && <p className="mt-4 text-sm text-red-600">{erreurImport}</p>}

          {resultatImport && (
            <div className="mt-4 rounded-lg border border-border bg-black/[0.02] p-4 text-sm dark:bg-white/[0.03]">
              <p>
                <span className="font-semibold text-brand-600">{resultatImport.crees}</span> créée(s),{" "}
                <span className="font-semibold text-brand-600">{resultatImport.modifies}</span> modifiée(s).
              </p>
              {resultatImport.erreurs.length > 0 && (
                <ul className="mt-2 list-inside list-disc text-red-600">
                  {resultatImport.erreurs.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
