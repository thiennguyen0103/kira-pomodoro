import { apiFailure } from "@/features/auth/application/api-response";
import { redactForLog } from "@/features/auth/domain/redact-log";
import { jsonResult } from "@/lib/http/api-response";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { revokeCurrentSession } =
      await import("@/features/auth/application/current-session");

    return jsonResult(await revokeCurrentSession(request.headers));
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
