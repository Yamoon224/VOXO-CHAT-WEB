"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth/session-context";
import { NAV_LINKS } from "@/components/layout/nav-links";

export function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const { session } = useSession();
  const permissions = session?.permissions ?? [];

  const links = NAV_LINKS.filter((link) => !link.permission || permissions.includes(link.permission));

  // Compte, pas espace de travail : ne peut pas se filtrer par permission
  // d'espace comme le reste de `NAV_LINKS` (voir `is_platform_admin`).
  if (session?.user.is_platform_admin) {
    links.push({ href: "/platform/workspaces", label: "Console plateforme" });
  }

  return (
    <nav aria-label="Navigation principale" className={`flex flex-col gap-1 ${className}`}>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-border/40"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
