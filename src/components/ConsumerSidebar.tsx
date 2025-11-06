import { Link, useLocation } from "react-router-dom";
import { Package, ShoppingCart, TrendingUp, Key, Home, CreditCard, AlertTriangle,FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConsumerSidebar() {
  const location = useLocation();

  const links = [
    // { to: "/consumer/marketplace", icon: Package, label: "Marketplace" },
    { to: "/consumer/cart", icon: ShoppingCart, label: "Giỏ Hàng" },
    { to: "/consumer/purchases", icon: CreditCard, label: "Đơn Mua" },
    { to: "/consumer/invoices", icon: FileText, label: "Hóa Đơn" },
  ];

  return (
    <div className="w-64 bg-gradient-primary border-r border-border/50 min-h-screen p-6">
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-2 text-primary-foreground mb-2">
          <Home className="h-5 w-5" />
          <span className="text-sm">Back to Home</span>
        </Link>
        <h2 className="text-2xl font-bold text-primary-foreground">Data Consumer</h2>
        <p className="text-sm text-primary-foreground/80 mt-1">Portal người dùng dữ liệu</p>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth",
                isActive
                  ? "bg-background/20 text-primary-foreground shadow-elegant"
                  : "text-primary-foreground/70 hover:bg-background/10 hover:text-primary-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}