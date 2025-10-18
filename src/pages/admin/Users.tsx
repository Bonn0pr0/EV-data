import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  // 👉 Form thêm user
  const [newUser, setNewUser] = useState({
    fullName: "",
    userName:"",
    email: "",
    phone:"",
    password:"",
    organization:"",
    roleName: "consumer",
    status: "Active",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/Users/Infor");
        if (!response.ok) throw new Error("Lỗi khi tải dữ liệu người dùng");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Fetch users error:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: number) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa tài khoản này?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/Users/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Xóa tài khoản thất bại");

      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert("Xóa tài khoản thành công ✅");
    } catch (error) {
      console.error("Lỗi khi xóa user:", error);
      alert("Xóa tài khoản thất bại ❌");
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch("/api/Users/Create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error("Thêm người dùng thất bại");

      const createdUser = await response.json();
      setUsers((prev) => [...prev, createdUser]);
      setOpenDialog(false);
      setNewUser({ fullName: "", userName:"",  email: "", phone :"", password:"", organization :"", roleName: "consumer", status: "Active" });
      alert("Thêm người dùng thành công ✅");
    } catch (error) {
      console.error("Lỗi khi thêm user:", error);
      alert("Thêm người dùng thất bại ❌");
    }
  };

  // 👉 Lọc user theo search + role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      user.roleName.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý người dùng</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý Data Provider, Data Consumer và đối tác
          </p>
        </div>
        <Button
          className="bg-gradient-primary shadow-elegant"
          onClick={() => setOpenDialog(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 🔍 Thanh tìm kiếm và lọc */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Lọc theo vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="provider">Data Provider</SelectItem>
                <SelectItem value="consumer">Data Consumer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 📋 Bảng danh sách */}
          <div className="rounded-md border border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Bộ dữ liệu</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.roleName}</Badge>
                      </TableCell>
                      <TableCell>{user.dataSet ?? 0}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.status === "Active"
                              ? "!bg-green-100 !text-green-800 hover:!bg-green-200"
                              : "!bg-red-100 !text-red-800 hover:!bg-red-200"
                          }
                        >
                          {user.status === "Active" ? "Hoạt động" : "Ngừng hoạt động"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right flex gap-2 justify-end">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Không tìm thấy người dùng
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 🆕 Modal thêm người dùng */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm người dùng mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Họ và tên"
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
            />
            <Input
              placeholder="Tên đăng nhập"
              value={newUser.userName}
              onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })}
            />

            <Input
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <Input
              placeholder="Số điện thoại"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value})}
            />
            <Input
              placeholder="Mật khẩu"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value})}
            />
            <Input
              placeholder="Tổ chức"
              value={newUser.organization}
              onChange={(e) => setNewUser({ ...newUser, organization: e.target.value})}
            />
            <Select
              value={newUser.roleName}
              onValueChange={(val) => setNewUser({ ...newUser, roleName: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Provider">Data Provider</SelectItem>
                <SelectItem value="Consumer">Data Consumer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddUser}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
