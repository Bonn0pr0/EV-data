import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Save, TrendingUp, Package } from "lucide-react";
import { StatCard } from "@/components/Statcard";

export default function Pricing() {
  const [pricingReport, setPricingReport] = useState<any>(null);
  const [pricingList, setPricingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const reportRes = await axios.get(
          `/api/PricingPlan/ReportPricingStaff/${userId}`
        );
        setPricingReport(reportRes.data);

        const listRes = await axios.get(
          `/api/PricingPlan/ListPricing/${userId}`
        );
        setPricingList(listRes.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        alert("Không thể tải dữ liệu, vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

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
          value={
            pricingReport
              ? `${pricingReport.avenragePricing.toLocaleString()}`
              : "..."
          }
          icon={DollarSign}
          change="Cập nhật tự động"
          changeType="positive"
        />
        <StatCard
          title="Số gói dữ liệu"
          value={pricingReport ? pricingReport.packageCount : "..."}
          icon={Package}
        />
        <StatCard
          title="Chính sách giá"
          value={pricingReport ? pricingReport.pricingPlan : "..."}
          icon={TrendingUp}
        />
      </div>


      {/* ----- Bảng chính sách hiện tại ----- */}
      <Card>
        <CardHeader>
          <CardTitle>Chính sách giá hiện tại</CardTitle>
          <CardDescription>
            Quản lý các chính sách giá đã thiết lập
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên gói</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricingList.length > 0 ? (
                pricingList.map((item) => (
                  <TableRow key={item.pricingId}>
                    <TableCell className="font-medium">
                      {item.packageName}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="font-semibold text-success">
                      {item.price.toLocaleString()}₫
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "Pending" ? "secondary" : "default"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    {loading ? "Đang tải dữ liệu..." : "Không có dữ liệu"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
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
                <SelectValue
                  placeholder={loading ? "Đang tải..." : "Chọn dữ liệu"}
                />
              </SelectTrigger>
              <SelectContent>
                {pricingList.length > 0 ? (
                  pricingList.map((pkg) => (
                    <SelectItem key={pkg.pricingId} value={pkg.packageName}>
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
                  <SelectItem value="download">
                    Theo lượt tải (Per Download)
                  </SelectItem>
                  <SelectItem value="volume">
                    Theo dung lượng (Per GB)
                  </SelectItem>
                  <SelectItem value="subscription">
                    Thuê bao (Subscription)
                  </SelectItem>
                  <SelectItem value="api">API Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price-new">Giá (VNĐ)</Label>
              <Input id="price-new" type="number" placeholder="35000" />
            </div>
          </div>

          <Button className="w-full bg-gradient-primary hover:opacity-90">
            <Save className="h-4 w-4 mr-2" />
            Lưu chính sách
          </Button>

          {/* Hiển thị gói được chọn */}
          {selectedPackage && (
            <p className="text-sm text-muted-foreground">
              Gói được chọn: <strong>{selectedPackage}</strong>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
