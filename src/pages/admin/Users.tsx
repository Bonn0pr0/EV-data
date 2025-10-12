import { useState } from "react";
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
import { Search, UserPlus, MoreVertical } from "lucide-react";

const users = [
  { id: 1, name: "Nguyễn Văn A", email: "nguyen.a@example.com", role: "Data Provider", status: "active", datasets: 12 },
  { id: 2, name: "Trần Thị B", email: "tran.b@example.com", role: "Data Consumer", status: "active", datasets: 0 },
  { id: 3, name: "Lê Văn C", email: "le.c@example.com", role: "Partner", status: "active", datasets: 8 },
  { id: 4, name: "Phạm Thị D", email: "pham.d@example.com", role: "Data Provider", status: "pending", datasets: 3 },
  { id: 5, name: "Hoàng Văn E", email: "hoang.e@example.com", role: "Data Consumer", status: "active", datasets: 0 },
];

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý người dùng</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý Data Provider, Data Consumer và đối tác
          </p>
        </div>
        <Button className="bg-gradient-primary shadow-elegant">
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent>
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
                <SelectItem value="provider">Data Provider</SelectItem>
                <SelectItem value="consumer">Data Consumer</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.datasets}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "default" : "secondary"}
                        className={user.status === "active" ? "bg-success" : ""}
                      >
                        {user.status === "active" ? "Hoạt động" : "Chờ duyệt"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
