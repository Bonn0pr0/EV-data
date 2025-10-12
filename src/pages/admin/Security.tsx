import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shield, Lock, Key, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Security() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bảo mật & Quyền riêng tư</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý mã hóa dữ liệu, truy cập API và tuân thủ quy định bảo mật
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-success/10 p-3 rounded-full w-fit mx-auto mb-3">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">99.9%</h3>
              <p className="text-sm text-muted-foreground mt-1">Uptime bảo mật</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-3">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">256-bit</h3>
              <p className="text-sm text-muted-foreground mt-1">Mã hóa AES</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="bg-warning/10 p-3 rounded-full w-fit mx-auto mb-3">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">3</h3>
              <p className="text-sm text-muted-foreground mt-1">Cảnh báo bảo mật</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Cài đặt mã hóa dữ liệu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-medium text-foreground">Mã hóa dữ liệu khi lưu trữ</h4>
                <p className="text-sm text-muted-foreground mt-1">AES-256 encryption</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-medium text-foreground">Mã hóa dữ liệu khi truyền tải</h4>
                <p className="text-sm text-muted-foreground mt-1">TLS 1.3</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-medium text-foreground">Sao lưu tự động</h4>
                <p className="text-sm text-muted-foreground mt-1">Hàng ngày lúc 2:00 AM</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Quản lý API Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-foreground">Production API Key</h4>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    pk_live_••••••••••••••••
                  </p>
                </div>
                <Badge className="bg-success">Hoạt động</Badge>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Xem
                </Button>
                <Button variant="outline" size="sm">Làm mới</Button>
                <Button variant="outline" size="sm" className="text-destructive">Vô hiệu hóa</Button>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-foreground">Development API Key</h4>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    pk_test_••••••••••••••••
                  </p>
                </div>
                <Badge className="bg-success">Hoạt động</Badge>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Xem
                </Button>
                <Button variant="outline" size="sm">Làm mới</Button>
                <Button variant="outline" size="sm" className="text-destructive">Vô hiệu hóa</Button>
              </div>
            </div>

            <Button className="w-full" variant="outline">
              <Key className="h-4 w-4 mr-2" />
              Tạo API Key mới
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Tuân thủ quy định & Chứng nhận
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <h4 className="font-medium text-foreground">GDPR</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Tuân thủ quy định bảo vệ dữ liệu EU
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <h4 className="font-medium text-foreground">ISO 27001</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Chứng nhận quản lý an ninh thông tin
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <h4 className="font-medium text-foreground">SOC 2 Type II</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Kiểm toán bảo mật hàng năm
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
