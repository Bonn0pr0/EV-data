"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, TrendingUp, Users, Percent } from "lucide-react";
import { StatCard } from "@/components/Statcard";

export default function Payments() {
  const [dashboard, setDashboard] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [revenueShare, setRevenueShare] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/Dashboard").then((res) => res.json()),
      fetch("/api/Transaction/GetRecent?count=5").then((res) => res.json()),
      fetch("/api/RevenueShare/Profit").then((res) => res.json()),
      fetch("/api/Transaction/ReportTransaction").then((res) => res.json()),
    ])
      .then(([dash, trans, revenue, rep]) => {
        setDashboard(dash || {});
        setTransactions(trans || []);
        setRevenueShare(revenue || []);
        setReport(rep || {});
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Thanh toán & Doanh thu</h1>

 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng doanh thu"
          value={`${dashboard?.totalRevenue?.toLocaleString?.() || 0} đ`}
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Hoa hồng nền tảng"
          value={`${dashboard?.platforCommission?.toLocaleString?.() || 0} đ`}
          changeType="neutral"
          icon={Percent}
        />
        <StatCard
          title="Chia sẻ cho Provider"
          value={`${dashboard?.providerShare?.toLocaleString?.() || 0} đ`}
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Giao dịch"
          value={dashboard?.totalTransactions || 0}
          changeType="positive"
          icon={Users}
        />
      </div>


      <Card>
        <CardHeader>
          <CardTitle>Giao dịch gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p>Không có giao dịch nào</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã giao dịch</TableHead>
                  <TableHead>Nhà cung cấp</TableHead>
                  <TableHead>Bộ dữ liệu</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Hoa hồng</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t, index) => (
                  <TableRow key={index}>
                    <TableCell>#{t.transactionId}</TableCell>
                    <TableCell>{t.providerName}</TableCell>
                    <TableCell>{t.packageName}</TableCell>
                    <TableCell>{t.amount?.toLocaleString?.() || 0} đ</TableCell>
                    <TableCell>{t.commission?.toLocaleString?.() || 0} đ</TableCell>
                    <TableCell>{t.transactionDate?.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge variant={t.status === "completed" ? "default" : "secondary"}>
                        {t.status === "completed" ? "Hoàn thành" : "Đang xử lý"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Cấu hình chia sẻ doanh thu</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Tỷ lệ Provider</TableHead>
                <TableHead>Tỷ lệ Nền tảng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueShare.map((p, index) => (
                <TableRow key={index}>
                  <TableCell>{p.providerName}</TableCell>
                  <TableCell>{p.sharePercentage}%</TableCell>
                  <TableCell>{p.platformPercentage}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Thống kê thanh toán</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Tổng giao dịch"
            value={report?.totalTransaction || 0}
            changeType="neutral"
            icon={Users}
          />
          <StatCard
            title="Tổng doanh thu"
            value={`${report?.totalAmount?.toLocaleString?.() || 0} đ`}
            changeType="positive"
            icon={DollarSign}
          />
          <StatCard
            title="Giá trị trung bình"
            value={`${report?.averageTransaction?.toLocaleString?.() || 0} đ`}
            changeType="neutral"
            icon={DollarSign}
          />
          <StatCard
            title="Thành công"
            value={`${report?.successPercentage || 0}%`}
            changeType="positive"
            icon={TrendingUp}
          />
          <StatCard
            title="Đang xử lý"
            value={`${report?.pendingPercentage || 0}%`}
            changeType="neutral"
            icon={TrendingUp}
          />
          <StatCard
            title="Thất bại"
            value={`${report?.failurePercentage || 0}%`}
            changeType="negative"
            icon={TrendingUp}
          />
        </CardContent>
      </Card>
    </div>
  );
}
