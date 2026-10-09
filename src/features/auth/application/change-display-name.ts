import type { PublicSession } from "../domain/public-session";
import { apiSuccess, type ApiResult } from "@/lib/http/api-response";

import { apiFailure } from "./api-response";
import { parseDisplayNameUpdate } from "./display-name-request";

export async function changeDisplayName(input: {
  session: PublicSession | null;
  body: unknown;
  saveDisplayName: (accountId: string, displayName: string) => Promise<void>;
}): Promise<ApiResult<PublicSession>> {
  if (!input.session) {
    return apiFailure("unauthenticated");
  }

  const parsed = parseDisplayNameUpdate(input.body);

  if (!parsed.ok) {
    return apiFailure(parsed.reason);
  }

  try {
    await input.saveDisplayName(input.session.user.id, parsed.displayName);
  } catch {
    return apiFailure("auth_unavailable");
  }

  return apiSuccess({
    user: {
      ...input.session.user,
      displayName: parsed.displayName,
    },
  });
}
