import { describe, expect, it } from "vitest";

import {
  signOutFailureMessage,
  signOutTimerExplanation,
} from "./sign-out-timer";

describe("sign-out timer explanation", () => {
  it("explains that a running session continues and a paused session stays paused", () => {
    expect(signOutTimerExplanation("running")).toContain("keeps running");
    expect(signOutTimerExplanation("paused")).toContain("stays paused");
    expect(signOutTimerExplanation(null)).toBeNull();
  });

  it("does not describe a failed sign-out as success", () => {
    expect(signOutFailureMessage).toContain("still signed in");
  });
});
