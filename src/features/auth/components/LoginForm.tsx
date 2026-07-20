import { AuthIllustration } from "./AuthIllustration";
import { LoginPanel } from "./LoginPanel";

export function LoginForm() {
  return (
    <div className="w-full min-h-screen bg-white grid grid-cols-1 md:grid-cols-2">
      <AuthIllustration />
      <LoginPanel />
    </div>
  );
}
