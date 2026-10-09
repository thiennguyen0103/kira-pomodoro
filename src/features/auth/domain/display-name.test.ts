import { describe, expect, it } from "vitest";

import {
  displayNameFallback,
  displayNameMaxLength,
  resolveDisplayName,
} from "./display-name";

describe("resolveDisplayName", () => {
  it("keeps a trimmed Google name", () => {
    expect(resolveDisplayName("  Ada Lovelace  ")).toBe("Ada Lovelace");
  });

  it("uses a neutral fallback when the name is empty or an email", () => {
    expect(resolveDisplayName("   ", "ada@example.com")).toBe(
      displayNameFallback,
    );
    expect(resolveDisplayName("ada@example.com", "ada@example.com")).toBe(
      displayNameFallback,
    );
    expect(resolveDisplayName("Ada <ada@example.com>")).toBe(
      displayNameFallback,
    );
    expect(resolveDisplayName("person@example.com")).toBe(displayNameFallback);
  });

  it("limits the initial name to 80 characters", () => {
    const name = "A".repeat(displayNameMaxLength + 5);

    expect(resolveDisplayName(name)).toHaveLength(displayNameMaxLength);
  });
});
