import Link from "next/link";

const NAV_LINKS = [
  { href: "/fonctionnalites", label: "Fonctionnalités" },
  { href: "/tarifs", label: "Tarifs" },
];

export function MarketingHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
          VOXO
        </Link>

        <nav aria-label="Navigation du site" className="hidden items-center gap-6 text-sm text-muted sm:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary">
            Se connecter
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            Essayer gratuitement
          </Link>
        </div>
      </div>
    </header>
  );
}
