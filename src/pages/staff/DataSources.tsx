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
  const mockDatasets = [
    { id: 1, name: "Dữ liệu pin Tesla Model 3", type: "Pin", size: "2.5 GB", status: "active", uploads: 1250, revenue: "45,000,000₫" },
    { id: 2, name: "Hành trình VinFast VF8", type: "Hành trình", size: "1.8 GB", status: "pending", uploads: 0, revenue: "0₫" },
    { id: 3, name: "Dữ liệu sạc nhanh", type: "Sạc", size: "980 MB", status: "active", uploads: 890, revenue: "32,000,000₫" },
    { id: 4, name: "Giao dịch điện năng", type: "Giao dịch", size: "450 MB", status: "active", uploads: 560, revenue: "18,500,000₫" },
  ];

  const [datasets, setDatasets] = useState([]);
// status 
  const pendingCount = datasets.filter(item => item.status === "Pending").length;
  const approvedCount = datasets.filter(item => item.status === "Approved").length; 
  const activeCount = datasets.filter(item => item.status === "Active").length;

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




useEffect(() => {
  const fetchData = async () => {
    const res = await fetch(`/api/DataPackage`);
    const data = await res.json();
    setDatasets(data);
  }; 
  fetchData();
}, []);

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
        <Button className="bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Thêm nguồn dữ liệu
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
      <StatCard
  title="Tổng dữ liệu"
  value={`${datasets.length}`}
  icon={Database}
  change={`${datasets.length} bộ dữ liệu`}
  changeType="positive"
/>

        <StatCard
          title="Đang hoạt động"
          value="3"
          icon={Activity}
          change="75% tỷ lệ hoạt động"
          changeType="positive"
        />
        <StatCard
          title="Đã phê duyệt"
          value="3"
          icon={CheckCircle}
        />
          <StatCard
        title="Chờ duyệt"
        value={`${pendingCount}`}
        icon={Clock}
      />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Đăng ký nguồn dữ liệu mới</CardTitle>
          <CardDescription>Thêm dữ liệu mới vào marketplace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Tên bộ dữ liệu</Label>
              <Input id="name" placeholder="VD: Dữ liệu pin Tesla Model 3" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Loại dữ liệu</Label>
              <Select>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="battery">Dữ liệu pin</SelectItem>
                  <SelectItem value="trip">Hành trình</SelectItem>
                  <SelectItem value="charging">Sạc</SelectItem>
                  <SelectItem value="transaction">Giao dịch điện</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" placeholder="Mô tả chi tiết về bộ dữ liệu..." rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="format">Định dạng dữ liệu</Label>
            <Select>
              <SelectTrigger id="format">
                <SelectValue placeholder="Chọn định dạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="raw">Raw Data (CSV, JSON)</SelectItem>
                <SelectItem value="analyzed">Đã phân tích (Reports, Insights)</SelectItem>
                <SelectItem value="both">Cả hai</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Tải lên dữ liệu
            </Button>
            <Button className="flex-1 bg-gradient-primary hover:opacity-90">
              Đăng ký
            </Button>
          </div>
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
  <TableCell>{dataset.version}</TableCell>
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
  <TableCell>{dataset.uploads}</TableCell>
  <TableCell className="font-semibold text-success">{dataset.revenue}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetail(dataset.packageId)}>
  <FileText className="h-4 w-4" />
</Button>

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
