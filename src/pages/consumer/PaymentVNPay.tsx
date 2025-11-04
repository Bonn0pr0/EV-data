import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Building2, CheckCircle, ArrowLeft, Shield, Clock } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import QRCode from "react-qr-code";

export default function PaymentVNPay() {
  const [paymentType, setPaymentType] = useState("atm");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
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

  const handlePayment = () => {
    if (paymentType === "qr") {
      setShowQR(true);
      return;
    }
    
    if (paymentType === "atm" && (!cardNumber || !cardName)) {
      alert("Vui lòng nhập đầy đủ thông tin thẻ!");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      alert("Thanh toán thành công!");
    }, 2000);
  };

  const handleConfirmQRPayment = () => {
    setIsProcessing(true);
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

  // Tạo VNPay QR Code data
  const vnpayQRData = JSON.stringify({
    version: "2.1.0",
    provider: "VNPay",
    merchant: "MERCHANT_ID_DEMO",
    amount: orderInfo.total,
    currency: "VND",
    orderId: `VNP${Date.now()}`,
    orderInfo: `Thanh toán đơn hàng ${Date.now()}`,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
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
            <h2 className="text-3xl font-bold text-gray-900">Thanh toán VNPay</h2>
            <p className="text-gray-600">Thanh toán qua cổng VNPay</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-blue-600 rounded p-1">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  Phương thức thanh toán VNPay
                </CardTitle>
                <CardDescription>Chọn loại thẻ và nhập thông tin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentType} onValueChange={setPaymentType}>
                  <div className="flex items-center space-x-3 rounded-lg border-2 border-gray-200 p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                    <RadioGroupItem value="atm" id="atm" />
                    <Label htmlFor="atm" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Thẻ ATM nội địa</p>
                        <p className="text-sm text-gray-500">Thẻ ngân hàng Việt Nam</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 rounded-lg border-2 border-gray-200 p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                    <RadioGroupItem value="international" id="international" />
                    <Label htmlFor="international" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Thẻ quốc tế</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard, JCB</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 rounded-lg border-2 border-gray-200 p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                    <RadioGroupItem value="qr" id="qr" />
                    <Label htmlFor="qr" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Quét mã QR</p>
                        <p className="text-sm text-gray-500">Ứng dụng ngân hàng hỗ trợ VNPay-QR</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {(paymentType === "atm" || paymentType === "international") && (
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Số thẻ</Label>
                      <Input
                        id="cardNumber"
                        placeholder="9704 1234 5678 9012"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Tên chủ thẻ</Label>
                      <Input
                        id="cardName"
                        placeholder="NGUYEN VAN A"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        className="text-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Ngày hết hạn</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">Mã OTP</Label>
                        <Input id="cvv" placeholder="123456" maxLength={6} />
                      </div>
                    </div>
                  </div>
                )}

                {paymentType === "qr" && !showQR && (
                  <div className="pt-4 text-center space-y-4">
                    <div className="bg-gray-50 rounded-lg p-8">
                      <p className="text-sm text-gray-600 mb-4">
                        Nhấn nút bên dưới để tạo mã QR thanh toán
                      </p>
                      <div className="w-48 h-48 mx-auto bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <p className="text-xs text-gray-500 px-4 text-center">QR Code sẽ hiển thị sau khi nhấn "Tạo mã QR"</p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentType === "qr" && showQR && (
                  <div className="pt-4 space-y-4">
                    <Separator />
                    
                    <div className="flex flex-col items-center space-y-4 p-6 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          Mã QR hết hạn sau: <span className="font-bold text-gray-900">{formatTime(countdown)}</span>
                        </span>
                      </div>

                      {/* QR Code */}
                      <div className="p-4 bg-white border-4 border-blue-200 rounded-lg shadow-md">
                        <QRCode 
                          value={vnpayQRData}
                          size={256}
                          level="H"
                        />
                      </div>

                      <div className="text-center space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                          Mã đơn hàng: <span className="font-bold">VNP{Date.now()}</span>
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          Số tiền: {orderInfo.total.toLocaleString()} VNĐ
                        </p>
                      </div>

                      <div className="space-y-2 text-center w-full">
                        <p className="text-sm font-medium text-gray-900">Hướng dẫn thanh toán:</p>
                        <ol className="text-xs text-gray-600 space-y-1 text-left bg-white p-4 rounded-lg">
                          <li>1. Mở ứng dụng ngân hàng hỗ trợ VNPay-QR</li>
                          <li>2. Chọn chức năng "Quét mã QR" hoặc "VNPay-QR"</li>
                          <li>3. Quét mã QR phía trên</li>
                          <li>4. Kiểm tra thông tin và xác nhận thanh toán</li>
                          <li>5. Nhập OTP và hoàn tất giao dịch</li>
                          <li>6. Nhấn "Xác nhận thanh toán" bên dưới sau khi hoàn tất</li>
                        </ol>
                      </div>

                      <Button
                        onClick={handleConfirmQRPayment}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 rounded-full p-2">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium mb-1 text-blue-900">An toàn & Bảo mật:</p>
                    <ul className="text-blue-700 space-y-1 text-xs">
                      <li>• VNPay được cấp phép bởi Ngân hàng Nhà nước Việt Nam</li>
                      <li>• Giao dịch được mã hóa SSL 256-bit</li>
                      <li>• Không lưu trữ thông tin thẻ của khách hàng</li>
                      <li>• Xác thực OTP để đảm bảo an toàn giao dịch</li>
                      <li>• Mã QR có hiệu lực trong 5 phút</li>
                      <li>• QR code này chỉ dùng để demo, không thực hiện giao dịch thật</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {paymentType !== "qr" && (
              <Button
                onClick={handlePayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Tiếp tục thanh toán
                  </>
                )}
              </Button>
            )}

            {paymentType === "qr" && !showQR && (
              <Button
                onClick={handlePayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Tạo mã QR
              </Button>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-6">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
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
                  <span className="text-blue-600">{orderInfo.total.toLocaleString()} VNĐ</span>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Thanh toán an toàn qua VNPay</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Hỗ trợ đa dạng ngân hàng</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Giao dịch được mã hóa bảo mật</span>
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