import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { InvoiceList } from "@/features/billing/components/InvoiceList";
import type { Invoice } from "@/features/billing/types";

const paid: Invoice = {
  id: "inv-1",
  amount_cents: 4900,
  currency: "EUR",
  status: "paid",
  hosted_invoice_url: "https://stripe.test/invoice/1",
  issued_at: "2026-10-01T00:00:00Z",
  paid_at: "2026-10-01T00:00:00Z",
};

describe("InvoiceList", () => {
  it("affiche le montant, le statut et le lien vers la facture", () => {
    render(<InvoiceList invoices={[paid]} />);

    expect(screen.getByText("49,00 €")).toBeInTheDocument();
    expect(screen.getByText("Payée")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Consulter" })).toHaveAttribute("href", "https://stripe.test/invoice/1");
  });

  it("n'affiche pas de lien sans page hébergée", () => {
    render(<InvoiceList invoices={[{ ...paid, hosted_invoice_url: null }]} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
