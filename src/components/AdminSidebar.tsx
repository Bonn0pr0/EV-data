import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Database,
  CreditCard,
  Shield,
  BarChart3,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Tổng quan", url: "/admin", icon: LayoutDashboard },
  { title: "Quản lý người dùng", url: "/admin/users", icon: Users },
  { title: "Kiểm duyệt dữ liệu", url: "/admin/data-moderation", icon: Database },
  { title: "Thanh toán & Doanh thu", url: "/admin/payments", icon: CreditCard },
  { title: "Bảo mật", url: "/admin/security", icon: Shield },
  { title: "Phân tích & Báo cáo", url: "/admin/analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          EV Analytics
        </h2>
        <p className="text-xs text-sidebar-foreground/70 mt-1">Dashboard Quản Lý</p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quản lý hệ thống</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-primary font-medium"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
