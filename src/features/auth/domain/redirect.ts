const maxRedirectLength = 2048;

export function isSafeRedirect(value: string, appOrigin: string): boolean {
  const trimmed = value.trim();

  if (trimmed.length === 0 || trimmed.length > maxRedirectLength) {
    return false;
  }

  let decoded = trimmed;

  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return false;
  }

  if (
    decoded.startsWith("/") &&
    !decoded.startsWith("//") &&
    !decoded.startsWith("/\\") &&
    !decoded.includes("\\") &&
    !decoded.includes("://")
  ) {
    return true;
  }

  try {
    return new URL(decoded).origin === appOrigin;
  } catch {
    return false;
  }
}
