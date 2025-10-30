import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, FileText, Calendar, Package } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/Statcard";

export default function MyPurchases() {
  const purchases = [
    {
      id: "DL-2024-001",
      packageName: "Battery Performance Dataset Q4 2024",
      provider: "Tesla Fleet Services",
      purchaseDate: "2024-01-15",
      format: "CSV, JSON",
      size: "2.4 GB",
      status: "active",
      downloads: 5,
      maxDownloads: 10,
    },
    {
      id: "DL-2024-002",
      packageName: "Charging Station Usage Patterns",
      provider: "ChargePoint Network",
      purchaseDate: "2024-01-10",
      format: "JSON, API",
      size: "850 MB",
      status: "active",
      downloads: 3,
      maxDownloads: 5,
    },
    {
      id: "DL-2024-003",
      packageName: "Vehicle Telematics - Urban Driving",
      provider: "BMW ConnectedDrive",
      purchaseDate: "2024-01-05",
      format: "CSV",
      size: "3.8 GB",
      status: "expired",
      downloads: 10,
      maxDownloads: 10,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">My Purchases</h2>
        <p className="text-muted-foreground">Quản lý các gói dữ liệu đã mua</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Packages"
          value="3"
          icon={Package}
          change="+1 this month"
          changeType="positive"
        />
        <StatCard
          title="Total Downloads"
          value="18"
          icon={Download}
          change="24 remaining"
          changeType="neutral"
        />
        <StatCard
          title="Active Packages"
          value="2"
          icon={FileText}
          change="1 expired"
          changeType="neutral"
        />
      </div>

      {/* Purchases Table */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle>Purchased Data Packages</CardTitle>
          <CardDescription>Danh sách các gói dữ liệu bạn đã mua</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package ID</TableHead>
                <TableHead>Package Name</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">{purchase.id}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-medium text-foreground truncate">{purchase.packageName}</p>
                    </div>
                  </TableCell>
                  <TableCell>{purchase.provider}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {purchase.purchaseDate}
                    </div>
                  </TableCell>
                  <TableCell>{purchase.format}</TableCell>
                  <TableCell>{purchase.size}</TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {purchase.downloads}/{purchase.maxDownloads}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={purchase.status === "active" ? "default" : "secondary"}>
                      {purchase.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={purchase.status === "expired"}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Download Instructions */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle>Download Instructions</CardTitle>
          <CardDescription>Hướng dẫn tải và sử dụng dữ liệu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>1. Click vào nút Download để tải xuống gói dữ liệu</p>
            <p>2. Mỗi gói có giới hạn số lần tải xuống theo gói đã mua</p>
            <p>3. Dữ liệu raw cần được xử lý trước khi sử dụng</p>
            <p>4. Sử dụng API Access để tích hợp trực tiếp vào hệ thống của bạn</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
