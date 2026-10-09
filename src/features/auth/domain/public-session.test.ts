import { describe, expect, it } from "vitest";

import { toPublicSession } from "./public-session";

describe("toPublicSession", () => {
  it("returns the allowlisted account fields", () => {
    const session = toPublicSession({
      id: "user-1",
      name: "Ada",
      rankingParticipation: false,
      publicAchievementVisibility: false,
    });

    expect(session).toEqual({
      user: {
        id: "user-1",
        displayName: "Ada",
        rankingParticipation: false,
        publicAchievementVisibility: false,
      },
    });
    expect(session).not.toHaveProperty("user.email");
    expect(JSON.stringify(session)).not.toContain("token");
  });
});
