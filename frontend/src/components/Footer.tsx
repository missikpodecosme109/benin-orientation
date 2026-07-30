export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center sm:px-6">
        <div className="flex items-center justify-center gap-2 font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-xs font-bold text-white">
            BO
          </span>
          Bénin Orientation
        </div>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Plateforme d&apos;aide à l&apos;orientation des nouveaux bacheliers,
          basée sur le guide officiel d&apos;orientation du Bénin. Les
          résultats de simulation sont une aide à la décision et ne
          remplacent pas les procédures officielles d&apos;inscription.
        </p>
        <p className="mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
          Réalisé par Cosme MISSIKPODE, Sublime World
        </p>
      </div>
    </footer>
  );
}
