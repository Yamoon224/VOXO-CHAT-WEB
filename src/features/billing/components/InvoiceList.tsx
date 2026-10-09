import { Badge } from "@/components/ui";
import { formatDate, formatMoney } from "@/lib/format";
import { INVOICE_STATUS_TONE } from "@/features/billing/status";
import type { Invoice } from "@/features/billing/types";

const STATUS_LABELS: Record<Invoice["status"], string> = {
  open: "En attente",
  paid: "Payée",
  void: "Annulée",
  uncollectible: "Impayée",
};

export function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {invoices.map((invoice) => (
        <li key={invoice.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">{formatMoney(invoice.amount_cents, invoice.currency)}</p>
            <p className="text-sm text-muted">{formatDate(invoice.issued_at)}</p>
          </div>

          <div className="flex items-center gap-3">
            <Badge tone={INVOICE_STATUS_TONE[invoice.status]}>{STATUS_LABELS[invoice.status]}</Badge>
            {invoice.hosted_invoice_url && (
              <a
                href={invoice.hosted_invoice_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                Consulter
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
