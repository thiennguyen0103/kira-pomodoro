import { redactForLog } from "@/features/auth/domain/redact-log";
import { apiFailure } from "@/features/auth/application/api-response";
import { jsonResult } from "@/lib/http/api-response";
import { sessionResponse } from "@/features/auth/application/session-response";

export const dynamic = "force-dynamic";

async function readBody(request: Request): Promise<unknown> {
  const text = await request.text();

  if (text.trim().length === 0) {
    return {};
  }

  return JSON.parse(text);
}

export async function GET(request: Request) {
  try {
    const { readCurrentSession } =
      await import("@/features/auth/application/current-session");

    return jsonResult(
      sessionResponse(await readCurrentSession(request.headers)),
    );
  } catch (error) {
    console.error(
      redactForLog(
        error instanceof Error
          ? error.message
          : "Authentication is unavailable.",
      ),
    );

    return jsonResult(apiFailure("auth_unavailable"));
  }
}

export async function PATCH(request: Request) {
  try {
    const { readCurrentSession } =
      await import("@/features/auth/application/current-session");
    const { changeDisplayName } =
      await import("@/features/auth/application/change-display-name");
    const { saveDisplayName } =
      await import("@/features/auth/infrastructure/account-store");

    return jsonResult(
      await changeDisplayName({
        session: await readCurrentSession(request.headers),
        body: await readBody(request),
        saveDisplayName,
      }),
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return jsonResult(apiFailure("invalid_request"));
    }

    console.error(
      redactForLog(
        error instanceof Error
          ? error.message
          : "Authentication is unavailable.",
      ),
    );

    return jsonResult(apiFailure("auth_unavailable"));
  }
}
