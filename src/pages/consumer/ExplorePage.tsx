import React from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { logout } from '@/features/auth/services/authService';
import { LogOut, Search, MapPin, Star, Clock } from 'lucide-react';
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

export const ExplorePage: React.FC = () => {
  const { user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const dummyFoods = [
    { id: 1, name: 'Sate Ayam Madura', merchant: 'Sate Khas Senayan', rating: 4.8, time: '20-30 min', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop' },
    { id: 2, name: 'Nasi Goreng Spesial', merchant: 'Nasi Goreng Kebon', rating: 4.5, time: '15-25 min', img: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?q=80&w=600&auto=format&fit=crop' },
    { id: 3, name: 'Ayam Geprek', merchant: 'Ayam Keprabon', rating: 4.7, time: '25-35 min', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600&auto=format&fit=crop' },
    { id: 4, name: 'Mie Kari Udang', merchant: 'Mie Kocok Mang Dadeng', rating: 4.6, time: '30-40 min', img: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=600&auto=format&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
                FoodUnity
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end mr-4">
                <span className="text-sm font-medium text-gray-900">{user?.displayName || 'Consumer'}</span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-md">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'C'}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah Anda yakin ingin keluar dari aplikasi?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>Ya, Keluar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Search Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mau makan apa hari ini? 🍔</h1>
          <p className="text-gray-500 mb-6">Temukan berbagai makanan lezat di sekitar Anda.</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all shadow-sm"
                placeholder="Cari makanan, restoran, atau kategori..."
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors shadow-sm font-medium">
              <MapPin size={18} className="text-orange-500" />
              Lokasi Saat Ini
            </button>
          </div>
        </div>

        {/* Categories (Dummy) */}
        <div className="mb-10 flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {['Semua', 'Promo', 'Terdekat', 'Nasi', 'Mie', 'Ayam', 'Minuman'].map((category, idx) => (
            <button 
              key={idx}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all ${
                idx === 0 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dummyFoods.map((food) => (
            <div key={food.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={food.img} 
                  alt={food.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-gray-700">{food.rating}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-orange-500 transition-colors">{food.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{food.merchant}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                    <Clock size={14} />
                    {food.time}
                  </div>
                  <button className="text-sm font-semibold text-orange-500 hover:text-orange-600">
                    Pesan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
