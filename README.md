# Kira Pomodoro

Kira Pomodoro is a focus timer for deliberate practice. The browser runs the timer and handles interaction. The server will validate recorded focus time, reject duplicate recordings, and calculate ranking.

This repository is a single Next.js application. Google sign-in and database sessions are implemented on the server. The sign-in screen, skills, the timer, and the leaderboard are not implemented yet.

## Stack

- Next.js App Router and TypeScript (strict)
- pnpm 12.6.0
- Tailwind CSS and shadcn/ui
- PostgreSQL and Prisma ORM 7
- Zod
- Oxlint and Oxfmt

## Prerequisites

- Node.js `20.19+`, `22.12+`, or `24+`
- pnpm `12.6.0` (`packageManager` in `package.json`)
- Docker, for the local PostgreSQL database

## Installation

```bash
pnpm install
cp .env.example .env
pnpm db:generate
```

`pnpm install` runs `prisma generate`. Generation does not connect to PostgreSQL. Commands that talk to the database (`pnpm db:migrate`, `pnpm db:studio`) need `DATABASE_URL` and a running database.

## Environment

Copy `.env.example` to `.env` and keep the local development URL unless you use another PostgreSQL instance.

Next.js loads `.env`, `.env.local`, `.env.development`, and `.env.production` from the project root. It does not load env files from `src/`.

Prisma CLI does not use that loader on its own. `prisma.config.ts` calls `@next/env` so `prisma migrate`, `prisma studio`, and the other Prisma commands see the same files.

`DATABASE_URL` is server-only. Do not prefix secrets with `NEXT_PUBLIC_`. Those values are inlined into browser JavaScript.

Server code reads environment variables through `src/lib/env.ts`. If `DATABASE_URL` is missing or is not a PostgreSQL URL, that module throws a message naming the variable.

## Local database

```bash
pnpm db:up
pnpm db:down
```

`pnpm db:up` starts PostgreSQL 17 and waits until its health check passes. Data is stored in the `kira_pomodoro_postgres` volume. `pnpm db:down` stops the container and keeps that volume. It does not delete data.

The example URL is:

`postgresql://kira:kira@localhost:5432/kira_pomodoro?schema=public`

These credentials are for local Docker only.

## Commands

| Command             | Purpose                                             |
| ------------------- | --------------------------------------------------- |
| `pnpm dev`          | Development server                                  |
| `pnpm build`        | Production build                                    |
| `pnpm start`        | Serve the production build                          |
| `pnpm lint`         | Oxlint                                              |
| `pnpm typecheck`    | TypeScript                                          |
| `pnpm format`       | Write Oxfmt formatting                              |
| `pnpm format:check` | Check Oxfmt formatting                              |
| `pnpm test`         | Unit tests                                          |
| `pnpm check`        | Format check, lint, typecheck, and production build |
| `pnpm db:up`        | Start local PostgreSQL                              |
| `pnpm db:down`      | Stop local PostgreSQL and keep its data             |
| `pnpm db:generate`  | Generate Prisma Client                              |
| `pnpm db:migrate`   | Create and apply a development migration            |
| `pnpm db:studio`    | Open Prisma Studio                                  |

## Authentication

Google is the only sign-in method. Better Auth stores the account and the current session in PostgreSQL. A protected request checks that session in the database. There is no background job and no periodic authentication poll.

Session lifetime is 7 days (`expiresIn`). A request that arrives after the session has been used for 1 day (`updateAge`) extends that same session by another 7 days. Cookie caching is off, so sign-out and expiry are visible to the next protected request. Sign-out deletes the current session only. Other devices stay signed in.

The Google identity is `providerId = google` plus Google's stable account id. That pair is unique. The application user id is separate. The first sign-in sets ranking participation and public achievement visibility to false, and stores a display name that is not an email. A later sign-in loads that same account and does not reset the name or those flags.

### Environment

Copy the auth variables from `.env.example` into `.env`. Do not commit real values.

| Variable               | Purpose                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `BETTER_AUTH_URL`      | Origin of this app, such as `http://localhost:3000` or the review origin. No path and no credentials.              |
| `BETTER_AUTH_SECRET`   | Server-only secret, at least 32 characters.                                                                        |
| `GOOGLE_CLIENT_ID`     | Google OAuth client id.                                                                                            |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret.                                                                                        |
| `AUTH_TRUSTED_ORIGINS` | Optional comma-separated origins for this application, such as a review host. `BETTER_AUTH_URL` is always trusted. |

Register these callback URLs in Google Cloud as authorized redirect URIs:

- Local: `http://localhost:3000/api/auth/callback/google`
- Review or deployed: `https://<review-host>/api/auth/callback/google`

`callbackURL`, `errorCallbackURL`, and `newUserCallbackURL` must be an internal path (`/timer`) or an absolute URL on a trusted origin. External destinations are rejected.

### HTTP contract

JSON APIs share one envelope from `src/lib/http/api-response.ts`. Success is `{ "ok": true, "data": ... }`. Failure is `{ "ok": false, "error": { "code", "message" } }`. A later backend route defines its own codes with `defineApiErrors` and returns them through `jsonResult`. Auth codes are `unauthenticated`, `invalid_request`, `redirect_rejected`, and `auth_unavailable`. Messages are fixed and do not include tokens, cookies, or secrets.

| Request                                                   | Result                                                                                                                                                |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /api/session/sign-in` with `{ "callbackURL": "/" }` | `200` `{ "ok": true, "data": { "url" } }`. The browser opens `url` to continue at Google.                                                             |
| `GET /api/auth/callback/google`                           | Creates or restores one account and sets the session cookie, then redirects inside the app. Cancellation and provider errors do not create a session. |
| `GET /api/session`                                        | `200` with the public user, or `401` `unauthenticated`.                                                                                               |
| `POST /api/session/sign-out`                              | `200` `{ "ok": true, "data": { "signedOut": true } }` after the current session is revoked. A failed revocation stays `ok: false`.                    |

The public user is `{ "id", "displayName", "rankingParticipation", "publicAchievementVisibility" }`. It omits email, OAuth tokens, and the session token. A missing, expired, or revoked session is `unauthenticated`.

`POST /api/auth/*` remains the OAuth callback transport. Its success responses stay in Better Auth's format, including redirects. Its error responses use the same `{ "ok": false, "error" }` body.

Logs drop credential fields and token query parameters. Secrets stay in server environment variables.

## Local URLs

- App: http://localhost:3000
- Health: http://localhost:3000/api/health
- Session: http://localhost:3000/api/session
- PostgreSQL: `localhost:5432`

The landing page and `GET /api/health` do not query the database. The health response reports process status only.

## Further reading

- [Architecture](docs/architecture.md)
- [Development](docs/development.md)
