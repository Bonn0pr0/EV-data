import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { QrCode, CheckCircle, Clock, Wallet, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export default function PaymentMomo() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes

  const orderInfo = location.state || {
    total: 4730,
    items: []
  };

  useEffect(() => {
    if (showQR && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showQR, countdown]);

  const handleGenerateQR = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Vui lòng nhập số điện thoại hợp lệ!");
      return;
    }
    setShowQR(true);
    toast.success("Mã QR đã được tạo!");
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Thanh toán thành công!");
      navigate("/consumer/invoice", { 
        state: { 
          orderId: `MO${Date.now()}`,
          method: "MoMo",
          ...orderInfo 
        } 
      });
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Thanh toán MoMo</h2>
          <p className="text-muted-foreground">Quét mã QR để thanh toán</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-pink-600" />
                Thông tin thanh toán MoMo
              </CardTitle>
              <CardDescription>Nhập số điện thoại MoMo của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại MoMo</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0901234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={10}
                  disabled={showQR}
                />
              </div>

              {!showQR && (
                <Button
                  onClick={handleGenerateQR}
                  className="w-full"
                  style={{ backgroundColor: "#D82D8B" }}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Tạo mã QR
                </Button>
              )}

              {showQR && (
                <div className="space-y-4">
                  <Separator />
                  
                  <div className="flex flex-col items-center space-y-4 p-6 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        Mã QR hết hạn sau: <span className="font-bold text-foreground">{formatTime(countdown)}</span>
                      </span>
                    </div>

                    {/* QR Code Placeholder */}
                    <div className="w-64 h-64 bg-white border-4 border-border rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <QrCode className="h-32 w-32 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Mã QR MoMo</p>
                        <p className="text-xs text-muted-foreground">
                          Số tiền: <span className="font-bold">${orderInfo.total.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-center">
                      <p className="text-sm font-medium">Hướng dẫn thanh toán:</p>
                      <ol className="text-xs text-muted-foreground space-y-1 text-left">
                        <li>1. Mở ứng dụng MoMo trên điện thoại</li>
                        <li>2. Chọn "Quét mã QR"</li>
                        <li>3. Quét mã QR phía trên</li>
                        <li>4. Xác nhận thanh toán trên ứng dụng MoMo</li>
                        <li>5. Nhấn "Xác nhận thanh toán" bên dưới sau khi hoàn tất</li>
                      </ol>
                    </div>

                    <Button
                      onClick={handleConfirmPayment}
                      className="w-full"
                      disabled={isProcessing}
                      style={{ backgroundColor: "#D82D8B" }}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Đang xác nhận...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Xác nhận thanh toán
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-pink-600 rounded-full p-2">
                  <Wallet className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium mb-1">Lưu ý khi thanh toán qua MoMo:</p>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li>• Mã QR có hiệu lực trong 5 phút</li>
                    <li>• Vui lòng không thoát khỏi trang này cho đến khi hoàn tất thanh toán</li>
                    <li>• Kiểm tra kỹ số tiền trước khi xác nhận trên ứng dụng MoMo</li>
                    <li>• Nếu gặp lỗi, vui lòng thử tạo lại mã QR</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="shadow-card sticky top-6">
            <CardHeader>
              <CardTitle>Đơn hàng của bạn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderInfo.items?.length > 0 ? (
                <div className="space-y-3">
                  {orderInfo.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground">x{item.quantity}</p>
                      </div>
                      <span className="font-medium">${item.price}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Không có sản phẩm</p>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-success">${orderInfo.total.toLocaleString()}</span>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3" />
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3" />
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
