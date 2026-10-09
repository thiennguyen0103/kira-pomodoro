import { describe, expect, it } from "vitest";

import {
  authOperationEffects,
  nextAccountState,
  planOwnerRecovery,
} from "./owner-recovery";

describe("planOwnerRecovery", () => {
  it("sends an unauthenticated request to sign in and does not replay it", () => {
    expect(planOwnerRecovery(false)).toEqual({
      replayFailedMutation: false,
      steps: ["sign-in"],
    });
  });

  it("loads the fresh account before owner timer reconciliation", () => {
    expect(planOwnerRecovery(true)).toEqual({
      replayFailedMutation: false,
      steps: ["load-fresh-account", "reconcile-owner-timer"],
    });
  });
});

describe("nextAccountState", () => {
  it("clears the previous account when the signed-in account changes", () => {
    expect(
      nextAccountState({
        previousAccountId: "account-1",
        nextAccountId: "account-2",
      }),
    ).toEqual({
      accountId: "account-2",
      clearPreviousClientState: true,
    });
  });

  it("keeps the same account without clearing it", () => {
    expect(
      nextAccountState({
        previousAccountId: "account-1",
        nextAccountId: "account-1",
      }),
    ).toEqual({
      accountId: "account-1",
      clearPreviousClientState: false,
    });
  });
});

describe("authOperationEffects", () => {
  it("does not mutate timer state or replay a failed mutation", () => {
    expect(authOperationEffects["sign-out"]).toEqual({
      mutatesTimer: false,
      replaysFailedMutation: false,
    });
    expect(authOperationEffects["sign-in"]).toEqual({
      mutatesTimer: false,
      replaysFailedMutation: false,
    });
  });
});
