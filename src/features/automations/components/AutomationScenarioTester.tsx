"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useAutomationScenarioTester } from "@/features/automations/components/useAutomationScenarioTester";

/** « Brouillon et test avant publication » (section 2.8) : simule le scénario sur un message d'exemple, sans rien enregistrer. */
export function AutomationScenarioTester({ scenarioId }: { scenarioId: string }) {
  const { message, setMessage, channel, setChannel, result, isRunning, error, run } = useAutomationScenarioTester(scenarioId);

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-muted/30 p-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Message du visiteur" value={message} onChange={(event) => setMessage(event.target.value)} />
        <Field label="Canal (optionnel)" placeholder="widget, email…" value={channel} onChange={(event) => setChannel(event.target.value)} />
      </div>

      <div>
        <Button type="button" variant="secondary" onClick={run} isLoading={isRunning} disabled={message.trim() === ""}>
          Tester
        </Button>
      </div>

      {error && <Alert variant="error">{error.message}</Alert>}

      {result && (
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-medium text-foreground">
            {result.conditions_matched ? "Les critères correspondent." : "Les critères ne correspondent pas — rien ne se déclencherait."}
          </p>
          {result.conditions_matched && (
            <ol className="flex flex-col gap-1 pl-4 text-muted">
              {result.steps.map((step, index) => (
                <li key={index} className="list-decimal">
                  {step.preview}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
