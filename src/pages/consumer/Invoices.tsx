import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Download, FileText } from "lucide-react";

// Mock data for invoices
const mockInvoices = [
  {
    id: "INV-2024-001",
    orderId: "ORD-2024-001",
    date: "2024-01-15",
    items: 3,
    total: 15000000,
    status: "paid",
    paymentMethod: "Ví MoMo"
  },
  {
    id: "INV-2024-002",
    orderId: "ORD-2024-002",
    date: "2024-01-20",
    items: 1,
    total: 8000000,
    status: "paid",
    paymentMethod: "VNPay"
  },
  {
    id: "INV-2024-003",
    orderId: "ORD-2024-003",
    date: "2024-02-05",
    items: 2,
    total: 12000000,
    status: "pending",
    paymentMethod: "Chuyển khoản"
  },
];

export default function Invoices() {
  const navigate = useNavigate();
  const [invoices] = useState(mockInvoices);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleViewInvoice = (invoice: typeof mockInvoices[0]) => {
    navigate('/consumer/invoice', {
      state: {
        invoiceData: {
          invoiceNumber: invoice.id,
          orderId: invoice.orderId,
          date: invoice.date,
          items: [
            {
              name: "Gói dữ liệu EV",
              description: "Dữ liệu xe điện toàn diện",
              quantity: invoice.items,
              price: invoice.total / invoice.items,
              total: invoice.total
            }
          ],
          subtotal: invoice.total,
          vat: invoice.total * 0.1,
          total: invoice.total * 1.1,
          paymentMethod: invoice.paymentMethod,
          status: invoice.status
        }
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Đã thanh toán</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Chờ thanh toán</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Đã hủy</Badge>;
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
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground">Tất cả thời gian</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã thanh toán</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices.filter(inv => inv.status === 'paid').length}
            </div>
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
              {formatCurrency(invoices.reduce((sum, inv) => sum + inv.total, 0))}
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
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{invoice.items}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(invoice.total)}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewInvoice(invoice)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Tải
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
