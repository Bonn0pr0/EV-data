import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Save, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/Statcard";

export default function Pricing() {
  const mockPricing = [
    { id: 1, dataset: "Dữ liệu pin Tesla Model 3", model: "Per Download", price: "35,000₫", usage: "Commercial", active: true },
    { id: 2, dataset: "Hành trình VinFast VF8", model: "Subscription", price: "500,000₫/tháng", usage: "Research", active: false },
    { id: 3, dataset: "Dữ liệu sạc nhanh", model: "Per GB", price: "15,000₫/GB", usage: "Both", active: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Chính sách Giá & Chia sẻ
        </h1>
        <p className="text-muted-foreground mt-1">Thiết lập giá và quyền sử dụng cho dữ liệu của bạn</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Giá trung bình"
          value="28,000₫"
          icon={DollarSign}
          change="+12% tăng so với tháng trước"
          changeType="positive"
        />
        <StatCard
          title="Mô hình giá"
          value="3"
          icon={TrendingUp}
        />
        <StatCard
          title="Doanh thu dự kiến"
          value="2.5M₫"
          icon={DollarSign}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thiết lập chính sách giá mới</CardTitle>
          <CardDescription>Định giá cho bộ dữ liệu của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataset">Chọn bộ dữ liệu</Label>
            <Select>
              <SelectTrigger id="dataset">
                <SelectValue placeholder="Chọn dữ liệu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="battery">Dữ liệu pin Tesla Model 3</SelectItem>
                <SelectItem value="trip">Hành trình VinFast VF8</SelectItem>
                <SelectItem value="charging">Dữ liệu sạc nhanh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="model">Mô hình định giá</Label>
              <Select>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Chọn mô hình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="download">Theo lượt tải (Per Download)</SelectItem>
                  <SelectItem value="volume">Theo dung lượng (Per GB)</SelectItem>
                  <SelectItem value="subscription">Thuê bao (Subscription)</SelectItem>
                  <SelectItem value="api">API Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VNĐ)</Label>
              <Input id="price" type="number" placeholder="35000" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage">Quyền sử dụng</Label>
            <Select>
              <SelectTrigger id="usage">
                <SelectValue placeholder="Chọn quyền sử dụng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="research">Chỉ nghiên cứu</SelectItem>
                <SelectItem value="commercial">Thương mại</SelectItem>
                <SelectItem value="both">Cả hai</SelectItem>
                <SelectItem value="extended">Mở rộng (Resale allowed)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="bulk">Giảm giá mua số lượng lớn</Label>
                <p className="text-sm text-muted-foreground">Áp dụng giảm giá cho đơn hàng lớn</p>
              </div>
              <Switch id="bulk" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="trial">Cho phép dùng thử miễn phí</Label>
                <p className="text-sm text-muted-foreground">Cung cấp mẫu dữ liệu giới hạn</p>
              </div>
              <Switch id="trial" />
            </div>
          </div>

          <Button className="w-full bg-gradient-primary hover:opacity-90">
            <Save className="h-4 w-4 mr-2" />
            Lưu chính sách
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chính sách giá hiện tại</CardTitle>
          <CardDescription>Quản lý các chính sách giá đã thiết lập</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bộ dữ liệu</TableHead>
                <TableHead>Mô hình</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Quyền sử dụng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPricing.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.dataset}</TableCell>
                  <TableCell>{item.model}</TableCell>
                  <TableCell className="font-semibold text-success">{item.price}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.usage}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.active ? "default" : "secondary"}>
                      {item.active ? "Kích hoạt" : "Tạm dừng"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Chỉnh sửa</Button>
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
