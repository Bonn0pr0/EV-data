import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Building2, Wallet, Lock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Checkout() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItems = [
    { name: "Battery Performance Dataset Q4 2024", price: 2500, quantity: 1 },
    { name: "Charging Station Usage Patterns", price: 1800, quantity: 1 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Thanh toán thành công!");
      navigate("/consumer/my-purchases");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Thanh Toán</h2>
        <p className="text-muted-foreground">Hoàn tất đơn hàng của bạn</p>
      </div>

      <form onSubmit={handlePayment}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Billing Information */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Thông tin thanh toán</CardTitle>
                <CardDescription>Nhập thông tin của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Họ</Label>
                    <Input id="firstName" placeholder="Nguyễn" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Tên</Label>
                    <Input id="lastName" placeholder="Văn A" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Công ty (tùy chọn)</Label>
                  <Input id="company" placeholder="Tên công ty" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input id="address" placeholder="Số nhà, tên đường" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Thành phố</Label>
                    <Input id="city" placeholder="Hà Nội" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipcode">Mã bưu điện</Label>
                    <Input id="zipcode" placeholder="100000" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
                <CardDescription>Chọn cách thanh toán</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {/* <div className="flex items-center space-x-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Thẻ tín dụng / Ghi nợ</p>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard, JCB</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-accent">
                    <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                    <Label htmlFor="bank-transfer" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Building2 className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Chuyển khoản ngân hàng</p>
                        <p className="text-sm text-muted-foreground">Thanh toán qua ngân hàng</p>
                      </div>
                    </Label>
                  </div> */}

                  <div 
                    className="flex items-center space-x-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-accent"
                    onClick={() => navigate("/consumer/payment-momo", { state: { total, items: cartItems } })}
                  >
                    <RadioGroupItem value="momo" id="momo" />
                    <Label htmlFor="momo" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5 text-pink-600" />
                      <div>
                        <p className="font-medium">MoMo</p>
                        <p className="text-sm text-muted-foreground">Ví điện tử MoMo</p>
                      </div>
                    </Label>
                  </div>

                  <div 
                    className="flex items-center space-x-3 rounded-lg border border-border p-4 cursor-pointer hover:bg-accent"
                    onClick={() => navigate("/consumer/payment-vnpay", { state: { total, items: cartItems } })}
                  >
                    <RadioGroupItem value="vnpay" id="vnpay" />
                    <Label htmlFor="vnpay" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">VNPay</p>
                        <p className="text-sm text-muted-foreground">Cổng thanh toán VNPay</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "credit-card" && (
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Số thẻ</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Ngày hết hạn</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" maxLength={3} required />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Thanh toán được mã hóa và bảo mật</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-card sticky top-6">
              <CardHeader>
                <CardTitle>Đơn hàng của bạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground">x{item.quantity}</p>
                      </div>
                      <span className="font-medium">${item.price}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span className="font-medium">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VAT (10%)</span>
                    <span className="font-medium">${tax.toLocaleString()}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-success">${total.toLocaleString()}</span>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary"
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
                      Hoàn tất thanh toán
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Bằng cách hoàn tất đơn hàng, bạn đồng ý với{" "}
                  <a href="#" className="underline">Điều khoản dịch vụ</a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
