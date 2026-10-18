"use client";

import { ApiKeysPage } from "@/features/integrations/components/ApiKeysPage";
import { WebhookSubscriptionsPage } from "@/features/integrations/components/WebhookSubscriptionsPage";

/** Écran `/settings/integrations` : clés d'API et webhooks sortants (lot 6, section 2.14). */
export function IntegrationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Clés d&apos;API</h2>
        <ApiKeysPage />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Webhooks sortants</h2>
        <WebhookSubscriptionsPage />
      </section>
    </div>
  );
}
