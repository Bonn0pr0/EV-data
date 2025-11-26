"use client";
import { useEffect, useState, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, Edit, Trash2, Upload, X, DollarSign } from "lucide-react";
import { StatCard } from "@/components/Statcard";
import { Database, Activity, CheckCircle, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { uploadFileToSupabase, isFileSizeValid, isFileTypeValid } from "@/integrations/supabase/uploadService";

export default function DataSources() {
  // Form fields
  const [packageName, setPackageName] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [metaType, setMetaType] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [fileFormat, setFileFormat] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  

  // Data lists & dashboard
  const [datasets, setDatasets] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState({
    totalData: 0,
    activeData: 0,
    approvedData: 0,
    pendingData: 0,
  });
  const [openPrice, setOpenPrice] = useState(false);
    const [pricePackage, setPricePackage] = useState({
      name: "",
      price: "",
      currency: "VND",
      duration: "",
      accessType: "",
      discount: "0",
    });

  // Add: Open form dialog
  const [openCreate, setOpenCreate] = useState(false);

  // current user
  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

  // Search
  const [search, setSearch] = useState("");

  // Detail dialog
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
const [currentPackageId, setCurrentPackageId] = useState<number | null>(null);

  // Delete dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  // Upload (download file) dialog for attaching a file to a package
  const [openUpload, setOpenUpload] = useState(false);
  const [uploadFileForPackage, setUploadFileForPackage] = useState<File | null>(null);
  const [uploadFileProgress, setUploadFileProgress] = useState(0);
  const [uploadFileError, setUploadFileError] = useState<string | null>(null);

  // Fetch subcategories from external API
  const fetchSubCategories = async () => {
    try {
      const res = await fetch("/api/SubCategory");
      if (!res.ok) throw new Error("Failed to fetch subcategories");
      const data = await res.json();
      setSubCategories(data || []);
    } catch (err) {
      console.error("Error loading subcategories:", err);
      setSubCategories([]);
    }
  };

  // Fetch datasets for current user
  const fetchUserData = async () => {
    try {
      if (!userId) {
        setDatasets([]);
        return;
      }
      const res = await fetch(`/api/DataPackage/user/${userId}`);
      if (!res.ok) throw new Error("Không thể lấy danh sách dataset");
      const data = await res.json();
      setDatasets(data || []);
    } catch (err) {
      console.error(err);
      setDatasets([]);
    }
  };

  // Fetch dashboard metrics
  const fetchDashboard = async () => {
    try {
      if (!userId) return;
      const res = await fetch(`/api/DataPackage/dashboard/${userId}`);
      if (!res.ok) throw new Error("Không thể lấy dữ liệu dashboard");
      const data = await res.json();
      setDashboardData(data || { totalData: 0, activeData: 0, approvedData: 0, pendingData: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubCategories();
    fetchUserData();
    fetchDashboard();
  }, [userId]);

  // Create new data package
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload file nếu có chọn
    let fileUrl: string | null = null;
    if (selectedFile) {
      if (!isFileSizeValid(selectedFile, 100)) {
        alert("Kích thước file không được vượt quá 100 MB");
        return;
      }

      if (!isFileTypeValid(selectedFile)) {
        alert("Định dạng file không được hỗ trợ. Vui lòng chọn: CSV, JSON, XLSX, TXT, PDF, ZIP");
        return;
      }

        setUploadProgress(10);
        const res = await uploadFileToSupabase(selectedFile, userId!);

        if (!res) {
          console.error("[DataSources] Upload failed - no response object");
          setFileUploadError("No response from upload service");
          alert("Không thể upload file. Vui lòng kiểm tra console (F12) để xem chi tiết lỗi.");
          setUploadProgress(0);
          return;
        }

        if (res.error) {
          console.error("[DataSources] Upload failed:", res.error);
          setFileUploadError(res.error);
          alert(`Không thể upload file: ${res.error}. Vui lòng kiểm tra console (F12) để xem chi tiết.`);
          setUploadProgress(0);
          return;
        }

        const filePublicUrl = res.publicUrl;
        setUploadedFileUrl(filePublicUrl);
        fileUrl = filePublicUrl;
        setUploadProgress(100);
        console.log("[DataSources] Upload success:", fileUrl);
    }

    const newPackage = {
      packageName,
      description,
      version,
      releaseDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      status: "Pending",
      userId,
      subCategoryName,
      fileUrl: fileUrl || null,
      metaData: {
        type: metaType,
        title: metaTitle,
        description: metaDescription,
        keywords: metaKeywords,
        fileFormat,
        fileSize: fileSize ? Number(fileSize) : 0,
      },
    };

    try {
      const res = await fetch("/api/DataPackage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPackage),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Không thể tạo mới gói dữ liệu");
      }

      await fetchUserData();
      await fetchDashboard();

      // reset form
      setPackageName("");
      setDescription("");
      setVersion("");
      setSubCategoryName("");
      setMetaType("");
      setMetaTitle("");
      setMetaDescription("");
      setMetaKeywords("");
      setFileFormat("");
      setFileSize("");
      setSelectedFile(null);
      setUploadProgress(0);
      setUploadedFileUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      setOpenCreate(false);

      alert("Tạo gói dữ liệu thành công!");
    } catch (err) {
      console.error(err);
      alert("Đăng ký thất bại!");
    } finally {
      setUploadProgress(0);
    }
  };

  // View detail
  const handleViewDetail = async (id: number) => {
    try {
      const res = await fetch(`/api/DataPackage/${id}`);
      if (!res.ok) throw new Error("Lấy chi tiết thất bại");
      const data = await res.json();
      setSelectedPackage(data);
      setOpenDetail(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Open edit modal and populate fields
  // Open pricing dialog
  const handleOpenPrice = (pkg: any) => {
    setSelectedPackage(pkg);
    setCurrentPackageId(pkg.packageId);
    setPricePackage({
      name: "",
      price: "",
      currency: "VND",
      duration: "",
      accessType: "",
      discount: "0",
    });
    setOpenPrice(true);
  };

  // Open upload dialog (attach file via /api/Download/with-file)
  const handleOpenUpload = (pkg: any) => {
    setSelectedPackage(pkg);
    setCurrentPackageId(pkg.packageId);
    setUploadFileForPackage(null);
    setUploadFileProgress(0);
    setUploadFileError(null);
    setOpenUpload(true);
  };

  const handleUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setUploadFileForPackage(f);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPackageId) {
      alert("Không xác định được gói dữ liệu!");
      return;
    }
    if (!uploadFileForPackage) {
      alert("Vui lòng chọn tệp để tải lên");
      return;
    }

    setUploadFileProgress(10);
    try {
      const fd = new FormData();
      fd.append("PackageId", String(currentPackageId));
      fd.append("File", uploadFileForPackage, uploadFileForPackage.name);

      const res = await fetch("/api/Download/with-file", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Upload thất bại");
      }

      const data = await res.json();
      console.log("Upload download response:", data);
      alert("Tạo download thành công");
      setUploadFileProgress(100);
      setOpenUpload(false);
      setUploadFileForPackage(null);
      // Refresh list if needed
      await fetchUserData();
    } catch (err: any) {
      console.error(err);
      setUploadFileError(err?.message || String(err));
      alert("Tải tệp thất bại. Kiểm tra console để biết chi tiết.");
    } finally {
      setUploadFileProgress(0);
    }
  };

  // Save pricing
  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPackageId) {
      alert("Không xác định được gói dữ liệu!");
      return;
    }

    // Lấy tên package từ selectedPackage
    const packageNameValue = selectedPackage?.packageName || "";

    // Tạo body request theo format của backend
    const requestBody = {
      planName: pricePackage.name,
      price: Number(pricePackage.price),
      currency: pricePackage.currency,
      duration: Number(pricePackage.duration),
      accessType: pricePackage.accessType,
      packageName: packageNameValue, // Tự động lấy từ dataset đã chọn
      discount: Number(pricePackage.discount)
    };

    try {
      const res = await fetch("/api/PricingPlan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error("Không thể tạo gói giá");
      }

      const data = await res.json();
      console.log("Kết quả:", data);
      alert("Đã lưu giá cho gói dữ liệu thành công!");
      setOpenPrice(false);
      
      // Reset form
      setPricePackage({
        name: "",
        price: "",
        currency: "VND",
        duration: "",
        accessType: "",
        discount: "0",
      });
      setCurrentPackageId(null);
      setSelectedPackage(null);
    } catch (err) {
      console.error(err);
      alert("Lưu giá thất bại! Vui lòng thử lại.");
    }
  };

  // Prepare delete
  const handleConfirmDelete = (id: number) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  // Execute delete
  const handleDelete = async (idParam?: number | null) => {
    const idToDelete = idParam ?? deleteId;
    if (!idToDelete) return;
    try {
      console.debug("Deleting package", idToDelete);
      const res = await fetch(`/api/DataPackage/${idToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Delete failed:", text);
        alert(`Xoá thất bại: ${text || res.statusText}`);
        return;
      }

      // success
      setDatasets((prev) => prev.filter((item) => item.packageId !== idToDelete));
      setOpenDelete(false);
      setDeleteId(null);
      alert("Xoá gói dữ liệu thành công");
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Xoá thất bại. Kiểm tra console để biết chi tiết.");
    }
  };

  // Filter datasets by search
  const filteredDatasets = datasets.filter((item) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;

    const packName = (item.packageName ?? "").toLowerCase();
    const subName =
      (item.subCategoryName ??
        item.subcategoryName ??
        item.subcategory?.subcategoryName ??
        item.subcategory?.subCategoryName ??
        "").toLowerCase();

    return packName.includes(term) || subName.includes(term);
  });
  

  return (
    <div className="space-y-6">

      {/* Header + Add new */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Quản lý Nguồn Dữ liệu
          </h1>
          <p className="text-muted-foreground mt-1">Đăng ký và quản lý các bộ dữ liệu của bạn</p>
        </div>

        {/* Button mở form */}
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <Button
            className="bg-gradient-primary hover:opacity-90"
            onClick={() => setOpenCreate(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm nguồn dữ liệu
          </Button>

          {/* Dialog chứa form */}
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Đăng ký nguồn dữ liệu mới</DialogTitle>
              <DialogDescription>
                Thêm dữ liệu mới vào marketplace
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4 form-section">

              {/* tên + version */}
              <div className="form-row">
                <label htmlFor="packageName">Tên bộ dữ liệu</label>
                <Input
                  id="packageName"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  required
                />
                <label htmlFor="version">Phiên bản</label>
                <Input
                  id="version"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                />
              </div>

              {/* desc */}
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* sub + meta type */}
              <div className="form-row">
                <label>Danh mục con</label>
                <Select onValueChange={(val) => setSubCategoryName(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục con" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map((item: any) => (
                      <SelectItem
                        key={item.subcategoryId ?? item.subCategoryId}
                        value={item.subcategoryName}
                      >
                        {item.subcategoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <label htmlFor="metaType">Loại Metadata</label>
                <Input
                  id="metaType"
                  value={metaType}
                  onChange={(e) => setMetaType(e.target.value)}
                />
              </div>

              {/* meta title */}
              <div className="form-row" style={{ alignItems: 'start' }}>
                <label htmlFor="metaTitle">Tiêu đề Metadata</label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                />

                <label htmlFor="metaDescription">Mô tả Metadata</label>
                <Textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                />
              </div>

              {/* keywords + fileformat */}
              <div className="form-row">
                <label htmlFor="metaKeywords">Từ khóa Metadata</label>
                <Input
                  id="metaKeywords"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                />

                <label htmlFor="fileFormat">Định dạng dữ liệu</label>
                <Input
                  id="fileFormat"
                  value={fileFormat}
                  onChange={(e) => setFileFormat(e.target.value)}
                />
              </div>

              {/* file size */}
              <div className="form-row">
                <label htmlFor="fileSize">Kích thước tệp (MB)</label>
                <Input
                  id="fileSize"
                  type="number"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                />
              </div>

              

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={uploadProgress > 0 && uploadProgress < 100}
              >
                {uploadProgress > 0 && uploadProgress < 100 ? "Đang tải lên..." : "Đăng ký"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Pricing dialog */}
        <Dialog open={openPrice} onOpenChange={setOpenPrice}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Cập nhật giá - {selectedPackage?.packageName}</DialogTitle>
              <DialogDescription>Thiết lập giá và điều khoản cho gói dữ liệu này</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSavePrice} className="space-y-4">
              {/* Plan name + Price */}
              <div className="form-row">
                <label htmlFor="planName">Tên gói giá</label>
                <Input
                  id="planName"
                  value={pricePackage.name}
                  onChange={(e) => setPricePackage({ ...pricePackage, name: e.target.value })}
                  placeholder="VD: Gói cơ bản, Gói Premium"
                  required
                />

                <label htmlFor="price">Giá (VND)</label>
                <Input
                  id="price"
                  type="number"
                  value={pricePackage.price}
                  onChange={(e) => setPricePackage({ ...pricePackage, price: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>

              {/* Duration + Access Type */}
              <div className="form-row">
                <label htmlFor="duration">Thời hạn (ngày)</label>
                <Input
                  id="duration"
                  type="number"
                  value={pricePackage.duration}
                  onChange={(e) => setPricePackage({ ...pricePackage, duration: e.target.value })}
                  placeholder="30"
                  required
                />

                <label htmlFor="accessType">Loại truy cập</label>
                <Input
                  id="accessType"
                  value={pricePackage.accessType}
                  onChange={(e) => setPricePackage({ ...pricePackage, accessType: e.target.value })}
                  placeholder="VD: Mua một lần, Đăng ký"
                  required
                />
              </div>

              {/* Discount + Currency */}
              <div className="form-row">
                <label htmlFor="discount">Chiết khấu (%)</label>
                <Input
                  id="discount"
                  type="number"
                  value={pricePackage.discount}
                  onChange={(e) => setPricePackage({ ...pricePackage, discount: e.target.value })}
                  placeholder="0"
                />

                <label htmlFor="currency">Tiền tệ</label>
                <Select onValueChange={(val) => setPricePackage({ ...pricePackage, currency: val })}>
                  <SelectTrigger>
                    <SelectValue defaultValue="VND" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VND">VND</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setOpenPrice(false)}>Huỷ</Button>
                <Button type="submit" className="bg-gradient-primary hover:opacity-90">Lưu giá</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        {/* Upload (attach file) dialog */}
        <Dialog open={openUpload} onOpenChange={setOpenUpload}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Đính kèm tệp cho: {selectedPackage?.packageName}</DialogTitle>
              <DialogDescription>Gửi tệp kèm PackageId tới API /api/Download/with-file</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="uploadFile">Chọn tệp</Label>
                <Input id="uploadFile" type="file" onChange={handleUploadFileChange} accept="*/*" />
                <p className="text-xs text-gray-500">Gửi tệp sẽ tạo bản ghi Download và trả về fileUrl</p>
              </div>

              {uploadFileForPackage && (
                <div className="p-3 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">{uploadFileForPackage.name}</p>
                    <p className="text-xs text-blue-700">{(uploadFileForPackage.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setUploadFileForPackage(null)}>Huỷ</Button>
                </div>
              )}

              {uploadFileProgress > 0 && uploadFileProgress < 100 && (
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${uploadFileProgress}%` }} />
                </div>
              )}

              {uploadFileError && (
                <div className="mt-2 p-3 rounded bg-red-50 text-red-700 border border-red-100">
                  <strong>Lỗi:</strong> {uploadFileError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setOpenUpload(false)}>Huỷ</Button>
                <Button type="submit" className="bg-gradient-primary hover:opacity-90" disabled={!uploadFileForPackage}>Gửi tệp</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Tổng dữ liệu"
          value={`${dashboardData.totalData}`}
          icon={Database}
          change={`${dashboardData.totalData} bộ dữ liệu`}
          changeType="positive"
        />
        <StatCard
          title="Đang hoạt động"
          value={`${dashboardData.activeData}`}
          icon={Activity}
          change={`${dashboardData.activeData} đang hoạt động`}
          changeType="positive"
        />
        <StatCard
          title="Đã phê duyệt"
          value={`${dashboardData.approvedData}`}
          icon={CheckCircle}
          change={`${dashboardData.approvedData} đã duyệt`}
        />
        <StatCard
          title="Chờ duyệt"
          value={`${dashboardData.pendingData}`}
          icon={Clock}
          change={`${dashboardData.pendingData} đang chờ`}
        />
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Dữ liệu đã đăng ký</CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Tìm kiếm..."
                className="w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên dữ liệu</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Dung lượng</TableHead>
                <TableHead>Danh mục con</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Lượt tải</TableHead>
                <TableHead>Giá gói</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredDatasets.map((dataset: any) => {
                const subName =
                  dataset.subCategoryName ??
                  dataset.subcategoryName ??
                  dataset.subcategory?.subcategoryName ??
                  dataset.subcategory?.subCategoryName ??
                  "—";

                return (
                  <TableRow key={dataset.packageId}>
                    <TableCell className="font-medium">
                      {dataset.packageName}
                    </TableCell>

                    <TableCell>{dataset.description}</TableCell>

                    <TableCell>
                      {dataset.fileSize ?? dataset.metaData?.fileSize ?? "—"}
                    </TableCell>

                    <TableCell>{subName}</TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          dataset.status === "Active"
                            ? "default"
                            : dataset.status === "Approved"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {dataset.status === "Active"
                          ? "Hoạt động"
                          : dataset.status === "Approved"
                          ? "Đã phê duyệt"
                          : "Chờ duyệt"}
                      </Badge>
                    </TableCell>

                    <TableCell>{dataset.downloadCount ?? 0}</TableCell>

                    <TableCell className="font-semibold text-success">
                      {(dataset.price ?? 0).toLocaleString('vi-VN')} VND
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetail(dataset.packageId)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenPrice(dataset)}
                          aria-label="Cập nhật giá"
                          title="Cập nhật giá"
                        >
                          <DollarSign className="h-4 w-4 text-yellow-600" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleConfirmDelete(dataset.packageId)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <Dialog open={openDetail} onOpenChange={setOpenDetail}>
        <DialogContent className="max-w-xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg font-semibold">
              {selectedPackage?.packageName}
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết gói dữ liệu
            </DialogDescription>
          </DialogHeader>

          {selectedPackage && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2">
                <p className="text-gray-500 font-medium mb-1">
                  Mô tả : {selectedPackage.description}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-medium mb-1">
                  Version : {selectedPackage.version}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-medium mb-1">
                  Ngày phát hành :{" "}
                  {selectedPackage.releaseDate
                    ? new Date(selectedPackage.releaseDate).toLocaleDateString(
                        "vi-VN"
                      )
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 font-medium mb-1">
                    Cập nhật lần cuối :{" "}
                    {selectedPackage.lastUpdate
                      ? new Date(selectedPackage.lastUpdate).toLocaleDateString(
                          "vi-VN"
                        )
                      : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium mb-1">
                    Trạng thái :
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border
                      ${
                        selectedPackage.status === "Approved"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : ""
                      }
                      ${
                        selectedPackage.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                          : ""
                      }
                      ${
                        selectedPackage.status === "Active"
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : ""
                      }
                    `}
                    >
                      {selectedPackage.status === "Active"
                        ? "Hoạt động"
                        : selectedPackage.status === "Approved"
                        ? "Đã phê duyệt"
                        : "Chờ duyệt"}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium mb-1">
                    User ID : {selectedPackage.userId}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium mb-1">
                    Subcategory :{" "}
                    {selectedPackage.subCategoryName ??
                      selectedPackage.subcategoryName ??
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 font-medium mb-1">
                    Metadata :{" "}
                    {selectedPackage.metaData
                      ? selectedPackage.metaData.title
                      : selectedPackage.metadataId ?? "—"}
                  </p>
                </div>

                {/* File URL */}
                {selectedPackage.fileUrl && (
                  <div className="col-span-2">
                    <p className="text-gray-500 font-medium mb-2">Tệp dữ liệu:</p>
                    <a
                      href={selectedPackage.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-sm"
                    >
                      <FileText className="h-4 w-4" />
                      Tải xuống tệp
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setOpenDetail(false)}
                className="px-4 py-2 text-sm rounded-md border hover:bg-gray-50 transition"
              >
                Đóng
              </button>
            </div>
          </DialogContent>
        </Dialog>
  
        {/* Delete confirm dialog */}
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-red-600">Xác nhận xoá</DialogTitle>
              <DialogDescription>
                Bạn có chắc muốn xoá gói dữ liệu này? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
  
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setOpenDelete(false)}>
                Huỷ
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(deleteId)}
                disabled={!deleteId}
              >
                Xoá
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
