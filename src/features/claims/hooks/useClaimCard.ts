import { useState } from 'react';
import { type Claim } from '../services/claimsApi';

export function useClaimCard(claim: Claim, merchantId: string, onComplete: (orderId: string) => void) {
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Only show items that belong to this merchant
  const merchantItems = claim.items.filter(item => item.merchantId === merchantId);
  const merchantTotal = merchantItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const formattedDate = claim.createdAt?.toDate 
    ? claim.createdAt.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Waktu tidak diketahui';

  const handleConfirm = () => {
    setShowConfirm(false);
    onComplete(claim.orderId);
  };

  return {
    showConfirm,
    setShowConfirm,
    merchantItems,
    merchantTotal,
    formattedDate,
    handleConfirm
  };
}
