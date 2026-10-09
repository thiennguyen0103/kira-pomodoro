import { mapValues } from "es-toolkit";

const secretKey =
  /token|secret|cookie|authorization|password|credential|session/i;
const bearerPattern = /Bearer\s+\S+/gi;
const querySecretPattern =
  /((?:session_token|access_token|refresh_token|id_token|client_secret|code)=)([^&\s]+)/gi;

export function redactForLog(value: unknown): unknown {
  if (typeof value === "string") {
    return value
      .replace(bearerPattern, "Bearer [redacted]")
      .replace(querySecretPattern, "$1[redacted]");
  }

  if (Array.isArray(value)) {
    return value.map((entry) => redactForLog(entry));
  }

  if (value && typeof value === "object") {
    return mapValues(value, (entry, key) =>
      secretKey.test(key) ? "[redacted]" : redactForLog(entry),
    );
  }

  return value;
}
