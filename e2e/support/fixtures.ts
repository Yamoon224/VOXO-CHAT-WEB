/** Génère des identifiants uniques pour que les tests n'entrent jamais en collision entre eux. */
export function uniqueEmail(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}@example.test`;
}
