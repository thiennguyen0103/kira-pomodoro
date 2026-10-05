# Development

## Daily workflow

```bash
pnpm install
cp .env.example .env
pnpm db:up
pnpm dev
```

Open http://localhost:3000. The health check is http://localhost:3000/api/health.

Before handing work off, run:

```bash
pnpm check
```

Commit messages use [Conventional Commits](https://www.conventionalcommits.org/). `pnpm install` installs Git hooks. `pre-commit` runs the TypeScript check, then formats staged files with Oxfmt and includes that formatting in the commit. `commit-msg` rejects a message when the type or format is wrong.

```text
feat: add a session note field
fix: keep the timer running after refresh
```

Allowed types include `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, and `ci`. Set `HUSKY=0` to skip the hook for one command.

That runs Oxfmt, Oxlint, TypeScript, and `pnpm build`. The landing page and the production build do not need PostgreSQL to be running.

## Environment

1. Copy `.env.example` to `.env`.
2. Leave `DATABASE_URL` pointed at the Docker database, or replace it with another PostgreSQL URL.
3. Do not commit `.env`, `.env.local`, or other real env files. `.env.example` is the committed template.

Next.js loads env files from the repository root automatically:

- `.env`
- `.env.local`
- `.env.development` and `.env.development.local` during `pnpm dev`
- `.env.production` and `.env.production.local` during `pnpm build` and `pnpm start`

Prisma commands load those same files because `prisma.config.ts` calls `loadEnvConfig` from `@next/env`. A shell variable already set in the environment takes precedence over the file, which is the same rule Next.js uses.

Server modules import `env` from `src/lib/env.ts`. That parse runs when the module loads, so a Server Component or action that imports `db` fails immediately if `DATABASE_URL` is missing. Routes that do not import `db`, including the landing page and `/api/health`, keep working.

Never add a secret as `NEXT_PUBLIC_*`. The `NEXT_PUBLIC_` prefix publishes the value to the browser.

## Prisma

This project uses Prisma ORM 7:

- `prisma/schema.prisma` declares the PostgreSQL datasource and the `prisma-client` generator.
- `prisma.config.ts` points at the schema, the migrations directory, and `DATABASE_URL`.
- Generated client output is `prisma/generated`. It is gitignored.
- `src/lib/db.ts` instantiates `PrismaClient` with `@prisma/adapter-pg`.

Generate the client after install or after a schema change:

```bash
pnpm db:generate
```

`pnpm install` also generates it through `postinstall`. Generation does not open a database connection. `pnpm db:generate` still reads env files, but it can finish when `DATABASE_URL` is unset. `pnpm db:migrate` and `pnpm db:studio` cannot.

Create a migration only when the schema has a real model change:

```bash
pnpm db:up
pnpm db:migrate
```

`prisma migrate dev` asks for a migration name, writes SQL under `prisma/migrations`, and applies it to the local database. Do not create an empty migration just to have a migrations folder.

There is no seed script. Add one only when there is real data to insert.

## Local PostgreSQL

`pnpm db:up` runs `docker compose up -d --wait`. Compose uses `compose.yaml`, publishes port `5432`, and stores data in the named volume `kira_pomodoro_postgres`.

`pnpm db:down` runs `docker compose down` without removing volumes. To delete local data yourself, remove the volume explicitly. The project scripts do not do that.

If port `5432` is already in use, stop the other PostgreSQL process or change the published port and `DATABASE_URL` together.

## Common setup issues

**`DATABASE_URL` error during a server action or database import.** `.env` is missing or the value does not start with `postgresql://` or `postgres://`. Copy `.env.example` and restart `pnpm dev`.

**Prisma cannot reach the database.** Start it with `pnpm db:up` and wait until the health check passes. Confirm the user, password, host, port, and database name in `DATABASE_URL` match `compose.yaml`.

**`prisma generate` cannot find the client during typecheck.** Run `pnpm db:generate`. The generated folder is not committed.

**Dependency install scripts did not run.** This repo uses pnpm's `allowBuilds` list in `pnpm-workspace.yaml`. That file only approves build scripts. It is not a monorepo. `prisma` must stay allowed so the Prisma CLI can install its engine.

**Wrong Node.js or pnpm version.** Use Node.js 20.19+, 22.12+, or 24+, and pnpm 12.6.0. The accepted range is also declared in `package.json` `engines` and `packageManager`.
