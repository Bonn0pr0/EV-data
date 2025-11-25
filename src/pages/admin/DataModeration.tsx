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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, AlertTriangle, Eye, Copy } from "lucide-react";

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
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // 📊 Lấy thống kê
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

  useEffect(() => {
    fetchStats();
  }, []);

  // 📂 Lấy danh sách dataset
  const fetchDatasets = async () => {
    try {
      const res = await fetch("/api/DataPackage/DataForAdmin");
      if (!res.ok) throw new Error("Lỗi tải dữ liệu");
      const result = await res.json();
      console.log("✅ Dữ liệu từ API:", result);

      const data = result.data || [];
      setDatasets(data);
      setFilteredData(data);
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách:", error);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  // 📌 Lọc dữ liệu khi tìm kiếm hoặc lọc trạng thái
  useEffect(() => {
    let data = datasets;

    if (searchTerm) {
      data = data.filter(
        (d) =>
          (d.packageName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (d.providerName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((d) => d.status === statusFilter);
    }

    setFilteredData(data);
  }, [searchTerm, statusFilter, datasets]);

  // 📤 Gọi API đổi trạng thái
const changeStatus = async (packageId, newStatus) => {
  try {
    // ✅ Xác nhận hành động
    const actionText = newStatus === "Approved" ? "duyệt" : "từ chối";
    const confirmAction = window.confirm(`Bạn có chắc muốn ${actionText} gói dữ liệu này không?`);
    if (!confirmAction) return;

    const res = await fetch(`/api/DataPackage/${packageId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newStatus }),
    });

    if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");
    console.log(`✅ Cập nhật trạng thái ${newStatus} cho gói ${packageId} thành công`);

    // Load lại dữ liệu sau khi cập nhật
    await fetchDatasets();
    await fetchStats();

    // ✅ Hiển thị thông báo đơn giản
    alert(`Gói dữ liệu đã được ${actionText} thành công!`);
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật trạng thái:", error);
    alert("❌ Có lỗi xảy ra, vui lòng thử lại!");
  }
};

  // 👁️ Xem chi tiết dataset
  const handleViewDetails = (dataset) => {
    setSelectedDataset(dataset);
    setIsDetailModalOpen(true);
  };

  // 📋 Copy URL vào clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("✅ Đã sao chép URL!");
  };

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
                  <TableHead>Chi tiết</TableHead>
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
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50"
                        onClick={() => handleViewDetails(dataset)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-success border-success hover:bg-success/10"
                          onClick={() => changeStatus(dataset.packageId, "Approved")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Duyệt
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive hover:bg-destructive/10"
                          onClick={() => changeStatus(dataset.packageId, "Rejected")}
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
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-4">
                      Không có dữ liệu phù hợp
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal chi tiết dataset */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Chi tiết Dataset</DialogTitle>
          </DialogHeader>

          {selectedDataset && (
            <div className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Tên dữ liệu</p>
                  <p className="text-base font-semibold">{selectedDataset.packageName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nhà cung cấp</p>
                  <p className="text-base font-semibold">{selectedDataset.providerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loại/Danh mục</p>
                  <Badge variant="outline">{selectedDataset.categoryName}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dung lượng</p>
                  <p className="text-base font-semibold">{selectedDataset.fileSize}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                  <Badge
                    variant={
                      selectedDataset.status === "Approved"
                        ? "default"
                        : selectedDataset.status === "Pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className="mt-1"
                  >
                    {selectedDataset.status === "Approved"
                      ? "Đã duyệt"
                      : selectedDataset.status === "Pending"
                      ? "Chờ duyệt"
                      : "Từ chối"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tải lên</p>
                  <p className="text-base font-semibold">
                    {new Date(selectedDataset.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* URL */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">URL Dataset</p>
                <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-border">
                  <Input
                    type="text"
                    value={selectedDataset.url || "N/A"}
                    readOnly
                    className="flex-1 border-0 bg-transparent"
                  />
                  {selectedDataset.url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(selectedDataset.url)}
                      className="text-blue-600"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Bảng chi tiết từ trang staff */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold">Thông tin chi tiết</h3>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Tên dữ liệu</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Dung lượng</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Lượt tải</TableHead>
                        <TableHead className="text-right">Doanh thu</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">{selectedDataset.packageName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50">
                            {selectedDataset.categoryName}
                          </Badge>
                        </TableCell>
                        <TableCell>{selectedDataset.fileSize}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              selectedDataset.status === "Approved" ? "default" : "secondary"
                            }
                          >
                            {selectedDataset.status === "Approved" ? "Hoạt động" : "Chứng"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <p className="font-semibold">{selectedDataset.downloadCount || 0}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <p className="font-semibold text-green-600">
                            {(selectedDataset.revenue || 0).toLocaleString("vi-VN")} VNĐ
                          </p>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Thao tác */}
              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailModalOpen(false)}
                >
                  Đóng
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    changeStatus(selectedDataset.packageId, "Approved");
                    setIsDetailModalOpen(false);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Phê duyệt
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    changeStatus(selectedDataset.packageId, "Rejected");
                    setIsDetailModalOpen(false);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Từ chối
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
