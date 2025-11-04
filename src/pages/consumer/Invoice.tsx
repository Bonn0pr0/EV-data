import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, Printer, Mail, ArrowLeft, Calendar, CreditCard, Package } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export default function Invoice() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const invoiceData = location.state || {
    orderId: `INV${Date.now()}`,
    method: "Credit Card",
    total: 4730,
    items: [],
    date: new Date().toLocaleDateString('vi-VN')
  };

  useEffect(() => {
    // Show success message when first loaded
    if (location.state) {
      toast.success("Đơn hàng đã được thanh toán thành công!");
    }
  }, [location.state]);

  const handlePrint = () => {
    window.print();
    toast.success("Đang chuẩn bị in hóa đơn...");
  };

  const handleDownload = () => {
    toast.success("Đang tải xuống hóa đơn...");
    // In real app, this would generate a PDF
  };

  const handleEmailInvoice = () => {
    toast.success("Hóa đơn đã được gửi đến email của bạn!");
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header - Hidden when printing */}
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
            <h2 className="text-3xl font-bold text-foreground">Hóa đơn thanh toán</h2>
            <p className="text-muted-foreground">Mã đơn hàng: {invoiceData.orderId}</p>
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

      {/* Success Banner - Hidden when printing */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-900 print:hidden">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-600 rounded-full p-3">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900 dark:text-green-100">Thanh toán thành công!</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Đơn hàng của bạn đã được xử lý. Bạn có thể tải dữ liệu ngay bây giờ.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Content */}
      <Card className="shadow-card print:shadow-none">
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">HÓA ĐƠN THANH TOÁN</CardTitle>
              <CardDescription>EV Data Marketplace</CardDescription>
            </div>
            <Badge className="bg-green-600 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              Đã thanh toán
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-bold mb-2">THÔNG TIN KHÁCH HÀNG</p>
              <div className="space-y-1 text-muted-foreground">
                <p>Công ty: EV Solutions Ltd.</p>
                <p>Địa chỉ: 123 Đường ABC, Quận 1</p>
                <p>TP. Hồ Chí Minh, Việt Nam</p>
                <p>Email: customer@example.com</p>
                <p>Điện thoại: +84 901 234 567</p>
              </div>
            </div>

            <div>
              <p className="font-bold mb-2">CHI TIẾT HÓA ĐƠN</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã hóa đơn:</span>
                  <span className="font-medium">{invoiceData.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày:</span>
                  <span className="font-medium">{invoiceData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phương thức:</span>
                  <span className="font-medium">{invoiceData.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Thành công
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Items Table */}
          <div>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Package className="h-4 w-4" />
              CHI TIẾT ĐƠN HÀNG
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
                  {invoiceData.items?.length > 0 ? (
                    invoiceData.items.map((item: any, index: number) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Dataset ID: {item.id}</p>
                        </td>
                        <td className="text-center p-3">{item.quantity}</td>
                        <td className="text-right p-3">${item.price}</td>
                        <td className="text-right p-3 font-medium">
                          ${(item.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t">
                      <td className="p-3">
                        <p className="font-medium">Battery Performance Dataset Q4 2024</p>
                        <p className="text-xs text-muted-foreground">Dataset ID: DS-001</p>
                      </td>
                      <td className="text-center p-3">1</td>
                      <td className="text-right p-3">$2,500</td>
                      <td className="text-right p-3 font-medium">$2,500</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tạm tính:</span>
              <span className="font-medium">
                ${invoiceData.items?.length > 0 
                  ? invoiceData.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0).toLocaleString()
                  : '4,300'
                }
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">VAT (10%):</span>
              <span className="font-medium">
                ${invoiceData.items?.length > 0
                  ? (invoiceData.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0) * 0.1).toLocaleString()
                  : '430'
                }
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>TỔNG CỘNG:</span>
              <span className="text-success text-2xl">${invoiceData.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Info */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-medium mb-1">Thông tin thanh toán:</p>
                  <p className="text-muted-foreground">
                    Đã thanh toán qua {invoiceData.method} vào ngày {invoiceData.date}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="text-center text-xs text-muted-foreground pt-4 border-t print:border-t-2">
            <p className="mb-1">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            <p>Mọi thắc mắc vui lòng liên hệ: support@evdatamarket.com | Hotline: 1900-xxxx</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons - Hidden when printing */}
      <div className="flex gap-4 print:hidden">
        <Button
          onClick={() => navigate("/consumer/purchases")}
          className="flex-1"
          variant="outline"
        >
          Xem đơn hàng của tôi
        </Button>
        <Button
          onClick={() => navigate("/consumer/marketplace")}
          className="flex-1 bg-gradient-primary"
        >
          Tiếp tục mua sắm
        </Button>
      </div>
    </div>
  );
}
