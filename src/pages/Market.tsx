import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Download, Eye, Calendar, Search } from "lucide-react";

const allDatasets = [
  {
    id: 1,
    title: "Tesla Model 3 Performance Dataset",
    description: "Dữ liệu hiệu suất chi tiết từ 10,000+ xe Tesla Model 3 trong 2 năm vận hành",
    provider: "Tesla Research Lab",
    rating: 4.9,
    downloads: "12.5K",
    views: "45.2K",
    price: "Miễn phí",
    lastUpdated: "2 ngày trước",
    tags: ["Hiệu suất", "Pin", "Tesla"],
    category: "performance"
  },
  {
    id: 2,
    title: "Global EV Charging Network Data",
    description: "Thông tin về 50,000+ trạm sạc xe điện trên toàn thế giới với dữ liệu thời gian thực",
    provider: "ChargePoint Analytics",
    rating: 4.7,
    downloads: "8.3K",
    views: "32.1K",
    price: "$299/tháng",
    lastUpdated: "1 tuần trước",
    tags: ["Trạm sạc", "Toàn cầu", "Real-time"],
    category: "charging"
  },
  {
    id: 3,
    title: "EV Battery Health Prediction",
    description: "Mô hình AI dự đoán tuổi thọ pin với độ chính xác 95% dựa trên 100K+ mẫu dữ liệu",
    provider: "BatteryTech AI",
    rating: 4.8,
    downloads: "6.7K",
    views: "28.9K",
    price: "$199/dataset",
    lastUpdated: "3 ngày trước",
    tags: ["AI", "Pin", "Dự đoán"],
    category: "battery"
  },
  {
    id: 4,
    title: "EV Market Analysis 2024",
    description: "Phân tích thị trường xe điện toàn cầu với dự báo đến 2030",
    provider: "Market Insights Pro",
    rating: 4.6,
    downloads: "5.2K",
    views: "18.7K",
    price: "$149/báo cáo",
    lastUpdated: "1 tuần trước",
    tags: ["Thị trường", "Phân tích", "Dự báo"],
    category: "market"
  }
];

const Market = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const filteredDatasets = allDatasets.filter(dataset => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || dataset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Thị Trường</span> Dữ Liệu
          </h1>
          <p className="text-muted-foreground text-lg">
            Khám phá và mua các bộ dữ liệu xe điện chất lượng cao
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              <SelectItem value="performance">Hiệu suất</SelectItem>
              <SelectItem value="charging">Trạm sạc</SelectItem>
              <SelectItem value="battery">Pin</SelectItem>
              <SelectItem value="market">Thị trường</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Phổ biến nhất</SelectItem>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="rating">Đánh giá cao</SelectItem>
              <SelectItem value="price">Giá</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDatasets.map((dataset) => (
            <Card key={dataset.id} className="group hover:shadow-electric transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {dataset.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {dataset.description}
                </CardDescription>
                <div className="text-sm font-medium text-primary">
                  by {dataset.provider}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {dataset.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                    <span className="font-medium">{dataset.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Download className="h-4 w-4 text-muted-foreground mr-1" />
                    <span>{dataset.downloads}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 text-muted-foreground mr-1" />
                    <span>{dataset.views}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                    <span>{dataset.lastUpdated}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <span className="text-lg font-bold text-foreground">{dataset.price}</span>
                  </div>
                  <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                    Xem Chi Tiết
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDatasets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Không tìm thấy dataset nào phù hợp với bộ lọc của bạn.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Market;