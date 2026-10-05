# Kira Pomodoro

Kira Pomodoro is a focus timer for deliberate practice. The browser runs the timer and handles interaction. The server will validate recorded focus time, reject duplicate recordings, and calculate ranking.

This repository is a single Next.js application. Authentication, skills, the timer, sessions, and the leaderboard are not implemented yet.

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
| `pnpm check`        | Format check, lint, typecheck, and production build |
| `pnpm db:up`        | Start local PostgreSQL                              |
| `pnpm db:down`      | Stop local PostgreSQL and keep its data             |
| `pnpm db:generate`  | Generate Prisma Client                              |
| `pnpm db:migrate`   | Create and apply a development migration            |
| `pnpm db:studio`    | Open Prisma Studio                                  |

## Local URLs

- App: http://localhost:3000
- Health: http://localhost:3000/api/health
- PostgreSQL: `localhost:5432`

The landing page and `GET /api/health` do not query the database. The health response reports process status only.

## Further reading

- [Architecture](docs/architecture.md)
- [Development](docs/development.md)
