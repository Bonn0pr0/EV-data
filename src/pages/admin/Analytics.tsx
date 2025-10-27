import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Database, Zap, Download, DollarSign, Package, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/Statcard";

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
        <StatCard
          title="Tổng DataPackages"
          value="2,847"
          change="+12.5% so với tháng trước"
          changeType="positive"
          icon={Package}
        />
        <StatCard
          title="Tổng Downloads"
          value="156,234"
          change="+18.2% so với tháng trước"
          changeType="positive"
          icon={Download}
        />
        <StatCard
          title="Transactions"
          value="8,942"
          change="+8.4% so với tháng trước"
          changeType="positive"
          icon={BarChart3}
        />
        <StatCard
          title="Doanh thu (RevenueShares)"
          value="$892,450"
          change="+15.3% so với tháng trước"
          changeType="positive"
          icon={DollarSign}
        />
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Top 10 DataPackages phổ biến nhất (từ bảng Downloads)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Battery Performance Dataset", downloads: "12,543", trend: "+15%", category: "Batterys", provider: "Tesla Inc." },
              { name: "Vehicle Telemetry Package", downloads: "10,892", trend: "+22%", category: "Vehicles", provider: "Ford Motors" },
              { name: "Charging Station Metadata", downloads: "9,456", trend: "+18%", category: "MetaDatas", provider: "ChargePoint" },
              { name: "Regional EV Analytics", downloads: "8,234", trend: "+12%", category: "Regions", provider: "EVgo" },
              { name: "Battery Health Reports", downloads: "7,891", trend: "+25%", category: "Battery_metaDatas", provider: "BYD" },
              { name: "Vehicle Usage Patterns", downloads: "6,723", trend: "+19%", category: "Vehicle_metaDatas", provider: "Rivian" },
              { name: "Feedback Analytics Dataset", downloads: "5,892", trend: "+14%", category: "Feedbacks", provider: "NIO" },
              { name: "Transaction History Data", downloads: "5,234", trend: "+17%", category: "Transactions", provider: "Lucid Motors" },
              { name: "Regional Market Analysis", downloads: "4,789", trend: "+21%", category: "Region_metaDatas", provider: "Polestar" },
              { name: "Invoice & Billing Data", downloads: "4,123", trend: "+13%", category: "Invoices", provider: "Xpeng" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-smooth">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-primary text-primary-foreground font-bold text-sm w-8 h-8 rounded-lg flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{item.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.downloads} downloads • {item.provider}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Phân tích theo Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { category: "Batterys", packages: 456, downloads: 32543, revenue: "$125,400" },
                { category: "Vehicles", packages: 389, downloads: 28934, revenue: "$98,200" },
                { category: "MetaDatas", packages: 512, downloads: 45123, revenue: "$156,800" },
                { category: "Regions", packages: 234, downloads: 18456, revenue: "$67,300" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.category}</p>
                    <p className="text-xs text-muted-foreground">{item.packages} packages</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{item.downloads} downloads</p>
                    <p className="text-xs text-success">{item.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Top ProviderProfiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { provider: "Tesla Inc.", packages: 89, revenue: "$234,500", rating: "4.9" },
                { provider: "Ford Motors", packages: 67, revenue: "$189,200", rating: "4.8" },
                { provider: "ChargePoint", packages: 54, revenue: "$145,800", rating: "4.7" },
                { provider: "BYD", packages: 43, revenue: "$98,400", rating: "4.6" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.provider}</p>
                    <p className="text-xs text-muted-foreground">{item.packages} packages • ⭐ {item.rating}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-success">{item.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border/50 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            AI Insights - Xu hướng dữ liệu Marketplace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">🔋 Batterys & Battery_metaDatas</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dữ liệu về hiệu suất pin đang tăng 45% mỗi quý. Các nhà cung cấp tập trung vào battery health monitoring và predictive maintenance data.
              </p>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">🚗 Vehicles & Vehicle_metaDatas</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dữ liệu telemetry và usage patterns tăng 38%. Consumer demand cho real-time vehicle tracking và fleet management insights đang cao nhất.
              </p>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">📊 Transactions & RevenueShares</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tổng transaction volume tăng 52%. Revenue sharing model với providers đang tạo ecosystem bền vững với average revenue split 70/30.
              </p>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">🌍 Regions & Regional Analytics</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Regional market data tăng 41%. Highest demand từ North America và Europe, với Asia-Pacific market đang phát triển nhanh nhất (+67% YoY).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
