

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, FileText, Cpu, Cloud, Code, Download, Database, Plug } from "lucide-react";

const Docs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Giới thiệu */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Tài Liệu</span> Sản Phẩm
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Tìm hiểu về nền tảng dữ liệu xe điện EV Analytics – cung cấp giải pháp toàn diện từ quản lý dữ liệu, 
            phân tích AI, đến tích hợp API cho các nhà phát triển.
          </p>
        </section>

        {/* Giới thiệu công ty */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Giới thiệu về EV Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>EV Analytics</strong> là nền tảng tiên phong trong lĩnh vực dữ liệu xe điện tại Việt Nam. 
              Chúng tôi cung cấp hệ sinh thái bao gồm:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Kho dữ liệu phong phú về xe điện, pin và hạ tầng sạc.</li>
              <li>Công cụ phân tích hiệu suất, dự báo thị trường và hành vi người dùng.</li>
              <li>API mở cho phép tích hợp vào ứng dụng, hệ thống quản lý hoặc dashboard riêng.</li>
            </ul>
            <p>
              Với mục tiêu “<em>Data-driven future for EV industry</em>”, EV Analytics giúp doanh nghiệp và nhà phát triển
              ra quyết định nhanh chóng, chính xác dựa trên dữ liệu thực tế.
            </p>
          </CardContent>
        </Card>

        {/* Tài liệu kỹ thuật */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Tài liệu kỹ thuật</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-electric transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Hướng dẫn API
                </CardTitle>
                <CardDescription>Tài liệu REST API và cách sử dụng</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Truy cập tài nguyên dữ liệu xe điện, pin, và trạm sạc qua API mở.
                </p>
                <Button variant="outline" className="w-full">
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-electric transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  SDK & Integration
                </CardTitle>
                <CardDescription>Thư viện hỗ trợ cho nhà phát triển</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Tích hợp dễ dàng với Node.js, Python, hoặc React SDK của chúng tôi.
                </p>
                <Button variant="outline" className="w-full">
                  Tải SDK
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-electric transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Cấu trúc dữ liệu
                </CardTitle>
                <CardDescription>Chi tiết schema & định dạng dữ liệu</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Mô tả chi tiết các bảng dữ liệu, định dạng JSON và cấu trúc trường thông tin.
                </p>
                <Button variant="outline" className="w-full">
                  Xem Schema
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tài liệu tham khảo */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Tài liệu tham khảo & Hỗ trợ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plug className="h-5 w-5 text-primary" />
                  Tích hợp với bên thứ ba
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Google Maps API cho định vị trạm sạc.</li>
                  <li>OpenWeather API để phân tích môi trường hoạt động xe.</li>
                  <li>Cloud Storage (AWS, GCP) cho lưu trữ dữ liệu lớn.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-primary" />
                  Hỗ trợ & Cộng đồng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">
                  Tham gia cộng đồng để nhận hỗ trợ nhanh chóng từ đội ngũ và developer khác.
                </p>
                <ul className="space-y-2">
                  <li>📘 <a href="#" className="text-primary hover:underline">Trung tâm hỗ trợ</a></li>
                  <li>💬 <a href="#" className="text-primary hover:underline">Diễn đàn nhà phát triển</a></li>
                  <li>📧 <a href="mailto:support@evanalytics.vn" className="text-primary hover:underline">support@evanalytics.vn</a></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* CTA cuối trang */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold">Bắt đầu tích hợp EV Analytics ngay hôm nay</h2>
          <p className="text-muted-foreground">
            Khám phá dữ liệu, API và công cụ phân tích để xây dựng giải pháp xe điện thông minh hơn.
          </p>
          <Button size="lg" className="bg-gradient-primary hover:opacity-90">
            Xem Tài Liệu API
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Docs;
