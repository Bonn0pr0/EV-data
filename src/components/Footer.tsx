import { BarChart3, Mail, Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                EV Analytics
              </span>
            </div>
            <p className="text-muted-foreground">
              Nền tảng dữ liệu xe điện hàng đầu, kết nối các nhà sản xuất và nhà nghiên cứu trong hệ sinh thái xe điện thông minh.
            </p>
          </div>
          
          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Sản Phẩm</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Thị Trường Dữ Liệu</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Analytics Platform</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API & SDK</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">AI Models</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Tài Nguyên</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Tài Liệu</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Hỗ Trợ</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Trung Tâm Trợ Giúp</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Liên Hệ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Báo Cáo Lỗi</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Đặt Lịch Demo</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-muted-foreground mb-4 md:mb-0">
            © 2024 EV Analytics Marketplace. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;