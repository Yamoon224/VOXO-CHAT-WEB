type BadgeTone = "neutral" | "primary" | "danger";

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-border/50 text-foreground",
  primary: "bg-primary/10 text-primary",
  danger: "bg-danger-surface text-danger",
};

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}
