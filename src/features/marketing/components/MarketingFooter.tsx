import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} VOXO. Support client assisté par IA.</p>
        <nav aria-label="Liens légaux" className="flex items-center gap-4">
          <Link href="/fonctionnalites" className="hover:text-foreground">
            Fonctionnalités
          </Link>
          <Link href="/tarifs" className="hover:text-foreground">
            Tarifs
          </Link>
          <Link href="/mentions-legales" className="hover:text-foreground">
            Mentions légales
          </Link>
        </nav>
      </div>
    </footer>
  );
}
