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

const transactions = [
  {
    id: "TXN-001",
    provider: "Nguyễn Văn A",
    dataset: "EV Charging Data",
    amount: "$450",
    commission: "$45",
    date: "2024-03-15",
    status: "completed",
  },
  {
    id: "TXN-002",
    provider: "Trần Thị B",
    dataset: "Battery Analytics",
    amount: "$320",
    commission: "$32",
    date: "2024-03-14",
    status: "completed",
  },
  {
    id: "TXN-003",
    provider: "Lê Văn C",
    dataset: "Vehicle Telemetry",
    amount: "$680",
    commission: "$68",
    date: "2024-03-13",
    status: "pending",
  },
];

export default function Payments() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Thanh toán & Doanh thu</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý giao dịch và chia sẻ doanh thu với nhà cung cấp
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng doanh thu"
          value="$45,231"
          change="+23.1% so với tháng trước"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Hoa hồng nền tảng"
          value="$4,523"
          change="10% mỗi giao dịch"
          changeType="neutral"
          icon={Percent}
        />
        <StatCard
          title="Chia sẻ cho Provider"
          value="$40,708"
          change="+21.5% so với tháng trước"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Giao dịch"
          value="892"
          change="+5.4% so với tháng trước"
          changeType="positive"
          icon={Users}
        />
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle>Giao dịch gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã giao dịch</TableHead>
                  <TableHead>Nhà cung cấp</TableHead>
                  <TableHead>Bộ dữ liệu</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Hoa hồng (10%)</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.provider}</TableCell>
                    <TableCell>{transaction.dataset}</TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {transaction.amount}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {transaction.commission}
                    </TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.status === "completed" ? "default" : "secondary"}
                        className={transaction.status === "completed" ? "bg-success" : ""}
                      >
                        {transaction.status === "completed" ? "Hoàn thành" : "Đang xử lý"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle>Cấu hình chia sẻ doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">Hoa hồng nền tảng</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Phần trăm trên mỗi giao dịch
                  </p>
                </div>
                <div className="text-2xl font-bold text-primary">10%</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-foreground">Chia sẻ cho Provider</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Phần trăm dành cho nhà cung cấp
                  </p>
                </div>
                <div className="text-2xl font-bold text-success">90%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle>Thống kê thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <span className="text-muted-foreground">Tổng số giao dịch tháng này</span>
                <span className="font-semibold text-foreground">892</span>
              </div>
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <span className="text-muted-foreground">Giá trị giao dịch trung bình</span>
                <span className="font-semibold text-foreground">$507</span>
              </div>
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <span className="text-muted-foreground">Số Provider đã nhận thanh toán</span>
                <span className="font-semibold text-foreground">156</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-muted-foreground">Thời gian xử lý trung bình</span>
                <span className="font-semibold text-foreground">2.4 ngày</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
