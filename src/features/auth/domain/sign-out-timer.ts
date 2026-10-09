export type UnfinishedTimerPhase = "running" | "paused";

export const signOutFailureMessage =
  "Sign-out didn't finish. You are still signed in.";

export function signOutTimerExplanation(
  phase: UnfinishedTimerPhase | null,
): string | null {
  if (phase === "running") {
    return "Signing out does not pause or discard this session. It keeps running until the planned time ends.";
  }

  if (phase === "paused") {
    return "Signing out does not pause or discard this session. It stays paused.";
  }

  return null;
}
