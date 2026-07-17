import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Package, CheckCircle, Clock } from 'lucide-react';

export function MerchantDashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Halo, {user?.displayName || 'Mitra'}! 👋</h1>
        <p className="text-muted-foreground mt-2">
          Selamat datang di dasbor manajemen makanan surplus Anda. Mari selamatkan lebih banyak makanan hari ini!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sisa Stok Aktif</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 Porsi</div>
            <p className="text-xs text-muted-foreground">Belum ada makanan yang diunggah</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Diambil</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 Klaim</div>
            <p className="text-xs text-muted-foreground">Konsumen sedang dalam perjalanan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Berhasil Diselamatkan</CardTitle>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">0 Kg</div>
            <p className="text-xs text-muted-foreground">Total emisi karbon yang dicegah</p>
          </CardContent>
        </Card>
      </div>

      {/* TODO: Add Quick Actions or Recent Claims Table */}
    </div>
  );
}
