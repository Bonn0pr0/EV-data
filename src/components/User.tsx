import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Shield, Phone, Building2 } from "lucide-react";

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy userId từ sessionStorage hoặc từ context
    const userId = sessionStorage.getItem("userId") 
    if (!userId) return;

    // Gọi API lấy thông tin người dùng
    fetch(`/api/Users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi khi tải thông tin người dùng");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => console.error("Lỗi API:", err));
  }, [authUser]);

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>Trang hồ sơ người dùng của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          {!user ? (
            <div className="text-center text-muted-foreground py-8">
              Vui lòng đăng nhập để xem thông tin profile.
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{user.username}</div>
                    <div className="text-sm text-muted-foreground">Tài khoản người dùng</div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="text-muted-foreground">Email</div>
                      <div className="font-medium">{user.email || "Chưa cập nhật"}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="text-muted-foreground">Số điện thoại</div>
                      <div className="font-medium">{user.phone || "Chưa cập nhật"}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="text-muted-foreground">Tổ chức</div>
                      <div className="font-medium">{user.organizationId || "Chưa cập nhật"}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="text-muted-foreground">Vai trò</div>
                      <div className="font-medium">
                        {user.roleId === 1
                          ? "Admin"
                          : user.roleId === 2
                          ? "Staff"
                          : user.roleId === 3
                          ? "Consumer"
                          : "Provider"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="outline">Chỉnh sửa profile</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
