import { AuthForm } from "@/components/auth-form";
import { login } from "../actions";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AuthForm
      title="Log in"
      submitLabel="Log in"
      action={login}
      footer={{ text: "No account?", linkLabel: "Sign up", href: "/signup" }}
      initialError={error}
      extra={
        <div className="text-right">
          <Link href={"/forgot-password"} className="text-sm underline">
            Forget password?
          </Link>
        </div>
      }
    />
  );
}
