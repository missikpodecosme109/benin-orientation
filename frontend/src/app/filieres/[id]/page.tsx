import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  Briefcase,
  Building2,
  ClipboardCheck,
  GraduationCap,
  Landmark,
} from "lucide-react";
import { ApiError, getFiliere } from "@/lib/api";
import { FavoriButton } from "@/components/FavoriButton";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FiliereIcon } from "@/components/FiliereIcon";
import { RetourLien } from "@/components/RetourLien";

export const dynamic = "force-dynamic";

export default async function FiliereDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const filiere = await chargerFiliere(Number(id));

  if (!filiere) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <RetourLien fallbackHref="/filieres" label="Toutes les filières" />

      <div className="mt-4 flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-800/30 dark:text-brand-300">
          <FiliereIcon nom={filiere.nom} className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {filiere.nom}
          </h1>
          {filiere.etablissement && (
            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <Link
                href={`/etablissements/${filiere.etablissement.id}`}
                className="hover:text-brand-600"
              >
                {filiere.etablissement.nom}
              </Link>
              {filiere.etablissement.universite && (
                <>
                  <span>·</span>
                  <Link
                    href={`/universites/${filiere.etablissement.universite.id}`}
                    className="hover:text-brand-600"
                  >
                    {filiere.etablissement.universite.nom}
                  </Link>
                </>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Info
          icon={ClipboardCheck}
          label="Mode d'entrée"
          valeur={filiere.mode_entree}
        />
        <Info
          icon={Award}
          label="Quota bourse"
          valeur={String(filiere.quota_bourse)}
        />
        <Info
          icon={GraduationCap}
          label="Quota aide FPP"
          valeur={String(filiere.quota_aide_fpp)}
        />
      </div>

      {filiere.series && filiere.series.length > 0 && (
        <div className="mt-8">
          <h2 className="flex items-center gap-2 font-semibold">
            <Landmark className="h-4 w-4 text-brand-600" />
            Séries de bac recommandées
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {filiere.series.map((serie) => (
              <Badge key={serie.id} variant="brand">
                {serie.code}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {filiere.debouches && filiere.debouches.length > 0 && (
        <div className="mt-8">
          <h2 className="flex items-center gap-2 font-semibold">
            <Briefcase className="h-4 w-4 text-brand-600" />
            Débouchés
          </h2>
          <Card className="mt-3">
            <ul className="grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {filiere.debouches.map((d) => (
                <li key={d.id} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {d.libelle}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      <div className="mt-8">
        <FavoriButton filiereId={filiere.id} />
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  valeur,
}: {
  icon: React.ElementType;
  label: string;
  valeur: string;
}) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <Icon className="h-5 w-5 shrink-0 text-brand-600" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold capitalize">{valeur}</p>
      </div>
    </Card>
  );
}

async function chargerFiliere(id: number) {
  try {
    return await getFiliere(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}
