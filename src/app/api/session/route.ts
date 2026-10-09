import { redactForLog } from "@/features/auth/domain/redact-log";
import { apiFailure } from "@/features/auth/application/api-response";
import { jsonResult } from "@/lib/http/api-response";
import { sessionResponse } from "@/features/auth/application/session-response";

export const dynamic = "force-dynamic";

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
