import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Các trang chính
import Index from "@/pages/Index";
import Market from "@/pages/Market";
import Analytics from "@/pages/Analytics";
import API from "@/pages/API";
import User from "@/pages/User";
import NotFound from "@/pages/NotFound";


function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <Routes>
            {/* Trang Public */}
            <Route path="/" element={<Index />} />
            <Route path="/market" element={<Market />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/api" element={<API />} />

            {/* Trang User (bảo vệ đăng nhập) */}
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <User />
                </ProtectedRoute>
              }
            />



            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Toaster />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
