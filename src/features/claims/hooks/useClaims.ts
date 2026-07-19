import { useState, useEffect } from 'react';
import { useAuthStore } from '@/features/auth';
import { claimsApi, type Claim } from '../services/claimsApi';
import { toast } from 'sonner';

export type TabStatus = 'ALL' | 'PENDING' | 'PAID' | 'COMPLETED';

export function useClaims() {
  const { user } = useAuthStore();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabStatus>('ALL');
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetchClaims();
    }
  }, [user]);

  const fetchClaims = async () => {
    setIsLoading(true);
    try {
      if (!user?.uid) return;
      const data = await claimsApi.getMerchantClaims(user.uid);
      setClaims(data);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat riwayat klaim');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteClaim = async (orderId: string) => {
    try {
      setCompletingId(orderId);
      await claimsApi.completeClaim(orderId);
      toast.success('Pesanan berhasil ditandai selesai (sudah diambil)');
      
      setClaims(prev => 
        prev.map(c => c.orderId === orderId ? { ...c, status: 'COMPLETED' } : c)
      );
    } catch (error) {
      console.error(error);
      toast.error('Gagal memvalidasi pengambilan');
    } finally {
      setCompletingId(null);
    }
  };

  const handleScanTicket = (scannedCode: string) => {
    const matchingClaim = claims.find(c => 
      c.orderId === scannedCode || 
      c.orderId.endsWith(scannedCode)
    );

    if (!matchingClaim) {
      toast.error('Tiket tidak ditemukan! Pastikan kode benar.');
      return;
    }

    if (matchingClaim.status === 'COMPLETED') {
      toast.warning('Pesanan ini sudah diambil sebelumnya!');
      return;
    }

    if (matchingClaim.status !== 'PAID') {
      toast.warning(`Tiket tidak bisa divalidasi. Status: ${matchingClaim.status}`);
      return;
    }

    setIsScannerOpen(false);
    handleCompleteClaim(matchingClaim.orderId);
  };

  const filteredClaims = claims.filter(claim => {
    if (activeTab === 'ALL') return true;
    return claim.status === activeTab;
  });

  return {
    claims: filteredClaims,
    isLoading,
    activeTab,
    setActiveTab,
    completingId,
    isScannerOpen,
    setIsScannerOpen,
    handleCompleteClaim,
    handleScanTicket,
    merchantId: user?.uid || ''
  };
}
