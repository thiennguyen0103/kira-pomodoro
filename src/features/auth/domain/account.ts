import { omit } from "es-toolkit";

import { resolveDisplayName } from "./display-name";

const oauthUpdateFields = [
  "name",
  "rankingParticipation",
  "publicAchievementVisibility",
] as const;

type OAuthUpdateField = (typeof oauthUpdateFields)[number];

export const privacyDefaults = {
  rankingParticipation: false,
  publicAchievementVisibility: false,
} as const;

export function providerAccountKey(
  providerId: string,
  accountId: string,
): string {
  return `${providerId}:${accountId}`;
}

export function prepareNewAccount(input: {
  name?: string | null;
  email?: string | null;
}) {
  return {
    name: resolveDisplayName(input.name, input.email),
    ...privacyDefaults,
  };
}

export function preserveSavedAccount<T extends Record<string, unknown>>(
  data: T,
): Omit<T, OAuthUpdateField> {
  return omit(data as T & Record<OAuthUpdateField, unknown>, oauthUpdateFields);
}

export function isOAuthCallbackPath(path: string | undefined): boolean {
  return typeof path === "string" && path.includes("/callback/");
}
