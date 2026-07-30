import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  ClipboardList,
  GraduationCap,
  ListChecks,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { getEtablissements, getFilieres, getUniversites } from "@/lib/api";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function Home() {
  const stats = await chargerStats();

  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-border">
        <Image
          src="/images/backgrounds/hero-groupe.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/65 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <Badge variant="accent" className="mb-4">
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            Basé sur le guide officiel d&apos;orientation du Bénin
          </Badge>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white drop-shadow-sm sm:text-5xl">
            Trouvez la filière universitaire faite pour vous.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90">
            Renseignez votre série de bac : Bénin Orientation charge
            automatiquement les bonnes matières et calcule votre
            compatibilité avec chaque filière des universités publiques du
            Bénin, sans invention, uniquement à partir des critères
            officiels.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/simulation" size="lg">
              <Sparkles className="h-4 w-4" />
              Faire ma simulation
            </ButtonLink>
            <ButtonLink href="/filieres" variant="secondary" size="lg">
              Explorer les filières
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={GraduationCap}
            valeur={stats.universites}
            label="universités publiques"
            href="/universites"
          />
          <StatCard
            icon={Building2}
            valeur={stats.etablissements}
            label="établissements"
            href="/etablissements"
          />
          <StatCard
            icon={ListChecks}
            valeur={stats.filieres}
            label="filières référencées"
            href="/filieres"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Comment ça marche ?
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Etape
            icon={SlidersHorizontal}
            numero="1"
            titre="Choisissez votre série"
            description="C, D, A, F1, F2, F3, G... une seule sélection suffit."
          />
          <Etape
            icon={ClipboardList}
            numero="2"
            titre="Entrez vos notes"
            description="Les matières de votre série apparaissent automatiquement : vous n'avez qu'à saisir vos notes."
          />
          <Etape
            icon={Sparkles}
            numero="3"
            titre="Consultez votre classement"
            description="Filières classées par compatibilité, points forts/faibles et débouchés."
          />
        </div>
      </section>
    </div>
  );
}

async function chargerStats() {
  try {
    const [universites, etablissements, filieres] = await Promise.all([
      getUniversites(),
      getEtablissements({ page: 1 }),
      getFilieres({ page: 1 }),
    ]);
    return {
      universites: universites.length,
      etablissements: etablissements.total,
      filieres: filieres.total,
    };
  } catch {
    return { universites: 0, etablissements: 0, filieres: 0 };
  }
}

function StatCard({
  icon: Icon,
  valeur,
  label,
  href,
}: {
  icon: React.ElementType;
  valeur: number;
  label: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card hoverable className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-800/30 dark:text-brand-300">
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <p className="text-3xl font-bold text-foreground">{valeur}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </Card>
    </Link>
  );
}

function Etape({
  icon: Icon,
  numero,
  titre,
  description,
}: {
  icon: React.ElementType;
  numero: string;
  titre: string;
  description: string;
}) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
          {numero}
        </span>
        <Icon className="h-5 w-5 text-brand-600" />
      </div>
      <h3 className="mt-4 font-semibold">{titre}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </Card>
  );
}
