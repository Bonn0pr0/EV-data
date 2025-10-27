import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/Statcard";
import {
  Users,
  Database,
  DollarSign,
  TrendingUp,
  FileText,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/Dashboard/dashboard/summary").then((res) => res.json()),
      fetch("/api/DataPackage/pending").then((res) => res.json()),
    ])
      .then(([sum, pend]) => {
        setSummary(sum);
        setPending(pend);
      })
      .catch((err) => console.error("Lỗi tải dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[50vh] text-gray-500">
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="p-6 space-y-8">
      {/* Tiêu đề */}
      <div>
        <h1 className="text-3xl font-bold">Tổng quan hệ thống</h1>
        <p className="text-gray-500">
          Thống kê và hoạt động của nền tảng Data Marketplace
        </p>
      </div>

      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Tổng người dùng"
          value={summary?.totalUsers || 0}
        />
        <StatCard
          icon={Database}
          title="Bộ dữ liệu"
          value={summary?.totalDataPackages || 0}
        />
        <StatCard
          icon={DollarSign}
          title="Doanh thu tháng này"
          value={`${summary?.monthlyRevenue?.toLocaleString() || 0} VND`}
        />
        <StatCard
          icon={TrendingUp}
          title="Giao dịch"
          value={summary?.totalTransactions || 0}
        />
      </div>

      {/* Hoạt động & Dữ liệu chờ duyệt */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hoạt động gần đây */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <span className="font-medium text-gray-800">
                    Nguyễn Văn A
                  </span>{" "}
                  đã tải lên bộ dữ liệu mới
                  <div className="text-sm text-gray-500">5 phút trước</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <span className="font-medium text-gray-800">
                    Trần Thị B
                  </span>{" "}
                  đã mua bộ dữ liệu EV Battery Data
                  <div className="text-sm text-gray-500">15 phút trước</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <span className="font-medium text-gray-800">Lê Văn C</span> đã
                  yêu cầu kiểm duyệt dữ liệu
                  <div className="text-sm text-gray-500">1 giờ trước</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <span className="font-medium text-gray-800">Phạm Thị D</span>{" "}
                  đã cập nhật thông tin tài khoản
                  <div className="text-sm text-gray-500">2 giờ trước</div>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Dữ liệu chờ kiểm duyệt */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Dữ liệu chờ kiểm duyệt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pending.length > 0 ? (
              pending.map((pkg, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {pkg.packageName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Nhà cung cấp: {pkg.providerName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(pkg.createAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                Không có dữ liệu chờ kiểm duyệt
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



