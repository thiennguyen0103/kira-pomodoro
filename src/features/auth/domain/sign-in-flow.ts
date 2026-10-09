import { isSafeRedirect } from "./redirect";

export const signInPath = "/sign-in";

const relativeOrigin = "http://return.invalid";

export type SignInNotice = "cancelled" | "failed";

function isSignInPath(value: string): boolean {
  return value === signInPath || value.startsWith(`${signInPath}?`);
}

export function signInReturnPath(value: string | null | undefined): string {
  if (
    !value ||
    !value.startsWith("/") ||
    !isSafeRedirect(value, relativeOrigin) ||
    isSignInPath(value)
  ) {
    return "/";
  }

  return value;
}

export function signInErrorPath(returnPath: string): string {
  if (returnPath === signInPath) {
    return signInPath;
  }

  return `${signInPath}?next=${encodeURIComponent(returnPath)}`;
}

export function signInNotice(
  error: string | null | undefined,
): SignInNotice | null {
  if (!error) {
    return null;
  }

  if (error === "access_denied" || error === "cancelled") {
    return "cancelled";
  }

  return "failed";
}

export function signInNoticeMessage(notice: SignInNotice): string {
  if (notice === "cancelled") {
    return "Google sign-in was cancelled. You are not signed in.";
  }

  return "Google sign-in didn't finish. Check your connection and try again.";
}
