// src/pages/consumer/PaymentPage.tsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

/**
 * PaymentPage - React + TypeScript
 *
 * Backend endpoints:
 * POST /api/Transaction/create-payment
 * POST /api/Transaction/waiting-confirm
 * GET /api/Orders/{orderId}
 */

type CartItem = {
  cartId: number;
  packageName: string;
  quantity: number;
  totalAmout: number;
};

export default function PaymentPage(): JSX.Element {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [method, setMethod] = useState<"vnpay" | "bank">("vnpay");
  const [processing, setProcessing] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  const pollRef = useRef<number | null>(null);

  const { user: authUser } = useAuth();
  const userIdRaw =
    typeof window !== "undefined" ? sessionStorage.getItem("userId") : null;
  const userId = userIdRaw ? Number(userIdRaw) : null;

  const token =
    authUser?.token ||
    (typeof window !== "undefined" ? sessionStorage.getItem("token") : null);

  // Bank Info
  const BANK_INFO = {
    bankName: "TPBank",
    accountNumber: "06296707401",
    accountName: "Bùi Hoàng Phúc",
    noteExample: "Thanh toán đơn hàng #ORDER123",
  };

  // VietQR auto URL
  const qrUrl = `https://img.vietqr.io/image/TPB-${BANK_INFO.accountNumber}-compact.png?amount=${totalAmount}&addInfo=Thanh%20toan%20don%20hang%20${userId}`;

  // Load cart data
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setMessage("Bạn chưa đăng nhập");
      return;
    }

    setLoading(true);
    axios
      .get(`/api/Cart?userId=${userId}`)
      .then((res) => {
        const data: any[] = res.data || [];
        setCartItems(data);
        setCartIds(data.map((x) => x.cartId));
        setTotalAmount(data.reduce((s, x) => s + (x.totalAmout || 0), 0));
      })
      .catch((err) => {
        console.error("Load cart failed:", err);
        setServerError("Không thể tải giỏ hàng. Vui lòng thử lại.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // Poll order status (5s)
  useEffect(() => {
    if (!currentOrderId) return;

    const poll = async () => {
      try {
        const res = await axios.get(`/api/Orders/${currentOrderId}`);
        const status = res.data?.status;
        setOrderStatus(status);
        if (status === "PAID" || status === "FAILED") {
          if (pollRef.current) {
            window.clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      } catch (err) {
        console.error("Poll order failed:", err);
      }
    };

    poll();
    pollRef.current = window.setInterval(poll, 5000);

    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [currentOrderId]);

  // VNPay
  const handlePayVNPay = async () => {
    if (!userId || cartIds.length === 0) {
      alert("Bạn cần đăng nhập và có sản phẩm trong giỏ hàng.");
      return;
    }

    setProcessing(true);
    setServerError(null);

    const payload = {
      userId,
      cartIds,
      amount: totalAmount,
      paymentMethod: "vnpay",
      orderInfo: `Thanh toán đơn hàng - user ${userId} - ${new Date().toLocaleString()}`,
    };

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await axios.post(
        "/api/Transaction/create-payment",
        payload,
        { headers }
      );

      const paymentUrl = res.data?.paymentUrl;
      const orderId = res.data?.orderId || null;

      if (orderId) setCurrentOrderId(orderId);
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert("Server không trả về URL thanh toán.");
      }
    } catch (err: any) {
      alert("Lỗi tạo giao dịch: " + err?.response?.data?.message);
    } finally {
      setProcessing(false);
    }
  };

  // Manual Bank Transfer
  const handleUserMarkTransferred = async () => {
    if (!userId || cartIds.length === 0) {
      alert("Bạn cần đăng nhập và có sản phẩm trong giỏ hàng.");
      return;
    }

    setProcessing(true);
    setServerError(null);

    const payload = {
      userId,
      cartIds,
      amount: totalAmount,
      paymentMethod: "bank-transfer",
      orderInfo: `Chuyển khoản thủ công - user ${userId} - ${new Date().toLocaleString()}`,
    };

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await axios.post(
        "/api/Transaction/create-payment",
        payload,
        { headers }
      );

      const orderId = res.data?.orderId;

      if (orderId) {
        await axios.post("/api/Transaction/waiting-confirm", {
          orderId,
          userId,
        });
        setCurrentOrderId(orderId);
        setOrderStatus("WAITING_CHECK");
        alert("Đã ghi nhận. Chờ admin xác nhận.");
      }
    } catch (err: any) {
      alert("Lỗi ghi nhận: " + err?.response?.data?.message);
    } finally {
      setProcessing(false);
    }
  };

  const fmt = (v: number) => v.toLocaleString("vi-VN");

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-4xl">
        <div className="bg-card shadow-md rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-6">
            <h1 className="text-2xl font-semibold">Thanh toán đơn hàng</h1>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left */}
            <div className="lg:col-span-2 bg-card">
              <div className="border rounded-md overflow-hidden">
                <div className="bg-background/50 px-4 py-3 font-medium">
                  Đơn hàng của bạn
                </div>
                <div className="p-4 space-y-4">
                  {loading && <div>Đang tải giỏ hàng...</div>}
                  {!loading && cartItems.length === 0 && (
                    <div className="text-muted-foreground">Giỏ hàng trống</div>
                  )}

                  {cartItems.map((it) => (
                    <div
                      key={it.cartId}
                      className="flex justify-between items-start"
                    >
                      <div>
                        <div className="font-medium">{it.packageName}</div>
                        <div className="text-sm text-gray-500">
                          x{it.quantity}
                        </div>
                      </div>
                      <div className="font-semibold">
                        {fmt(it.totalAmout)} VNĐ
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-3 flex justify-between items-center">
                    <div className="font-bold">Tổng cộng</div>
                    <div className="text-2xl text-green-600 font-bold">
                      {fmt(totalAmount)} VNĐ
                    </div>
                  </div>
                </div>
              </div>

              {currentOrderId && (
                <div className="mt-4 p-4 bg-background/10 border border-border rounded-md">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      Order ID: <strong className="text-foreground">{currentOrderId}</strong>
                    </span>
                    <span>
                      Trạng thái: <strong className="text-foreground">{orderStatus}</strong>
                    </span>
                  </div>
                </div>
              )}

              {serverError && (
                <div className="mt-4 p-3 rounded-md bg-card/5 border border-border text-destructive">
                  <strong className="mr-2">Lỗi:</strong>
                  <span className="text-destructive">{serverError}</span>
                </div>
              )}
            </div>

            {/* Right: Payment Method */}
            <div className="bg-card p-4 rounded-md border border-border">
              <div className="mb-4">
                <div className="font-medium text-lg">Phương thức thanh toán</div>
              </div>

              <div className="space-y-3">
                {/* Radio VNPay */}
                <label
                  className={`flex items-center p-3 rounded-md cursor-pointer ${
                    method === "vnpay"
                      ? "border border-green-400 bg-background/20"
                      : "hover:bg-background/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    checked={method === "vnpay"}
                    onChange={() => setMethod("vnpay")}
                    className="mr-3"
                  />
                  <span className="font-semibold">
                    VNPay (Thanh toán trực tuyến)
                  </span>
                </label>

                {/* Radio Bank */}
                <label
                  className={`flex items-center p-3 rounded-md cursor-pointer ${
                    method === "bank"
                      ? "border border-green-400 bg-background/20"
                      : "hover:bg-background/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    checked={method === "bank"}
                    onChange={() => setMethod("bank")}
                    className="mr-3"
                  />
                  <span className="font-semibold">
                    Chuyển khoản ngân hàng (Thủ công)
                  </span>
                </label>
              </div>

              {/* VNPay Button */}
              {method === "vnpay" && (
                <div className="mt-6">
                  <button
                    onClick={handlePayVNPay}
                    disabled={processing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold"
                  >
                    {processing ? "Đang xử lý..." : "Thanh toán VNPay"}
                  </button>
                </div>
              )}

              {/* BANK TRANSFER + QR */}
              {method === "bank" && (
                <div className="mt-6 space-y-4">
                  {/* Bank info */}
                  <div className="p-3 rounded-md bg-background/50 border border-border">
                    <div>
                      <strong>Ngân hàng:</strong> {BANK_INFO.bankName}
                    </div>
                    <div>
                      <strong>Số tài khoản:</strong>{" "}
                      {BANK_INFO.accountNumber}
                    </div>
                    <div>
                      <strong>Chủ tài khoản:</strong>{" "}
                      {BANK_INFO.accountName}
                    </div>
                    <div>
                      <strong>Số tiền:</strong> {fmt(totalAmount)} VNĐ
                    </div>
                  </div>

                  {/* VietQR */}
                  <div className="p-4 bg-card border border-border rounded-md text-center">
                    <div className="font-semibold mb-2">
                      Quét mã VietQR để thanh toán
                    </div>

                    <img
                      src={qrUrl}
                      alt="VietQR TPBank"
                      className="w-60 mx-auto rounded-md shadow"
                    />

                    <div className="text-xs text-muted-foreground mt-2">
                      Mã QR tự động theo số tiền và nội dung.
                    </div>
                  </div>

                  <button
                    onClick={handleUserMarkTransferred}
                    disabled={processing}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-md font-semibold"
                  >
                    {processing
                      ? "Đang ghi nhận..."
                      : "Tôi đã chuyển khoản"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="text-sm text-muted-foreground p-4">
            Lưu ý: Chuyển khoản thủ công cần admin xác nhận thủ công.
          </div>
        </div>
      </div>
    </div>
  );
}
