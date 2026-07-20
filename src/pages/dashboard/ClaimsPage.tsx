import { 
  ClaimCard, 
  ClaimsTabs, 
  ClaimsEmptyState, 
  useClaims 
} from '@/features/claims';
import { History } from 'lucide-react';

export function ClaimsPage() {
  const {
    claims,
    isLoading,
    activeTab,
    setActiveTab,
    completingId,
    handleCompleteClaim,
    merchantId
  } = useClaims();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <History className="text-primary-500 w-8 h-8" />
            Riwayat Klaim
          </h1>
          <p className="text-slate-500 mt-2">
            Pantau daftar pesanan yang masuk dan validasi pengambilan makanan oleh konsumen.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <ClaimsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
          </div>
        ) : claims.length === 0 ? (
          <ClaimsEmptyState activeTab={activeTab} />
        ) : (
          claims.map((claim) => (
            <ClaimCard 
              key={claim.orderId}
              claim={claim}
              merchantId={merchantId}
              onComplete={handleCompleteClaim}
              isCompleting={completingId === claim.orderId}
            />
          ))
        )}
      </div>
    </div>
  );
}

