import { createClient } from "@/lib/supabase/server";
import { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const next = searchParams.get("next") ?? "/dashboard";

  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  console.log("📨 CONFIRM", {
    code: code ? "yes" : "no",
    token_hash: token_hash ? "yes" : "no",
    next: safeNext,
  });

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    console.log("📨 EXCHANGE", error ? `❌ ${error.message}` : "✅ session cookie set");
    if (!error) return NextResponse.redirect(new URL(safeNext, request.url));
  }

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    console.log("📨 VERIFY", error?.message ?? "✅");
    if (!error) return NextResponse.redirect(new URL(safeNext, request.url));
  }

  return NextResponse.redirect(
    new URL("/login?error=Link%20invalid%20or%20expired", request.url),
  );
}
