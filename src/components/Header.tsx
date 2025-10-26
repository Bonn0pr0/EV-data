import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, User, Menu, BarChart3 } from "lucide-react";
import LoginModal from "@/components/LoginModal";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useContext } from "react";


const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/market?search=${encodeURIComponent(searchTerm)}`);
      toast.success(`Tìm kiếm: ${searchTerm}`);
    }
  };

  const handleGetStarted = () => {
    navigate('/market');
    toast.success("Chào mừng bạn đến với EV Analytics!");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EV Analytics
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/market" className="text-foreground hover:text-primary transition-colors">
              Thị Trường
            </Link>
            <Link to="/analytics" className="text-foreground hover:text-primary transition-colors">
              Phân Tích
            </Link>
            <Link to="/api" className="text-foreground hover:text-primary transition-colors">
              API
            </Link>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Tài Liệu
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-muted rounded-lg px-3 py-2 max-w-xs">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <input 
                type="text" 
                placeholder="Tìm kiếm dữ liệu..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-sm outline-none flex-1"
              />
            </form>
                        {user ? (
              <>
                <Link to="/user" className="text-foreground hover:text-primary transition-colors hidden sm:flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{user.username}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex"
                  onClick={() => signOut()}
                >
                  Đăng Xuất
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <User className="h-4 w-4 mr-2" />
                Đăng Nhập
              </Button>
            )}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Header;