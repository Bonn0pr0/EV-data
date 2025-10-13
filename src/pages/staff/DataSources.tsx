import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Upload, FileText, Edit, Trash2 } from "lucide-react";
import { StatCard } from "@/components/Statcard";
import { Database, Activity, CheckCircle, Clock } from "lucide-react";

export default function DataSources() {
  const mockDatasets = [
    { id: 1, name: "Dữ liệu pin Tesla Model 3", type: "Pin", size: "2.5 GB", status: "active", uploads: 1250, revenue: "45,000,000₫" },
    { id: 2, name: "Hành trình VinFast VF8", type: "Hành trình", size: "1.8 GB", status: "pending", uploads: 0, revenue: "0₫" },
    { id: 3, name: "Dữ liệu sạc nhanh", type: "Sạc", size: "980 MB", status: "active", uploads: 890, revenue: "32,000,000₫" },
    { id: 4, name: "Giao dịch điện năng", type: "Giao dịch", size: "450 MB", status: "active", uploads: 560, revenue: "18,500,000₫" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Quản lý Nguồn Dữ liệu
          </h1>
          <p className="text-muted-foreground mt-1">Đăng ký và quản lý các bộ dữ liệu của bạn</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Thêm nguồn dữ liệu
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Tổng dữ liệu"
          value="4"
          icon={Database}
          change="2 bộ dữ liệu mới"
          changeType="positive"
        />
        <StatCard
          title="Đang hoạt động"
          value="3"
          icon={Activity}
          change="75% tỷ lệ hoạt động"
          changeType="positive"
        />
        <StatCard
          title="Đã phê duyệt"
          value="3"
          icon={CheckCircle}
        />
        <StatCard
          title="Chờ duyệt"
          value="1"
          icon={Clock}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Đăng ký nguồn dữ liệu mới</CardTitle>
          <CardDescription>Thêm dữ liệu mới vào marketplace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Tên bộ dữ liệu</Label>
              <Input id="name" placeholder="VD: Dữ liệu pin Tesla Model 3" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Loại dữ liệu</Label>
              <Select>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="battery">Dữ liệu pin</SelectItem>
                  <SelectItem value="trip">Hành trình</SelectItem>
                  <SelectItem value="charging">Sạc</SelectItem>
                  <SelectItem value="transaction">Giao dịch điện</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" placeholder="Mô tả chi tiết về bộ dữ liệu..." rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="format">Định dạng dữ liệu</Label>
            <Select>
              <SelectTrigger id="format">
                <SelectValue placeholder="Chọn định dạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="raw">Raw Data (CSV, JSON)</SelectItem>
                <SelectItem value="analyzed">Đã phân tích (Reports, Insights)</SelectItem>
                <SelectItem value="both">Cả hai</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Tải lên dữ liệu
            </Button>
            <Button className="flex-1 bg-gradient-primary hover:opacity-90">
              Đăng ký
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Dữ liệu đã đăng ký</CardTitle>
            <div className="flex items-center gap-2">
              <Input placeholder="Tìm kiếm..." className="w-64" />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên dữ liệu</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Dung lượng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Lượt tải</TableHead>
                <TableHead>Doanh thu</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDatasets.map((dataset) => (
                <TableRow key={dataset.id}>
                  <TableCell className="font-medium">{dataset.name}</TableCell>
                  <TableCell>{dataset.type}</TableCell>
                  <TableCell>{dataset.size}</TableCell>
                  <TableCell>
                    <Badge variant={dataset.status === "active" ? "default" : "secondary"}>
                      {dataset.status === "active" ? "Hoạt động" : "Chờ duyệt"}
                    </Badge>
                  </TableCell>
                  <TableCell>{dataset.uploads}</TableCell>
                  <TableCell className="font-semibold text-success">{dataset.revenue}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
