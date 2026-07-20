import React from "react";
import { Search, MapPin } from "lucide-react";

export const ExploreSearch: React.FC = () => {
  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mau makan apa hari ini? 🍔
        </h1>
        <p className="text-gray-500 mb-6">
          Temukan berbagai makanan lezat di sekitar Anda.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm"
              placeholder="Cari makanan, restoran, atau kategori..."
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors shadow-sm font-medium">
            <MapPin size={18} className="text-primary-500" />
            Lokasi Saat Ini
          </button>
        </div>
      </div>

      <div className="mb-10 flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {["Semua", "Promo", "Terdekat", "Nasi", "Mie", "Ayam", "Minuman"].map(
          (category, idx) => (
            <button
              key={idx}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all ${
                idx === 0
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {category}
            </button>
          ),
        )}
      </div>
    </>
  );
};

