import React from "react";
import { Package } from "lucide-react";

export const OrderEmptyState: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
      <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">Belum Ada Pesanan</h3>
      <p className="text-gray-500 mt-2 text-sm">Anda belum memiliki pesanan di kategori ini.</p>
    </div>
  );
};
