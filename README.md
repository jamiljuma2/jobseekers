# AI Career Scout

AI Career Scout is a Next.js + TypeScript foundation for an AI-powered job search platform built for African professionals.

## What is in this scaffold

- Mobile-first landing page with a clearer product story
- Authentication pages for login, registration, and password reset
- Route shells for `dashboard`, `jobs`, `applications`, and `career-passport`
- API stubs for auth, job discovery, applications, alerts, tailoring, interviews, and reporting
- PostgreSQL schema for the core MVP tables and row-level security policies
- Tailwind theme and global styling that fit the product direction in the PRD
- TypeScript and Next.js configuration ready for phase 1 work

## Product direction

The PRD centers on fewer, better applications:

- AI job matching with explainability
- Career Passport profile management
- CV upload and tailoring
- Application tracking
- Interview preparation and alerts

## Notes

- The editor-level static validation passed after removing a premature Node type dependency from `tsconfig.json`.
- Runtime build validation could not be run in this environment because `npm` is not available on the PATH.
 - The database schema is written for Supabase Postgres with row-level security and an auth signup trigger.
- Auth pages are wired to Supabase Auth via server actions and the OAuth callback route.
- Supabase Auth owns password login, email confirmation, Google OAuth, password reset, session cookies, and protected-route middleware; the application does not store passwords.
- Login uses route handlers for password sign-in and Google OAuth, while registration and password reset use server actions.
- The first real MVP API slice now covers session, Career Passport, jobs, match scoring, application tracking, job alerts, and reporting.
 - AI generation endpoints currently provide authenticated deterministic guidance; a provider-backed generation layer can be added later.

## Supabase setup

1. Create a project in the Supabase dashboard.
2. Open **SQL Editor** and run the complete contents of `db/schema.sql`.
3. Copy the Project URL and public `anon` key from **Project Settings > API** into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAILS=admin@example.com
```

4. Enable Email or Google authentication under **Authentication > Providers**.
5. Restart the Next.js server after changing `.env.local`.

## Next steps

1. Add the Supabase values to `.env.local`.
2. Run `npm install` and `npm run build`.
3. Configure `http://localhost:3000/auth/callback` as an allowed redirect URL in Supabase Auth.
