import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { QrCode, CheckCircle, Clock, Wallet, ArrowLeft } from "lucide-react";
import QRCode from "react-qr-code";

export default function PaymentMomo() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes

  const orderInfo = {
    total: 4730,
    items: [
      { name: "Sản phẩm 1", quantity: 2, price: 2000 },
      { name: "Sản phẩm 2", quantity: 1, price: 2730 }
    ]
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
      alert("Vui lòng nhập số điện thoại hợp lệ!");
      return;
    }
    setShowQR(true);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      alert("Thanh toán thành công!");
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Tạo deep link MoMo
  const momoDeepLink = `momo://app?action=payWithApp&amount=${orderInfo.total}&phone=${phoneNumber}&description=${encodeURIComponent('Thanh toán đơn hàng #' + Date.now())}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Thanh toán MoMo</h2>
            <p className="text-gray-600">Quét mã QR để thanh toán</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
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
                    className="text-lg"
                  />
                </div>

                {!showQR && (
                  <Button
                    onClick={handleGenerateQR}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Tạo mã QR
                  </Button>
                )}

                {showQR && (
                  <div className="space-y-4">
                    <Separator />
                    
                    <div className="flex flex-col items-center space-y-4 p-6 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          Mã QR hết hạn sau: <span className="font-bold text-gray-900">{formatTime(countdown)}</span>
                        </span>
                      </div>

                      {/* QR Code */}
                      <div className="p-4 bg-white border-4 border-pink-200 rounded-lg shadow-md">
                        <QRCode 
                        value={momoDeepLink}
                        size={256}
                        level="H"
                        />
                      </div>

                      <div className="text-center space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                          Số điện thoại: <span className="font-bold">{phoneNumber}</span>
                        </p>
                        <p className="text-lg font-bold text-pink-600">
                          Số tiền: {orderInfo.total.toLocaleString()} VNĐ
                        </p>
                      </div>

                      <div className="space-y-2 text-center w-full">
                        <p className="text-sm font-medium text-gray-900">Hướng dẫn thanh toán:</p>
                        <ol className="text-xs text-gray-600 space-y-1 text-left bg-white p-4 rounded-lg">
                          <li>1. Mở ứng dụng MoMo trên điện thoại</li>
                          <li>2. Chọn "Quét mã QR"</li>
                          <li>3. Quét mã QR phía trên</li>
                          <li>4. Xác nhận thanh toán trên ứng dụng MoMo</li>
                          <li>5. Nhấn "Xác nhận thanh toán" bên dưới sau khi hoàn tất</li>
                        </ol>
                      </div>

                      <Button
                        onClick={handleConfirmPayment}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                        disabled={isProcessing}
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

            <Card className="bg-pink-50 border-pink-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-pink-600 rounded-full p-2">
                    <Wallet className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium mb-1 text-gray-900">Lưu ý khi thanh toán qua MoMo:</p>
                    <ul className="text-gray-600 space-y-1 text-xs">
                      <li>• Mã QR có hiệu lực trong 5 phút</li>
                      <li>• Vui lòng không thoát khỏi trang này cho đến khi hoàn tất thanh toán</li>
                      <li>• Kiểm tra kỹ số tiền trước khi xác nhận trên ứng dụng MoMo</li>
                      <li>• Nếu gặp lỗi, vui lòng thử tạo lại mã QR</li>
                      <li>• Đây là QR code demo, không thực hiện giao dịch thật</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-6">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle>Đơn hàng của bạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {orderInfo.items?.length > 0 ? (
                  <div className="space-y-3">
                    {orderInfo.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-gray-500">x{item.quantity}</p>
                        </div>
                        <span className="font-medium text-gray-900">{item.price.toLocaleString()} VNĐ</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Không có sản phẩm</p>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-pink-600">{orderInfo.total.toLocaleString()} VNĐ</span>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Thanh toán an toàn & bảo mật</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Hỗ trợ 24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}