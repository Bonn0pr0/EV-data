import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CheckCircle, XCircle, Eye, AlertTriangle } from "lucide-react";

export default function DataModeration() {
  const [stats, setStats] = useState({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
  });

  const [datasets, setDatasets] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 📊 Lấy thống kê
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/DataPackage/Count");
        if (!res.ok) throw new Error("Lỗi tải dữ liệu thống kê");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("❌ Lỗi khi tải thống kê:", error);
      }
    };
    fetchStats();
  }, []);

  // 📂 Lấy danh sách dataset
useEffect(() => {
  const fetchDatasets = async () => {
    try {
      const res = await fetch("/api/DataPackage/DataForAdmin");
      if (!res.ok) throw new Error("Lỗi tải dữ liệu");
      const result = await res.json();
      console.log("✅ Dữ liệu từ API:", result);

      // Lấy đúng mảng data
      const data = result.data || [];
      setDatasets(data);
      setFilteredData(data);
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách:", error);
    }
  };
  fetchDatasets();
}, []);

  // 📌 Xử lý lọc dữ liệu
  useEffect(() => {
    let data = datasets;

    // Tìm kiếm
    if (searchTerm) {
      data = data.filter(
        (d) =>
          (d.packageName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (d.providerName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      );
    }

    // Lọc trạng thái
    if (statusFilter !== "all") {
      data = data.filter((d) => d.status === statusFilter);
    }

    setFilteredData(data);
  }, [searchTerm, statusFilter, datasets]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Kiểm duyệt dữ liệu</h1>
        <p className="text-muted-foreground mt-2">
          Xem xét và phê duyệt dữ liệu trước khi xuất bản
        </p>
      </div>

      {/* Cards thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="bg-warning/10 p-3 rounded-full w-fit mx-auto mb-3">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <h3 className="text-2xl font-bold">{stats.pendingCount}</h3>
            <p className="text-sm text-muted-foreground mt-1">Chờ kiểm duyệt</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="bg-success/10 p-3 rounded-full w-fit mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-2xl font-bold">{stats.approvedCount}</h3>
            <p className="text-sm text-muted-foreground mt-1">Đã phê duyệt</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="bg-destructive/10 p-3 rounded-full w-fit mx-auto mb-3">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-2xl font-bold">{stats.rejectedCount}</h3>
            <p className="text-sm text-muted-foreground mt-1">Từ chối</p>
          </CardContent>
        </Card>
      </div>

      {/* Bảng dữ liệu */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle>Dữ liệu chờ kiểm duyệt</CardTitle>
        </CardHeader>

        {/* Thanh tìm kiếm & lọc */}
        <div className="px-6 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-1/2">
            <Input
              placeholder="🔍 Tìm kiếm theo tên hoặc nhà cung cấp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="w-full md:w-1/4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Pending">Chờ duyệt</SelectItem>
                <SelectItem value="Approved">Đã duyệt</SelectItem>
                <SelectItem value="Rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <CardContent>
          <div className="rounded-md border border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên bộ dữ liệu</TableHead>
                  <TableHead>Nhà cung cấp</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Kích thước</TableHead>
                  <TableHead>Ngày tải lên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(filteredData) && filteredData.map((dataset) => (
                  <TableRow key={dataset.packageId}>
                    <TableCell className="font-medium">{dataset.packageName}</TableCell>
                    <TableCell>{dataset.providerName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{dataset.categoryName}</Badge>
                    </TableCell>
                    <TableCell>{dataset.fileSize}</TableCell>
                    <TableCell>
                      {new Date(dataset.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          dataset.status === "Approved"
                            ? "default"
                            : dataset.status === "Pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {dataset.status === "Approved"
                          ? "Đã duyệt"
                          : dataset.status === "Pending"
                          ? "Chờ duyệt"
                          : "Từ chối"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Xem
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-success border-success hover:bg-success/10"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Duyệt
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Từ chối
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-4">
                      Không có dữ liệu phù hợp
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
