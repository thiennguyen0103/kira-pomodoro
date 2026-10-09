import type { PublicSession } from "../domain/public-session";
import { apiSuccess, type ApiResult } from "@/lib/http/api-response";

import { apiFailure } from "./api-response";

export function sessionResponse(
  session: PublicSession | null,
): ApiResult<PublicSession> {
  if (!session) {
    return apiFailure("unauthenticated");
  }

  return apiSuccess(session);
}
