export type NavLink = { href: string; label: string; permission?: string };

/**
 * Liens de la navigation principale. `permission`, s'il est présent, cache le
 * lien pour un appelant qui ne tient pas cette permission dans l'espace
 * courant — un confort d'affichage, l'autorisation réelle restant appliquée
 * côté serveur.
 */
export const NAV_LINKS: NavLink[] = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/settings/profile", label: "Profil" },
  { href: "/settings/workspace", label: "Espace de travail", permission: "workspace.manage" },
  { href: "/settings/team", label: "Équipe", permission: "members.view" },
];
