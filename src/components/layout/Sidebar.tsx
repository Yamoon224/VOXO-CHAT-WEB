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
