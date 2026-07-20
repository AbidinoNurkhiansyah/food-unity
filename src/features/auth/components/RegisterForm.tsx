import { AuthIllustration } from "./AuthIllustration";
import { RegisterPanel } from "./RegisterPanel";
import type { UserRole } from "@/features/auth";

interface RegisterFormProps {
  role: UserRole;
}

export function RegisterForm({ role }: RegisterFormProps) {
  return (
    <div className="w-full min-h-screen bg-white grid grid-cols-1 md:grid-cols-2">
      <RegisterPanel role={role} />
      <AuthIllustration />
    </div>
  );
}
