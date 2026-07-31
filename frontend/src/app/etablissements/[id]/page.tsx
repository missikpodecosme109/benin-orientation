import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, GraduationCap } from "lucide-react";
import { ApiError, getEtablissement } from "@/lib/api";
import { CardLink } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FiliereIcon } from "@/components/FiliereIcon";
import { RetourLien } from "@/components/RetourLien";

export const dynamic = "force-dynamic";

export default async function EtablissementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const etablissement = await chargerEtablissement(Number(id));

  if (!etablissement) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <RetourLien fallbackHref="/etablissements" label="Tous les établissements" />

      <div className="mt-4 flex items-start gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-800/30 dark:text-brand-300">
          <Building2 className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {etablissement.sigle
              ? `${etablissement.sigle} · ${etablissement.nom}`
              : etablissement.nom}
          </h1>
          {etablissement.universite && (
            <p className="mt-1 flex items-start gap-1.5 text-muted-foreground">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0" />
              <Link
                href={`/universites/${etablissement.universite.id}`}
                className="hover:text-brand-600"
              >
                {etablissement.universite.nom}
              </Link>
            </p>
          )}
        </div>
      </div>

      <h2 className="mt-10 text-lg font-semibold">
        Filières ({etablissement.filieres.length})
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {etablissement.filieres.map((filiere) => (
          <CardLink key={filiere.id} href={`/filieres/${filiere.id}`}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-800/30 dark:text-brand-300">
              <FiliereIcon nom={filiere.nom} className="h-4 w-4" />
            </span>
            <h3 className="mt-3 font-semibold leading-snug group-hover:text-brand-600">
              {filiere.nom}
            </h3>
            <p className="mt-1 text-xs capitalize text-muted-foreground">
              {filiere.mode_entree}
            </p>
            {filiere.series.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {filiere.series.map((s) => (
                  <Badge key={s.id} variant="neutral">
                    {s.code}
                  </Badge>
                ))}
              </div>
            )}
          </CardLink>
        ))}
        {etablissement.filieres.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            Aucune filière référencée pour cet établissement.
          </p>
        )}
      </div>
    </div>
  );
}

async function chargerEtablissement(id: number) {
  try {
    return await getEtablissement(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}
