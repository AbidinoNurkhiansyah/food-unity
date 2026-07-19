import { useEffect, useState } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { claimsApi, type Claim } from '@/features/claims/services/claimsApi';
import { ClaimCard } from '@/features/claims/components/ClaimCard';
import { ScannerModal } from '@/features/claims/components/ScannerModal';
import { History, PackageSearch, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type TabStatus = 'ALL' | 'PENDING' | 'PAID' | 'COMPLETED';

export function ClaimsPage() {
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
      
      // Update local state instead of refetching everything to be faster
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
    // Cari pesanan yang cocok (bisa dicocokkan dengan orderId penuh atau 6 digit terakhir)
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

    // Jika cocok dan statusnya PAID, langsung eksekusi completeClaim
    setIsScannerOpen(false);
    handleCompleteClaim(matchingClaim.orderId);
  };

  const filteredClaims = claims.filter(claim => {
    if (activeTab === 'ALL') return true;
    return claim.status === activeTab;
  });

  const tabs: { label: string; value: TabStatus }[] = [
    { label: 'Semua Pesanan', value: 'ALL' },
    { label: 'Menunggu (Pending)', value: 'PENDING' },
    { label: 'Siap Diambil (Paid)', value: 'PAID' },
    { label: 'Selesai (Completed)', value: 'COMPLETED' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <History className="text-orange-500 w-8 h-8" />
            Riwayat Klaim
          </h1>
          <p className="text-slate-500 mt-2">
            Pantau daftar pesanan yang masuk dan validasi pengambilan makanan oleh konsumen.
          </p>
        </div>
        <Button 
          onClick={() => setIsScannerOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-2 h-12 px-6 rounded-xl"
        >
          <QrCode size={20} />
          <span className="font-semibold text-base">Scan Tiket Pembeli</span>
        </Button>
      </div>

      <ScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScan={handleScanTicket} 
      />

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`whitespace-nowrap px-4 py-2.5 rounded-t-lg font-medium text-sm transition-colors relative ${
              activeTab === tab.value
                ? 'text-orange-600 bg-orange-50/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            {activeTab === tab.value && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredClaims.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-16 text-center shadow-sm">
            <PackageSearch className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak Ada Pesanan</h3>
            <p className="text-gray-500">
              {activeTab === 'ALL' 
                ? 'Belum ada pesanan yang masuk ke toko Anda.' 
                : `Tidak ada pesanan dengan status ${tabs.find(t => t.value === activeTab)?.label}.`}
            </p>
          </div>
        ) : (
          filteredClaims.map((claim) => (
            <ClaimCard 
              key={claim.orderId}
              claim={claim}
              merchantId={user?.uid || ''}
              onComplete={handleCompleteClaim}
              isCompleting={completingId === claim.orderId}
            />
          ))
        )}
      </div>
    </div>
  );
}
