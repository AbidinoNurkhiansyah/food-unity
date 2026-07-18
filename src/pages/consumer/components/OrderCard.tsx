import React from 'react';
import { formatCurrency } from "@/lib/utils";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

export interface Order {
  orderId: string;
  items: any[];
  total: number;
  status: string;
  snapToken?: string;
  createdAt: string;
}

interface OrderCardProps {
  order: Order;
  onPayNow: (snapToken?: string) => void;
  onCancelClick: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPayNow, onCancelClick }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-xs font-semibold border border-yellow-200"><Clock size={14} /> Belum Dibayar</span>;
      case "PAID":
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-semibold border border-green-200"><CheckCircle2 size={14} /> Lunas</span>;
      case "FAILED":
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-semibold border border-red-200"><XCircle size={14} /> Gagal/Batal</span>;
      default:
        return <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded-md text-xs font-semibold border border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="border-b border-gray-100 p-4 bg-gray-50/50 flex flex-wrap justify-between items-center gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order ID</p>
          <p className="text-sm font-medium text-gray-900">{order.orderId}</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
          {getStatusBadge(order.status)}
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3 mb-4">
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center font-bold text-gray-400">
                  {item.quantity}x
                </div>
                <span className="font-medium text-gray-700">{item.name}</span>
              </div>
              <span className="text-gray-600">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-xs text-gray-500">Total Pembayaran</p>
            <p className="text-lg font-bold text-orange-600">{formatCurrency(order.total)}</p>
          </div>

          {order.status === "PENDING" && (
            <div className="flex gap-2">
              <button
                onClick={() => onCancelClick(order.orderId)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Batalkan Pesanan
              </button>
              <button
                onClick={() => onPayNow(order.snapToken)}
                disabled={!order.snapToken}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50"
              >
                {order.snapToken ? "Bayar Sekarang" : "Token Kedaluwarsa"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
