import "server-only";

import { redactForLog } from "../domain/redact-log";
import { getAuth } from "../infrastructure/auth";
import { loadAuthEnv } from "../infrastructure/auth-env";
import { apiSuccess, type ApiResult } from "@/lib/http/api-response";

import { apiFailure } from "./api-response";
import { authErrorCode } from "./auth-failure";
import { parseGoogleSignIn } from "./sign-in-request";

export async function startGoogleSignIn(
  requestHeaders: Headers,
  body: unknown,
): Promise<ApiResult<{ url: string }>> {
  let origin: string;

  try {
    origin = loadAuthEnv().baseURL;
  } catch (error) {
    console.error(
      redactForLog(
        error instanceof Error
          ? error.message
          : "Authentication is unavailable.",
      ),
    );
    return apiFailure("auth_unavailable");
  }

  const parsed = parseGoogleSignIn(body, origin);

  if (!parsed.ok) {
    return parsed;
  }

  try {
    const result = await getAuth().api.signInSocial({
      headers: requestHeaders,
      body: {
        provider: "google",
        callbackURL: parsed.data.callbackURL,
        errorCallbackURL: parsed.data.errorCallbackURL,
        newUserCallbackURL: parsed.data.newUserCallbackURL,
        disableRedirect: true,
      },
    });
    const url = signInUrl(result);

    if (!url) {
      return apiFailure("auth_unavailable");
    }

    return apiSuccess({ url });
  } catch (error) {
    return apiFailure(authErrorCode(error));
  }
}

function signInUrl(result: unknown): string | undefined {
  if (!result || typeof result !== "object" || !("url" in result)) {
    return undefined;
  }

  return typeof result.url === "string" ? result.url : undefined;
}
