import { useEffect, useState } from "react";
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
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  const userId = sessionStorage.getItem("userId");

  // 🔹 Dữ liệu mẫu cho bảng bên dưới
  const mockPricing = [
    { id: 1, dataset: "Dữ liệu pin Tesla Model 3", model: "Per Download", price: "35,000₫", active: true },
    { id: 2, dataset: "Hành trình VinFast VF8", model: "Subscription", price: "500,000₫/tháng", active: false },
    { id: 3, dataset: "Dữ liệu sạc nhanh", model: "Per GB", price: "15,000₫/GB", active: true },
  ];

  // 🔹 Gọi API để lấy dữ liệu gói
  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/DataPackage/user", {
          headers: {
            accept: "*/*",
          },
        });

        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu");
        const data = await res.json();
        setPackages(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="space-y-6">
      {/* ----- Tiêu đề ----- */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Chính sách Giá & Chia sẻ
        </h1>
        <p className="text-muted-foreground mt-1">
          Thiết lập giá và quyền sử dụng cho dữ liệu của bạn
        </p>
      </div>

      {/* ----- Thống kê ----- */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Giá trung bình"
          value="28,000₫"
          icon={DollarSign}
          change="+12% tăng so với tháng trước"
          changeType="positive"
        />
        <StatCard title="Bộ dữ liệu" value="3" icon={TrendingUp} />
        <StatCard title="Doanh thu dự kiến" value="2.5M₫" icon={DollarSign} />
      </div>

      {/* ----- Form tạo chính sách mới ----- */}
      <Card>
        <CardHeader>
          <CardTitle>Thiết lập chính sách giá mới</CardTitle>
          <CardDescription>Định giá cho bộ dữ liệu của bạn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataset">Chọn bộ dữ liệu</Label>
            <Select onValueChange={setSelectedPackage}>
              <SelectTrigger id="dataset">
                <SelectValue placeholder={loading ? "Đang tải..." : "Chọn dữ liệu"} />
              </SelectTrigger>
              <SelectContent>
                {packages.length > 0 ? (
                  packages.map((pkg) => (
                    <SelectItem key={pkg.princingPlanId} value={pkg.packageName}>
                      {pkg.packageName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    {loading ? "Đang tải..." : "Không có dữ liệu"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* ----- Các input giá và mô hình ----- */}
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
              <Label htmlFor="price-old">Giá cũ (VNĐ)</Label>
              <Input id="price-old" type="number" placeholder="35000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price-new">Giá mới (VNĐ)</Label>
              <Input id="price-new" type="number" placeholder="35000" />
            </div>
          </div>

          <Button className="w-full bg-gradient-primary hover:opacity-90">
            <Save className="h-4 w-4 mr-2" />
            Lưu chính sách
          </Button>

          {/* Hiển thị gói đã chọn */}
          {selectedPackage && (
            <p className="text-sm text-muted-foreground">
              Gói được chọn: <strong>{selectedPackage}</strong>
            </p>
          )}
        </CardContent>
      </Card>

      {/* ----- Bảng chính sách hiện tại ----- */}
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
                    <Badge variant={item.active ? "default" : "secondary"}>
                      {item.active ? "Kích hoạt" : "Tạm dừng"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Chỉnh sửa
                    </Button>
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
