import { describe, expect, it } from "vitest";

import { parseGoogleSignIn } from "./sign-in-request";

const origin = "http://localhost:3000";

describe("parseGoogleSignIn", () => {
  it("defaults the return path to the application root", () => {
    expect(parseGoogleSignIn({}, origin)).toMatchObject({
      ok: true,
      data: { callbackURL: "/" },
    });
  });

  it("rejects an external return destination and an invalid body", () => {
    expect(
      parseGoogleSignIn({ callbackURL: "https://evil.example/phish" }, origin),
    ).toMatchObject({
      ok: false,
      error: { code: "redirect_rejected" },
    });
    expect(parseGoogleSignIn({ provider: "github" }, origin)).toMatchObject({
      ok: false,
      error: { code: "invalid_request" },
    });
  });
});
