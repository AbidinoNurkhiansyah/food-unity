import {
  ClaimCard,
  ClaimsTabs,
  ClaimsEmptyState,
  useClaims,
} from "@/features/claims";

export function ClaimsPage() {
  const {
    claims,
    isLoading,
    activeTab,
    setActiveTab,
    completingId,
    handleCompleteClaim,
    merchantId,
  } = useClaims();

  return (
    <div className="max-w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
