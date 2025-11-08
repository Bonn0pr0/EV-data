"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Upload, FileText, Edit, Trash2 } from "lucide-react";
import { StatCard } from "@/components/Statcard";
import { Database, Activity, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,DialogFooter } from "@/components/ui/dialog";

export default function DataSources() {
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

const [datasets, setDatasets] = useState([]);
const [dashboardData, setDashboardData] = useState({
  totalData: 0,
  activeData: 0,
  approvedData: 0,
  pendingData: 0,
});
  const userId = sessionStorage.getItem("userId");
 // detail button 
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

//delete button 
  const [openDelete, setOpenDelete] = useState(false);
const [deleteId, setDeleteId] = useState<number | null>(null);

const handleConfirmDelete = (id: number) => {
  setDeleteId(id);
  setOpenDelete(true);
};
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPackage = {
      packageName,
      description,
      version,
      releaseDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      status: "Pending",
      userId,
      subCategoryName,
      metaData: {
        type: metaType,
        title: metaTitle,
        description: metaDescription,
        keywords: metaKeywords,
        fileFormat,
        fileSize: Number(fileSize),
      },
    };

    try {
      const res = await fetch("/api/DataPackage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPackage),
      });

      if (!res.ok) throw new Error("Không thể tạo mới gói dữ liệu");

      alert("Tạo gói dữ liệu thành công!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Đăng ký thất bại!");
    }
  };

useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const res = await fetch(`/api/DataPackage/dashboard/${userId}`);
      if (!res.ok) throw new Error("Không thể lấy dữ liệu dashboard");
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/DataPackage/user/${userId}`);
      if (!res.ok) throw new Error("Không thể lấy danh sách dataset");
      const data = await res.json();
      setDatasets(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchDashboard();
  fetchUserData();
}, []);





const handleDelete = async (id: number) => {
  if (!deleteId) return;
  try {
    const res = await fetch(`/api/DataPackage/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Xoá thất bại");

    setDatasets((prev) => prev.filter((item) => item.packageId !== deleteId));
    setOpenDelete(false);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Quản lý Nguồn Dữ liệu
          </h1>
          <p className="text-muted-foreground mt-1">Đăng ký và quản lý các bộ dữ liệu của bạn</p>
        </div>

      </div>

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

      {/* Form đăng ký */}
<Card>
  <CardHeader>
    <CardTitle>Đăng ký nguồn dữ liệu mới</CardTitle>
    <CardDescription>Thêm dữ liệu mới vào marketplace</CardDescription>
  </CardHeader>

  <CardContent className="space-y-4">
    <form onSubmit={handleCreate} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="packageName">Tên bộ dữ liệu</Label>
          <Input
            id="packageName"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            placeholder="VD: Dữ liệu pin Tesla Model 3"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="version">Phiên bản</Label>
          <Input
            id="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="v1.0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả chi tiết..."
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="subcategory">Danh mục con</Label>
          <Input
            id="subcategory"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            placeholder="VD: Dữ liệu hành trình xe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="metaType">Loại Metadata</Label>
          <Input
            id="metaType"
            value={metaType}
            onChange={(e) => setMetaType(e.target.value)}
            placeholder="VD: Phân tích, thô, tổng hợp"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaTitle">Tiêu đề Metadata</Label>
        <Input
          id="metaTitle"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          placeholder="VD: Báo cáo dữ liệu pin Tesla"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaDescription">Mô tả Metadata</Label>
        <Textarea
          id="metaDescription"
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          placeholder="VD: Bộ dữ liệu bao gồm các thông tin chi tiết về hiệu suất pin..."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="metaKeywords">Từ khóa Metadata</Label>
          <Input
            id="metaKeywords"
            value={metaKeywords}
            onChange={(e) => setMetaKeywords(e.target.value)}
            placeholder="VD: pin, điện, xe hơi, Tesla"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fileFormat">Định dạng dữ liệu</Label>
          <Input
            id="fileFormat"
            value={fileFormat}
            onChange={(e) => setFileFormat(e.target.value)}
            placeholder="VD: CSV, JSON"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fileSize">Kích thước tệp (MB)</Label>
        <Input
          id="fileSize"
          type="number"
          value={fileSize}
          onChange={(e) => setFileSize(e.target.value)}
          placeholder="VD: 200"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90">
          Đăng ký
        </Button>
      </div>
    </form>
  </CardContent>
</Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Dữ liệu đã đăng ký</CardTitle>
            <div className="flex items-center gap-2">
              <Input placeholder="Tìm kiếm..." className="w-64" />
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
                <TableHead>Trạng thái</TableHead>
                <TableHead>Lượt tải</TableHead>
                <TableHead>Doanh thu</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasets.map((dataset) => (
                <TableRow key={dataset.packageId}>
                   <TableCell className="font-medium">{dataset.packageName}</TableCell>
  <TableCell>{dataset.description}</TableCell>
  <TableCell>{dataset.fileSize}</TableCell>
  <TableCell>
    {/* Đổi hiển thị trạng thái ở đây */}
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
  <TableCell>{dataset.downloadCount}</TableCell>
  <TableCell className="font-semibold text-success">{dataset.revenueCount} VND</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/* <Button variant="ghost" size="icon" onClick={() => handleViewDetail(dataset.packageId)}>
                        <FileText className="h-4 w-4" />
                      </Button> */}

                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
          <p className="text-gray-500 font-medium mb-1">Mô tả : {selectedPackage.description}</p>
        </div>

        <div>
          <p className="text-gray-500 font-medium mb-1">Version : {selectedPackage.version}</p>
        </div>

        <div>
          <p className="text-gray-500 font-medium mb-1">Ngày phát hành :
         
            {new Date(selectedPackage.releaseDate).toLocaleDateString("vi-VN")}
          </p>
        </div>

        <div>
          <p className="text-gray-500 font-medium mb-1">Cập nhật lần cuối : {new Date(selectedPackage.lastUpdate).toLocaleDateString("vi-VN")}
          </p>
        </div>

        <div>
          <p className="text-gray-500 font-medium mb-1">Trạng thái : 
          <span
            className={`px-2 py-1 rounded text-xs font-medium border
              ${selectedPackage.status === "Approved" ? "bg-green-100 text-green-700 border-green-300" : ""}
              ${selectedPackage.status === "Pending" ? "bg-yellow-100 text-yellow-700 border-yellow-300" : ""}
              ${selectedPackage.status === "Active" ? "bg-blue-100 text-blue-700 border-blue-300" : ""}
            `}
          >
            {selectedPackage.status === "Active"
              ? "Hoạt động"
              : selectedPackage.status === "Approved"
              ? "Đã phê duyệt"
              : "Chờ duyệt"}
          </span> </p>
        </div>

        <div>
          <p className="text-gray-500 font-medium mb-1">User ID : {selectedPackage.userId}</p>
        </div>

        <div>
          <p className="text-gray-500 font-medium mb-1">Subcategory : {selectedPackage.subcategoryId}</p>
        </div>

        <div>
          <p className="text-gray-500 font-medium mb-1">Metadata : {selectedPackage.metadataId}</p>
        
        </div>

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
      <Button variant="destructive" onClick={() => handleDelete(deleteId)}>
        Xoá
      </Button>
    </div>
  </DialogContent>
</Dialog>



    </div>
  );
}
