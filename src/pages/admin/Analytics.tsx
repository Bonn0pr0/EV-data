import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Database, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Analytics() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Phân tích & Báo cáo</h1>
        <p className="text-muted-foreground mt-2">
          Thống kê thị trường và xu hướng phát triển EV
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-primary p-3 rounded-xl shadow-elegant">
                <Database className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bộ dữ liệu phổ biến</p>
                <h3 className="text-2xl font-bold text-foreground">234</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-primary p-3 rounded-xl shadow-elegant">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tăng trưởng</p>
                <h3 className="text-2xl font-bold text-foreground">+23%</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-primary p-3 rounded-xl shadow-elegant">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lượt tải xuống</p>
                <h3 className="text-2xl font-bold text-foreground">45.2K</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-primary p-3 rounded-xl shadow-elegant">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">API Requests</p>
                <h3 className="text-2xl font-bold text-foreground">1.2M</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Top 10 bộ dữ liệu được quan tâm nhất
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "EV Charging Station Network", downloads: "12,543", trend: "+15%", category: "Infrastructure" },
              { name: "Battery Performance Metrics", downloads: "10,892", trend: "+22%", category: "Technical" },
              { name: "Vehicle Telemetry Data", downloads: "9,456", trend: "+18%", category: "Analytics" },
              { name: "Energy Consumption Patterns", downloads: "8,234", trend: "+12%", category: "Analytics" },
              { name: "Charging Station Availability", downloads: "7,891", trend: "+25%", category: "Real-time" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-smooth">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-primary text-primary-foreground font-bold text-sm w-8 h-8 rounded-lg flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{item.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.downloads} lượt tải xuống
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{item.category}</Badge>
                  <Badge className="bg-success">{item.trend}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card border-border/50 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            AI Insights - Xu hướng phát triển EV
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">🔋 Xu hướng Pin & Năng lượng</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dữ liệu về hiệu suất pin và quản lý năng lượng đang tăng mạnh với tốc độ 45% mỗi quý. 
                Các nhà sản xuất đang tập trung vào tối ưu hóa mật độ năng lượng và tuổi thọ pin.
              </p>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">⚡ Hạ tầng sạc thông minh</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dữ liệu về trạm sạc thông minh và tích hợp lưới điện tăng 38%. Xu hướng sạc nhanh 
                và tích hợp thanh toán tự động đang trở thành tiêu chuẩn mới.
              </p>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">🚗 Dữ liệu xe tự hành</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nhu cầu về dữ liệu telemetry và cảm biến cho xe tự hành tăng 52%. Các dataset về 
                nhận diện đối tượng và quyết định thời gian thực đang được ưu tiên phát triển.
              </p>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">📊 Phân tích hành vi người dùng</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dữ liệu về thói quen sử dụng, mẫu di chuyển và sở thích cá nhân hóa tăng 41%. 
                Các nhà phát triển đang tập trung vào trải nghiệm người dùng thông minh hơn.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
