import { createApi } from "./api";
import { connectRealtime, type RealtimeHandle } from "./realtime";
import { loadSession, saveSession } from "./storage";
import { buildStyles } from "./styles";
import type { Session, WidgetMessage, WidgetSettings } from "./types";

declare global {
  interface Window {
    VoxoWidgetConfig?: { workspaceId: string; apiBaseUrl: string };
  }
}

const POLL_INTERVAL_MS = 4000;

function escapeHtml(value: string): string {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function senderClass(senderType: WidgetMessage["sender_type"]): string {
  return senderType === "visitor" ? "visitor" : "other";
}

class VoxoWidget {
  private readonly workspaceId: string;
  private readonly apiBaseUrl: string;
  private readonly api: ReturnType<typeof createApi>;
  private readonly root: HTMLElement;
  private readonly shadow: ShadowRoot;

  private settings: WidgetSettings | null = null;
  private session: Session | null = null;
  private conversationId: string | null = null;
  private messages: WidgetMessage[] = [];
  private isOpen = false;
  private hasUnread = false;
  private isSending = false;
  private agentTyping = false;
  private agentPresent = false;
  private rating: number | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private realtime: RealtimeHandle | null = null;
  private typingSentAt = 0;

  constructor(workspaceId: string, apiBaseUrl: string) {
    this.workspaceId = workspaceId;
    this.apiBaseUrl = apiBaseUrl;
    this.api = createApi(apiBaseUrl);

    this.root = document.createElement("div");
    this.root.id = "voxo-widget-root";
    document.body.appendChild(this.root);
    this.shadow = this.root.attachShadow({ mode: "open" });
  }

  async start(): Promise<void> {
    const { data: settings } = await this.api.getSettings(this.workspaceId);
    this.settings = settings;

    this.session = loadSession(this.workspaceId) ?? (await this.startSession());

    const { data: history, meta } = await this.api.listMessages(this.session.token);
    this.messages = history;
    this.conversationId = meta.conversation_id;

    if (this.conversationId) this.connectLive();
    this.render();
  }

  private async startSession(): Promise<Session> {
    const { data: session } = await this.api.startSession(this.workspaceId);
    saveSession(this.workspaceId, session);
    return session;
  }

  private connectLive(): void {
    if (!this.settings || !this.conversationId || !this.session || this.realtime) return;

    this.realtime = connectRealtime(
      this.settings,
      this.apiBaseUrl,
      this.session.token,
      this.conversationId,
      (message) => this.handleIncoming(message),
      () => this.handleAgentTyping(),
      (present) => {
        this.agentPresent = present;
        this.render();
      },
    );

    if (!this.realtime) this.startPolling();
  }

  private startPolling(): void {
    if (this.pollTimer) return;
    this.pollTimer = setInterval(() => {
      if (!this.session) return;
      void this.api.listMessages(this.session.token).then(({ data }) => {
        const newCount = data.length - this.messages.length;
        this.messages = data;
        if (newCount > 0 && !this.isOpen) this.hasUnread = true;
        this.render();
      });
    }, POLL_INTERVAL_MS);
  }

  private handleIncoming(message: WidgetMessage): void {
    if (this.messages.some((existing) => existing.id === message.id)) return;
    this.messages = [...this.messages, message];
    if (!this.isOpen) this.hasUnread = true;
    this.agentTyping = false;
    this.render();
  }

  private handleAgentTyping(): void {
    this.agentTyping = true;
    this.render();
    setTimeout(() => {
      this.agentTyping = false;
      this.render();
    }, 4000);
  }

  private async send(body: string): Promise<void> {
    if (!this.session || body.trim() === "") return;
    this.isSending = true;
    this.render();

    try {
      const { data } = await this.api.sendMessage(this.session.token, body.trim());
      this.conversationId = data.conversation_id;
      const { data: history, meta } = await this.api.listMessages(this.session.token);
      this.messages = history;
      this.conversationId = meta.conversation_id;
      this.connectLive();
    } finally {
      this.isSending = false;
      this.render();
    }
  }

  private notifyTyping(): void {
    const now = Date.now();
    if (now - this.typingSentAt < 3000) return;
    this.typingSentAt = now;
    this.realtime?.sendTyping();
  }

  private async submitRating(value: number): Promise<void> {
    if (!this.session || !this.conversationId) return;
    this.rating = value;
    this.render();
    await this.api.rate(this.session.token, this.conversationId, value);
  }

  private toggleOpen(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) this.hasUnread = false;
    this.render();
  }

  private render(): void {
    if (!this.settings) return;
    const s = this.settings;
    const side = s.position === "bottom_left" ? "left" : "right";

    this.shadow.innerHTML = `
      <style>${buildStyles(s.primary_color)}</style>
      <button class="bubble ${side}" aria-label="Ouvrir le chat">
        ${this.isOpen ? "&times;" : "&#128172;"}
        ${this.hasUnread && !this.isOpen ? '<span class="dot"></span>' : ""}
      </button>
      ${
        this.isOpen
          ? `
        <div class="panel ${side}">
          <div class="header">
            <button class="close" aria-label="Fermer">&times;</button>
            Discutez avec nous
            ${this.agentPresent ? '<div class="presence">Un agent est en ligne</div>' : ""}
          </div>
          ${!s.is_open_now && s.offline_message ? `<div class="banner">${escapeHtml(s.offline_message)}</div>` : ""}
          <div class="messages">
            ${
              this.messages.length === 0 && s.welcome_message
                ? `<div class="welcome">${escapeHtml(s.welcome_message)}</div>`
                : ""
            }
            ${this.messages
              .map((message) => `<div class="msg ${senderClass(message.sender_type)}">${escapeHtml(message.body)}</div>`)
              .join("")}
          </div>
          ${this.agentTyping ? '<p class="typing">L’agent est en train d’écrire…</p>' : ""}
          ${
            this.conversationId
              ? `<div class="rating">${[1, 2, 3, 4, 5]
                  .map((value) => `<button data-rating="${value}" class="${this.rating !== null && value <= this.rating ? "active" : ""}">★</button>`)
                  .join("")}</div>`
              : ""
          }
          <form class="composer">
            <textarea rows="1" placeholder="Écrivez votre message…"></textarea>
            <button type="submit" ${this.isSending ? "disabled" : ""}>Envoyer</button>
          </form>
          ${!s.hide_branding ? '<div class="footer">Propulsé par VOXO</div>' : ""}
        </div>
      `
          : ""
      }
    `;

    this.bindEvents();
  }

  private bindEvents(): void {
    this.shadow.querySelector(".bubble")?.addEventListener("click", () => this.toggleOpen());
    this.shadow.querySelector(".close")?.addEventListener("click", () => this.toggleOpen());

    const textarea = this.shadow.querySelector<HTMLTextAreaElement>(".composer textarea");
    textarea?.addEventListener("input", () => this.notifyTyping());

    this.shadow.querySelector(".composer")?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!textarea) return;
      const body = textarea.value;
      textarea.value = "";
      void this.send(body);
    });

    this.shadow.querySelectorAll<HTMLButtonElement>(".rating button").forEach((button) => {
      button.addEventListener("click", () => void this.submitRating(Number(button.dataset.rating)));
    });
  }
}

(function init(): void {
  const config = window.VoxoWidgetConfig;
  if (!config?.workspaceId || !config.apiBaseUrl) return;

  void new VoxoWidget(config.workspaceId, config.apiBaseUrl).start();
})();
