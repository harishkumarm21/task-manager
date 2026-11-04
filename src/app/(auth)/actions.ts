"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

export type AuthState = { error?: string; message?: string } | null;

function getEmail(formData: FormData) {
  return String(formData.get("email") ?? "").trim();
}

function getPassword(formData: FormData) {
  return String(formData.get("password") ?? "");
}

function emailError(email: string) {
  return !email || !email.includes("@") ? "Enter a valid email" : null;
}

function passwordError(password: string) {
  return password.length < 8 ? "Password must be atleast 8 characters" : null;
}

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = getEmail(formData);
  const password = getPassword(formData);
  const invalid = emailError(email) ?? passwordError(password);
  if (invalid) return { error: invalid };

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log(
    "🔑 LOGIN",
    email,
    error ? `❌ ${error.message}` : "✅ cookie set",
  );
  if (error) {
    if (error.code == "email_not_confirmed") {
      return { error: "Please confirm your email first" };
    }
    return { error: "Invalid email or password" };
  }

  redirect("/dashboard");
}

export async function signup(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = getEmail(formData);
  const password = getPassword(formData);
  const invalid = emailError(email) ?? passwordError(password);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${SITE_URL}/auth/confirm?next=/dashboard` },
  });
  console.log(
    "📝 SIGNUP",
    email,
    error
      ? `❌ ${error.message}`
      : data.session
        ? "✅ session"
        : "📧 needs confirm",
  );
  if (error) return { error: error.message };

  if (!data.session) {
    return { message: "Check your email to confirm your account" };
  }

  redirect("/dashboard");
}

export async function forgotPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = getEmail(formData);
  const invalid = emailError(email);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/auth/confirm?next=/reset-password`,
  });

  console.log(
    "🔁 FORGOT",
    email,
    error ? `❌ ${error.message}` : "📧 email sent",
  );

  if (error?.code == "over_email_send_rate_limit") {
    return { error: "Too many requests. Try again later." };
  }

  return { message: "If that email exists, a reset link has been sent." };
}

export async function resetPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = getPassword(formData);
  const invalid = passwordError(password);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  console.log(
    "🔒 RESET",
    error ? `❌ ${error.message}` : "✅ password updated",
  );
  if (error) return { error: error.message };

  redirect("/dashboard");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  console.log("🚪 SIGNOUT");
  redirect("/login");
}
