import type { AuthErrorCode } from "./api-response";

function textOf(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "";
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "";
}

function statusOf(error: unknown): number | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  if ("statusCode" in error && typeof error.statusCode === "number") {
    return error.statusCode;
  }

  if ("status" in error && typeof error.status === "number") {
    return error.status;
  }

  return undefined;
}

export function authErrorCode(error: unknown): AuthErrorCode {
  const message = textOf(error);

  if (message.includes("Redirect must stay")) {
    return "redirect_rejected";
  }

  if (message.includes("only sign-in method")) {
    return "invalid_request";
  }

  const status = statusOf(error);

  if (status === 401 || status === 403) {
    return "unauthenticated";
  }

  if (status !== undefined && status >= 400 && status < 500) {
    return "invalid_request";
  }

  return "auth_unavailable";
}

export function authFailureFromUpstream(
  status: number,
  bodyText: string,
): AuthErrorCode | null {
  if (status < 400) {
    return null;
  }

  let body: unknown = bodyText;

  try {
    body = JSON.parse(bodyText);
  } catch {
    body = { message: bodyText };
  }

  return authErrorCode({ status, message: textOf(body) });
}
