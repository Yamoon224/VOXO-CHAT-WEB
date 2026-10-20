import { describe, expect, it } from "vitest";
import { buildStyles } from "./styles";

describe("buildStyles", () => {
  it("reprend une couleur hexadecimale valide", () => {
    expect(buildStyles("#112233")).toContain("#112233");
  });

  it("retombe sur la couleur par defaut pour une valeur invalide (defense en profondeur)", () => {
    const styles = buildStyles('#fff;}</style><script>alert(1)</script>');

    expect(styles).not.toContain("<script>");
    expect(styles).toContain("#4F46E5");
  });
});
