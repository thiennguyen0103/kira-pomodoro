import { describe, expect, it } from "vitest";

import { sessionResponse } from "./session-response";

const session = {
  user: {
    id: "user-1",
    displayName: "Ada",
    rankingParticipation: false,
    publicAchievementVisibility: false,
  },
};

describe("sessionResponse", () => {
  it("denies a missing, expired, or revoked session", () => {
    expect(sessionResponse(null)).toEqual({
      ok: false,
      status: 401,
      error: {
        code: "unauthenticated",
        message: "Sign in to continue.",
      },
    });
  });

  it("returns the public session for a validated request", () => {
    expect(sessionResponse(session)).toEqual({
      ok: true,
      status: 200,
      data: session,
    });
  });
});
