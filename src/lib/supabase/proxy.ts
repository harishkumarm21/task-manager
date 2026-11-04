import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Verifies the token with Supabase + refreshes it if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(`🛡️ PROXY ${request.nextUrl.pathname} → user: ${user?.email ?? "none"}`);

  const path = request.nextUrl.pathname;

  const authPages = ["/login", "/signup", "/forgot-password"];
  const protectedPages = ["/dashboard", "/reset-password"];

  const isAuthPage = authPages.includes(path);
  const isProtected = protectedPages.some((p) => path.startsWith(p));

  if (!user && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
