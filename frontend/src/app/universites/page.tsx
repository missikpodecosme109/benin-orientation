import { GraduationCap } from "lucide-react";
import { getUniversites } from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardLink } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function UniversitesPage() {
  const universites = await getUniversites();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <PageHeader
        eyebrow="Catalogue"
        title="Universités"
        subtitle={`${universites.length} université(s) publique(s) du Bénin.`}
        backgroundImage="/images/backgrounds/library.jpg"
      />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {universites.map((u) => (
          <CardLink key={u.id} href={`/universites/${u.id}`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-800/30 dark:text-brand-300">
              <GraduationCap className="h-5 w-5" />
            </span>
            <h2 className="mt-3 font-semibold leading-snug group-hover:text-brand-600">
              {u.nom}
            </h2>
            <p className="mt-2 text-xs font-medium text-brand-600">
              {u.etablissements_count ?? 0} établissement(s)
            </p>
          </CardLink>
        ))}
      </div>
    </div>
  );
}
