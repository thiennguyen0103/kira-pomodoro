import { describe, expect, it } from "vitest";

import {
  displayNameFallback,
  displayNameMaxLength,
  normalizeDisplayNameUpdate,
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

describe("normalizeDisplayNameUpdate", () => {
  it("accepts a trimmed name of 1 to 80 characters, including duplicates", () => {
    expect(normalizeDisplayNameUpdate("  Ada Lovelace  ")).toBe("Ada Lovelace");
    expect(normalizeDisplayNameUpdate("Ada Lovelace")).toBe("Ada Lovelace");
    expect(normalizeDisplayNameUpdate("A")).toBe("A");
    expect(normalizeDisplayNameUpdate("A".repeat(displayNameMaxLength))).toBe(
      "A".repeat(displayNameMaxLength),
    );
  });

  it("rejects empty, whitespace-only, and overlong names", () => {
    expect(normalizeDisplayNameUpdate("")).toBeNull();
    expect(normalizeDisplayNameUpdate("   ")).toBeNull();
    expect(
      normalizeDisplayNameUpdate("A".repeat(displayNameMaxLength + 1)),
    ).toBeNull();
  });
});
