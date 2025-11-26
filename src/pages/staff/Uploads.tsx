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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Package, Upload } from "lucide-react";
import { StatCard } from "@/components/Statcard";

export default function Uploads() {
  const API_BASE = import.meta.env.VITE_API_BASE || "";
  const [report, setReport] = useState<any | null>(null);
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

  const getAuthToken = () => {
    return (
      sessionStorage.getItem("token") ||
      sessionStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      null
    );
  };

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const token = getAuthToken();
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        // list uploads (use API_BASE when configured)
        const listUrl = `${API_BASE || ""}/api/Download/user/${userId}`;
        const res = await axios.get(listUrl, { headers });
        setUploads(res.data || []);

        // optional report endpoint; if not available, this can be omitted on the backend
        try {
          const reportUrl = `${API_BASE || ""}/api/Download/report/${userId}`;
          const r = await axios.get(reportUrl, { headers });
          setReport(r.data || null);
        } catch (e) {
          // ignore missing report endpoint
          setReport(null);
        }
      } catch (error) {
        console.error("Error loading uploads:", error);
        // show server message when available
        const msg = (error as any)?.response?.data || (error as any)?.message || String(error);
        alert(`Không thể tải danh sách uploads. \n${msg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleDownload = async (rec: any) => {
    const id = rec.downloadId ?? rec.id ?? rec.download_id;
    if (!id) {
      alert("Không tìm thấy id để tải xuống");
      return;
    }

    try {
      setDownloadingId(id);
      const token = getAuthToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const requestUrl = `${API_BASE}/api/Download/${id}/download`;
      const res = await fetch(requestUrl, { method: "GET", headers: { ...headers, accept: "*/*" } });
      if (!res.ok) {
        let txt = "";
        try {
          txt = await res.text();
        } catch (_) {
          txt = `HTTP ${res.status}`;
        }
        throw new Error(txt || `Download failed: ${res.status}`);
      }

      const blob = await res.blob();
      const cd = res.headers.get("content-disposition") || "";
      let filename = rec.fileName || rec.fileNameOriginal || rec.fileName || rec.filename || rec.name || `file`;
      if (cd) {
        const rfcMatch = cd.match(/filename\*=(?:UTF-8''|utf-8''|UTF8'')?([^;\n\r]+)/i);
        if (rfcMatch && rfcMatch[1]) {
          try {
            filename = decodeURIComponent(rfcMatch[1].replace(/['\"]/g, ""));
          } catch (_) {
            filename = rfcMatch[1].replace(/['\"]/g, "");
          }
        } else {
          const q = cd.match(/filename=\"?([^\";]+)\"?/i);
          if (q && q[1]) filename = q[1];
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Download error", err);
      alert(`Tải xuống thất bại: ${err?.message ?? err}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const filtered = uploads.filter((u) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    const name = (u.packageName ?? u.fileName ?? u.name ?? "").toString().toLowerCase();
    return name.includes(term);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Uploads</h1>
        <p className="text-muted-foreground mt-1">Danh sách các tệp đã được đính kèm (tạo bởi hành động Upload trên DataSources)</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Total Uploads" value={report?.totalUploads ?? uploads.length} icon={Upload} change="—" />
        <StatCard title="Total Size" value={report?.totalSize ? `${(report.totalSize / 1024 / 1024).toFixed(2)} MB` : "—"} icon={FileText} change="—" />
        <StatCard title="Packages" value={report?.packageCount ?? "—"} icon={Package} change="—" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Uploaded Files</CardTitle>
            <div className="flex items-center gap-2">
              <Input placeholder="Tìm kiếm..." className="w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Download ID</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((u) => (
                  <TableRow key={u.downloadId ?? u.id}>
                    <TableCell className="font-medium">{u.downloadId ?? u.id}</TableCell>
                    <TableCell>{u.packageName ?? u.packageId ?? '—'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate max-w-xs">{u.fileName ?? u.name ?? '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{u.fileSize ? `${(u.fileSize / 1024 / 1024).toFixed(2)} MB` : '—'}</TableCell>
                    <TableCell>{u.createdAt ? new Date(u.createdAt).toLocaleString() : '—'}</TableCell>
                    <TableCell>
                      <Badge variant={u.status === 'success' ? 'default' : 'secondary'}>{u.status ?? '—'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleDownload(u)} disabled={downloadingId === (u.downloadId ?? u.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">{loading ? 'Đang tải...' : 'Không có upload nào'}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
