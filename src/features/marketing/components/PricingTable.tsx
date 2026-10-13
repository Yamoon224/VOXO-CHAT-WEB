import Link from "next/link";
import { formatMoney } from "@/lib/format";
import type { Plan } from "@/features/billing/types";

const ROWS: { label: string; read: (plan: Plan) => string }[] = [
  { label: "Sièges", read: (plan) => (plan.max_seats === null ? "Illimité" : String(plan.max_seats)) },
  { label: "Contacts", read: (plan) => (plan.max_contacts === null ? "Illimité" : plan.max_contacts.toLocaleString("fr-FR")) },
  {
    label: "Crédits IA / mois",
    read: (plan) => (plan.ai_credits_per_month === null ? "Illimité" : plan.ai_credits_per_month.toLocaleString("fr-FR")),
  },
  {
    label: "Documents indexables",
    read: (plan) => (plan.max_knowledge_documents === null ? "Illimité" : plan.max_knowledge_documents.toLocaleString("fr-FR")),
  },
];

export function PricingTable({ plans }: { plans: Plan[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr>
            <th className="w-40 border-b border-border pb-4" />
            {plans.map((plan) => (
              <th key={plan.id} className="border-b border-border px-4 pb-4">
                <p className="text-base font-semibold text-foreground">{plan.name}</p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {formatMoney(plan.price_cents, plan.currency)}
                  {plan.price_cents !== null && <span className="text-sm font-normal text-muted"> / mois</span>}
                </p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="border-b border-border py-3 pr-4 font-medium text-muted">
                {row.label}
              </th>
              {plans.map((plan) => (
                <td key={plan.id} className="border-b border-border px-4 py-3 text-foreground">
                  {row.read(plan)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th scope="row" className="py-6 pr-4" />
            {plans.map((plan) => (
              <td key={plan.id} className="px-4 py-6">
                {plan.is_custom ? (
                  <a href="mailto:contact@voxo.chat" className="text-sm font-medium text-primary hover:underline">
                    Nous contacter
                  </a>
                ) : (
                  <Link href="/register" className="text-sm font-medium text-primary hover:underline">
                    Essayer gratuitement
                  </Link>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
