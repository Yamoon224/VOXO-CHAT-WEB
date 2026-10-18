"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useAgentToolForm } from "@/features/assistant/components/useAgentToolForm";
import type { AgentTool, AgentToolHttpMethod, AgentToolParameterLocation, AgentToolParameterType } from "@/features/assistant/types";
import type { AgentToolPayload } from "@/features/assistant/api";

const HTTP_METHOD_OPTIONS: AgentToolHttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const PARAMETER_TYPE_OPTIONS: { value: AgentToolParameterType; label: string }[] = [
  { value: "string", label: "Texte" },
  { value: "number", label: "Nombre" },
  { value: "boolean", label: "Booléen" },
];
const PARAMETER_LOCATION_OPTIONS: { value: AgentToolParameterLocation; label: string }[] = [
  { value: "path", label: "Dans l'URL ({param})" },
  { value: "query", label: "En paramètre de requête" },
  { value: "body", label: "Dans le corps de la requête" },
];

export function AgentToolForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: AgentTool | null;
  onSubmit: (payload: AgentToolPayload) => Promise<void>;
  onCancel?: () => void;
}) {
  const {
    name,
    setName,
    description,
    setDescription,
    httpMethod,
    setHttpMethod,
    url,
    setUrl,
    enabled,
    setEnabled,
    parameters,
    addParameter,
    removeParameter,
    updateParameter,
    headerRows,
    addHeaderRow,
    removeHeaderRow,
    updateHeaderRow,
    isHeaderConfigured,
    isSubmitting,
    error,
    handleSubmit,
  } = useAgentToolForm(onSubmit, initial ?? null);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nom de l'outil"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          hint="Lettres, chiffres, tirets et underscores uniquement (ex. lookup_order)."
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="agent-tool-method" className="text-sm font-medium text-foreground">
            Méthode HTTP
          </label>
          <select
            id="agent-tool-method"
            value={httpMethod}
            onChange={(event) => setHttpMethod(event.target.value as AgentToolHttpMethod)}
            className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
          >
            {HTTP_METHOD_OPTIONS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Field
        label="Description"
        required
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        hint="Décrit à Claude quand utiliser cet outil."
      />

      <Field
        label="URL"
        type="text"
        required
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://exemple.fr/api/orders/{order_id}"
        hint="Les paramètres de type « chemin » sont substitués entre accolades, ex. {order_id}."
      />

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
        Outil actif
      </label>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">En-têtes HTTP</p>
        {headerRows.map((row, index) => (
          <div key={index} className="flex flex-wrap items-end gap-2">
            <Field label="Clé" value={row.key} onChange={(event) => updateHeaderRow(index, { key: event.target.value })} />
            <Field
              label="Valeur"
              type="password"
              value={row.value}
              onChange={(event) => updateHeaderRow(index, { value: event.target.value })}
              placeholder={isHeaderConfigured(row.key) ? "Laisser vide pour conserver la valeur actuelle" : undefined}
            />
            <Button variant="ghost" type="button" onClick={() => removeHeaderRow(index)}>
              Retirer
            </Button>
          </div>
        ))}
        <div>
          <Button variant="secondary" type="button" onClick={addHeaderRow}>
            Ajouter un en-tête
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">Paramètres proposés à Claude</p>
        {parameters.map((parameter, index) => (
          <div key={index} className="flex flex-col gap-2 rounded-md border border-border p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <Field
                label="Nom"
                value={parameter.name}
                onChange={(event) => updateParameter(index, { name: event.target.value })}
              />
              <Field
                label="Description"
                value={parameter.description}
                onChange={(event) => updateParameter(index, { description: event.target.value })}
              />
            </div>

            <div className="flex flex-wrap items-end gap-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`agent-tool-parameter-type-${index}`} className="text-sm font-medium text-foreground">
                  Type
                </label>
                <select
                  id={`agent-tool-parameter-type-${index}`}
                  value={parameter.type}
                  onChange={(event) => updateParameter(index, { type: event.target.value as AgentToolParameterType })}
                  className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
                >
                  {PARAMETER_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`agent-tool-parameter-location-${index}`} className="text-sm font-medium text-foreground">
                  Emplacement
                </label>
                <select
                  id={`agent-tool-parameter-location-${index}`}
                  value={parameter.in}
                  onChange={(event) => updateParameter(index, { in: event.target.value as AgentToolParameterLocation })}
                  className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
                >
                  {PARAMETER_LOCATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={parameter.required}
                  onChange={(event) => updateParameter(index, { required: event.target.checked })}
                />
                Requis
              </label>

              <Button variant="ghost" type="button" className="ml-auto" onClick={() => removeParameter(index)}>
                Retirer
              </Button>
            </div>
          </div>
        ))}
        <div>
          <Button variant="secondary" type="button" onClick={addParameter}>
            Ajouter un paramètre
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          {initial ? "Enregistrer" : "Ajouter l'outil"}
        </Button>
        {initial && onCancel && (
          <Button variant="ghost" type="button" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}
