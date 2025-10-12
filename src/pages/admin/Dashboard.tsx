import { StatCard } from "@/components/Statcard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Database, DollarSign, TrendingUp, Activity, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tổng quan hệ thống</h1>
        <p className="text-muted-foreground mt-2">
          Thống kê và hoạt động của nền tảng Data Marketplace
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng người dùng"
          value="2,847"
          change="+12.5% so với tháng trước"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Bộ dữ liệu"
          value="1,234"
          change="+8.2% so với tháng trước"
          changeType="positive"
          icon={Database}
        />
        <StatCard
          title="Doanh thu tháng này"
          value="$45,231"
          change="+23.1% so với tháng trước"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Giao dịch"
          value="892"
          change="+5.4% so với tháng trước"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "Nguyễn Văn A", action: "đã tải lên bộ dữ liệu mới", time: "5 phút trước" },
                { user: "Trần Thị B", action: "đã mua bộ dữ liệu EV Battery Data", time: "15 phút trước" },
                { user: "Lê Văn C", action: "đã yêu cầu kiểm duyệt dữ liệu", time: "1 giờ trước" },
                { user: "Phạm Thị D", action: "đã cập nhật thông tin tài khoản", time: "2 giờ trước" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              Dữ liệu chờ kiểm duyệt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "EV Charging Station Data", provider: "ABC Corp", date: "2024-03-15" },
                { name: "Battery Performance Metrics", provider: "XYZ Ltd", date: "2024-03-14" },
                { name: "Vehicle Telemetry Dataset", provider: "Tech Solutions", date: "2024-03-13" },
              ].map((item, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-smooth">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">Nhà cung cấp: {item.provider}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                    </div>
                    <Button size="sm" variant="outline">Kiểm duyệt</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
