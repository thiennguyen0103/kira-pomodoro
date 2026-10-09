export const ownerRecoveryOrder = [
  "load-fresh-account",
  "reconcile-owner-timer",
] as const;

export function planOwnerRecovery(authenticated: boolean): {
  replayFailedMutation: false;
  steps: readonly ["sign-in"] | typeof ownerRecoveryOrder;
} {
  if (!authenticated) {
    return { replayFailedMutation: false, steps: ["sign-in"] };
  }

  return { replayFailedMutation: false, steps: ownerRecoveryOrder };
}

export function nextAccountState(input: {
  previousAccountId: string | null;
  nextAccountId: string;
}): { accountId: string; clearPreviousClientState: boolean } {
  return {
    accountId: input.nextAccountId,
    clearPreviousClientState:
      input.previousAccountId !== null &&
      input.previousAccountId !== input.nextAccountId,
  };
}

export const authOperationEffects = {
  "update-display-name": { mutatesTimer: false, replaysFailedMutation: false },
  "sign-out": { mutatesTimer: false, replaysFailedMutation: false },
  "sign-in": { mutatesTimer: false, replaysFailedMutation: false },
} as const;
