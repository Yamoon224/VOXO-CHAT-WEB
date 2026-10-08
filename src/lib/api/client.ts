import { env } from "@/lib/env";
import { ApiError } from "@/lib/api/errors";
import { getToken } from "@/lib/auth/token-store";

export type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Un `FormData` part tel quel (import de fichiers) : jamais sérialisé en JSON. */
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  /** Jamais envoyé pour les routes publiques (connexion, invitation non authentifiée, etc). */
  withAuth?: boolean;
  signal?: AbortSignal;
};

type ErrorBody = {
  message?: string;
  error_code?: string;
  context?: Record<string, unknown>;
  errors?: Record<string, string[]>;
};

function buildUrl(path: string, query?: ApiRequestOptions["query"]): string {
  const url = new URL(path.replace(/^\//, ""), `${env.apiBaseUrl.replace(/\/$/, "")}/`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

/**
 * Appelle l'API VOXO et renvoie le contenu de `data`, ou `undefined` pour une
 * réponse sans corps (204). Toute erreur HTTP ou réseau devient une
 * `ApiError`, seule forme d'erreur que le reste de l'application a à
 * connaître.
 *
 * Aucun composant n'appelle `fetch` directement : tout passe par ici, ce qui
 * est aussi le seul endroit qui sait comment joindre le jeton d'authentification.
 */
export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, withAuth = true, signal } = options;

  const isFormData = body instanceof FormData;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined && !isFormData) {
    // `FormData` fixe elle-même son `Content-Type` (avec la frontière
    // multipart) : la poser ici l'écraserait et casserait l'envoi.
    headers["Content-Type"] = "application/json";
  }
  if (withAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
      signal,
    });
  } catch {
    throw ApiError.networkError();
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const raw = await response.text();
  const json: unknown = raw ? JSON.parse(raw) : {};

  if (!response.ok) {
    const errorBody = json as ErrorBody;
    throw new ApiError(
      response.status,
      errorBody.message ?? "Une erreur est survenue.",
      errorBody.error_code ?? "unknown_error",
      errorBody.context ?? {},
      errorBody.errors ?? {},
    );
  }

  return json as T;
}
