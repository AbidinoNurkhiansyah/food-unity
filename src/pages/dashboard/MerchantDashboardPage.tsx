import { useAuthStore } from "@/features/auth";
import { MerchantBentoGrid } from "@/features/dashboard";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

// Bento Grid Theme Styles (Modern Minimalist / Cobalt-inspired)
const themeStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .font-sans-bento {
    font-family: 'Inter', sans-serif;
  }
  
  /* Subtle enter animation for bento tiles */
  .bento-enter {
    animation: fade-slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  }
  
  @keyframes fade-slide-up {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export function MerchantDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const isInitialCheck = useRef(true);

  useEffect(() => {
    if (isLoading) return;

    if (isInitialCheck.current) {
      isInitialCheck.current = false;
      return;
    }

    if (!isAuthenticated) {
      toast.success('Berhasil logout!');
    }
  }, [isAuthenticated, isLoading]);

  return (
    <>
      <style>{themeStyles}</style>
      <div className="max-w-full font-sans-bento min-h-screen text-slate-900 mt-2">
        <MerchantBentoGrid user={user} />
      </div>
    </>
  );
}
