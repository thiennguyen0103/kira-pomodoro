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

export function displayNameInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "K";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}
