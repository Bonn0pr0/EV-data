import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/Statcard";
import { DollarSign, TrendingUp, Download, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Revenue() {
  const mockTransactions = [
    { id: 1, date: "2024-01-15", buyer: "VinGroup Research", dataset: "Dữ liệu pin Tesla Model 3", downloads: 5, revenue: "175,000₫" },
    { id: 2, date: "2024-01-14", buyer: "EV Analytics Co.", dataset: "Dữ liệu sạc nhanh", downloads: 3, revenue: "105,000₫" },
    { id: 3, date: "2024-01-13", buyer: "Smart Mobility Lab", dataset: "Dữ liệu pin Tesla Model 3", downloads: 2, revenue: "70,000₫" },
    { id: 4, date: "2024-01-12", buyer: "Green Transport", dataset: "Giao dịch điện năng", downloads: 4, revenue: "120,000₫" },
  ];

  const topBuyers = [
    { name: "VinGroup Research", purchases: 25, revenue: "2,450,000₫" },
    { name: "EV Analytics Co.", purchases: 18, revenue: "1,890,000₫" },
    { name: "Smart Mobility Lab", purchases: 12, revenue: "980,000₫" },
  ];

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
          value="5,320,000₫"
          icon={DollarSign}
          change="+23% tăng so với tháng trước"
          changeType="positive"
        />
        <StatCard
          title="Lượt tải"
          value="156"
          icon={Download}
          change="+18% tăng"
          changeType="positive"
        />
        <StatCard
          title="Người mua"
          value="42"
          icon={Users}
          change="8 người mua mới"
          changeType="positive"
        />
        <StatCard
          title="Giá trị TB/giao dịch"
          value="34,100₫"
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
                {mockTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="font-medium">{transaction.buyer}</TableCell>
                    <TableCell>{transaction.dataset}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{transaction.downloads}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-success">
                      {transaction.revenue}
                    </TableCell>
                  </TableRow>
                ))}
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
              {topBuyers.map((buyer, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{buyer.name}</p>
                    <p className="text-sm text-muted-foreground">{buyer.purchases} giao dịch</p>
                  </div>
                  <p className="font-semibold text-success">{buyer.revenue}</p>
                </div>
              ))}
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
                <TableHead>Tỷ lệ chuyển đổi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Dữ liệu pin Tesla Model 3</TableCell>
                <TableCell>68</TableCell>
                <TableCell className="font-semibold text-success">2,380,000₫</TableCell>
                <TableCell>35,000₫</TableCell>
                <TableCell><Badge>45%</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dữ liệu sạc nhanh</TableCell>
                <TableCell>52</TableCell>
                <TableCell className="font-semibold text-success">1,820,000₫</TableCell>
                <TableCell>35,000₫</TableCell>
                <TableCell><Badge>38%</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Giao dịch điện năng</TableCell>
                <TableCell>36</TableCell>
                <TableCell className="font-semibold text-success">1,120,000₫</TableCell>
                <TableCell>31,100₫</TableCell>
                <TableCell><Badge>28%</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
