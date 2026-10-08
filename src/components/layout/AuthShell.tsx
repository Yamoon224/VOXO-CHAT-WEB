import type { ReactNode } from "react";
import { Card } from "@/components/ui";

/** Coquille des pages d'authentification : carte centrée, un titre, un sous-titre. */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold tracking-tight text-foreground">VOXO</p>
        </div>
        <Card>
          <h1 className="mb-1 text-xl font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="mb-6 text-sm text-muted">{subtitle}</p>}
          {!subtitle && <div className="mb-4" />}
          {children}
        </Card>
      </div>
    </div>
  );
}
