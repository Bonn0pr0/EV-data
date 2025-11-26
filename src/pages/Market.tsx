import { useState, useEffect  } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Download, Eye, Calendar, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {Filter, Battery, Car, Zap, TrendingUp,DollarSign,FileText, Database, BarChart3, ShoppingCart, AlertCircle } from "lucide-react";

const Market = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const { user } = useAuth();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);


  const [datasets, setDatasets] = useState([]);

  //  Fetch API khi load trang
  useEffect(() => {
    fetch("/api/DataPackage/AllPackage", {
      method: "GET",
      headers: { Accept: "*/*" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        setDatasets(data);
      })
      .catch((err) => console.error("Lỗi khi gọi API:", err));
  }, []);
  const filteredDatasets = datasets.filter((item) => {
    const matchesSearch =
      item.packageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.providerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Thị Trường</span> Dữ Liệu
          </h1>
          <p className="text-muted-foreground text-lg">
            Khám phá và mua các bộ dữ liệu xe điện chất lượng cao
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              <SelectItem value="Regions">Khu vực</SelectItem>
              <SelectItem value="Vehicles">Phương tiện</SelectItem>
              <SelectItem value="Batterys">Pin</SelectItem>
            </SelectContent>
          </Select>
          {/* <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Phổ biến nhất</SelectItem>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="rating">Đánh giá cao</SelectItem>
              <SelectItem value="price">Giá</SelectItem>
            </SelectContent>
          </Select> */}
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDatasets.map((dataset) => (
            <Card key={dataset.id} className="group hover:shadow-electric transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {dataset.packageName}
                </CardTitle>
                <div className="text-sm font-medium text-primary">
                  by {dataset.providerName}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    {dataset.type && (
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {dataset.type}
                        </Badge>
                      </div>
                    )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                    <span className="font-medium">{dataset.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Download className="h-4 w-4 text-muted-foreground mr-1" />
                    <span>{dataset.downloadCount}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                    <span>{dataset.createAt}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <span className="text-lg font-bold text-foreground">{dataset.pricingPlan.toLocaleString('vi-VN')} VND</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-primary hover:opacity-90"
                    onClick={() => {
                      if (!user) {
                        // not logged in -> open login modal
                        setIsLoginModalOpen(true);
                        return;
                      }

                      // logged in -> show details dialog
                      setSelectedDataset(dataset);
                      setDetailOpen(true);
                    }}
                  >
                    Xem Chi Tiết
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDatasets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Không tìm thấy dataset nào phù hợp với bộ lọc của bạn.</p>
          </div>
        )}
      

      {/* Dataset Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">CHI TIẾT GÓI DỮ LIỆU</DialogTitle>
          </DialogHeader>

          {selectedDataset ? (
            <div className="space-y-6">
              {/* THÔNG TIN CƠ BẢN */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    THÔNG TIN CƠ BẢN
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tên gói dữ liệu</p>
                      <p className="font-medium">{selectedDataset.packageName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nhà cung cấp</p>
                      <p className="font-medium">{selectedDataset.providerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Đánh giá</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(selectedDataset.rating)
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                        <span className="ml-2 font-medium">{selectedDataset.rating}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Giá</p>
                      <p className="font-bold text-lg text-success">{selectedDataset.pricingPlan.toLocaleString('vi-VN')} VND</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Loại</p>
                      <Badge variant="secondary">{selectedDataset.type}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* MÔ TẢ */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    MÔ TẢ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedDataset.description}
                  </p>
                </CardContent>
              </Card>

              {/* THÔNG TIN KỸ THUẬT */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    THÔNG TIN KỸ THUẬT
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Định dạng</p>
                      <p className="font-medium">{selectedDataset.fileFormat}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Kích thước</p>
                      <p className="font-medium">{selectedDataset.fileSize}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phiên bản</p>
                      <p className="font-medium">{selectedDataset.version}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* THỜI GIAN */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    THỜI GIAN
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày tạo</p>
                      <p className="font-medium">{selectedDataset.createAt}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày cập nhật</p>
                      <p className="font-medium">{selectedDataset.updateAt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* THỐNG KÊ */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    THỐNG KÊ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Lượt tải</p>
                      <p className="font-medium flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        {selectedDataset.downloadCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Đã thêm giỏ hàng</p>
                      <p className="font-medium flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        {selectedDataset.cartCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                {/* <Button className="bg-gradient-primary flex-1 min-w-[150px]">
                  <Download className="h-4 w-4 mr-2" />
                  Mua ngay
                </Button> */}
                <Button
                  variant="outline"
                  className="flex-1 min-w-[150px]"
                  onClick={async () => {
                    if (!user) {
                      setIsLoginModalOpen(true);
                      return;
                    }

                    try {
                      const response = await fetch("/api/Cart", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Accept: "*/*",
                        },
                        body: JSON.stringify({
                          userId: user.userId, 
                          planId: selectedDataset.princingPlanId, 
                          quantity: 1, 
                        }),
                      });

                      if (!response.ok) throw new Error("Lỗi khi thêm vào giỏ hàng");

                      const result = await response.json();
                      toast.success(result.message || "Đã thêm vào giỏ hàng!");
                    } catch (err) {
                      console.error(err);
                      toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
                    }
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Thêm vào giỏ
                </Button>

                <Button variant="outline" className="flex-1 min-w-[150px]">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Báo cáo
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Không có dữ liệu
            </div>
          )}
        </DialogContent>
      </Dialog>

        {/* Login modal (open when user is not logged in and clicks detail) */}
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </main>
      <Footer />
    </div>
  );
};

export default Market;