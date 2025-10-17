import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoleId?: number; // 1=admin, 2=staff, etc.
}

const ProtectedRoute = ({ children, requiredRoleId }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-4">Đang tải...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

if (requiredRoleId && user.roleId !== requiredRoleId) {
  return <Navigate to="/" replace />;
}
  return <>{children}</>;
};

export default ProtectedRoute;
