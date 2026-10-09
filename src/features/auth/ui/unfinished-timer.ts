import type { UnfinishedTimerPhase } from "../domain/sign-out-timer";

// KPO-7 and KPO-8 own timer recovery. Until then, sign-out has no session to explain.
export function readUnfinishedTimer(): UnfinishedTimerPhase | null {
  return null;
}
