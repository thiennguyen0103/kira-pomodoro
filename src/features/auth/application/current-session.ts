import "server-only";

import { toPublicSession } from "../domain/public-session";
import { getAuth } from "../infrastructure/auth";
import { apiSuccess } from "@/lib/http/api-response";

import { apiFailure } from "./api-response";
import { authErrorCode } from "./auth-failure";

export async function readCurrentSession(requestHeaders: Headers) {
  const session = await getAuth().api.getSession({
    headers: requestHeaders,
    query: {
      disableCookieCache: true,
    },
  });

  if (!session) {
    return null;
  }

  return toPublicSession({
    id: session.user.id,
    name: session.user.name,
    rankingParticipation: session.user.rankingParticipation,
    publicAchievementVisibility: session.user.publicAchievementVisibility,
  });
}

export async function revokeCurrentSession(requestHeaders: Headers) {
  try {
    await getAuth().api.signOut({
      headers: requestHeaders,
    });

    return apiSuccess({ signedOut: true as const });
  } catch (error) {
    return apiFailure(authErrorCode(error));
  }
}
