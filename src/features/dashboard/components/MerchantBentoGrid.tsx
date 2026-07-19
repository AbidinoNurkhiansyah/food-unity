import React from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  HeartHandshake, 
  AlertCircle,
  Plus,
  ArrowRight,
  Leaf 
} from 'lucide-react';

interface MerchantBentoGridProps {
  user: any;
  mounted: boolean;
  setIsCreateModalOpen: (val: boolean) => void;
}

export const MerchantBentoGrid: React.FC<MerchantBentoGridProps> = ({ 
  user, 
  mounted, 
  setIsCreateModalOpen 
}) => {
  return (
    <>
      <header className="mb-10 text-center bento-enter" style={{ animationDelay: '0ms' }}>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white shadow-sm border border-slate-200/60 text-slate-600 rounded-full text-xs font-medium mb-4">
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          Pahlawan Zero Hunger
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Halo, {user?.displayName || 'Mitra'}
        </h1>
        <p className="mt-2 text-slate-500 font-medium">Ringkasan operasional dan dampak penyelamatan makanan Anda.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)] md:auto-rows-[220px]">
        {/* Tile 1: Active Orders (2x2) */}
        <div 
          className="md:col-span-2 md:row-span-2 bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8 flex flex-col relative overflow-hidden bento-enter shadow-sm"
          style={{ animationDelay: '50ms' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Menunggu Diambil</h2>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
              1
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            <div className="group flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors cursor-pointer">
              <div className="p-3 bg-white text-slate-400 rounded-xl shadow-sm group-hover:text-emerald-600">
                <Package className="w-6 h-6" />
              </div>
              <div className="flex-1 pt-1">
                <h4 className="font-semibold text-slate-900 leading-tight">Paket Roti Malam (3 item)</h4>
                <p className="text-sm text-slate-500 mt-1">Oleh Budi Santoso</p>
              </div>
              <div className="text-right pt-1">
                <p className="text-xs font-bold text-slate-900 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">
                  20:30 WIB
                </p>
              </div>
            </div>
          </div>
          
          <button className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors">
            Lihat semua pesanan <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tile 2: Big Impact Stat (2x1) */}
        <div 
          className="md:col-span-2 md:row-span-1 bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden bento-enter shadow-md"
          style={{ animationDelay: '100ms' }}
        >
          <div className="absolute right-0 top-0 w-48 h-48 bg-emerald-800 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex items-center gap-2 text-emerald-200/80 mb-2 font-medium text-sm">
            <CheckCircle className="w-4 h-4" /> Makanan Diselamatkan
          </div>
          <div className="flex items-baseline gap-2 z-10">
            <span className="text-5xl md:text-6xl font-bold tracking-tighter tabular-nums">
              {mounted ? '45' : '0'}
            </span>
            <span className="text-2xl text-emerald-400/80 font-medium">kg</span>
          </div>
          <p className="text-sm text-emerald-100/70 mt-2 z-10">Bulan ini. Mencegah emisi 112 kg CO₂.</p>
        </div>

        {/* Tile 3: Revenue (1x1) */}
        <Link 
          to="/dashboard/wallet"
          className="md:col-span-1 md:row-span-1 bg-white rounded-3xl border border-slate-200/70 p-6 flex flex-col justify-between bento-enter shadow-sm hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
          style={{ animationDelay: '150ms' }}
        >
          <div className="flex justify-between items-start">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg w-fit group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Dompet Aktif</p>
            <p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">Cek Saldo</p>
          </div>
        </Link>

        {/* Tile 4: Sales Rate (1x1) */}
        <div 
          className="md:col-span-1 md:row-span-1 bg-white rounded-3xl border border-slate-200/70 p-6 flex flex-col justify-between bento-enter shadow-sm hover:border-slate-300 transition-colors"
          style={{ animationDelay: '200ms' }}
        >
           <div className="p-2 bg-slate-100 text-slate-600 rounded-lg w-fit">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Donasi Porsi</p>
            <p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">120</p>
          </div>
        </div>

        {/* Tile 5: Smart Alerts (2x2) */}
        <div 
          className="md:col-span-2 md:row-span-2 bg-white rounded-3xl border border-rose-200/60 p-6 sm:p-8 flex flex-col bento-enter shadow-sm relative overflow-hidden"
          style={{ animationDelay: '250ms' }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-amber-400"></div>
          
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-2">Peringatan Pintar</h2>
          <p className="text-sm text-slate-500 mb-6">Mencegah limbah berdasarkan masa kelayakan.</p>
          
          <div className="space-y-3 flex-1 overflow-y-auto">
            <div className="flex items-center gap-4 p-4 border border-rose-100 rounded-2xl bg-rose-50/50">
              <div className="p-2.5 bg-white shadow-sm text-rose-600 rounded-xl">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 text-sm">Ayam Goreng (15 ptg)</h4>
                <p className="text-xs text-rose-600 mt-0.5">Batas layak jual mendekat</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-xs font-bold text-rose-700 shadow-sm hover:bg-rose-50 transition-colors">
                Diskon
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 border border-amber-100 rounded-2xl bg-amber-50/50">
              <div className="p-2.5 bg-white shadow-sm text-amber-600 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 text-sm">Nasi Putih (20 prs)</h4>
                <p className="text-xs text-amber-600 mt-0.5">Sisa makan siang</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-xs font-bold text-amber-700 shadow-sm hover:bg-amber-50 transition-colors">
                Buat
              </button>
            </div>
          </div>
        </div>

        {/* Tile 6: Quick Action 1 - Create Surplus (1x1) */}
        <div 
          onClick={() => setIsCreateModalOpen(true)}
          className="md:col-span-1 md:row-span-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bento-enter shadow-sm active:scale-95 group"
          style={{ animationDelay: '300ms' }}
        >
          <div className="p-4 bg-emerald-500/50 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8" />
          </div>
          <p className="font-bold tracking-tight text-sm">Buat Paket<br/>Surplus Baru</p>
        </div>

        {/* Tile 7: Quick Action 2 - Donate (1x1) */}
        <div 
          className="md:col-span-1 md:row-span-1 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bento-enter active:scale-95 group"
          style={{ animationDelay: '350ms' }}
        >
          <div className="p-3 bg-slate-100 text-slate-500 rounded-2xl mb-3 group-hover:scale-110 group-hover:bg-slate-200 group-hover:text-slate-700 transition-all">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <p className="font-bold tracking-tight text-slate-700 text-sm">Panggil Relawan<br/>Donasi</p>
        </div>

        {/* Tile 8: Extra Info (2x1) */}
        <div 
          className="md:col-span-2 md:row-span-1 bg-slate-900 text-white rounded-3xl p-6 flex items-center justify-between bento-enter relative overflow-hidden group cursor-pointer"
          style={{ animationDelay: '400ms' }}
        >
          <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-slate-800 to-transparent"></div>
          <div>
            <h3 className="text-lg font-bold tracking-tight mb-1">Laporan Dampak Bulanan</h3>
            <p className="text-sm text-slate-400">Unduh ringkasan performa Zero Hunger.</p>
          </div>
          <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors z-10">
             <ArrowRight className="w-5 h-5 text-white" />
          </div>
        </div>

      </div>
    </>
  );
};
