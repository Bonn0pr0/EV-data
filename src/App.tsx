import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Các trang chính
import Index from "@/pages/Index";
import Market from "@/pages/Market";
import Analytics from "@/pages/Analytics";
import API from "@/pages/API";
import User from "@/components/User";
import NotFound from "@/pages/NotFound";

// Các trang trong admin
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Users from "@/pages/admin/Users";
import DataModeration from "@/pages/admin/DataModeration";
import Payments from "@/pages/admin/Payments";
import AdminAnalytics from "@/pages/admin/Analytics"; // tránh trùng tên với trang ngoài

// Trang dành cho staff
import DataSources from './pages/staff/DataSources';
import Pricing from './pages/staff/Pricing';
import Revenue from './pages/staff/Revenue';
import StaffLayout from './pages/staff/StaffLayout';

//Trang dành cho consumer
import ConsumerLayout from "./pages/consumer/ConsumerLayout";
import Cart from "./pages/consumer/Cart";
import Checkout from "./pages/consumer/Checkout";
import MyPurchases from "./pages/consumer/MyPurchases";
import PaymentMomo from "./pages/consumer/PaymentMomo";
import PaymentVNPay from "./pages/consumer/PaymentVNPay";
import Invoice from "./pages/consumer/Invoice";
import Invoices from "./pages/consumer/Invoices";

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

            {/* Trang Staff (phân quyền staff) */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute requiredRole="staff">
                  <StaffLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DataSources />} />
              <Route path="data-sources" element={<DataSources />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="revenue" element={<Revenue />} />
            </Route>
            

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
            </Route>
            
            <Route path="/consumer" element={<ConsumerLayout />}>
              <Route index element={<MyPurchases />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="purchases" element={<MyPurchases />} />
              <Route path="payment-momo" element={<PaymentMomo />} />
              <Route path="payment-vnpay" element={<PaymentVNPay />} />
              <Route path="invoice/:invoiceId" element={<Invoice />} />
              <Route path="invoices" element={<Invoices />} />
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
