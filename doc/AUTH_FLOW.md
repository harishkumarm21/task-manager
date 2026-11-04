# Auth Flow

## Files
| File                     | Job                                  |
|--------------------------|--------------------------------------|
| proxy.ts                 | runs before every request            |
| lib/supabase/proxy.ts    | refresh session + redirect rules     |
| (auth)/actions.ts        | login / signup / signout (server)    |
| components/auth-form.tsx | reusable UI + error + pending state  |
| dashboard/page.tsx       | protected page (2nd guard)           |

## Keywords
- Server Action → "use server" fn, called from <form action>
- useActionState → [state, formAction, pending]
- proxy (Next 16) → renamed from middleware
- matcher → which paths proxy runs on
- route group (auth) → folder not in URL
- getUser() → verifies with Supabase (safe)
- getSession() → reads cookie only (NOT for auth checks)

## Rules
- Validate on server, even with HTML `required`
- Generic login error → don't reveal if email exists
- Guard twice: proxy + page
- redirect() throws → never put it inside try/catch

## Flows
SIGNUP (confirm ON)
signUp() → user created, session = null
   ↓
"Check your email" message
   ↓
Email link → /auth/confirm?token_hash=...&type=email
   ↓
verifyOtp() → session cookie set → /dashboard

FORGOT / RESET
/forgot-password → resetPasswordForEmail()
   ↓
Same message always (exists or not)
   ↓
Email link → /auth/confirm?token_hash=...&type=recovery&next=/reset-password
   ↓
verifyOtp() → recovery session → /reset-password
   ↓
updateUser({ password }) → /dashboard

BAD / EXPIRED LINK
/auth/confirm fails → /login?error=... → red error box

## Email links
- /auth/confirm → Route Handler (GET), verifyOtp({ type, token_hash })
- type=email → signup confirmation
- type=recovery → password reset
- Links are single-use + expire

## Password reset
forgot → resetPasswordForEmail → email → /auth/confirm
→ recovery session → /reset-password → updateUser({ password })

## Security
- Same response if email exists or not → no account enumeration
- `next` param must start with "/" → no open redirect
- /reset-password protected → needs recovery session

## Keywords
- Route Handler → app/**/route.ts, exports GET/POST
- token_hash → one-time token in email link
- verifyOtp → exchanges token → session cookie
- searchParams → Promise in Next 15+ (await it)
- Site URL → base for {{ .SiteURL }} in templates

## Prod
- Built-in mailer ≈ 2 emails/hour → use custom SMTP (Resend)
- Update Site URL + Redirect URLs to Vercel domain on deploy

## Email link modes
| Template | Link param  | Handler                         |
|----------|-------------|---------------------------------|
| Default  | ?code=      | exchangeCodeForSession(code)    |
| Custom   | ?token_hash | verifyOtp({ type, token_hash }) |

- Custom templates need custom SMTP (Supabase restriction)
- PKCE code → must open link in SAME browser
- emailRedirectTo / redirectTo must match Redirect URLs allow-list

## The whole auth system: 4 parts
┌──────────────┐   form submit    ┌──────────────┐   API call   ┌──────────┐
│  BROWSER     │ ───────────────► │ SERVER ACTION│ ───────────► │ SUPABASE │
│ auth-form.tsx│ ◄─────────────── │  actions.ts  │ ◄─────────── │  Auth    │
└──────────────┘  error/redirect  └──────────────┘   tokens     └──────────┘
       │                                 │
       │                                 └─► writes cookie: sb-xxx-auth-token
       │
       ▼ every page request (cookie sent automatically)
┌──────────────┐
│  proxy.ts    │  getUser() → logged in?  → allow / redirect
└──────────────┘
       ▼
┌──────────────┐
│ dashboard    │  getUser() again → show email
└──────────────┘