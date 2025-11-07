import { useState, useEffect } from "react";
import axios from "axios";
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
  const [countdown, setCountdown] = useState(300);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

const userId = sessionStorage.getItem("userId");

  // 🔹 Gọi API lấy giỏ hàng
  useEffect(() => {
    axios
      .get(`/api/Cart?userId=${userId}`)
      .then((response) => {
        setCartItems(response.data);

        // Tính tổng tiền
        const total = response.data.reduce(
          (sum: number, item: any) => sum + item.totalAmout,
          0
        );
        setTotalAmount(total);
      })
      .catch((error) => {
        console.error("Lỗi khi tải giỏ hàng:", error);
        alert("Không thể tải giỏ hàng. Vui lòng thử lại!");
      });
  }, [userId]);

  // ⏱️ Countdown timer
  useEffect(() => {
    if (showQR && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
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
    setTimeout(() => {
      setIsProcessing(false);
      alert("Thanh toán thành công!");
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 🔗 Tạo deep link MoMo
  const momoDeepLink = `momo://app?action=payWithApp&amount=${totalAmount}&phone=${phoneNumber}&description=${encodeURIComponent(
    "Thanh toán đơn hàng #" + Date.now()
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
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
                          Mã QR hết hạn sau:{" "}
                          <span className="font-bold text-gray-900">
                            {formatTime(countdown)}
                          </span>
                        </span>
                      </div>

                      {/* QR Code */}
                      <div className="p-4 bg-white border-4 border-pink-200 rounded-lg shadow-md">
                        <QRCode value={momoDeepLink} size={256} level="H" />
                      </div>

                      <div className="text-center space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                          Số điện thoại: <span className="font-bold">{phoneNumber}</span>
                        </p>
                        <p className="text-lg font-bold text-pink-600">
                          Số tiền: {totalAmount.toLocaleString()} VNĐ
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
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-6">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle>Đơn hàng của bạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {cartItems.length > 0 ? (
                  <div className="space-y-3">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.packageName}</p>
                          <p className="text-gray-500">x{item.quantity}</p>
                        </div>
                        <span className="font-medium text-gray-900">
                          {item.totalAmout.toLocaleString()} VNĐ
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Không có sản phẩm</p>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-pink-600">{totalAmount.toLocaleString()} VNĐ</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
