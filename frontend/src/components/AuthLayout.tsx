import Image from "next/image";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid lg:min-h-[calc(100dvh-65px)] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src="/images/backgrounds/hero-etudiante.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-800/90 via-brand-700/45 to-brand-600/10" />
        <div className="absolute inset-x-0 bottom-0 p-10">
          <p className="text-2xl font-bold leading-snug text-white drop-shadow-sm">
            Chaque bachelier mérite la bonne filière.
          </p>
          <p className="mt-3 max-w-sm text-sm text-white/85">
            Bénin Orientation vous guide à partir des critères officiels des
            universités publiques du Bénin.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
