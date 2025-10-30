import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface UserInfo {
  userId?: number;
  username: string;
  email: string;
  token: string;
  roleId?: number;
  
}

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: any }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Đọc session khi reload trang
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const storedUsername = sessionStorage.getItem("username");
    const email = sessionStorage.getItem("email");
    const roleIdStr = sessionStorage.getItem("roleId");
    const roleId = roleIdStr ? parseInt(roleIdStr) : undefined;
    const userIdStr = sessionStorage.getItem("userId");
    const userId = userIdStr ? parseInt(userIdStr) : undefined;
    if (token && storedUsername && email) {
      setUser({ token, username: storedUsername, email, roleId, userId  });
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/Users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.message || "Đăng nhập thất bại!");
        return { error: result.message };
      }

      // ✅ Đổi tên khi destructuring để tránh trùng với biến đầu vào
      const { token, username: returnedUsername, email: returnedEmail,userId, roleId } =
        result.data;

      // ✅ Lưu session
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", userId?.toString() || "");
      sessionStorage.setItem("username", returnedUsername);
      sessionStorage.setItem("email", returnedEmail);
      sessionStorage.setItem("roleId", roleId?.toString() || "");

      setUser({ token, username: returnedUsername, email: returnedEmail, roleId });
      toast.success("Đăng nhập thành công!");
      return { error: null };
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error("Lỗi kết nối máy chủ!");
      return { error: err.message };
    }
  };

  const signOut = () => {
    sessionStorage.clear();
    setUser(null);
    toast.success("Đã đăng xuất!");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
