import { z } from "zod";

import { normalizeDisplayNameUpdate } from "../domain/display-name";

const displayNameUpdateSchema = z
  .object({
    displayName: z.string(),
  })
  .strict();

export function parseDisplayNameUpdate(
  body: unknown,
):
  | { ok: true; displayName: string }
  | { ok: false; reason: "invalid_request" | "invalid_display_name" } {
  const parsed = displayNameUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return { ok: false, reason: "invalid_request" };
  }

  const displayName = normalizeDisplayNameUpdate(parsed.data.displayName);

  if (!displayName) {
    return { ok: false, reason: "invalid_display_name" };
  }

  return { ok: true, displayName };
}
