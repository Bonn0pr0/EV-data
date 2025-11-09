"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/Statcard";
import { DollarSign, TrendingUp, Download, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

export default function Revenue() {
  const userId = sessionStorage.getItem("userId");

  // States để lưu dữ liệu từ API
  const [revenueReport, setRevenueReport] = useState({
    totalRevenue: 0,
    revenueGrowth: 0,
    downloadCount: 0,
    downloadGrowth: 0,
    buyerCount: 0,
    newBuyer: 0,
    averageRevenue: 0
  });

  const [transactions, setTransactions] = useState([]);
  const [topBuyers, setTopBuyers] = useState([]);
  const [dataRevenue, setDataRevenue] = useState([]);

  // Fetch Revenue Report (Dashboard stats)
  useEffect(() => {
    const fetchRevenueReport = async () => {
      try {
        const res = await fetch(`/api/PricingPlan/RevenueStaff/RevenueReport/${userId}`);
        if (!res.ok) throw new Error("Không thể lấy báo cáo doanh thu");
        const data = await res.json();
        setRevenueReport(data);
      } catch (err) {
        console.error("❌ Lỗi fetch Revenue Report:", err);
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await fetch(`/api/Transaction/RevenueStaff/Now/${userId}`);
        if (!res.ok) throw new Error("Không thể lấy lịch sử giao dịch");
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("❌ Lỗi fetch Transactions:", err);
      }
    };

    const fetchTopBuyers = async () => {
      try {
        const res = await fetch(`/api/Transaction/RevenueStaff/TopBuyer/${userId}`);
        if (!res.ok) throw new Error("Không thể lấy top người mua");
        const data = await res.json();
        setTopBuyers(data);
      } catch (err) {
        console.error("❌ Lỗi fetch Top Buyers:", err);
      }
    };

    const fetchDataRevenue = async () => {
      try {
        const res = await fetch(`/api/Transaction/RevenueStaff/DataRevenue/${userId}`);
        if (!res.ok) throw new Error("Không thể lấy doanh thu theo dữ liệu");
        const data = await res.json();
        setDataRevenue(data);
      } catch (err) {
        console.error("❌ Lỗi fetch Data Revenue:", err);
      }
    };

    if (userId) {
      fetchRevenueReport();
      fetchTransactions();
      fetchTopBuyers();
      fetchDataRevenue();
    }
  }, [userId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Theo dõi Doanh thu
          </h1>
          <p className="text-muted-foreground mt-1">Báo cáo doanh thu và số lượt tải dữ liệu</p>
        </div>
        <Select defaultValue="month">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">7 ngày qua</SelectItem>
            <SelectItem value="month">30 ngày qua</SelectItem>
            <SelectItem value="quarter">90 ngày qua</SelectItem>
            <SelectItem value="year">Cả năm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Tổng doanh thu"
          value={`${revenueReport.totalRevenue.toLocaleString('vi-VN')}₫`}
          icon={DollarSign}
          change={`${revenueReport.revenueGrowth > 0 ? '+' : ''}${revenueReport.revenueGrowth}% so với tháng trước`}
          changeType={revenueReport.revenueGrowth >= 0 ? "positive" : "negative"}
        />
        <StatCard
          title="Lượt tải"
          value={revenueReport.downloadCount.toString()}
          icon={Download}
          change={`${revenueReport.downloadGrowth > 0 ? '+' : ''}${revenueReport.downloadGrowth}% tăng`}
          changeType={revenueReport.downloadGrowth >= 0 ? "positive" : "negative"}
        />
        <StatCard
          title="Người mua"
          value={revenueReport.buyerCount.toString()}
          icon={Users}
          change={`${revenueReport.newBuyer} người mua mới`}
          changeType="positive"
        />
        <StatCard
          title="Giá trị TB/giao dịch"
          value={`${revenueReport.averageRevenue.toLocaleString('vi-VN')}₫`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Giao dịch gần đây</CardTitle>
            <CardDescription>Lịch sử giao dịch và tải xuống dữ liệu</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Người mua</TableHead>
                  <TableHead>Dữ liệu</TableHead>
                  <TableHead>Lượt tải</TableHead>
                  <TableHead>Doanh thu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.transactionDate}>
                      <TableCell>{new Date(transaction.transactionDate).toLocaleDateString('vi-VN')}</TableCell>
                      <TableCell className="font-medium">{transaction.buyerName}</TableCell>
                      <TableCell>{transaction.packageName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{transaction.downloadCount}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-success">
                        {transaction.revenue.toLocaleString('vi-VN')}₫
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Chưa có giao dịch nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top người mua</CardTitle>
            <CardDescription>Khách hàng mua nhiều nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBuyers.length > 0 ? (
                topBuyers.map((buyer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{buyer.buyerName}</p>
                      <p className="text-sm text-muted-foreground">{buyer.transactionCount} giao dịch</p>
                    </div>
                    <p className="font-semibold text-success">
                      {buyer.totalRevenue.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">Chưa có dữ liệu</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doanh thu theo bộ dữ liệu</CardTitle>
          <CardDescription>Phân tích hiệu suất từng bộ dữ liệu</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bộ dữ liệu</TableHead>
                <TableHead>Lượt tải</TableHead>
                <TableHead>Doanh thu</TableHead>
                <TableHead>Giá TB</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataRevenue.length > 0 ? (
                dataRevenue.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.packageName}</TableCell>
                    <TableCell>{item.totalDownloads}</TableCell>
                    <TableCell className="font-semibold text-success">
                      {item.totalRevenue.toLocaleString('vi-VN')}₫
                    </TableCell>
                    <TableCell>{item.averagePrice.toLocaleString('vi-VN')}₫</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Chưa có dữ liệu doanh thu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}