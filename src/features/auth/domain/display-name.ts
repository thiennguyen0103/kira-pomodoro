export const displayNameFallback = "Learner";
export const displayNameMaxLength = 80;

function isEmailLike(value: string, email: string | null | undefined): boolean {
  if (value.includes("@")) {
    return true;
  }

  return Boolean(email && value.toLowerCase() === email.trim().toLowerCase());
}

export function resolveDisplayName(
  name: string | null | undefined,
  email?: string | null,
): string {
  const trimmed = (name ?? "").trim();

  if (trimmed.length === 0 || isEmailLike(trimmed, email)) {
    return displayNameFallback;
  }

  return trimmed.slice(0, displayNameMaxLength);
}
