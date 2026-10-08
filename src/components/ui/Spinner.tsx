export function Spinner({ size = "md" }: { size?: "sm" | "md" }) {
  const dimension = size === "sm" ? "h-4 w-4" : "h-6 w-6";

  return (
    <span
      role="status"
      aria-label="Chargement en cours"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${dimension}`}
    />
  );
}
