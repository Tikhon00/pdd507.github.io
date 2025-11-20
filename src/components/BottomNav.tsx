import { Link, useLocation } from "react-router-dom";
import { Home, Gamepad2, Info } from "lucide-react";
import { useEffect } from "react";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Главная" },
    { path: "/missions", icon: Gamepad2, label: "Миссии" },
    { path: "/result", icon: Info, label: "Результат" },
  ];

  const handleVibrate = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav border-t border-border safe-area-bottom">
      <div className="flex justify-around items-center py-2 px-4 max-w-[420px] mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleVibrate}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all min-h-[44px] flex-1 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={24} className={isActive ? "animate-pulse" : ""} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
