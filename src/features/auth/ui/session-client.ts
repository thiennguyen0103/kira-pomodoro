import type { PublicSession } from "../domain/public-session";

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

export async function saveAccountName(
  displayName: string,
): Promise<{ ok: true; user: AccountUser } | { ok: false; message: string }> {
  try {
    const response = await fetch("/api/session", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ displayName }),
    });
    const body = (await response.json()) as SessionBody;

    if (!response.ok || !body.ok || !body.data?.user) {
      return {
        ok: false,
        message: body.error?.message ?? "Could not save your name. Try again.",
      };
    }

    return { ok: true, user: body.data.user };
  } catch {
    return { ok: false, message: "Could not save your name. Try again." };
  }
}
