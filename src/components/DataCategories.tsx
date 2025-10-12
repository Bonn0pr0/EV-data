import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery, MapPin, Gauge, Wrench, Users, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const categories = [
  {
    id: "battery",
    icon: Battery,
    title: "Dữ Liệu Pin",
    description: "Hiệu suất, tuổi thọ và công nghệ pin xe điện",
    dataCount: "150+ datasets",
    trending: true,
    color: "text-electric-green",
    bgColor: "bg-electric-green/10"
  },
  {
    id: "charging",
    icon: MapPin,
    title: "Trạm Sạc",
    description: "Vị trí, tình trạng và thống kê sử dụng trạm sạc",
    dataCount: "80+ datasets",
    trending: false,
    color: "text-electric-blue",
    bgColor: "bg-electric-blue/10"
  },
  {
    id: "performance",
    icon: Gauge,
    title: "Hiệu Suất",
    description: "Dữ liệu tiêu thụ năng lượng và hiệu suất vận hành",
    dataCount: "120+ datasets",
    trending: true,
    color: "text-electric-purple",
    bgColor: "bg-electric-purple/10"
  },
  {
    id: "maintenance",
    icon: Wrench,
    title: "Bảo Trì",
    description: "Lịch sử bảo trì và dự đoán hư hỏng",
    dataCount: "90+ datasets",
    trending: false,
    color: "text-data-orange",
    bgColor: "bg-data-orange/10"
  },
  {
    id: "behavior",
    icon: Users,
    title: "Hành Vi Người Dùng",
    description: "Thói quen lái xe và sử dụng xe điện",
    dataCount: "60+ datasets",
    trending: true,
    color: "text-electric-green",
    bgColor: "bg-electric-green/10"
  },
  {
    id: "market",
    icon: TrendingUp,
    title: "Thị Trường",
    description: "Giá cả, doanh số và xu hướng thị trường xe điện",
    dataCount: "40+ datasets",
    trending: false,
    color: "text-electric-blue",
    bgColor: "bg-electric-blue/10"
  }
];

const DataCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: typeof categories[0]) => {
    navigate(`/market?category=${category.id}`);
    toast.success(`Khám phá dữ liệu ${category.title}!`);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Danh Mục <span className="bg-gradient-primary bg-clip-text text-transparent">Dữ Liệu</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá các loại dữ liệu xe điện đa dạng từ pin, sạc đến hành vi người dùng
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-electric transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-card-custom"
                onClick={() => handleCategoryClick(category)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${category.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${category.color}`} />
                    </div>
                    {category.trending && (
                      <Badge variant="secondary" className="bg-electric-blue/10 text-electric-blue border-0">
                        Trending
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {category.dataCount}
                    </span>
                    <span className="text-sm text-primary font-medium group-hover:underline">
                      Khám phá →
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DataCategories;