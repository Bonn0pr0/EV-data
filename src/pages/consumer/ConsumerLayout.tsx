import { Outlet } from "react-router-dom";
import { ConsumerSidebar } from "@/components/ConsumerSidebar";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ConsumerLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <ConsumerSidebar />
      
      <div className="flex-1">
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">EV Data Marketplace</h1>
              <p className="text-sm text-muted-foreground">Khám phá & phân tích dữ liệu EV</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
              
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
