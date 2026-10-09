import { apiFailure } from "@/features/auth/application/api-response";
import { authFailureFromUpstream } from "@/features/auth/application/auth-failure";
import { redactForLog } from "@/features/auth/domain/redact-log";
import { jsonResult } from "@/lib/http/api-response";

export const dynamic = "force-dynamic";

async function handlers() {
  const [{ toNextJsHandler }, { getAuth }] = await Promise.all([
    import("better-auth/next-js"),
    import("@/features/auth/infrastructure/auth"),
  ]);

  return toNextJsHandler(getAuth());
}

async function present(response: Response) {
  if (response.status < 400) {
    return response;
  }

  const code = authFailureFromUpstream(response.status, await response.text());
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.delete("content-type");

  return jsonResult(apiFailure(code ?? "auth_unavailable"), headers);
}

export async function GET(request: Request) {
  try {
    const { GET: handle } = await handlers();
    return present(await handle(request));
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

export async function POST(request: Request) {
  try {
    const { POST: handle } = await handlers();
    return present(await handle(request));
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
