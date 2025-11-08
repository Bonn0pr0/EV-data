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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Save, TrendingUp, Package, Edit } from "lucide-react";
import { StatCard } from "@/components/Statcard";

export default function Pricing() {
  const [pricingReport, setPricingReport] = useState<any>(null);
  const [pricingList, setPricingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [newPrice, setNewPrice] = useState<string>("");

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

  // Khi click "Chỉnh sửa"
  const handleEdit = (item: any) => {
    setSelectedPackage(item);
    setNewPrice(item.price); // giá mặc định
  };

  // Lưu giá mới
  const handleSave = async () => {
    if (!selectedPackage) {
      alert("Vui lòng chọn gói dữ liệu để cập nhật!");
      return;
    }

    if (!newPrice || Number(newPrice) <= 0) {
      alert("Giá mới không hợp lệ!");
      return;
    }

    try {
      // Gọi API đúng định dạng body
      await axios.put(`/api/PricingPlan`, {
        pricingPlanId: selectedPackage.pricingId,
        newPrice: Number(newPrice),
      });

      alert("Cập nhật giá thành công!");
      setSelectedPackage(null);
      setNewPrice("");

      // Cập nhật lại danh sách
      const listRes = await axios.get(`/api/PricingPlan/ListPricing/${userId}`);
      setPricingList(listRes.data);
    } catch (error) {
      console.error("Lỗi khi cập nhật giá:", error);
      alert("Không thể cập nhật giá, vui lòng thử lại!");
    }
  };

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
            pricingReport?.avenragePricing
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
                <TableHead>Hành động</TableHead>
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
                      {item.price?.toLocaleString() ?? 0}₫
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
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Chỉnh sửa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    {loading ? "Đang tải dữ liệu..." : "Không có dữ liệu"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ----- Form chỉnh sửa hoặc tạo chính sách ----- */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedPackage
              ? "Cập nhật giá cho gói dữ liệu"
              : "Thiết lập chính sách giá mới"}
          </CardTitle>
          <CardDescription>
            {selectedPackage
              ? "Điều chỉnh giá của gói hiện tại"
              : "Định giá cho bộ dữ liệu của bạn"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {selectedPackage ? (
            <>
              {/* --- 2 ô đầu nằm cùng hàng --- */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tên gói</Label>
                  <Input value={selectedPackage.packageName} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Mô tả</Label>
                  <Input value={selectedPackage.description} disabled />
                </div>
              </div>

              {/* --- Giá hiện tại --- */}
              <div className="space-y-2">
                <Label>Giá hiện tại (VNĐ)</Label>
                <Input value={selectedPackage.price.toLocaleString()} disabled />
              </div>

              {/* --- Giá mới --- */}
              <div className="space-y-2">
                <Label>Giá mới (VNĐ)</Label>
                <Input
                  type="number"
                  placeholder="Nhập giá mới..."
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                <Save className="h-4 w-4 mr-2" />
                Lưu thay đổi
              </Button>
            </>
          ) : (
            <p className="text-muted-foreground">
              Chọn “Chỉnh sửa” ở bảng trên để cập nhật giá cho một gói cụ thể.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
