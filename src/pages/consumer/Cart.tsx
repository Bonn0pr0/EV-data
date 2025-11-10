import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CartItem {
  cartId: number;
  planId: number;
  quantity: number;
  packageName: string;
  providerName: string;
  type: string;
  fileFormat: string;
  totalAmout: number; // tổng tiền của item hiện tại
  totalPrice: number; // tổng tiền gốc (để tính lại khi thay đổi số lượng)
}

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      toast.error("Không tìm thấy user session");
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await fetch(`/api/Cart?userId=${userId}`);
        if (!res.ok) throw new Error("Lỗi khi tải dữ liệu giỏ hàng");
        const data = await res.json();
        setCartItems(data);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải giỏ hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  // 🔹 Cập nhật số lượng và tính lại totalAmout chính xác
  const updateQuantity = (cartId: number, change: number) => {
  setCartItems(items =>
    items.map(item => {
      if (item.cartId === cartId) {
        const newQuantity = Math.max(1, item.quantity + change); // số lượng tối thiểu là 1
        const unitPrice = item.totalAmout / item.quantity; // giá 1 sản phẩm
        return {
          ...item,
          quantity: newQuantity,
          totalAmout: unitPrice * newQuantity, // tính lại tổng tiền
        };
      }
      return item;
    })
  );
};


  const removeItem = (cartId: number) => {
    setCartItems(items => items.filter(item => item.cartId !== cartId));
    toast.success("Đã xóa khỏi giỏ hàng");
  };

  if (loading) {
    return <p className="text-center py-10">Đang tải giỏ hàng...</p>;
  }

  if (cartItems.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl font-medium mb-2">Giỏ hàng trống</p>
          <p className="text-muted-foreground mb-4">Hãy thêm dataset vào giỏ hàng</p>
          <Button onClick={() => navigate("/consumer/marketplace")}>Khám phá Marketplace</Button>
        </CardContent>
      </Card>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalAmout, 0);
  const vat = 0; 
  const total = subtotal + vat;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Giỏ Hàng</h2>
        <p className="text-muted-foreground">Quản lý các gói dữ liệu bạn muốn mua</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.cartId} className="shadow-card border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="bg-gradient-primary p-4 rounded-xl shadow-elegant w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <Package className="h-8 w-8 text-primary-foreground" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.packageName}</h3>
                      <p className="text-sm text-muted-foreground">by {item.providerName}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{item.type}</Badge>
                      <Badge variant="outline">{item.fileFormat}</Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.cartId, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.cartId, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xl font-bold">{item.totalAmout.toLocaleString('vi-VN')} VND</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.cartId)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="shadow-card sticky top-6">
            <CardHeader>
              <CardTitle>Tổng Đơn Hàng</CardTitle>
              <CardDescription>Chi tiết thanh toán</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                className="w-full bg-gradient-primary"
                size="lg"
                disabled={cartItems.length === 0}
                onClick={() => navigate("/consumer/checkout")}
              >
                Tiến hành thanh toán
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/market")}
              >
                Tiếp tục mua sắm
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
