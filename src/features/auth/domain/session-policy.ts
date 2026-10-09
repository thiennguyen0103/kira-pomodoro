export const sessionPolicy = {
  expiresInSeconds: 60 * 60 * 24 * 7,
  updateAgeSeconds: 60 * 60 * 24,
  cookieCacheEnabled: false,
} as const;
