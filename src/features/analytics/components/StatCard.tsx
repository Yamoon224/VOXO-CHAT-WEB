import { Card } from "@/components/ui";

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="flex flex-col gap-1 p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
    </Card>
  );
}
