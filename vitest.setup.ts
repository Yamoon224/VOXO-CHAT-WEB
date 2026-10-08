import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Chaque test part d'un DOM propre : un composant oublié par un test
// précédent ne doit jamais rendre le suivant silencieusement vert ou rouge.
afterEach(() => {
  cleanup();
});
