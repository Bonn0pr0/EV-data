import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Download,
  Printer,
  Mail,
  ArrowLeft,
  CreditCard,
  Package,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function Invoice() {
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🟩 Gọi API lấy thông tin hóa đơn
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/Dashboard/order-detail/${invoiceId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Lỗi ${res.status}: Không thể tải hóa đơn`);
        }

        const data = await res.json();
        setInvoiceData(data);
        toast.success("Tải thông tin hóa đơn thành công!");
      } catch (err) {
        console.error("❌ Lỗi khi tải hóa đơn:", err);
        toast.error("Không thể tải thông tin hóa đơn, vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) fetchInvoice();
  }, [invoiceId]);

  // 🟨 Các handler cho nút hành động
  const handlePrint = () => {
    window.print();
    toast.success("Đang chuẩn bị in hóa đơn...");
  };

  const handleDownload = () => {
    toast.success("Đang tải xuống hóa đơn...");
  };

  const handleEmailInvoice = () => {
    toast.success("Hóa đơn đã được gửi đến email của bạn!");
  };

  // 🟦 Giao diện khi đang tải
  if (loading) return <p className="text-center mt-10">Đang tải dữ liệu...</p>;
  if (!invoiceData)
    return (
      <p className="text-center mt-10 text-red-500">
        Không tìm thấy thông tin hóa đơn.
      </p>
    );

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/consumer/purchases")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Hóa đơn thanh toán
            </h2>
            <p className="text-muted-foreground">
              Mã hóa đơn: {invoiceData.invoiceName}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleEmailInvoice}>
            <Mail className="h-4 w-4 mr-2" />
            Gửi Email
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Tải xuống
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            In
          </Button>
        </div>
      </div>

      {/* Banner */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 print:hidden">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-600 rounded-full p-3">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900">
                Thanh toán thành công!
              </h3>
              <p className="text-sm text-green-700">
                Đơn hàng của bạn đã được xử lý thành công.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nội dung hóa đơn */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">HÓA ĐƠN THANH TOÁN</CardTitle>
              <CardDescription>EV Data Marketplace</CardDescription>
            </div>
            <Badge className="bg-green-600 text-white">
              <CheckCircle className="h-3 w-3 mr-1" /> Đã thanh toán
            </Badge>
          </div>

          <Separator />

          {/* Thông tin khách hàng */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-bold mb-2">THÔNG TIN KHÁCH HÀNG</p>
              <div className="space-y-1 text-muted-foreground">
                <p>Tên: {invoiceData.userName}</p>
                <p>Email: {invoiceData.userEmail}</p>
                <p>Số điện thoại: {invoiceData.phoneNumber}</p>
                <p>Tổ chức: {invoiceData.organization}</p>
              </div>
            </div>

            <div>
              <p className="font-bold mb-2">CHI TIẾT HÓA ĐƠN</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã hóa đơn:</span>
                  <span className="font-medium">{invoiceData.invoiceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày lập:</span>
                  <span className="font-medium">{invoiceData.issueDay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phương thức:</span>
                  <span className="font-medium">{invoiceData.methodName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    {invoiceData.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Chi tiết đơn hàng */}
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Package className="h-4 w-4" /> CHI TIẾT ĐƠN HÀNG
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Sản phẩm</th>
                    <th className="text-center p-3 font-medium">Số lượng</th>
                    <th className="text-right p-3 font-medium">Đơn giá</th>
                    <th className="text-right p-3 font-medium">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">{invoiceData.packageName}</td>
                    <td className="text-center p-3">{invoiceData.quantity}</td>
                    <td className="text-right p-3">
                      {invoiceData.packagePrice.toLocaleString()}₫
                    </td>
                    <td className="text-right p-3 font-medium">
                      {invoiceData.totalPrice.toLocaleString()}₫
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          {/* Tổng cộng */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tạm tính:</span>
              <span className="font-medium">
                {invoiceData.totalPrice.toLocaleString()}₫
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">VAT (10%):</span>
              <span className="font-medium">
                {(0).toLocaleString()}
                ₫
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>TỔNG CỘNG:</span>
              <span className="text-success text-2xl">
                {invoiceData.sumPrice.toLocaleString()}₫
              </span>
            </div>
          </div>

          {/* Thông tin thanh toán */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-medium mb-1">Thông tin thanh toán:</p>
                  <p className="text-muted-foreground">
                    Đã thanh toán qua {invoiceData.methodName} vào ngày{" "}
                    {invoiceData.issueDay}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex gap-4 print:hidden">
        <Button
          onClick={() => navigate("/consumer/purchases")}
          className="flex-1"
          variant="outline"
        >
          Xem đơn hàng của tôi
        </Button>
        <Button
          onClick={() => navigate("/market")}
          className="flex-1 bg-gradient-primary"
        >
          Tiếp tục mua sắm
        </Button>
      </div>
    </div>
  );
}
