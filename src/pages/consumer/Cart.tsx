import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Battery Performance Dataset Q4 2024",
      provider: "Tesla Fleet Services",
      category: "Battery Data",
      price: 2500,
      quantity: 1,
      format: "CSV, JSON",
    },
    {
      id: 2,
      name: "Charging Station Usage Patterns",
      provider: "ChargePoint Network",
      category: "Charging Data",
      price: 1800,
      quantity: 1,
      format: "JSON, API",
    },
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
    toast.success("Đã xóa khỏi giỏ hàng");
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% VAT
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Giỏ Hàng</h2>
        <p className="text-muted-foreground">Quản lý các gói dữ liệu bạn muốn mua</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl font-medium mb-2">Giỏ hàng trống</p>
                <p className="text-muted-foreground mb-4">Hãy thêm dataset vào giỏ hàng</p>
                <Button onClick={() => navigate("/consumer/marketplace")}>
                  Khám phá Marketplace
                </Button>
              </CardContent>
            </Card>
          ) : (
            cartItems.map((item) => (
              <Card key={item.id} className="shadow-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="bg-gradient-primary p-4 rounded-xl shadow-elegant w-16 h-16 flex items-center justify-center flex-shrink-0">
                      <Package className="h-8 w-8 text-primary-foreground" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">by {item.provider}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{item.category}</Badge>
                        <Badge variant="outline">{item.format}</Badge>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold">${item.price * item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
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
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT (10%)</span>
                  <span className="font-medium">${tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-success">${total.toLocaleString()}</span>
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
                onClick={() => navigate("/consumer/marketplace")}
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
