"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

/**
 * Coquille de l'application connectée : navigation latérale stable sur
 * ordinateur, empilée (masquée par défaut) sur téléphone — conçu d'abord pour
 * mobile, aucun défilement horizontal.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside
        className={`w-full shrink-0 border-b border-border bg-surface px-4 py-4 lg:block lg:w-60 lg:border-b-0 lg:border-r ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <Sidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onToggleMenu={() => setIsMenuOpen((open) => !open)} />
        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
