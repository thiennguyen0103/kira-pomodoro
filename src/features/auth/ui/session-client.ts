import { signOutFailureMessage } from "../domain/sign-out-timer";
import type { PublicSession } from "../domain/public-session";

export const sessionQueryKey = ["session"] as const;

export type AccountUser = PublicSession["user"];

type SessionBody = {
  ok?: boolean;
  data?: { user?: AccountUser };
  error?: { message?: string };
};

export async function readAccount(): Promise<AccountUser | null> {
  const response = await fetch("/api/session");

  if (response.status === 401) {
    return null;
  }

  const body = (await response.json()) as SessionBody;

  if (!response.ok || !body.ok || !body.data?.user) {
    throw new Error("session unavailable");
  }

  return body.data.user;
}

export async function requestGoogleSignIn(input: {
  callbackURL: string;
  errorCallbackURL: string;
}): Promise<string> {
  const response = await fetch("/api/session/sign-in", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = (await response.json()) as SessionBody & {
    data?: { url?: string };
  };

  if (!response.ok || !body.ok || typeof body.data?.url !== "string") {
    throw new Error("sign-in unavailable");
  }

  return body.data.url;
}

export async function requestSignOut(): Promise<
  { ok: true } | { ok: false; message: string }
> {
  try {
    const response = await fetch("/api/session/sign-out", { method: "POST" });
    const body = (await response.json()) as SessionBody & {
      data?: { signedOut?: boolean };
    };

    if (!response.ok || !body.ok || body.data?.signedOut !== true) {
      return {
        ok: false,
        message: body.error?.message ?? signOutFailureMessage,
      };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: signOutFailureMessage };
  }
}
