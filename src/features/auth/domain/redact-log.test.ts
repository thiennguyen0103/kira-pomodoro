import { describe, expect, it } from "vitest";

import { redactForLog } from "./redact-log";

describe("redactForLog", () => {
  it("removes tokens, cookies, and secrets from structured logs", () => {
    expect(
      redactForLog({
        accessToken: "ya29.secret",
        cookie: "session_token=abc",
        nested: { refreshToken: "refresh", name: "Ada" },
      }),
    ).toEqual({
      accessToken: "[redacted]",
      cookie: "[redacted]",
      nested: { refreshToken: "[redacted]", name: "Ada" },
    });
  });

  it("redacts credential material inside messages", () => {
    const message = redactForLog(
      "Authorization failed Bearer ya29.secret access_token=abc",
    );

    expect(message).toBe(
      "Authorization failed Bearer [redacted] access_token=[redacted]",
    );
    expect(message).not.toContain("ya29.secret");
    expect(message).not.toContain("abc");
  });
});
