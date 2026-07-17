import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/hooks/useAuthStore';
import { logout } from '@/features/auth/services/authService';
import { LayoutDashboard, Package, History, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardLayout() {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navItems = [
    { name: 'Ringkasan', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Kelola Stok', href: '/dashboard/products', icon: Package },
    { name: 'Riwayat Klaim', href: '/dashboard/claims', icon: History },
  ];

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r hidden md:flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-primary">Mitra FoodUnity</h2>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link 
                key={item.name} 
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="w-5 h-5 mr-3" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar for mobile */}
        <header className="h-14 bg-card border-b flex items-center justify-between px-4 md:hidden">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="font-bold">FoodUnity</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Keluar
          </Button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
