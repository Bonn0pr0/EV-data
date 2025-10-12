import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Outlet } from "react-router-dom";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border/50 bg-card flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
