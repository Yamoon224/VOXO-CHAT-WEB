type AlertVariant = "error" | "success" | "info";

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  error: "bg-danger-surface text-danger border-danger/30",
  success: "bg-success-surface text-success border-success/30",
  info: "bg-border/30 text-foreground border-border-strong",
};

/** Bannière d'état : succès, erreur ou information. `role="alert"` sur erreur pour une annonce immédiate. */
export function Alert({ variant, children }: { variant: AlertVariant; children: React.ReactNode }) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`rounded-md border px-4 py-3 text-sm ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </div>
  );
}
