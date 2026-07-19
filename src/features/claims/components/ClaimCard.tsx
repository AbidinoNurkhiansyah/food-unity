import React, { useState } from 'react';
import { type Claim } from '../services/claimsApi';
import { formatCurrency } from '@/lib/utils';
import { Clock, CheckCircle2, XCircle, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ClaimCardProps {
  claim: Claim;
  merchantId: string;
  onComplete: (orderId: string) => void;
  isCompleting?: boolean;
}

export const ClaimCard: React.FC<ClaimCardProps> = ({ claim, merchantId, onComplete, isCompleting = false }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Only show items that belong to this merchant
  const merchantItems = claim.items.filter(item => item.merchantId === merchantId);
  const merchantTotal = merchantItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-xs font-semibold border border-yellow-200"><Clock size={14} /> Menunggu Pembayaran</span>;
      case "PAID":
        return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs font-semibold border border-blue-200"><CheckCircle2 size={14} /> Siap Diambil</span>;
      case "COMPLETED":
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-semibold border border-green-200"><CheckSquare size={14} /> Selesai Diambil</span>;
      case "FAILED":
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-semibold border border-red-200"><XCircle size={14} /> Batal / Kedaluwarsa</span>;
      default:
        return <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded-md text-xs font-semibold border border-gray-200">{status}</span>;
    }
  };

  const formattedDate = claim.createdAt?.toDate 
    ? claim.createdAt.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Waktu tidak diketahui';

  const handleConfirm = () => {
    setShowConfirm(false);
    onComplete(claim.orderId);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4 hover:shadow-md transition-shadow">
        <div className="border-b border-gray-100 p-4 bg-gray-50/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
              Order ID: {claim.orderId}
            </p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">{claim.customerDetails.first_name}</span>
              <span className="text-sm text-gray-500">({claim.customerDetails.email})</span>
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-1">
            {getStatusBadge(claim.status)}
            <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            {merchantItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-orange-100 text-orange-600 rounded-md flex items-center justify-center font-bold text-xs">
                    {item.quantity}x
                  </div>
                  <span className="font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="text-gray-600 font-medium">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Pendapatan (dari pesanan ini)</p>
              <p className="text-lg font-bold text-emerald-600">{formatCurrency(merchantTotal)}</p>
            </div>

            {claim.status === "PAID" && (
              <Button 
                onClick={() => setShowConfirm(true)}
                disabled={isCompleting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
              >
                {isCompleting ? "Memproses..." : "Validasi Manual"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Validasi Pengambilan Manual?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin pembeli atas nama <b>{claim.customerDetails.first_name}</b> sudah mengambil makanannya di toko Anda? 
              Jika divalidasi, pesanan ini akan dianggap selesai dan saldo akan segera diteruskan ke dompet Anda. Aksi ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Ya, Selesaikan Pesanan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
