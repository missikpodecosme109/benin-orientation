import { notFound } from "next/navigation";
import { Building2 } from "lucide-react";
import { ApiError, getUniversite } from "@/lib/api";
import { CardLink } from "@/components/ui/Card";
import { RetourLien } from "@/components/RetourLien";

export const dynamic = "force-dynamic";

export default async function UniversiteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const universite = await chargerUniversite(Number(id));

  if (!universite) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <RetourLien fallbackHref="/universites" label="Toutes les universités" />

      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
        {universite.nom}
      </h1>

      <h2 className="mt-10 text-lg font-semibold">
        Établissements ({universite.etablissements.length})
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {universite.etablissements.map((etab) => (
          <CardLink key={etab.id} href={`/etablissements/${etab.id}`}>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-800/30 dark:text-brand-300">
              <Building2 className="h-4 w-4" />
            </span>
            <h3 className="mt-3 font-semibold leading-snug group-hover:text-brand-600">
              {etab.sigle ? `${etab.sigle} · ${etab.nom}` : etab.nom}
            </h3>
            <p className="mt-1 text-xs font-medium text-brand-600">
              {etab.filieres?.length ?? 0} filière(s)
            </p>
          </CardLink>
        ))}
        {universite.etablissements.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            Aucun établissement référencé pour cette université.
          </p>
        )}
      </div>
    </div>
  );
}

async function chargerUniversite(id: number) {
  try {
    return await getUniversite(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}
