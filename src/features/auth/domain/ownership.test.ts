import { describe, expect, it } from "vitest";

import { authorizeOwner } from "./ownership";

describe("authorizeOwner", () => {
  it("denies a missing or expired session", () => {
    expect(authorizeOwner(null, "account-1")).toEqual({
      allowed: false,
      code: "unauthenticated",
    });
    expect(authorizeOwner(undefined, "account-1")).toEqual({
      allowed: false,
      code: "unauthenticated",
    });
  });

  it("denies a request for another account", () => {
    expect(authorizeOwner("account-1", "account-2")).toEqual({
      allowed: false,
      code: "forbidden",
    });
  });

  it("allows the verified account to use its own resource", () => {
    expect(authorizeOwner("account-1", "account-1")).toEqual({
      allowed: true,
      accountId: "account-1",
    });
  });
});
