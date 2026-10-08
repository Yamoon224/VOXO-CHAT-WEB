"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/session-context";
import { WorkspaceSwitcher } from "@/features/workspace/components/WorkspaceSwitcher";
import { Button } from "@/components/ui";

export function Topbar({ onToggleMenu }: { onToggleMenu?: () => void }) {
  const router = useRouter();
  const { session, logout } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      router.push("/login");
    }
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
      <div className="flex items-center gap-3">
        {onToggleMenu && (
          <button
            type="button"
            onClick={onToggleMenu}
            aria-label="Ouvrir le menu"
            className="rounded-md p-2 text-foreground hover:bg-border/40 lg:hidden"
          >
            ☰
          </button>
        )}
        <WorkspaceSwitcher />
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-muted sm:inline">{session?.user.name}</span>
        <Button variant="ghost" type="button" onClick={handleLogout} isLoading={isLoggingOut}>
          Se déconnecter
        </Button>
      </div>
    </header>
  );
}
