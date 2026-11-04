import { AuthForm } from "@/components/auth-form";
import { forgotPassword } from "../actions";

export default function ForgetPasswordPage() {
  return (
    <AuthForm
      title="Forgot Password"
      submitLabel="Send reset link"
      action={forgotPassword}
      fields={["email"]}
      footer={{ text: "remembered it?", linkLabel: "Log in", href: "/login" }}
    />
  );
}
