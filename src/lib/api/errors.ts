/**
 * Forme des erreurs renvoyées par l'API VOXO :
 * `{ message, error_code, context, errors? }` (voir resources/openapi/openapi.yaml
 * du backend). Les écrans routent sur `code`, jamais sur `message` : un message
 * se traduit et se reformule, un code ne bouge pas.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly context: Record<string, unknown>;
  readonly fieldErrors: Record<string, string[]>;

  constructor(
    status: number,
    message: string,
    code: string,
    context: Record<string, unknown> = {},
    fieldErrors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.context = context;
    this.fieldErrors = fieldErrors;
  }

  /** Premier message de validation pour un champ donné, s'il y en a un. */
  fieldError(field: string): string | undefined {
    return this.fieldErrors[field]?.[0];
  }

  static networkError(): ApiError {
    return new ApiError(0, "Impossible de joindre le serveur. Vérifiez votre connexion.", "network_error");
  }
}
