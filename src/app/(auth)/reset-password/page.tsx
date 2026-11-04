import { AuthForm } from "@/components/auth-form";
import { resetPassword } from "../actions";

export default function ResetPasswordPage() {
  return (
    <AuthForm
      title="Set new password"
      submitLabel="Update password"
      action={resetPassword}
      fields={["password"]}
      passwordLabel="New Password"
    />
  );
}
