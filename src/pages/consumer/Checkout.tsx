import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wallet, Lock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!user?.userId) return;

    const fetchData = async () => {
      try {
        const [cartRes, userRes] = await Promise.all([
          fetch(`/api/Cart?userId=${user.userId}`),
          fetch(`/api/Users/${user.userId}`)
        ]);

        if (!cartRes.ok) throw new Error("Không thể tải giỏ hàng");
        if (!userRes.ok) throw new Error("Không thể tải thông tin người dùng");

        const cartData = await cartRes.json();
        const userInfo = await userRes.json();

        setCartItems(cartData);
        setUserData(userInfo);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải dữ liệu từ server!");
      }
    };

    fetchData();
  }, [user]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalAmout, 0);
  const vat = 0;
  const total = subtotal + vat;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!cartItems.length) {
      toast.warning("Giỏ hàng trống!");
      return;
    }

    setIsProcessing(true);

    // Giả lập xử lý thanh toán
    setTimeout(() => {
      setIsProcessing(false);

      // 👉 Điều hướng tùy phương thức thanh toán
       if (paymentMethod === "vnpay") {
        navigate("/consumer/payment-vnpay", { state: { total, items: cartItems } });
      } else {
        toast.success("Thanh toán thành công!");
        navigate("/consumer/my-purchases");
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Thanh Toán</h2>
        <p className="text-muted-foreground">Hoàn tất đơn hàng của bạn</p>
      </div>

      <form onSubmit={handlePayment}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thông tin thanh toán */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Thông tin thanh toán</CardTitle>
                <CardDescription>Thông tin người dùng</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Họ và tên</Label>
                    <Input value={userData?.fullName || ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={userData?.email || ""} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input value={userData?.phone || ""} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Tổ chức / Công ty</Label>
                  <Input value={userData?.organizationId || ""} readOnly />
                </div>
              </CardContent>
            </Card>

            {/* Phương thức thanh toán */}
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
                <CardDescription>Chọn cách thanh toán</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  

                  <div className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="vnpay" id="vnpay" />
                    <Label htmlFor="vnpay" className="flex items-center gap-3 flex-1 cursor-pointer">
                      <Wallet className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">VNPay</p>
                        <p className="text-sm text-muted-foreground">Cổng thanh toán VNPay</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Thanh toán được mã hóa và bảo mật</span>
            </div>
          </div>

          {/* Đơn hàng */}
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
                        <p className="font-medium">{item.packageName}</p>
                        <p className="text-muted-foreground">x{item.quantity}</p>
                      </div>
                      <span className="font-medium">
                        {item.totalAmout.toLocaleString()}₫
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span className="font-medium">{subtotal.toLocaleString('vi-VN')} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VAT (0%)</span>
                    <span className="font-medium">{vat} VND</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-success">{total.toLocaleString('vi-VN')} VND</span>
                  </div>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
