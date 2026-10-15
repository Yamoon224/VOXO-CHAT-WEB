export type ChannelEmailSettings = {
  enabled: boolean;
  reply_from_email: string | null;
  reply_from_name: string | null;
};

/** Canaux de messagerie du lot 5 (section 2.5, P2) : un connecteur par prestataire, derrière `ChannelConnection`. */
export type MessagingChannel = "whatsapp" | "messenger" | "instagram" | "telegram" | "sms";

export type ChannelConnection = {
  channel: MessagingChannel;
  enabled: boolean;
  /** Identifiants masqués par le serveur sauf `verify_token` (voir `ChannelConnectionResource`). */
  credentials: Record<string, string>;
};

/**
 * Champs d'identifiants requis par canal pour pouvoir l'activer — même liste
 * que `MessagingChannel::requiredCredentialFields()` côté backend.
 * `app_secret` sert à vérifier la signature de chaque webhook entrant
 * (`X-Hub-Signature-256`) : sans lui, n'importe qui pourrait usurper un
 * visiteur en postant directement sur l'URL publique du canal.
 */
export const CHANNEL_CREDENTIAL_FIELDS: Record<MessagingChannel, { key: string; label: string }[]> = {
  whatsapp: [
    { key: "access_token", label: "Jeton d'accès" },
    { key: "phone_number_id", label: "Identifiant du numéro" },
    { key: "app_secret", label: "Secret de l'application" },
  ],
  messenger: [
    { key: "page_access_token", label: "Jeton d'accès de la page" },
    { key: "app_secret", label: "Secret de l'application" },
  ],
  instagram: [
    { key: "page_access_token", label: "Jeton d'accès de la page" },
    { key: "app_secret", label: "Secret de l'application" },
  ],
  telegram: [{ key: "bot_token", label: "Jeton du bot" }],
  sms: [
    { key: "account_sid", label: "SID du compte" },
    { key: "auth_token", label: "Jeton d'authentification" },
    { key: "from_number", label: "Numéro d'envoi" },
  ],
};

export const CHANNEL_LABELS: Record<MessagingChannel, string> = {
  whatsapp: "WhatsApp",
  messenger: "Messenger",
  instagram: "Instagram",
  telegram: "Telegram",
  sms: "SMS",
};

/** WhatsApp/Messenger/Instagram passent par le webhook unifié de Meta : un `verify_token` à copier dans sa console. */
export const CHANNELS_WITH_META_HANDSHAKE: ReadonlySet<MessagingChannel> = new Set(["whatsapp", "messenger", "instagram"]);

/** Telegram vérifie chaque webhook par un en-tête secret à reporter dans l'appel `setWebhook` (`secret_token`), engendré à la création. */
export const CHANNELS_WITH_SECRET_TOKEN: ReadonlySet<MessagingChannel> = new Set(["telegram"]);

export const MESSAGING_CHANNELS: MessagingChannel[] = ["whatsapp", "messenger", "instagram", "telegram", "sms"];
