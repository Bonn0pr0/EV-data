"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Database, Zap, Download, DollarSign, Package, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/Statcard";

export default function Analytics() {
  const [dashboard, setDashboard] = useState(null);
  const [topPackages, setTopPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/Dashboard/Total").then((res) => res.json()),
      fetch("/api/Dashboard/top-packages?top=10").then((res) => res.json()),
      fetch("/api/Dashboard/category-analytics").then((res) => res.json()),
      fetch("/api/Dashboard/top-providers?top=10").then((res) => res.json()),
    ])
      .then(([dash, top, cats, provs]) => {
        setDashboard(dash || {});
        setTopPackages(top || []);
        setCategories(cats || []);
        setProviders(provs || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dữ liệu...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Phân tích & Báo cáo</h1>
        <p className="text-muted-foreground mt-2">
          Thống kê thị trường và xu hướng phát triển EV
        </p>
      </div>

      {/* ✅ Thẻ thống kê tổngwnL quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng gói dữ liệu"
          value={dashboard?.totalDataPackage?.toLocaleString?.() || 0}
          changeType="positive"
          icon={Package}
        />
        <StatCard
          title="Tổng lượt tải"
          value={dashboard?.totalDownLoad?.toLocaleString?.() || 0}
          changeType="positive"
          icon={Download}
        />
        <StatCard
          title="Số giao dịch"
          value={dashboard?.totalTransaction?.toLocaleString?.() || 0}
          changeType="positive"
          icon={BarChart3}
        />
        <StatCard
          title="Doanh thu"
          value={`${dashboard?.totalRevenue?.toLocaleString?.() || 0} VND`}
          changeType="positive"
          icon={DollarSign}
        />
      </div>


      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Top 10 DataPackages phổ biến nhất
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPackages.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-smooth">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-primary text-primary-foreground font-bold text-sm w-8 h-8 rounded-lg flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{item.dataPackageName}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.totalDownloads?.toLocaleString?.()} downloads • {item.providerName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{item.type}</Badge>
                  <Badge className="bg-success">{item.trend || "+0%"}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ✅ Phân tích theo Category + Top Providers */}
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
              {categories.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.categoryName}</p>
                    <p className="text-xs text-muted-foreground">{item.totalPackages} packages</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{item.totalDownloads?.toLocaleString?.()} downloads</p>
                    <p className="text-xs text-success">{item.totalRevenue?.toLocaleString?.()} VND</p>
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
              {providers.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.providerName}</p>
                    <p className="text-xs text-muted-foreground">{item.totalPackages} packages •  {item.rating  } ⭐</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-success">{item.totalRevenue?.toLocaleString?.()} VND</p>
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
