import { describe, expect, it } from "vitest";

import {
  isOAuthCallbackPath,
  prepareNewAccount,
  preserveSavedAccount,
  providerAccountKey,
} from "./account";

describe("account identity", () => {
  it("initializes privacy flags off and never uses the email as the name", () => {
    expect(
      prepareNewAccount({
        name: "ada@example.com",
        email: "ada@example.com",
      }),
    ).toEqual({
      name: "Learner",
      rankingParticipation: false,
      publicAchievementVisibility: false,
    });
  });

  it("treats repeated Google callbacks as one provider identity", () => {
    const first = providerAccountKey("google", "google-subject-1");
    const retry = providerAccountKey("google", "google-subject-1");

    expect(retry).toBe(first);
    expect(providerAccountKey("google", "google-subject-2")).not.toBe(first);
  });

  it("drops profile and privacy writes on an OAuth callback update", () => {
    expect(isOAuthCallbackPath("/callback/google")).toBe(true);
    expect(isOAuthCallbackPath("/update-user")).toBe(false);
    const incoming = {
      name: "New Google Name",
      rankingParticipation: true,
      publicAchievementVisibility: true,
      emailVerified: true,
    };
    expect(preserveSavedAccount(incoming)).toEqual({
      emailVerified: true,
    });
    expect(incoming).toEqual({
      name: "New Google Name",
      rankingParticipation: true,
      publicAchievementVisibility: true,
      emailVerified: true,
    });
  });
});
