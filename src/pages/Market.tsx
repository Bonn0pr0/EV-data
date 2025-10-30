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



const Market = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const { user } = useAuth();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);


  const [datasets, setDatasets] = useState([]);

  // ✅ Fetch API khi load trang
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
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Phổ biến nhất</SelectItem>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="rating">Đánh giá cao</SelectItem>
              <SelectItem value="price">Giá</SelectItem>
            </SelectContent>
          </Select>
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
                    <span className="text-lg font-bold text-foreground">{dataset.pricingPlan}</span>
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
      
        {/* Dataset detail dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chi tiết Dataset</DialogTitle>
              <DialogDescription>Thông tin chi tiết về bộ dữ liệu</DialogDescription>
            </DialogHeader>

            {selectedDataset ? (
              <div className="mt-2">
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-2 font-medium">Tiêu đề</td>
                      <td className="py-2">{String(selectedDataset.packageName || "-")}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Nhà cung cấp</td>
                      <td className="py-2">{String(selectedDataset.providerName || "-")}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Đánh giá</td>
                      <td className="py-2">{String(selectedDataset.rating ?? "-")}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Lượt tải</td>
                      <td className="py-2">{String(selectedDataset.downloadCount || "-")}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Lượt xem</td>
                      <td className="py-2">{String(selectedDataset.views || "-")}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Giá</td>
                      <td className="py-2">{String(selectedDataset.pricingPlan || "-")}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Cập nhật</td>
                      <td className="py-2">{String(selectedDataset.createAt || "-")}</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Tags</td>
                      <td className="py-2">{String(selectedDataset.type|| "-")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div>Không có dữ liệu</div>
            )}

            <DialogFooter>
              <div className="w-full flex justify-end">
                <Button variant="outline" onClick={() => setDetailOpen(false)}>Đóng</Button>
              </div>
            </DialogFooter>
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