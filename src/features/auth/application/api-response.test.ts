import { describe, expect, it } from "vitest";

import { jsonResult } from "@/lib/http/api-response";

import { apiFailure } from "./api-response";

describe("auth API responses", () => {
  it("uses the shared envelope with an auth error", async () => {
    const response = jsonResult(apiFailure("unauthenticated"));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      ok: false,
      error: {
        code: "unauthenticated",
        message: "Sign in to continue.",
      },
    });
  });
});
