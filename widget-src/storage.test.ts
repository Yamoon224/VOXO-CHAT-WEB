import { describe, expect, it, beforeEach } from "vitest";
import { loadSession, saveSession } from "./storage";

describe("storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("retrouve une session enregistree pour le meme espace", () => {
    saveSession("workspace-1", { token: "tok", visitorId: "visitor-1" });

    expect(loadSession("workspace-1")).toEqual({ token: "tok", visitorId: "visitor-1" });
  });

  it("ne renvoie rien pour un espace sans session", () => {
    expect(loadSession("workspace-inconnu")).toBeNull();
  });

  it("ignore une entree corrompue plutot que de planter", () => {
    window.localStorage.setItem("voxo-widget-session:workspace-1", "{not json");

    expect(loadSession("workspace-1")).toBeNull();
  });

  it("ignore une entree dont la forme ne correspond pas", () => {
    window.localStorage.setItem("voxo-widget-session:workspace-1", JSON.stringify({ token: 123 }));

    expect(loadSession("workspace-1")).toBeNull();
  });
});
