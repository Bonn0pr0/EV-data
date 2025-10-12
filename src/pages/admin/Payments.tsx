import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Eye, AlertTriangle } from "lucide-react";

const pendingDatasets = [
  {
    id: 1,
    name: "EV Charging Station Network Data",
    provider: "ABC Corporation",
    category: "Infrastructure",
    size: "2.5 GB",
    uploadDate: "2024-03-15",
    priority: "high",
  },
  {
    id: 2,
    name: "Battery Performance Metrics 2024",
    provider: "XYZ Limited",
    category: "Technical",
    size: "1.2 GB",
    uploadDate: "2024-03-14",
    priority: "medium",
  },
  {
    id: 3,
    name: "Vehicle Telemetry Dataset",
    provider: "Tech Solutions Inc",
    category: "Analytics",
    size: "3.8 GB",
    uploadDate: "2024-03-13",
    priority: "low",
  },
];

export default function DataModeration() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Kiểm duyệt dữ liệu</h1>
        <p className="text-muted-foreground mt-2">
          Xem xét và phê duyệt dữ liệu trước khi xuất bản
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-warning/10 p-3 rounded-full w-fit mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">12</h3>
              <p className="text-sm text-muted-foreground mt-1">Chờ kiểm duyệt</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-success/10 p-3 rounded-full w-fit mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">145</h3>
              <p className="text-sm text-muted-foreground mt-1">Đã phê duyệt</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-destructive/10 p-3 rounded-full w-fit mx-auto mb-3">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">8</h3>
              <p className="text-sm text-muted-foreground mt-1">Từ chối</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle>Dữ liệu chờ kiểm duyệt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên bộ dữ liệu</TableHead>
                  <TableHead>Nhà cung cấp</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Kích thước</TableHead>
                  <TableHead>Ngày tải lên</TableHead>
                  <TableHead>Độ ưu tiên</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingDatasets.map((dataset) => (
                  <TableRow key={dataset.id}>
                    <TableCell className="font-medium">{dataset.name}</TableCell>
                    <TableCell>{dataset.provider}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{dataset.category}</Badge>
                    </TableCell>
                    <TableCell>{dataset.size}</TableCell>
                    <TableCell>{dataset.uploadDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          dataset.priority === "high"
                            ? "destructive"
                            : dataset.priority === "medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {dataset.priority === "high"
                          ? "Cao"
                          : dataset.priority === "medium"
                          ? "Trung bình"
                          : "Thấp"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Xem
                        </Button>
                        <Button variant="outline" size="sm" className="text-success border-success hover:bg-success/10">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Duyệt
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                          <XCircle className="h-4 w-4 mr-1" />
                          Từ chối
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
