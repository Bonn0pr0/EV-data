import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Building2, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div>

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

                    {/* Phone and organization fields removed as they're not in UserInfo interface */}

                    <div className="flex items-center space-x-3">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div className="text-muted-foreground">Vai trò</div>
                        <div className="font-medium">
                          {user.roleId === 1 ? "Admin" : user.roleId === 2 ? "Staff" : "Người dùng"}
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
      
    </div>
  );
}
