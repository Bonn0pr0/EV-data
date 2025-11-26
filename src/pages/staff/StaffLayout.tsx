import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StaffSidebar } from "@/components/StaffSidebar";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { Bell, User, LogOut, Search, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";


export default function StaffLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = React.useState<"light" | "dark">(() => {
    try {
      const stored = localStorage.getItem("theme");
      return (stored === "dark" ? "dark" : "light");
    } catch {
      return "light";
    }
  });

  React.useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === "dark") root.classList.add("dark");
      else root.classList.remove("dark");
      localStorage.setItem("theme", theme);
    } catch (e) {
      console.warn("Could not apply theme", e);
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <StaffSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border/50 bg-card sticky top-0 z-10 shadow-sm">
            <div className="container mx-auto px-4 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="mr-4" />
                  <div className="hidden md:flex items-center max-w-md w-full bg-background/80 rounded-lg">
                    <Input
                      type="text"
                      placeholder="Tìm kiếm..."
                      className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button variant="ghost" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    aria-label={theme === "dark" ? "Chuyển sang sáng" : "Chuyển sang tối"}
                    title={theme === "dark" ? "Chuyển sang sáng" : "Chuyển sang tối"}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <User className="h-5 w-5" />
                        {user && (
                          <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-background" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user?.username || 'Admin'}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user?.email || 'admin@example.com'}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link to="/user" className="flex items-center w-full">
                          <Settings className="mr-2 h-4 w-4" />
                          Cài đặt tài khoản
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Đăng xuất
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
