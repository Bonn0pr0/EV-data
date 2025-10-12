import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, TrendingUp, Zap } from "lucide-react";
import heroImage from "@/assets/hero-ev-analytics.jpg";
import { toast } from "sonner";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleExploreNow = () => {
    navigate('/market');
    toast.success("Chào mừng bạn khám phá thị trường dữ liệu EV!");
  };

  const handleViewDemo = () => {
    navigate('/analytics');
    toast.success("Xem demo các công cụ phân tích!");
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="EV Data Analytics Dashboard" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/20 via-electric-purple/10 to-electric-green/20" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-muted/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Zap className="h-4 w-4 text-electric-blue mr-2" />
            <span className="text-sm font-medium">Nền tảng dữ liệu xe điện hàng đầu</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Chợ Dữ Liệu
            </span>
            <br />
            <span className="text-foreground">Xe Điện Thông Minh</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Khám phá, phân tích và giao dịch dữ liệu xe điện với nền tảng AI hàng đầu. 
            Kết nối các nhà sản xuất, nhà nghiên cứu và nhà đầu tư trong một hệ sinh thái dữ liệu thống nhất.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 shadow-electric text-lg px-8 py-6"
              onClick={handleExploreNow}
            >
              Khám Phá Ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={handleViewDemo}
            >
              Xem Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Database className="h-6 w-6 text-electric-blue mr-2" />
                <span className="text-3xl font-bold text-foreground">500+</span>
              </div>
              <p className="text-muted-foreground">Bộ dữ liệu</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-electric-green mr-2" />
                <span className="text-3xl font-bold text-foreground">1M+</span>
              </div>
              <p className="text-muted-foreground">Điểm dữ liệu</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-electric-purple mr-2" />
                <span className="text-3xl font-bold text-foreground">50+</span>
              </div>
              <p className="text-muted-foreground">Đối tác</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;