import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CartEmptyState: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200 flex flex-col items-center justify-center">
      <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">Keranjang Kosong</h3>
      <p className="text-gray-500 mb-6">Anda belum memasukkan produk apapun ke keranjang.</p>
      <Button asChild className="bg-primary-500 hover:bg-primary-600">
        <Link to="/explore">Mulai Belanja</Link>
      </Button>
    </div>
  );
};

