import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Download, FileText } from "lucide-react";

interface Invoice {
  invoiceId: number;
  invoiceName: string;
  issueDay: string;
  packageCount: number;
  sumPrice: number;
  methodName: string;
  status: string;
}

interface Report {
  sumCart: number;
  statusCount: number;
  totalPrice: number;
}

export default function MyPurchases() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [report, setReport] = useState<Report | null>(null);

  // ✅ Lấy userId từ sessionStorage
  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`/api/Dashboard/order-list/${userId}`
      );
      setInvoices(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hóa đơn:", error);
    }
  };

  const fetchReport = async () => {
    try {
      const res = await axios.get(`/api/Dashboard/order-report/${userId}`
      );
      setReport(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy báo cáo:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchInvoices();
      fetchReport();
    }
  }, [userId]);

const handleViewInvoice = (invoice: Invoice) => {
  navigate(`/consumer/invoice/${invoice.invoiceId}`, {
    state: {
      invoiceData: {
        invoiceNumber: invoice.invoiceName,
        orderId: invoice.invoiceId,
        date: invoice.issueDay,
        items: [
          {
            name: "Gói dữ liệu EV",
            description: "Dữ liệu xe điện toàn diện",
            quantity: invoice.packageCount,
            price: invoice.sumPrice / invoice.packageCount,
            total: invoice.sumPrice,
          },
        ],
        subtotal: invoice.sumPrice,
        vat: invoice.sumPrice * 0.1,
        total: invoice.sumPrice * 1.1,
        paymentMethod: invoice.methodName || "Chưa có phương thức thanh toán", 
        status: invoice.status,
      },
    },
  });
};

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
            Đã thanh toán
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
            Chờ thanh toán
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
            Đã hủy
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Hóa đơn của tôi</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý và xem chi tiết các hóa đơn của bạn
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng hóa đơn</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report?.sumCart ?? 0}</div>
            <p className="text-xs text-muted-foreground">Tất cả thời gian</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã thanh toán</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report?.statusCount ?? 0}</div>
            <p className="text-xs text-muted-foreground">Hóa đơn hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chi tiêu</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(report?.totalPrice ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">Tất cả thời gian</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hóa đơn</CardTitle>
          <CardDescription>
            Xem và quản lý tất cả các hóa đơn của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Số hóa đơn</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Số món hàng</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <TableRow key={invoice.invoiceId}>
                    <TableCell className="font-medium">
                      {invoice.invoiceName}
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.issueDay).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>{invoice.packageCount}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(invoice.sumPrice)}
                    </TableCell>
                    <TableCell>{invoice.methodName}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Xem
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Tải
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                    Không có hóa đơn nào được tìm thấy.
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
