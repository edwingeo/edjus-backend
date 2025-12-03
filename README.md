# Edjus Backend (NestJS)

NestJS service that uses PostgreSQL (via Prisma) for users, supports signup/login, and issues JWT tokens.

## Setup
- Install dependencies: `npm install`
- Environment (required for DB):
  - `PORT` (default `3000`)
  - `JWT_SECRET` (default `dev-secret`)
  - `JWT_EXPIRES_IN` (default `1h`, e.g. `15m`)
  - PostgreSQL:
    - `DATABASE_HOST` (default `localhost`)
    - `DATABASE_PORT` (default `5432`)
    - `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`
    - `DATABASE_SSL` (`true` to enable)
    - `DATABASE_URL` (preferred; e.g. `postgresql://user:pass@localhost:5432/edjus`)
- Start in dev: `npm run start:dev`
- Build: `npm run build`
- Start built bundle: `npm start`

## Vercel deployment
- A serverless entry point lives at `api/[...vercel].ts` and reuses the Nest bootstrap so routes stay under `/api/*`.
- Ensure required env vars are configured in the Vercel project (`PORT` is ignored there, but DB/JWT vars are required).
- Install dependencies (including `@vercel/node`) during deployment and run `prisma generate` so the Prisma client is available.
- Local check: `vercel dev` will execute the catch-all function and forward `/api/*` to the Nest app.

## Prisma ORM
- Schema: `prisma/schema.prisma`
- Migration: `prisma/migrations/20240402120000_init/migration.sql` (creates `User` table).
- Commands:
  - Generate client: `npm run prisma:generate`
  - Apply migrations: `npm run prisma:migrate`

## Auth Flow
- Register: `POST /api/auth/register` with JSON `{ "username": "alice", "password": "strongpass", "roles": ["user"] }`
- Login: `POST /api/auth/login` with JSON `{ "username": "alice", "password": "strongpass" }`
- Responses for register/login: `{ "user": { "id": 1, "username": "...", "roles": [...] }, "access_token": "<JWT>" }`
- Protected profile: `GET /api/auth/profile` with `Authorization: Bearer <JWT>` header.

## Notes
- Ensure PostgreSQL is running and `DATABASE_URL` is valid before running migrations or starting the app.
- Passwords are hashed with bcrypt before storage.
