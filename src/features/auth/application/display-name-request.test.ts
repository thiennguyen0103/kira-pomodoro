import { describe, expect, it } from "vitest";

import { parseDisplayNameUpdate } from "./display-name-request";

describe("parseDisplayNameUpdate", () => {
  it("reads only a display name", () => {
    expect(parseDisplayNameUpdate({ displayName: "  Ada  " })).toEqual({
      ok: true,
      displayName: "Ada",
    });
  });

  it("rejects a client-supplied account identity", () => {
    expect(
      parseDisplayNameUpdate({
        displayName: "Ada",
        userId: "account-2",
      }),
    ).toEqual({ ok: false, reason: "invalid_request" });
    expect(
      parseDisplayNameUpdate({
        displayName: "Ada",
        rankingParticipation: true,
      }),
    ).toEqual({ ok: false, reason: "invalid_request" });
  });

  it("rejects a name that cannot be saved", () => {
    expect(parseDisplayNameUpdate({ displayName: "   " })).toEqual({
      ok: false,
      reason: "invalid_display_name",
    });
    expect(parseDisplayNameUpdate({ displayName: 12 })).toEqual({
      ok: false,
      reason: "invalid_request",
    });
  });
});
