export type NavLink = { href: string; label: string; permission?: string };

/**
 * Liens de la navigation principale. `permission`, s'il est présent, cache le
 * lien pour un appelant qui ne tient pas cette permission dans l'espace
 * courant — un confort d'affichage, l'autorisation réelle restant appliquée
 * côté serveur.
 */
export const NAV_LINKS: NavLink[] = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/conversations", label: "Conversations", permission: "conversations.view" },
  { href: "/analytics", label: "Statistiques", permission: "analytics.view" },
  { href: "/settings/profile", label: "Profil" },
  { href: "/settings/workspace", label: "Espace de travail", permission: "workspace.manage" },
  { href: "/settings/team", label: "Équipe", permission: "members.view" },
  { href: "/settings/knowledge", label: "Base de connaissances", permission: "knowledge.view" },
  { href: "/settings/canned-responses", label: "Réponses pré-enregistrées", permission: "canned_responses.manage" },
  { href: "/settings/widget", label: "Widget", permission: "widget.manage" },
  { href: "/settings/assistant", label: "Agent IA", permission: "assistant.manage" },
  { href: "/settings/billing", label: "Facturation", permission: "billing.view" },
];
