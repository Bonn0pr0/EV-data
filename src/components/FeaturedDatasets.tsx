import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Eye, Calendar } from "lucide-react";
import { toast } from "sonner";

const datasets = [
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
    featured: true
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
    featured: false
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
    featured: true
  }
];

const FeaturedDatasets = () => {
  const navigate = useNavigate();

  const handleBuyNow = (datasetId: number) => {
    navigate(`/checkout/${datasetId}`);
    toast.success("Điều hướng đến trang thanh toán!");
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Bộ Dữ Liệu</span> Nổi Bật
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Những bộ dữ liệu chất lượng cao được tin dùng bởi các chuyên gia trong ngành
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {datasets.map((dataset, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-electric transition-all duration-300 hover:-translate-y-1 relative overflow-hidden border-0 shadow-card-custom"
            >
              {dataset.featured && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-gradient-data border-0 text-white">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Nổi bật
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <CardTitle className="text-xl group-hover:text-primary transition-colors pr-16">
                  {dataset.title}
                </CardTitle>
                <CardDescription className="text-base line-clamp-2">
                  {dataset.description}
                </CardDescription>
                <div className="text-sm font-medium text-primary">
                  by {dataset.provider}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {dataset.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                {/* Stats */}
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
                
                {/* Price and Action */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <span className="text-lg font-bold text-foreground">{dataset.price}</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-gradient-primary hover:opacity-90"
                    onClick={() => handleBuyNow(dataset.id)}
                  >
                    Mua Ngay
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => {
              navigate('/market');
              toast.success("Xem tất cả datasets có sẵn!");
            }}
          >
            Xem Tất Cả Datasets
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDatasets;