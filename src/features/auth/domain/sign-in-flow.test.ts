import { describe, expect, it } from "vitest";

import {
  signInErrorPath,
  signInNotice,
  signInNoticeMessage,
  signInReturnPath,
} from "./sign-in-flow";

describe("sign-in flow", () => {
  it("returns to the account screen when no safe destination is given", () => {
    expect(signInReturnPath(null)).toBe("/sign-in");
    expect(signInReturnPath("")).toBe("/sign-in");
    expect(signInReturnPath("https://evil.example/phish")).toBe("/sign-in");
    expect(signInReturnPath("//evil.example")).toBe("/sign-in");
  });

  it("keeps a safe internal return path", () => {
    expect(signInReturnPath("/")).toBe("/");
    expect(signInReturnPath("/timer?from=login")).toBe("/timer?from=login");
  });

  it("keeps the return path on the error screen", () => {
    expect(signInErrorPath("/sign-in")).toBe("/sign-in");
    expect(signInErrorPath("/timer")).toBe("/sign-in?next=%2Ftimer");
  });

  it("treats cancellation as signed out and other provider errors as retryable", () => {
    expect(signInNotice(null)).toBeNull();
    expect(signInNotice("")).toBeNull();
    expect(signInNotice("access_denied")).toBe("cancelled");
    expect(signInNotice("unable_to_get_user_info")).toBe("failed");
    expect(signInNoticeMessage("cancelled")).toContain("not signed in");
    expect(signInNoticeMessage("failed")).toContain("try again");
  });
});
