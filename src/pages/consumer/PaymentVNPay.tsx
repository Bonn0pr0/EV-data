"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code";

// CRC16-CCITT (xmodem) pure JS
function crc16ccitt(str: string) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// Build TPBank QR tĩnh
const buildTPBankQR = (amount: number) => {
  const accountName = "Bùi Hoàng Phúc";
  const accountNumber = "06296707401";
  const bankCode = "TPBANK";

  const payloadWithoutCRC = [
    "000201",
    "010212",
    `52${bankCode.length}${bankCode}`,
    `53${3}704`,
    `54${amount.toString().length}${amount}`,
    `59${accountName.length}${accountName}`,
    `58${2}VN`,
  ].join("");

  const crcValue = crc16ccitt(payloadWithoutCRC);
  return payloadWithoutCRC + "6304" + crcValue;
};

export default function PaymentTPBank() {
  const [showQR, setShowQR] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const userId = sessionStorage.getItem("userId");

  // Lấy giỏ hàng từ API
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`/api/Cart?userId=${userId}`)
      .then((res) => {
        const data = res.data || [];
        setCartItems(data);

        const total = data.reduce(
          (sum: number, item: any) => sum + item.totalAmout,
          0
        );
        const ids = data.map((item: any) => item.cartId);

        setTotalAmount(total);
        setCartIds(ids);
      })
      .catch((err) => {
        console.error("Lỗi tải giỏ hàng:", err);
        alert("Không thể tải giỏ hàng");
      });
  }, [userId]);

  // Countdown QR
  useEffect(() => {
    if (showQR && countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [showQR, countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const tpbankQRData = buildTPBankQR(totalAmount);

  // Tạo giao dịch demo
  const handleConfirmPayment = async () => {
    if (!userId || cartIds.length === 0) {
      alert("Không có giỏ hàng hoặc người dùng");
      return;
    }
    setIsProcessing(true);

    const payload = {
      userId: Number(userId),
      cartIds: cartIds,
      amount: totalAmount,
      paymentMethod: "tpbank-qr",
      orderInfo: `Thanh toán đơn hàng ngày ${new Date().toLocaleString(
        "vi-VN"
      )}`,
    };

    try {
      await axios.post("/api/Transaction/create", payload);
      alert("Thanh toán thành công!");
    } catch (err) {
      console.error(err);
      alert("Thanh toán thất bại!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col items-center space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Thanh toán QR</h1>
      <p className="text-gray-700">Quét mã QR để chuyển tiền</p>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl">
        {/* Left: QR */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            {showQR ? (
              <div className="flex flex-col items-center space-y-4">
                <p className="text-gray-600 text-sm">
                  Mã QR hết hạn sau:{" "}
                  <span className="font-bold text-gray-900">
                    {formatTime(countdown)}
                  </span>
                </p>
                <QRCode value={tpbankQRData} size={256} level="H" />
                <p className="text-green-600 font-bold text-lg">
                  Số tiền: {totalAmount.toLocaleString()} VNĐ
                </p>
                <button
                  disabled={isProcessing}
                  onClick={handleConfirmPayment}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md flex items-center gap-2"
                >
                  {isProcessing ? (
                    <span className="animate-spin h-4 w-4 border-2 border-white rounded-full" />
                  ) : (
                    "Xác nhận thanh toán"
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowQR(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md w-full"
              >
                Tạo mã QR 
              </button>
            )}
          </div>
        </div>

        {/* Right: Giỏ hàng */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-600 text-white p-4 font-bold text-lg">
              Đơn hàng của bạn
            </div>
            <div className="p-4 space-y-3">
              {cartItems.length > 0 ? (
                cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.packageName}
                      </p>
                      <p className="text-gray-500">x{item.quantity}</p>
                    </div>
                    <span className="font-medium text-gray-900">
                      {item.totalAmout.toLocaleString()} VNĐ
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Không có sản phẩm</p>
              )}
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-green-600">
                  {totalAmount.toLocaleString()} VNĐ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
