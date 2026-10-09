import { compact, uniq } from "es-toolkit";

export type AuthEnv = {
  secret: string;
  baseURL: string;
  googleClientId: string;
  googleClientSecret: string;
  trustedOrigins: string[];
};

function required(
  source: Record<string, string | undefined>,
  name: string,
  minimumLength: number,
): string {
  const value = source[name];

  if (typeof value !== "string" || value.length < minimumLength) {
    throw new Error(
      `${name} is required and must be at least ${minimumLength} characters.`,
    );
  }

  return value;
}

function appOrigin(value: string, name: string): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be an absolute http(s) URL.`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${name} must use http or https.`);
  }

  if (url.username || url.password) {
    throw new Error(`${name} must not include credentials.`);
  }

  return url.origin;
}

export function resolveTrustedOrigins(
  baseURL: string,
  configured: string | undefined,
): string[] {
  const origin = appOrigin(baseURL, "BETTER_AUTH_URL");
  const extras = compact(
    (configured ?? "").split(",").map((entry) => entry.trim()),
  ).map((entry) => appOrigin(entry, "AUTH_TRUSTED_ORIGINS"));

  return uniq([origin, ...extras]);
}

export function parseAuthEnv(
  source: Record<string, string | undefined>,
): AuthEnv {
  const baseURL = required(source, "BETTER_AUTH_URL", 1);
  const origin = appOrigin(baseURL, "BETTER_AUTH_URL");

  return {
    secret: required(source, "BETTER_AUTH_SECRET", 32),
    baseURL: origin,
    googleClientId: required(source, "GOOGLE_CLIENT_ID", 1),
    googleClientSecret: required(source, "GOOGLE_CLIENT_SECRET", 1),
    trustedOrigins: resolveTrustedOrigins(origin, source.AUTH_TRUSTED_ORIGINS),
  };
}

export function loadAuthEnv(): AuthEnv {
  return parseAuthEnv(process.env);
}
