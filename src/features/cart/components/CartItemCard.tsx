import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCartStore, isProductExpired } from "../hooks/useCartStore";

interface CartItemCardProps {
  item: {
    product: any;
    quantity: number;
  };
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const expired = isProductExpired(item.product);

  return (
    <div className={`flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0 ${expired ? "opacity-60" : ""}`}>
      <div className="flex gap-4 items-start flex-1">
        <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 relative">
          <img 
            src={item.product.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop"} 
            alt={item.product.title} 
            className="w-full h-full object-cover"
          />
          {expired && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                Expired
              </span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-gray-900 text-lg line-clamp-2">
              {item.product.title}
            </h4>
            {expired && (
              <span className="text-xs bg-red-50 text-red-600 border border-red-100 font-medium px-2 py-0.5 rounded-full">
                Kadaluarsa
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{item.product.merchantName}</p>
          <div className="font-bold text-primary-500 mt-2">
            {item.product.isDonation
              ? "Gratis"
              : `Rp ${(item.product.discountPrice * item.quantity).toLocaleString("id-ID")}`}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full mt-2 sm:mt-0">
        <div className={`flex items-center border border-gray-200 rounded-lg p-1 bg-white ${expired ? "bg-gray-50 border-gray-100" : ""}`}>
          <button 
            disabled={expired}
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            className={`p-1 rounded-md transition-colors ${expired ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100 text-gray-600"}`}
            title="Kurangi"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className={`w-10 text-center font-semibold ${expired ? "text-gray-400" : "text-gray-900"}`}>
            {item.quantity}
          </span>
          <button 
            disabled={expired}
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            className={`p-1 rounded-md transition-colors ${expired ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100 text-gray-600"}`}
            title="Tambah"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus dari Keranjang?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus {item.product.title} dari keranjang?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => removeItem(item.product.id)}
                className="bg-red-500 hover:bg-red-600"
              >
                Ya, Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

