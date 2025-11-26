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

export default function MyPurchases() {
  const [report, setReport] = useState<any>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

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

  
  const handleDownload = async (p: any) => {
    const id = p.downloadId ?? p.packageId;

    if (!id) {
      alert("Không tìm thấy downloadId hoặc packageId để tải xuống");
      return;
    }

    try {
      setDownloadingId(id);

      const token = getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const requestUrl = `${API_BASE}/api/Download/${id}/download`;

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
      let filename = "download_file";

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
          title="Total Packages"
          value={report?.totalPackage || 0}
          icon={Package}
          change={`${report?.newPackageThisMonth || 0} new this month`}
          changeType="neutral"
        />
        <StatCard
          title="Total Downloads"
          value={report?.totalDownload || 0}
          icon={Download}
          change={`${report?.totalRemaining || 0} remaining`}
          changeType="neutral"
        />
        <StatCard
          title="Active Packages"
          value={report?.activeCount || 0}
          icon={FileText}
          change={`${report?.expiredCount || 0} expired`}
          changeType="neutral"
        />
      </div>

      {/* PURCHASE TABLE */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle>Purchased Data Packages</CardTitle>
          <CardDescription>
            Danh sách các gói dữ liệu bạn đã mua
          </CardDescription>
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
                <TableHead>File Size</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {purchases.length > 0 ? (
                purchases.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      {p.packageId}
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
                        {new Date(p.purchaseDate).toLocaleDateString()}
                      </div>
                    </TableCell>

                    <TableCell>{p.fileFormat}</TableCell>

                    <TableCell>
                      {(p.fileSize / 1024 / 1024).toFixed(2)} MB
                    </TableCell>

                    <TableCell>{p.downloadCount}</TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          p.status === "success" ? "default" : "secondary"
                        }
                      >
                        {p.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">

                        {/* DOWNLOAD BUTTON */}
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={
                            p.status !== "success" ||
                            downloadingId === (p.downloadId ?? p.packageId)
                          }
                          onClick={() => handleDownload(p)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>

                        {/* PREVIEW */}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>

                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-muted-foreground"
                  >
                    Không có gói dữ liệu nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </CardContent>
      </Card>

      {/* INSTRUCTIONS */}
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
