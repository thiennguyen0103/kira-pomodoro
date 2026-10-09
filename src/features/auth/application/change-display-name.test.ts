import { describe, expect, it } from "vitest";

import type { PublicSession } from "../domain/public-session";
import { changeDisplayName } from "./change-display-name";

const saved: PublicSession = {
  user: {
    id: "account-1",
    displayName: "Learner",
    rankingParticipation: false,
    publicAchievementVisibility: false,
  },
};

describe("changeDisplayName", () => {
  it("does not write when the session is missing", async () => {
    const saves: string[] = [];

    const result = await changeDisplayName({
      session: null,
      body: { displayName: "Ada" },
      saveDisplayName: async (accountId, displayName) => {
        saves.push(`${accountId}:${displayName}`);
      },
    });

    expect(result).toMatchObject({
      ok: false,
      error: { code: "unauthenticated" },
    });
    expect(saves).toEqual([]);
  });

  it("leaves the saved name unchanged when the update is invalid", async () => {
    const saves: string[] = [];

    const result = await changeDisplayName({
      session: saved,
      body: { displayName: "   " },
      saveDisplayName: async (accountId, displayName) => {
        saves.push(`${accountId}:${displayName}`);
      },
    });

    expect(result).toMatchObject({
      ok: false,
      error: { code: "invalid_display_name" },
    });
    expect(saves).toEqual([]);
  });

  it("updates only the signed-in account name and keeps privacy flags", async () => {
    const saves: string[] = [];

    const result = await changeDisplayName({
      session: saved,
      body: { displayName: "  Ada Lovelace  " },
      saveDisplayName: async (accountId, displayName) => {
        saves.push(`${accountId}:${displayName}`);
      },
    });

    expect(saves).toEqual(["account-1:Ada Lovelace"]);
    expect(result).toEqual({
      ok: true,
      status: 200,
      data: {
        user: {
          id: "account-1",
          displayName: "Ada Lovelace",
          rankingParticipation: false,
          publicAchievementVisibility: false,
        },
      },
    });
    expect(JSON.stringify(result)).not.toContain("email");
  });

  it("denies a body that names another account and does not write", async () => {
    const saves: string[] = [];

    const result = await changeDisplayName({
      session: saved,
      body: { displayName: "Ada", userId: "account-2" },
      saveDisplayName: async (accountId, displayName) => {
        saves.push(`${accountId}:${displayName}`);
      },
    });

    expect(result).toMatchObject({
      ok: false,
      error: { code: "invalid_request" },
    });
    expect(saves).toEqual([]);
  });
});
