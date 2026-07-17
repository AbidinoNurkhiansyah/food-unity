import { RegisterForm } from '@/features/auth';

export function ConsumerRegisterPage() {
  return (
    <div className="min-h-screen bg-muted/50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-card text-card-foreground shadow-sm rounded-xl p-6">
        <RegisterForm role="consumer" />
      </div>
    </div>
  );
}
