import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Download, Eye, Calendar, FileText, BarChart3, Shield, File, FolderOpen } from "lucide-react";

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
    ],
    files: [
      { name: "tesla_model3_2024_q1.csv", size: "850 MB", format: "CSV", records: "2.5M" },
      { name: "tesla_model3_2024_q2.csv", size: "920 MB", format: "CSV", records: "2.8M" },
      { name: "charging_patterns.json", size: "340 MB", format: "JSON", records: "1.2M" },
      { name: "temperature_data.parquet", size: "215 MB", format: "Parquet", records: "800K" },
      { name: "location_data.parquet", size: "450 MB", format: "Parquet", records: "1.8M" },
      { name: "documentation.pdf", size: "12 MB", format: "PDF", records: "-" }
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

        <Tabs defaultValue="files" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="files">Danh sách File</TabsTrigger>
            <TabsTrigger value="schema">Cấu trúc</TabsTrigger>
            <TabsTrigger value="sample">Mẫu dữ liệu</TabsTrigger>
          </TabsList>

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

          <TabsContent value="files" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Danh sách File Download
                </CardTitle>
                <CardDescription>
                  Các file trong dataset sẵn sàng để tải xuống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{file.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {file.size} • {file.format} • {file.records} bản ghi
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-shrink-0 ml-2"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Tải
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hướng dẫn Tải xuống</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Chọn file bạn muốn tải xuống bằng cách nhấp vào nút "Tải"</p>
                <p>• Tất cả file đều được nén để giảm thời gian tải xuống</p>
                <p>• Bạn sẽ nhận được email với link tải xuống trực tiếp</p>
                <p>• Link tải xuống có hiệu lực trong 7 ngày kể từ khi mua</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DatasetDetailModal;