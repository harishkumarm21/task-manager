# Architecture

## Stack
Next.js (App Router) + TS + Tailwind → Supabase (Auth + Postgres) → Vercel

## Two Supabase clients
| File       | Runs in | Use for                                |
|------------|---------|----------------------------------------|
| client.ts  | Browser | "use client" components, form events   |
| server.ts  | Server  | Server Components, Server Actions      |

## Keywords
- NEXT_PUBLIC_ → env var exposed to browser
- anon key → public key, safe ONLY because of RLS
- Server Component → default in App Router, can be async
- @supabase/ssr → stores session in cookies (not localStorage)

## Hints
- Restart dev server after .env changes
- Never commit .env.local
- Never use service_role key in frontend

## Cookies
- cookies() → read request cookies (server only, async in Next 15+)
- Cookies are per domain, NOT per project/port
- Supabase session cookie → sb-<ref>-auth-token
- Never log/share session tokens

# Database

## tasks
| column      | type          | notes                       |
|-------------|---------------|-----------------------------|
| id          | uuid PK       | gen_random_uuid()           |
| user_id     | uuid FK       | → auth.users, default auth.uid() |
| title       | text          | 1–200 chars                 |
| description | text          | nullable                    |
| status      | enum          | todo / in_progress / done   |
| priority    | enum          | low / medium / high         |
| due_date    | date          | nullable                    |
| created_at  | timestamptz   | default now()               |
| updated_at  | timestamptz   | trigger                     |

## Keywords
- RLS → row-level filter enforced by Postgres
- auth.uid() → current user id from JWT
- using → which rows you can SEE / target
- with check → what rows you can WRITE
- on delete cascade → user deleted → tasks deleted
- PGRST205 → table not found (API reached = connected)

## Hints
- No RLS + public anon key = anyone can read all data
- RLS on + no policy = nobody can access (deny by default)
- Not logged in → empty [] (not an error)

## Flow
LOGIN
Form submit
   ↓
Server Action login()  → validate input
   ↓
supabase.auth.signInWithPassword
   ↓
Supabase returns tokens → setAll() writes sb-...-auth-token cookie
   ↓
redirect("/dashboard")

EVERY REQUEST
Browser → proxy.ts → updateSession()
                         ↓ getUser() (verify + refresh token)
           no user + /dashboard → /login
           user + /login|/signup → /dashboard
                         ↓
                   page renders → getUser() again (2nd guard)

## DATABASE.md
- auth.users → managed by Supabase, not exposed to API
- public.tasks.user_id → FK to auth.users.id
- Extra user fields → public.profiles (1:1), not needed in MVP 1