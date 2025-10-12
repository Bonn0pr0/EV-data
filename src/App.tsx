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

// Các trang trong admin
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Users from "@/pages/admin/Users";
import DataModeration from "@/pages/admin/DataModeration";
import Payments from "@/pages/admin/Payments";
import Security from './pages/admin/Security';
import AdminAnalytics from "@/pages/admin/Analytics"; // tránh trùng tên với trang ngoài


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
            
            {/* Admin layout và các route con */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="data-moderation" element={<DataModeration />} />
              <Route path="payments" element={<Payments />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="security" element={<Security />} />
            </Route>

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
