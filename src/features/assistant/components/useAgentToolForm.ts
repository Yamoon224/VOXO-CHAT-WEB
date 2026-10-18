import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { AgentTool, AgentToolHttpMethod, AgentToolParameter } from "@/features/assistant/types";
import type { AgentToolPayload } from "@/features/assistant/api";

export type HeaderRow = { key: string; value: string };

const EMPTY_PARAMETER: AgentToolParameter = { name: "", type: "string", description: "", required: false, in: "query" };

export function useAgentToolForm(submit: (payload: AgentToolPayload) => Promise<void>, initial: AgentTool | null) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [httpMethod, setHttpMethod] = useState<AgentToolHttpMethod>(initial?.http_method ?? "GET");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [enabled, setEnabled] = useState(initial?.enabled ?? true);
  const [parameters, setParameters] = useState<AgentToolParameter[]>(initial?.parameters ?? []);
  // Les en-têtes relus sont masqués (voir `AgentToolResource`) : les lignes
  // existantes démarrent avec une valeur vide, et seule une valeur retapée
  // par l'agent est renvoyée au serveur.
  const [headerRows, setHeaderRows] = useState<HeaderRow[]>(
    initial?.headers ? Object.keys(initial.headers).map((key) => ({ key, value: "" })) : [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  function addParameter() {
    setParameters((current) => [...current, { ...EMPTY_PARAMETER }]);
  }

  function removeParameter(index: number) {
    setParameters((current) => current.filter((_, i) => i !== index));
  }

  function updateParameter(index: number, patch: Partial<AgentToolParameter>) {
    setParameters((current) => current.map((parameter, i) => (i === index ? { ...parameter, ...patch } : parameter)));
  }

  function addHeaderRow() {
    setHeaderRows((current) => [...current, { key: "", value: "" }]);
  }

  function removeHeaderRow(index: number) {
    setHeaderRows((current) => current.filter((_, i) => i !== index));
  }

  function updateHeaderRow(index: number, patch: Partial<HeaderRow>) {
    setHeaderRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function isHeaderConfigured(key: string): boolean {
    return Boolean(initial?.headers && initial.headers[key]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const headers = Object.fromEntries(
      headerRows
        .map((row) => [row.key.trim(), row.value.trim()])
        .filter(([key, value]) => key !== "" && value !== ""),
    );
    const cleanedParameters = parameters.filter((parameter) => parameter.name.trim() !== "");

    try {
      await submit({
        name,
        description,
        http_method: httpMethod,
        url,
        enabled,
        parameters: cleanedParameters,
        ...(Object.keys(headers).length > 0 ? { headers } : {}),
      });
      if (!initial) {
        setName("");
        setDescription("");
        setHttpMethod("GET");
        setUrl("");
        setEnabled(true);
        setParameters([]);
        setHeaderRows([]);
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
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
  };
}
