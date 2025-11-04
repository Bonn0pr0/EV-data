import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Building2, CheckCircle, ArrowLeft, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function PaymentVNPay() {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentType, setPaymentType] = useState("atm");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const orderInfo = location.state || {
    total: 4730,
    items: []
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentType === "atm" && (!cardNumber || !cardName)) {
      toast.error("Vui lòng nhập đầy đủ thông tin thẻ!");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Thanh toán thành công!");
      navigate("/consumer/invoice", { 
        state: { 
          orderId: `VNP${Date.now()}`,
          method: "VNPay",
          ...orderInfo 
        } 
      });
    }, 2000);
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
          <h2 className="text-3xl font-bold text-foreground">Thanh toán VNPay</h2>
          <p className="text-muted-foreground">Thanh toán qua cổng VNPay</p>
        </div>
      </div>

      <form onSubmit={handlePayment}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card border-border/50">
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
                  <div className="flex items-center space-x-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="atm" id="atm" />
                    <Label htmlFor="atm" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Thẻ ATM nội địa</p>
                        <p className="text-sm text-muted-foreground">Thẻ ngân hàng Việt Nam</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="international" id="international" />
                    <Label htmlFor="international" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Thẻ quốc tế</p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard, JCB</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="qr" id="qr" />
                    <Label htmlFor="qr" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Quét mã QR</p>
                        <p className="text-sm text-muted-foreground">Ứng dụng ngân hàng hỗ trợ VNPay-QR</p>
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
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Tên chủ thẻ</Label>
                      <Input
                        id="cardName"
                        placeholder="NGUYEN VAN A"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Ngày hết hạn</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">Mã OTP</Label>
                        <Input id="cvv" placeholder="123456" maxLength={6} required />
                      </div>
                    </div>
                  </div>
                )}

                {paymentType === "qr" && (
                  <div className="pt-4 text-center space-y-4">
                    <div className="bg-muted/50 rounded-lg p-8">
                      <p className="text-sm text-muted-foreground mb-4">
                        Bạn sẽ được chuyển đến trang quét mã QR của VNPay
                      </p>
                      <div className="w-48 h-48 mx-auto bg-white border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                        <p className="text-xs text-muted-foreground">QR Code sẽ hiển thị sau khi xác nhận</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 rounded-full p-2">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium mb-1 text-blue-900 dark:text-blue-100">An toàn & Bảo mật:</p>
                    <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-xs">
                      <li>• VNPay được cấp phép bởi Ngân hàng Nhà nước Việt Nam</li>
                      <li>• Giao dịch được mã hóa SSL 256-bit</li>
                      <li>• Không lưu trữ thông tin thẻ của khách hàng</li>
                      <li>• Xác thực OTP để đảm bảo an toàn giao dịch</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isProcessing}
              style={{ backgroundColor: "#1F75CB" }}
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
                    <span>Thanh toán an toàn qua VNPay</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3" />
                    <span>Hỗ trợ đa dạng ngân hàng</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
