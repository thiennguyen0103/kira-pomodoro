import { describe, expect, it } from "vitest";

import { authErrorCode, authFailureFromUpstream } from "./auth-failure";

describe("auth failure mapping", () => {
  it("maps redirect and provider request failures", () => {
    expect(
      authErrorCode({
        status: 400,
        message: "Redirect must stay on this application.",
      }),
    ).toBe("redirect_rejected");
    expect(authErrorCode({ status: 401 })).toBe("unauthenticated");
    expect(
      authErrorCode({ status: 415, message: "Content-Type is required." }),
    ).toBe("invalid_request");
  });

  it("replaces an empty upstream failure and leaves success untouched", () => {
    expect(authFailureFromUpstream(500, "")).toBe("auth_unavailable");
    expect(
      authFailureFromUpstream(200, '{"url":"https://accounts.google.com"}'),
    ).toBe(null);
  });
});
