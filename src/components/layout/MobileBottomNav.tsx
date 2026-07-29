import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  name: string;
  href?: string;
  action?: "scan";
  icon: LucideIcon;
}

interface MobileBottomNavProps {
  navItems: NavItem[];
  currentPath: string;
}

export function MobileBottomNav({
  navItems,
  currentPath,
}: MobileBottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-lg border-t border-primary/10 flex justify-around items-center h-16 pb-safe z-40 px-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        if (item.action === "scan" || item.href === "/dashboard/scan") {
          return (
            <div key={item.name} className="relative -top-6">
              <Button
                asChild
                size="icon"
                className="w-14 h-14 bg-gradient-to-tr from-palette-600 to-palette-400 hover:from-palette-700 hover:to-palette-500 text-white rounded-full shadow-lg shadow-palette-500/40 transition-all hover:scale-105 active:scale-95"
              >
                <Link to={item.href!}>
                  <Icon className="w-7 h-7" />
                </Link>
              </Button>
            </div>
          );
        }

        const isActive = currentPath === item.href;
        return (
          <Link
            key={item.name}
            to={item.href!}
            className={`flex flex-col items-center justify-center w-16 h-14 gap-1 rounded-2xl transition-all duration-300 ${
              isActive
                ? "text-primary-700 bg-primary-50/80 shadow-sm shadow-primary/5"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                isActive ? "fill-primary/20 stroke-primary-600" : ""
              }`}
            />
            <span className="text-[10px] font-semibold">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
