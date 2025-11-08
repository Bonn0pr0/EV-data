import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Building2,
  CheckCircle,
  ArrowLeft,
  Shield,
  Clock,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import QRCode from "react-qr-code";

export default function PaymentVNPay() {
  const [paymentType, setPaymentType] = useState("atm");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartIds, setCartIds] = useState<number[]>([]);

  const userId = sessionStorage.getItem("userId");


  useEffect(() => {
    if (!userId) return;

    axios
      .get(`/api/Cart?userId=${userId}`)
      .then((response) => {
        const data = response.data || [];
        setCartItems(data);

        // Tính tổng tiền và danh sách cartId
        const total = data.reduce(
          (sum: number, item: any) => sum + item.totalAmout,
          0
        );
        const ids = data.map((item: any) => item.cartId);

        setTotalAmount(total);
        setCartIds(ids);
      })
      .catch((error) => {
        console.error("Lỗi khi tải giỏ hàng:", error);
        alert("Không thể tải giỏ hàng. Vui lòng thử lại!");
      });
  }, [userId]);

  // 🕒 Đếm ngược thời gian QR
  useEffect(() => {
    if (showQR && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showQR, countdown]);

  // 🟠 Gửi yêu cầu tạo giao dịch
  const createTransaction = async (method: string) => {
    if (!userId || cartIds.length === 0) {
      alert("Không tìm thấy giỏ hàng hoặc người dùng.");
      return;
    }

    const payload = {
      userId: Number(userId),
      cartIds: cartIds,
      amount: totalAmount,
      paymentMethod: method,
      orderInfo: `Thanh toán đơn hàng ngày ${new Date().toLocaleString("vi-VN")}`,
    };

    console.log("📤 Dữ liệu gửi đi:", payload);

    try {
      const response = await axios.post(`/api/Transaction/create`, payload);
      console.log("✅ Phản hồi từ server:", response.data);
      alert("Thanh toán thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi tạo giao dịch:", error);
      alert("Thanh toán thất bại. Vui lòng thử lại!");
    }
  };

  // Xử lý thanh toán
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
    setTimeout(async () => {
      await createTransaction(paymentType);
      setIsProcessing(false);
    }, 2000);
  };

  // Xác nhận thanh toán QR
  const handleConfirmQRPayment = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      await createTransaction("vnpay-qr");
      setIsProcessing(false);
      alert("Thanh toán VNPay thành công!");
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 🔹 Tạo dữ liệu QR VNPay (demo)
  const vnpayQRData = JSON.stringify({
    version: "2.1.0",
    provider: "VNPay",
    merchant: "MERCHANT_ID_DEMO",
    amount: totalAmount,
    currency: "VND",
    orderId: `VNP${Date.now()}`,
    orderInfo: `Thanh toán đơn hàng ${Date.now()}`,
    timestamp: new Date().toISOString(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Tiêu đề */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Thanh toán VNPay
            </h2>
            <p className="text-gray-600">Thanh toán qua cổng VNPay</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-blue-600 rounded p-1">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  Phương thức thanh toán VNPay
                </CardTitle>
                <CardDescription>Chọn loại thẻ hoặc mã QR</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Loại thanh toán */}
                <RadioGroup value={paymentType} onValueChange={setPaymentType}>
                  <div className="flex items-center space-x-3 rounded-lg border-2 border-gray-200 p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                    <RadioGroupItem value="atm" id="atm" />
                    <Label htmlFor="atm" className="flex items-center gap-3 flex-1">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Thẻ ATM nội địa
                        </p>
                        <p className="text-sm text-gray-500">
                          Thẻ ngân hàng Việt Nam
                        </p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 rounded-lg border-2 border-gray-200 p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                    <RadioGroupItem value="international" id="international" />
                    <Label
                      htmlFor="international"
                      className="flex items-center gap-3 flex-1"
                    >
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Thẻ quốc tế
                        </p>
                        <p className="text-sm text-gray-500">
                          Visa, Mastercard, JCB
                        </p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 rounded-lg border-2 border-gray-200 p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                    <RadioGroupItem value="qr" id="qr" />
                    <Label htmlFor="qr" className="flex items-center gap-3 flex-1">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Quét mã QR</p>
                        <p className="text-sm text-gray-500">
                          Hỗ trợ VNPay-QR
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Nhập thẻ */}
                {(paymentType === "atm" || paymentType === "international") && (
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Số thẻ</Label>
                      <Input
                        id="cardNumber"
                        placeholder="9704 1234 5678 9012"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Tên chủ thẻ</Label>
                      <Input
                        id="cardName"
                        placeholder="NGUYEN VAN A"
                        value={cardName}
                        onChange={(e) =>
                          setCardName(e.target.value.toUpperCase())
                        }
                      />
                    </div>
                  </div>
                )}

                {/* QR hiển thị */}
                {paymentType === "qr" && showQR && (
                  <div className="pt-4 space-y-4">
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

                      <div className="p-4 bg-white border-4 border-blue-200 rounded-lg shadow-md">
                        <QRCode value={vnpayQRData} size={256} level="H" />
                      </div>

                      <p className="text-lg font-bold text-blue-600">
                        Số tiền: {totalAmount.toLocaleString()} VNĐ
                      </p>

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

            {/* Nút thanh toán */}
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

          {/* Cột phải - Giỏ hàng */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg sticky top-6">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
                <CardTitle>Đơn hàng của bạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {cartItems.length > 0 ? (
                  <div className="space-y-3">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.packageName}
                          </p>
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
                  <span className="text-blue-600">
                    {totalAmount.toLocaleString()} VNĐ
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
