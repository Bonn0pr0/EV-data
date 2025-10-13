import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/Statcard";
import { Shield, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Privacy() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Bảo mật & Ẩn danh hóa
        </h1>
        <p className="text-muted-foreground mt-1">Quản lý quyền riêng tư và tuân thủ quy định</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard
          title="Mức độ bảo mật"
          value="98%"
          icon={Shield}
        />
        <StatCard
          title="Dữ liệu đã ẩn danh"
          value="100%"
          icon={CheckCircle}
        />
        <StatCard
          title="Cảnh báo"
          value="0"
          icon={AlertTriangle}
        />
        <StatCard
          title="Tuân thủ"
          value="GDPR/CCPA"
          icon={FileText}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cấu hình ẩn danh hóa dữ liệu</CardTitle>
          <CardDescription>Xóa thông tin định danh cá nhân khỏi dữ liệu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pii">Xóa thông tin cá nhân (PII)</Label>
                <p className="text-sm text-muted-foreground">Tên, địa chỉ, số điện thoại, email</p>
              </div>
              <Switch id="pii" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="location">Làm mờ vị trí GPS</Label>
                <p className="text-sm text-muted-foreground">Giảm độ chính xác vị trí xuống 100m</p>
              </div>
              <Switch id="location" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="vehicle">Ẩn mã định danh xe (VIN)</Label>
                <p className="text-sm text-muted-foreground">Thay thế bằng ID ngẫu nhiên</p>
              </div>
              <Switch id="vehicle" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="timestamp">Làm mờ thời gian</Label>
                <p className="text-sm text-muted-foreground">Làm tròn timestamp lên giờ gần nhất</p>
              </div>
              <Switch id="timestamp" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pattern">Xóa pattern sử dụng</Label>
                <p className="text-sm text-muted-foreground">Tránh nhận diện qua thói quen di chuyển</p>
              </div>
              <Switch id="pattern" defaultChecked />
            </div>
          </div>

          <Button className="w-full bg-gradient-primary hover:opacity-90">
            Áp dụng cấu hình
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tuân thủ GDPR</CardTitle>
            <CardDescription>Quy định bảo vệ dữ liệu châu Âu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quyền truy cập dữ liệu</span>
                <Badge variant="default">Đạt</Badge>
              </div>
              <Progress value={100} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quyền xóa dữ liệu</span>
                <Badge variant="default">Đạt</Badge>
              </div>
              <Progress value={100} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Đồng ý xử lý dữ liệu</span>
                <Badge variant="default">Đạt</Badge>
              </div>
              <Progress value={100} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Thông báo vi phạm</span>
                <Badge variant="default">Đạt</Badge>
              </div>
              <Progress value={100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tuân thủ CCPA</CardTitle>
            <CardDescription>Quy định quyền riêng tư California</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quyền biết thông tin</span>
                <Badge variant="default">Đạt</Badge>
              </div>
              <Progress value={100} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quyền xóa</span>
                <Badge variant="default">Đạt</Badge>
              </div>
              <Progress value={100} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quyền từ chối bán</span>
                <Badge variant="default">Đạt</Badge>
              </div>
              <Progress value={100} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Không phân biệt đối xử</span>
                <Badge variant="default">Đạt</Badge>
              </div>
              <Progress value={100} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử kiểm tra bảo mật</CardTitle>
          <CardDescription>Nhật ký kiểm tra và xác minh</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: "2024-01-15 14:30", action: "Kiểm tra ẩn danh hóa tự động", status: "success", message: "Đã xóa 1,245 PII records" },
              { date: "2024-01-14 09:15", action: "Kiểm tra tuân thủ GDPR", status: "success", message: "100% tuân thủ" },
              { date: "2024-01-13 16:45", action: "Làm mờ vị trí GPS", status: "success", message: "2,890 tọa độ đã làm mờ" },
              { date: "2024-01-12 11:20", action: "Xóa VIN numbers", status: "success", message: "856 VIN đã ẩn danh" },
            ].map((log, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{log.action}</p>
                    <Badge variant="outline">{log.status === "success" ? "Thành công" : "Lỗi"}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{log.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{log.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
