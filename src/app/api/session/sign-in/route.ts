import { apiFailure } from "@/features/auth/application/api-response";
import { redactForLog } from "@/features/auth/domain/redact-log";
import { jsonResult } from "@/lib/http/api-response";

export const dynamic = "force-dynamic";

async function readBody(request: Request): Promise<unknown> {
  const text = await request.text();

  if (text.trim().length === 0) {
    return {};
  }

  return JSON.parse(text);
}

export async function POST(request: Request) {
  try {
    const { startGoogleSignIn } =
      await import("@/features/auth/application/start-google-sign-in");

    return jsonResult(
      await startGoogleSignIn(request.headers, await readBody(request)),
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
