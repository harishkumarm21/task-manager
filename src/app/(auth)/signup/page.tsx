import { AuthForm } from "@/components/auth-form";
import { signup } from "../actions";

export default function SignupPage() {
  return (
    <AuthForm
      title="Create Account"
      submitLabel="Sign up"
      action={signup}
      footer={{ text: "Have an account?", linkLabel: "Log in", href: "/login" }}
    />
  );
}
