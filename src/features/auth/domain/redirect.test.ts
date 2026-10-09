import { describe, expect, it } from "vitest";

import { isSafeRedirect } from "./redirect";

const origin = "http://localhost:3000";

describe("isSafeRedirect", () => {
  it("allows internal paths and the application origin", () => {
    expect(isSafeRedirect("/", origin)).toBe(true);
    expect(isSafeRedirect("/timer?from=login", origin)).toBe(true);
    expect(isSafeRedirect("http://localhost:3000/timer", origin)).toBe(true);
  });

  it("rejects external and protocol-relative destinations", () => {
    expect(isSafeRedirect("https://evil.example/phish", origin)).toBe(false);
    expect(isSafeRedirect("//evil.example", origin)).toBe(false);
    expect(isSafeRedirect("/\\evil.example", origin)).toBe(false);
    expect(isSafeRedirect("javascript:alert(1)", origin)).toBe(false);
    expect(isSafeRedirect("%2F%2Fevil.example", origin)).toBe(false);
  });
});
