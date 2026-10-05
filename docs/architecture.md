# Architecture

Kira Pomodoro is one Next.js application. Browser code displays the timer and handles interaction. Server code will validate recorded focus time, prevent duplicate recording, and calculate ranking. Those product features are not built yet.

## Folders

| Path                    | Responsibility                                                 |
| ----------------------- | -------------------------------------------------------------- |
| `src/app`               | Routes, layouts, and route handlers. Pages stay thin.          |
| `src/features`          | Feature UI and feature logic, once a feature exists.           |
| `src/components/ui`     | Shared shadcn/ui components.                                   |
| `src/components/layout` | Shared application chrome.                                     |
| `src/lib`               | Shared helpers, environment validation, and the Prisma client. |
| `src/server`            | Server-only business services.                                 |
| `src/styles`            | Global Tailwind and theme tokens.                              |
| `prisma`                | Prisma schema and, later, migrations.                          |
| `public`                | Static files.                                                  |

Create a feature folder only when it contains implementation. Do not add empty business modules.

Future feature folders:

- `src/features/auth`
- `src/features/skills`
- `src/features/timer`
- `src/features/sessions`
- `src/features/leaderboard`
- `src/features/profile`

## Server and Client Components

Server Components are the default. Do not add `"use client"` unless the component needs state, events, or a browser API.

The root layout is a Server Component. `ThemeProvider`, `QueryProvider`, `FormDevtools`, and the Sonner toaster are Client Components because they use browser state. `QueryProvider` creates a new TanStack Query client for each server render and reuses one client in the browser. `FormDevtools` shows TanStack Form state in development. The landing page does not need a Client Component.

Database modules and other server-only modules import `server-only`. Client Components cannot import them. Prisma is used only from server code: Server Components, Server Actions, route handlers, and modules under `src/server` or `src/lib/db.ts`.

A Server Component should call a server function directly. Do not add an internal HTTP request for data the server can already reach.

## Mutations and HTTP endpoints

Use Server Actions for application mutations such as saving a session. Validate action inputs on the server with Zod. Check authentication and authorization inside the action before changing data.

Client forms use TanStack Form. Pass a Zod schema to the form's `validators`. That check is for the person filling in the form. The Server Action still validates the same input before it changes data.

Use a route handler when an HTTP endpoint is required, such as `GET /api/health`. Validate inputs with Zod there as well. Future handlers that read or change user data must check authentication and authorization. The health route does neither: it only reports that the process is up and does not touch the database.

## Database access

`prisma/schema.prisma` is the source of truth for PostgreSQL models. The connection string lives in `prisma.config.ts`, which is the Prisma 7 setup. The schema currently has no models and no migrations.

`src/lib/db.ts` creates one Prisma Client with the PostgreSQL driver adapter. In development it stores that client on `globalThis` so hot reload does not open extra pools. Import `db` from server code only.

`src/lib/env.ts` parses `DATABASE_URL` before the client is constructed. A missing or non-PostgreSQL URL fails there, with the variable name in the error.

## Product boundary

When the timer exists, client code will display it and collect the session. Server code will decide whether that focus time is stored, whether it duplicates an existing record, and how it affects ranking. The client does not calculate the official result.
