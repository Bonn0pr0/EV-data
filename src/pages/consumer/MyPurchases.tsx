"use client";

import { useEffect, useState } from "react";
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
  Download,
  Eye,
  FileText,
  Calendar,
  Package,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/Statcard";

// Định nghĩa interface cho dữ liệu
interface DownloadItem {
  downloadId: number;
  downloadDate: string;
  fileName: string;
  fileUrl: string;
  status: string;
  downloadCount: number;
  packageId: number;
}

interface PurchaseItem {
  transactionId: number;
  packageId: number;
  packageName: string;
  providerName: string;
  purchaseDate: string;
  fileFormat: string;
  fileSize: number;
  totalDownloads: number;
  latestDownloadDate: string | null;
  status: string;
  downloads: DownloadItem[];
}

export default function MyPurchases() {
  const [report, setReport] = useState<any>(null);
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const userId = sessionStorage.getItem("userId");

  const getAuthToken = () => {
    return (
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      null
    );
  };
  const API_BASE = import.meta.env.VITE_API_BASE || "";

  const toggleRowExpansion = (transactionId: number) => {
    setExpandedRows(prev =>
      prev.includes(transactionId)
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleDownload = async (downloadItem: DownloadItem) => {
    const id = downloadItem.downloadId;

    if (!id) {
      alert("Không tìm thấy downloadId để tải xuống");
      return;
    }

    try {
      setDownloadingId(id);

      const token = getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      // 
      const url = `/api/download/${id}/download`;

      const res = await fetch(requestUrl, {
        method: "GET",
        headers: { ...headers, accept: "*/*" },
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `HTTP ${res.status}`);
      }

      const blob = await res.blob();

      // Lấy filename từ header
      const cd = res.headers.get("content-disposition");
      let filename = downloadItem.fileName || "download_file";

      if (cd) {
        const utf8Match = cd.match(/filename\*=UTF-8''([^;]+)/);
        const normalMatch = cd.match(/filename="?([^\";]+)"?/);

        if (utf8Match) filename = decodeURIComponent(utf8Match[1]);
        else if (normalMatch) filename = normalMatch[1];
      }

      // Tải file
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      a.remove();
      URL.revokeObjectURL(blobUrl);

    } catch (err: any) {
      console.error("Download error:", err);
      alert(`Tải xuống thất bại: ${err?.message || err}`);
    } finally {
      setDownloadingId(null);
    }
  };

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const reportRes = await axios.get(`/api/DataPackage/report/${userId}`);
        setReport(reportRes.data);

        const purchaseRes = await axios.get(
          `/api/DataPackage/user-data/${userId}`
        );
        setPurchases(purchaseRes.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Quản Lý Đơn Mua
        </h2>
        <p className="text-muted-foreground">
          Quản lý các gói dữ liệu đã mua
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Tổng gói dữ liệu"
          value={report?.totalPackage || purchases.length}
          icon={Package}
          change={`${report?.newPackageThisMonth || 0} new this month`}
          changeType="neutral"
        />
        <StatCard
          title="Tổng file"
          value={report?.totalDownload || purchases.reduce((sum, p) => sum + p.totalDownloads, 0)}
          icon={Download}
          change={`${report?.totalRemaining || 0} remaining`}
          changeType="neutral"
        />
        <StatCard
          title="Trạng thái"
          value={report?.activeCount || purchases.filter(p => p.status === "Purchased").length}
          icon={FileText}
          change={`${report?.expiredCount || 0} expired`}
          changeType="neutral"
        />
      </div>

      {/* PURCHASE TABLE */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle>Gói dữ liệu đã mua</CardTitle>
          <CardDescription>
            Danh sách các gói dữ liệu bạn đã mua
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Mã giao dịch</TableHead>
                <TableHead>Tên gói dữ liệu</TableHead>
                <TableHead>Nhà cung cấp</TableHead>
                <TableHead>Ngày mua</TableHead>
                <TableHead>Định dạng</TableHead>
                <TableHead>Kích thước</TableHead>
                <TableHead>Số file </TableHead>
                <TableHead>ngày tải gần nhất</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hoạt động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {purchases.length > 0 ? (
                purchases.map((p) => (
                  <>
                    {/* Main Row */}
                    <TableRow key={p.transactionId} className="group">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(p.transactionId)}
                        >
                          {expandedRows.includes(p.transactionId) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>

                      <TableCell className="font-medium">
                        {p.transactionId}
                      </TableCell>

                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium text-foreground truncate">
                            {p.packageName}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>{p.providerName}</TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(p.purchaseDate).toLocaleDateString('vi-VN')}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {p.fileFormat}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {(p.fileSize / 1024 / 1024).toFixed(2)} MB
                      </TableCell>

                      <TableCell>
                        <div className="text-center">
                          <span className="font-medium">{p.totalDownloads}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {p.latestDownloadDate ? (
                          <div className="text-sm">
                            {new Date(p.latestDownloadDate).toLocaleDateString('vi-VN')}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Chưa tải</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            p.status === "Purchased" ? "default" : "secondary"
                          }
                          className="capitalize"
                        >
                          {p.status.toLowerCase()}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2">
                          {/* EXPAND BUTTON */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpansion(p.transactionId)}
                            title="Xem chi tiết downloads"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row - Chi tiết downloads */}
                    {expandedRows.includes(p.transactionId) && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={11} className="p-0">
                          <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-semibold text-lg">Chi tiết Files trong Package</h4>
                              <Badge variant="secondary" className="text-sm">
                                {p.downloads.length} files
                              </Badge>
                            </div>
                            
                            {p.downloads.length > 0 ? (
                              <div className="space-y-3">
                                {p.downloads.map((download, index) => (
                                  <div
                                    key={download.downloadId}
                                    className="flex items-center justify-between p-4 border rounded-lg bg-background shadow-sm"
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center gap-4">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                        <div className="flex-1">
                                          <p className="font-medium text-base mb-1">
                                            {download.fileName}
                                          </p>
                                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                              <Calendar className="h-3 w-3" />
                                              {new Date(download.downloadDate).toLocaleString('vi-VN')}
                                            </span>
                                            <span>
                                              Download count: {download.downloadCount}
                                            </span>
                                            <Badge
                                              variant={download.status === "Active" ? "default" : "secondary"}
                                              className="text-xs"
                                            >
                                              {download.status}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <Button
                                      variant="default"
                                      size="sm"
                                      disabled={downloadingId === download.downloadId}
                                      onClick={() => handleDownload(download)}
                                      className="ml-4"
                                    >
                                      {downloadingId === download.downloadId ? (
                                        <>
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                          Đang tải...
                                        </>
                                      ) : (
                                        <>
                                          <Download className="h-4 w-4 mr-2" />
                                          Tải xuống
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-muted-foreground border rounded-lg bg-background">
                                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                                <p>Không có file nào trong package này</p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="text-center text-muted-foreground py-8"
                  >
                    Không có gói dữ liệu nào
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