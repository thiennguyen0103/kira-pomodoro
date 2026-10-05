import "server-only";

import { z } from "zod";

const requiredDatabaseUrl =
  "DATABASE_URL is required. Copy .env.example to .env and set a PostgreSQL connection string.";

const postgresDatabaseUrl =
  "DATABASE_URL must be a PostgreSQL connection string starting with postgresql:// or postgres://.";

const databaseUrlSchema = z
  .string({ error: requiredDatabaseUrl })
  .superRefine((value, context) => {
    if (value.length === 0) {
      context.addIssue({
        code: "custom",
        message: requiredDatabaseUrl,
      });
      return;
    }

    if (
      !value.startsWith("postgresql://") &&
      !value.startsWith("postgres://")
    ) {
      context.addIssue({
        code: "custom",
        message: postgresDatabaseUrl,
      });
    }
  });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: databaseUrlSchema,
});

export type Env = z.infer<typeof envSchema>;

function formatEnvError(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "environment";
      return `- ${path}: ${issue.message}`;
    })
    .join("\n");
}

function loadEnv(): Env {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid environment configuration.\n${formatEnvError(parsed.error)}`,
    );
  }

  return parsed.data;
}

export const env = loadEnv();
