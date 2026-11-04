"use client";

import { AuthState } from "@/app/(auth)/actions";
import { error } from "console";
import Link from "next/link";
import { ReactNode, useActionState } from "react";

type Field = "email" | "password";

type Props = {
  title: string;
  submitLabel: string;
  action: (prev: AuthState, formDate: FormData) => Promise<AuthState>;
  footer?: { text: string; linkLabel: string; href: string };
  fields?: Field[];
  passwordLabel?: string;
  extra?: ReactNode;
  initialError?: string;
};

export function AuthForm({
  title,
  submitLabel,
  action,
  footer,
  fields = ["email", "password"],
  passwordLabel = "password",
  extra,
  initialError,
}: Props) {
  const [state, formAction, pending] = useActionState(
    action,
    initialError ? { error: initialError } : null,
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        action={formAction}
        className="w-full max-w-sm space-y-4 rounded-xl border text-gray-700 bg-white border-gray-200 shadow-sm p-6"
      >
        <h1 className="text-2xl font-bold">{title}</h1>

        {fields.includes("email") && (
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        )}

        {fields.includes("password") && (
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              {passwordLabel}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        )}

        {extra}

        {state?.error && (
          <p className="rounded-md bg-red-50 p-2 text-sm font-semibold text-red-600">
            {state.error}
          </p>
        )}

        {state?.message && (
          <p className="rounded-md bg-green-50 text-green-600 p-2 text-sm">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-black text-white font-bold py-2 disabled:opacity-50"
        >
          {pending ? "Please wait..." : submitLabel}
        </button>

        {footer && (
          <p className="text-center text-sm text-gray-600">
            {footer.text}{" "}
            <Link
              href={footer.href}
              className="font-medium underline hover:text-blue-900"
            >
              {footer.linkLabel}
            </Link>
          </p>
        )}
      </form>
    </main>
  );
}
