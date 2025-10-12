import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Download, Eye, Calendar, FileText, BarChart3, Shield } from "lucide-react";

interface Dataset {
  id: number;
  title: string;
  description: string;
  provider: string;
  rating: number;
  downloads: string;
  views: string;
  price: string;
  lastUpdated: string;
  tags: string[];
}

interface DatasetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: Dataset | null;
}

const DatasetDetailModal = ({ isOpen, onClose, dataset }: DatasetDetailModalProps) => {
  if (!dataset) return null;

  const sampleData = {
    overview: {
      size: "2.5 GB",
      format: "CSV, JSON, Parquet",
      updateFrequency: "Hàng ngày",
      license: "Commercial"
    },
    features: [
      "Battery performance metrics",
      "Charging patterns",
      "Temperature data", 
      "Energy consumption",
      "Geographic location data",
      "Temporal patterns"
    ],
    schema: [
      { field: "vehicle_id", type: "string", description: "Unique identifier for vehicle" },
      { field: "timestamp", type: "datetime", description: "Data collection timestamp" },
      { field: "battery_level", type: "float", description: "Battery charge level (0-100%)" },
      { field: "location_lat", type: "float", description: "GPS latitude coordinate" },
      { field: "location_lon", type: "float", description: "GPS longitude coordinate" },
      { field: "temperature", type: "float", description: "Battery temperature in Celsius" }
    ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">
                {dataset.title}
              </DialogTitle>
              <DialogDescription className="text-base mb-4">
                {dataset.description}
              </DialogDescription>
              <div className="text-sm font-medium text-primary mb-4">
                by {dataset.provider}
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground mb-2">{dataset.price}</div>
              <Button className="bg-gradient-primary hover:opacity-90">
                Mua Ngay
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {dataset.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2 fill-current" />
            <span className="font-medium">{dataset.rating}</span>
          </div>
          <div className="flex items-center">
            <Download className="h-5 w-5 text-muted-foreground mr-2" />
            <span>{dataset.downloads}</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-muted-foreground mr-2" />
            <span>{dataset.views}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
            <span>{dataset.lastUpdated}</span>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="schema">Cấu trúc</TabsTrigger>
            <TabsTrigger value="sample">Mẫu dữ liệu</TabsTrigger>
            <TabsTrigger value="api">API Access</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Thông tin Dataset
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kích thước:</span>
                    <span>{sampleData.overview.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Định dạng:</span>
                    <span>{sampleData.overview.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cập nhật:</span>
                    <span>{sampleData.overview.updateFrequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giấy phép:</span>
                    <span>{sampleData.overview.license}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Tính năng chính
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {sampleData.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Shield className="h-4 w-4 text-electric-green mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Mô tả chi tiết</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Dataset này cung cấp dữ liệu chi tiết về hiệu suất xe điện Tesla Model 3, 
                  được thu thập từ hơn 10,000 xe trong suốt 2 năm vận hành. Dữ liệu bao gồm 
                  thông tin về pin, hiệu suất sạc, mô hình sử dụng và các chỉ số kỹ thuật quan trọng. 
                  Đây là tài nguyên quý giá cho các nhà nghiên cứu, kỹ sư và nhà phát triển 
                  muốn hiểu sâu về hoạt động của xe điện trong điều kiện thực tế.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schema" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cấu trúc dữ liệu</CardTitle>
                <CardDescription>
                  Chi tiết về các trường dữ liệu và kiểu dữ liệu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleData.schema.map((field, index) => (
                    <div key={index} className="border-b border-border pb-3 last:border-b-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-sm font-medium">{field.field}</span>
                        <Badge variant="outline">{field.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{field.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sample" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dữ liệu mẫu</CardTitle>
                <CardDescription>
                  Xem trước cấu trúc và nội dung dữ liệu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <pre className="bg-muted p-4 rounded-lg text-sm">
{`{
  "vehicle_id": "TESLA_MODEL3_001",
  "timestamp": "2024-01-15T08:30:00Z",
  "battery_level": 85.6,
  "location_lat": 37.4419,
  "location_lon": -122.1430,
  "temperature": 22.5,
  "charging_status": "not_charging",
  "energy_consumed": 15.2,
  "distance_traveled": 45.8,
  "efficiency": 0.33
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>
                  Truy cập dữ liệu qua RESTful API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Endpoint URL:</h4>
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    https://api.ev-analytics.com/v1/datasets/{dataset.id}
                  </code>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Rate Limits:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 1000 requests/hour cho gói Basic</li>
                    <li>• 10000 requests/hour cho gói Pro</li>
                    <li>• Unlimited cho gói Enterprise</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Authentication:</h4>
                  <code className="bg-muted px-2 py-1 rounded text-sm block">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DatasetDetailModal;