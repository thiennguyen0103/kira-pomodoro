import "server-only";

import { betterAuth, type User } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import type { GoogleProfile } from "better-auth/social-providers";

import { db } from "@/lib/db";

import {
  isOAuthCallbackPath,
  prepareNewAccount,
  preserveSavedAccount,
} from "../domain/account";
import { resolveDisplayName } from "../domain/display-name";
import { redactForLog } from "../domain/redact-log";
import { isSafeRedirect } from "../domain/redirect";
import { sessionPolicy } from "../domain/session-policy";
import { loadAuthEnv, type AuthEnv } from "./auth-env";

const redirectFields = [
  "callbackURL",
  "errorCallbackURL",
  "newUserCallbackURL",
] as const;

type AuthLogLevel = "debug" | "info" | "warn" | "error";

type CreatedUser = User & Record<string, unknown>;

type UpdatedUser = Partial<User> & Record<string, unknown>;

type AuthHookContext = {
  path: string;
} | null;

type AuthRequestContext = {
  path: string;
  body: unknown;
};

function readBodyString(body: unknown, key: string): string | undefined {
  if (!body || typeof body !== "object" || !(key in body)) {
    return undefined;
  }

  const value = (body as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}

export function createAuth(env: AuthEnv) {
  return betterAuth({
    baseURL: env.baseURL,
    secret: env.secret,
    trustedOrigins: env.trustedOrigins,
    database: prismaAdapter(db, {
      provider: "postgresql",
    }),
    session: {
      expiresIn: sessionPolicy.expiresInSeconds,
      updateAge: sessionPolicy.updateAgeSeconds,
      cookieCache: {
        enabled: sessionPolicy.cookieCacheEnabled,
      },
    },
    account: {
      storeAccountCookie: false,
      accountLinking: {
        enabled: true,
        trustedProviders: ["google"],
        updateUserInfoOnLink: false,
      },
    },
    socialProviders: {
      google: {
        clientId: env.googleClientId,
        clientSecret: env.googleClientSecret,
        overrideUserInfoOnSignIn: false,
        mapProfileToUser: (profile: GoogleProfile) => ({
          name: resolveDisplayName(profile.name, profile.email),
        }),
      },
    },
    user: {
      additionalFields: {
        rankingParticipation: {
          type: "boolean",
          required: true,
          defaultValue: false,
          input: false,
        },
        publicAchievementVisibility: {
          type: "boolean",
          required: true,
          defaultValue: false,
          input: false,
        },
      },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user: CreatedUser) => {
            const prepared = prepareNewAccount({
              name: user.name,
              email: user.email,
            });

            return {
              data: {
                ...user,
                name: prepared.name,
                rankingParticipation: prepared.rankingParticipation,
                publicAchievementVisibility:
                  prepared.publicAchievementVisibility,
              },
            };
          },
        },
        update: {
          before: async (user: UpdatedUser, context: AuthHookContext) => {
            if (!isOAuthCallbackPath(context?.path)) {
              return { data: user };
            }

            return { data: preserveSavedAccount(user) };
          },
        },
      },
    },
    hooks: {
      before: createAuthMiddleware(async (ctx: AuthRequestContext) => {
        if (ctx.path !== "/sign-in/social") {
          return;
        }

        const provider = readBodyString(ctx.body, "provider");

        if (provider !== "google") {
          throw new APIError("BAD_REQUEST", {
            message: "Google is the only sign-in method.",
          });
        }

        for (const field of redirectFields) {
          const destination = readBodyString(ctx.body, field);

          if (destination && !isSafeRedirect(destination, env.baseURL)) {
            throw new APIError("BAD_REQUEST", {
              message: "Redirect must stay on this application.",
            });
          }
        }
      }),
    },
    logger: {
      level: "warn",
      log(level: AuthLogLevel, message: string, ...args: readonly unknown[]) {
        const sink = level === "error" ? console.error : console.warn;
        sink(
          redactForLog(message),
          ...args.map((entry) => redactForLog(entry)),
        );
      },
    },
    plugins: [nextCookies()],
  });
}

let auth: ReturnType<typeof createAuth> | undefined;

export function getAuth() {
  auth ??= createAuth(loadAuthEnv());
  return auth;
}
