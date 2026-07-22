import React from "react";
import {
  Minus,
  Plus,
  Trash2,
  Clock,
  Store,
  Scale,
  Package,
  Tag,
} from "lucide-react";
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
import {
  useCartStore,
  isProductExpired,
  type CartItem,
} from "../hooks/useCartStore";

interface CartItemCardProps {
  item: CartItem;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeItem, toggleSelectItem } = useCartStore();
  const expired = isProductExpired(item.product);
  const isSelected = item.selected ?? true;

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    try {
      const date = new Date(deadline);
      if (isNaN(date.getTime())) return deadline;
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return deadline;
    }
  };

  const discountPercent =
    !item.product.isDonation &&
    item.product.originalPrice > item.product.discountPrice
      ? Math.round(
          ((item.product.originalPrice - item.product.discountPrice) /
            item.product.originalPrice) *
            100
        )
      : 0;

  const unitLabel =
    item.product.unit === "pcs"
      ? "pcs"
      : item.product.unit === "porsi"
      ? "porsi"
      : item.product.unit === "box"
      ? "box"
      : item.product.unit === "kg"
      ? "kg"
      : item.product.unit === "gram"
      ? "g"
      : item.product.unit;

  return (
    <div
      className={`flex flex-col md:flex-row justify-between gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0 transition-all ${
        expired ? "opacity-60" : ""
      }`}
    >
      <div className="flex gap-3 sm:gap-4 items-start flex-1 min-w-0">
        {/* Checkbox Pilih Produk */}
        <div className="flex items-center pt-9 sm:pt-10 shrink-0">
          <input
            type="checkbox"
            disabled={expired}
            checked={!expired && isSelected}
            onChange={() => toggleSelectItem(item.product.id)}
            className="w-5 h-5 rounded-md accent-palette-700 border-gray-300 text-primary-500 focus:ring-primary-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            title={
              expired
                ? "Expired products cannot be selected."
                : "Select this product for checkout."
            }
          />
        </div>

        {/* Gambar Produk */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 relative shadow-sm">
          <img
            src={
              item.product.imageUrl ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop"
            }
            alt={item.product.title}
            className="w-full h-full object-cover"
          />
          {expired && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center p-1">
              <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                Kadaluarsa
              </span>
            </div>
          )}
          {item.product.isDonation ? (
            <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              Donasi
            </span>
          ) : discountPercent > 0 ? (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
              <Tag size={10} /> -{discountPercent}%
            </span>
          ) : null}
        </div>

        {/* Informasi Detail Produk */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {item.product.category && (
              <span className="text-[11px] font-semibold bg-primary-50 text-primary-700 px-2.5 py-0.5 rounded-full border border-primary-100/60 capitalize">
                {item.product.category}
              </span>
            )}
            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
              <Store size={13} className="text-primary-500 shrink-0" />
              <span className="truncate">{item.product.merchantName}</span>
            </div>
          </div>

          <h4 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-1 leading-snug">
            {item.product.title}
          </h4>

          {item.product.description && (
            <p className="text-xs text-gray-500 line-clamp-1">
              {item.product.description}
            </p>
          )}

          {/* Metadata Grid (Berat, Stok, Batas Waktu) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 pt-1">
            {item.product.weightInGrams && (
              <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded text-gray-600 border border-gray-100">
                <Scale size={12} className="text-gray-400" />
                <span>
                  {item.product.weightInGrams * item.quantity}g{" "}
                  <span className="text-gray-400">
                    ({item.product.weightInGrams}g/{unitLabel})
                  </span>
                </span>
              </div>
            )}

            {item.product.stock !== undefined && (
              <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded text-gray-600 border border-gray-100">
                <Package size={12} className="text-gray-400" />
                <span>
                  Stok: {item.product.stock} {unitLabel}
                </span>
              </div>
            )}

            {item.product.pickupDeadline && (
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-800 border border-amber-100/70">
                <Clock size={12} className="text-amber-600 shrink-0" />
                <span>
                  Ambil s/d:{" "}
                  <strong>{formatDeadline(item.product.pickupDeadline)}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Harga (Total & Satuan) */}
          <div className="pt-1.5 flex items-baseline gap-2 flex-wrap">
            <span className="font-extrabold text-lg text-primary-600">
              {item.product.isDonation
                ? "Gratis"
                : `Rp ${(
                    item.product.discountPrice * item.quantity
                  ).toLocaleString("id-ID")}`}
            </span>

            {!item.product.isDonation && (
              <>
                {item.product.originalPrice > item.product.discountPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    Rp $
                    {(
                      item.product.originalPrice * item.quantity
                    ).toLocaleString("id-ID")}
                  </span>
                )}
                <span className="text-xs text-gray-400 font-medium">
                  (Rp {item.product.discountPrice.toLocaleString("id-ID")} /{" "}
                  {unitLabel})
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Kontrol Kuantitas & Hapus */}
      <div className="flex items-center justify-between md:justify-end gap-4 md:w-auto w-full pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0">
        <div className="flex flex-col items-end gap-1">
          <div
            className={`flex items-center border border-gray-200 rounded-lg p-1 bg-white shadow-sm ${
              expired ? "bg-gray-50 border-gray-100" : ""
            }`}
          >
            <button
              disabled={expired}
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
              className={`p-1.5 rounded-md transition-colors ${
                expired
                  ? "text-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-100 text-gray-600 active:bg-gray-200"
              }`}
              title="Kurangi Kuantitas"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span
              className={`w-10 text-center font-bold text-sm ${
                expired ? "text-gray-400" : "text-gray-900"
              }`}
            >
              {item.quantity}
            </span>
            <button
              disabled={expired || item.quantity >= item.product.stock}
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
              className={`p-1.5 rounded-md transition-colors ${
                expired || item.quantity >= item.product.stock
                  ? "text-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-100 text-gray-600 active:bg-gray-200"
              }`}
              title={
                item.quantity >= item.product.stock
                  ? "Mencapai Batas Stok"
                  : "Tambah Kuantitas"
              }
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {item.quantity >= item.product.stock && !expired && (
            <span className="text-[10px] font-semibold text-amber-600">
              Batas stok tercapai
            </span>
          )}
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-xl transition-colors cursor-pointer"
              title="Hapus item"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white border-none ring-0 sm:rounded-2xl p-6">
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus dari Keranjang?</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus{" "}
                <strong>{item.product.title}</strong> dari keranjang belanja
                Anda?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="border-none bg-transparent mt-4">
              <AlertDialogCancel className="border-none shadow-none hover:bg-gray-100 cursor-pointer rounded-xl font-medium">
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => removeItem(item.product.id)}
                className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold cursor-pointer"
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
