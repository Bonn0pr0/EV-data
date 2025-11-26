"use client";

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  // 📊 Get statistic
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/DataPackage/Count");
      if (!res.ok) throw new Error("Lỗi tải thống kê");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("❌ Lỗi thống kê:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // 📂 Fetch dataset list
  const fetchDatasets = async () => {
    try {
      const res = await fetch("/api/DataPackage/DataForAdmin");
      if (!res.ok) throw new Error("Lỗi tải danh sách dữ liệu");
      const result = await res.json();

      const data = result.data || [];
      setDatasets(data);
      setFilteredData(data);
    } catch (error) {
      console.error("❌ Lỗi danh sách:", error);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  // 🔍 Filter
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

  // 💾 Update dataset status
  const changeStatus = async (packageId, newStatus) => {
    try {
      const confirmAction = window.confirm(
        `Bạn có chắc muốn ${newStatus === "Approved" ? "duyệt" : "từ chối"} dữ liệu này không?`
      );
      if (!confirmAction) return;

      const res = await fetch(`/api/DataPackage/${packageId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newStatus }),
      });

      if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");

      await fetchDatasets();
      await fetchStats();

      alert("✔ Cập nhật thành công!");
    } catch (error) {
      console.error("❌ Lỗi:", error);
      alert("❌ Lỗi cập nhật, thử lại!");
    }
  };

  // 🔎 Fetch detail from API
  const fetchDatasetDetails = async (packageId) => {
    try {
      const res = await fetch(`/api/DataPackage/details/${packageId}`);
      if (!res.ok) throw new Error("Không thể tải chi tiết dataset");

      return await res.json();
    } catch (error) {
      console.error("❌ Lỗi chi tiết:", error);
      return null;
    }
  };

  // 👁️ View detail
  const handleViewDetails = async (dataset) => {
    const detail = await fetchDatasetDetails(dataset.packageId);
    if (detail) {
      setSelectedDataset(detail);
      setIsDetailModalOpen(true);
    }
  };

  // 📋 Copy URL
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("✔ Đã sao chép URL!");
  };

  // 📥 DOWNLOAD FILE API
  const downloadFile = async (downloadId) => {
    try {
      const roleId = sessionStorage.getItem("roleId") || 1;

      const res = await fetch(`/api/Download/${downloadId}/download?roleId=${roleId}`);

      if (!res.ok) throw new Error("Không thể tải file");

      // Lấy filename từ header
      const disposition = res.headers.get("content-disposition");
      let fileName = "download.dat";

      if (disposition) {
        const match = disposition.match(/filename\*=UTF-8''(.+)$/);
        if (match) fileName = decodeURIComponent(match[1]);
      }

      // Convert to blob
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();

      window.URL.revokeObjectURL(url);

      alert("✔ Tải xuống thành công!");
    } catch (error) {
      console.error("❌ Lỗi tải file:", error);
      alert("❌ Không thể tải file!");
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Kiểm duyệt dữ liệu</h1>
        <p className="text-muted-foreground mt-1">
          Xem xét và phê duyệt dữ liệu trước khi xuất bản
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardContent className="pt-6 text-center">
          <div className="bg-yellow-100 p-3 rounded-full w-fit mx-auto mb-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-2xl font-bold">{stats.pendingCount}</h3>
          <p className="text-sm">Chờ duyệt</p>
        </CardContent></Card>

        <Card><CardContent className="pt-6 text-center">
          <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold">{stats.approvedCount}</h3>
          <p className="text-sm">Đã duyệt</p>
        </CardContent></Card>

        <Card><CardContent className="pt-6 text-center">
          <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-3">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold">{stats.rejectedCount}</h3>
          <p className="text-sm">Từ chối</p>
        </CardContent></Card>
      </div>

      {/* DATA TABLE */}
      <Card>
        <CardHeader><CardTitle>Dữ liệu chờ duyệt</CardTitle></CardHeader>

        <div className="px-6 pb-4 flex gap-4">
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Pending">Chờ duyệt</SelectItem>
              <SelectItem value="Approved">Đã duyệt</SelectItem>
              <SelectItem value="Rejected">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
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
                {filteredData.map((dataset) => (
                  <TableRow key={dataset.packageId}>
                    <TableCell>{dataset.packageName}</TableCell>
                    <TableCell>{dataset.providerName}</TableCell>
                    <TableCell><Badge>{dataset.categoryName}</Badge></TableCell>
                    <TableCell>{(dataset.fileSize / 1024 / 1024).toFixed(2)} MB</TableCell>
                    <TableCell>{new Date(dataset.createdAt).toLocaleDateString("vi-VN")}</TableCell>
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
                        {dataset.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(dataset)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600"
                          onClick={() => changeStatus(dataset.packageId, "Approved")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Duyệt
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
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
                    <TableCell colSpan={10} className="text-center py-4 text-muted-foreground">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* DETAIL MODAL */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Chi tiết Dataset</DialogTitle>
          </DialogHeader>

          {selectedDataset && (
            <div className="space-y-6">

              {/* BASIC INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div><p className="text-sm text-muted-foreground">Tên</p>
                  <p className="font-semibold">{selectedDataset.packageName}</p></div>

                <div><p className="text-sm text-muted-foreground">Nhà cung cấp</p>
                  <p className="font-semibold">{selectedDataset.providerName}</p></div>

                <div><p className="text-sm text-muted-foreground">Danh mục</p>
                  <p className="font-semibold">{selectedDataset.subCategoryName}</p></div>

                <div><p className="text-sm text-muted-foreground">Kích thước</p>
                  <p className="font-semibold">{(selectedDataset.fileSize / 1024 / 1024).toFixed(2)} MB</p></div>

                <div><p className="text-sm text-muted-foreground">Giá</p>
                  <p className="font-semibold text-green-600">
                    {selectedDataset.price?.toLocaleString("vi-VN")} VND
                  </p></div>

                <div><p className="text-sm text-muted-foreground">Thời hạn</p>
                  <p className="font-semibold">{selectedDataset.duration} ngày</p></div>

                <div><p className="text-sm text-muted-foreground">Số file</p>
                  <p className="font-semibold">{selectedDataset.fileCount}</p></div>

                <div><p className="text-sm text-muted-foreground">Ngày phát hành</p>
                  <p className="font-semibold">
                    {new Date(selectedDataset.releaseDate).toLocaleDateString("vi-VN")}
                  </p></div>

                <div>
                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                  <Badge className="mt-1">{selectedDataset.status}</Badge>
                </div>
              </div>

              {/* DOWNLOADS TABLE */}
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Danh sách tải xuống</h3>

                {selectedDataset.downloads?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File</TableHead>
                        <TableHead>Ngày tải</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Số lần</TableHead>
                        <TableHead>Copy</TableHead>
                        <TableHead>Tải xuống</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {selectedDataset.downloads.map((d) => (
                        <TableRow key={d.downloadId}>
                          <TableCell>{d.fileName}</TableCell>
                          <TableCell>{new Date(d.downloadDate).toLocaleString("vi-VN")}</TableCell>
                          <TableCell><Badge variant="outline">{d.status}</Badge></TableCell>
                          <TableCell>{d.downloadCount}</TableCell>

                          {/* COPY */}
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(d.fileUrl)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TableCell>

                          {/* DOWNLOAD */}
                          <TableCell>
                            <Button
                              className="bg-blue-600 text-white hover:bg-blue-700"
                              size="sm"
                              onClick={() => downloadFile(d.downloadId)}
                            >
                              Tải xuống
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">Không có lịch sử download</p>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
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
