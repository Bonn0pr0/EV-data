import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, PieChart, Activity, Zap, Battery } from "lucide-react";

const analyticsTools = [
  {
    title: "EV Performance Dashboard",
    description: "Dashboard tương tác để phân tích hiệu suất xe điện với hơn 50 chỉ số",
    features: ["Real-time monitoring", "Custom metrics", "Export reports"],
    price: "$99/tháng",
    icon: BarChart3,
    popular: true
  },
  {
    title: "Battery Analytics Suite",
    description: "Bộ công cụ phân tích pin toàn diện với AI dự đoán",
    features: ["Health prediction", "Degradation analysis", "Temperature monitoring"],
    price: "$149/tháng",
    icon: Battery,
    popular: false
  },
  {
    title: "Market Trend Analyzer",
    description: "Phân tích xu hướng thị trường xe điện với dự báo thông minh",
    features: ["Market forecasting", "Competitor analysis", "Price trends"],
    price: "$199/tháng",
    icon: TrendingUp,
    popular: true
  },
  {
    title: "Charging Network Optimizer",
    description: "Tối ưu hóa mạng lưới trạm sạc với phân tích dữ liệu địa lý",
    features: ["Location optimization", "Usage patterns", "ROI analysis"],
    price: "$299/tháng",
    icon: Zap,
    popular: false
  }
];

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Phân Tích</span> & Báo Cáo
          </h1>
          <p className="text-muted-foreground text-lg">
            Công cụ phân tích dữ liệu xe điện mạnh mẽ với AI tích hợp
          </p>
        </div>

        {/* Hero Section */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-0">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">Bắt đầu với Analytics miễn phí</h2>
                <p className="text-muted-foreground">
                  Dùng thử 14 ngày miễn phí với tất cả tính năng cao cấp
                </p>
              </div>
              <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                Bắt Đầu Miễn Phí
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {analyticsTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Card key={index} className="group hover:shadow-electric transition-all duration-300 hover:-translate-y-1 relative">
                {tool.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-data border-0 text-white">
                      Phổ biến
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {tool.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {tool.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <Activity className="h-4 w-4 text-electric-green mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-2xl font-bold text-foreground">{tool.price}</span>
                    </div>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      Xem Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Tính năng nổi bật</CardTitle>
            <CardDescription>
              Khám phá các tính năng mạnh mẽ của nền tảng analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-electric-blue mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Visualizations</h3>
                <p className="text-sm text-muted-foreground">
                  Biểu đồ tương tác với hơn 20 loại visualization khác nhau
                </p>
              </div>
              <div className="text-center">
                <Activity className="h-12 w-12 text-electric-green mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Real-time Data</h3>
                <p className="text-sm text-muted-foreground">
                  Dữ liệu thời gian thực với độ trễ dưới 1 giây
                </p>
              </div>
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-electric-purple mx-auto mb-4" />
                <h3 className="font-semibold mb-2">AI Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Phân tích thông minh với machine learning tích hợp
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;