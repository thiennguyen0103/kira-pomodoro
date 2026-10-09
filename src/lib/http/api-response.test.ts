import { describe, expect, it } from "vitest";

import {
  apiError,
  apiSuccess,
  defineApiErrors,
  jsonResult,
} from "./api-response";

const skills = defineApiErrors({
  not_found: {
    status: 404,
    message: "That skill does not exist.",
  },
});

describe("shared API responses", () => {
  it("returns created data for a future endpoint", async () => {
    const response = jsonResult(apiSuccess({ id: "skill-1" }, 201));

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({
      ok: true,
      data: { id: "skill-1" },
    });
  });

  it("lets another feature define its own error catalog", async () => {
    const response = jsonResult(skills.failure("not_found"));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      ok: false,
      error: {
        code: "not_found",
        message: "That skill does not exist.",
      },
    });
  });

  it("accepts a one-off error without a catalog", async () => {
    const response = jsonResult(
      apiError("conflict", 409, "That record already exists."),
    );

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      ok: false,
      error: {
        code: "conflict",
        message: "That record already exists.",
      },
    });
  });
});
