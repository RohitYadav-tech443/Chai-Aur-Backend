import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../api/users.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
  const stored = localStorage.getItem("user");

  if (!stored || stored === "undefined") {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Invalid user data in localStorage:", error);
    localStorage.removeItem("user");
    return null;
  }
});
  const [loading, setLoading] = useState(true);

  const persistAuth = (authData) => {
    const accessToken = authData?.accessToken;
    const userData = authData?.user;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    const accessToken = response.data?.accessToken;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }

    const userResponse = await getCurrentUser();
    const currentUser = userResponse.data;
    localStorage.setItem("user", JSON.stringify(currentUser));
    setUser(currentUser);

    return response;
  };

  const register = async (formData) => {
    const response = await registerUser(formData);
    return response;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      clearAuth();
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        const currentUser = response.data;
        localStorage.setItem("user", JSON.stringify(currentUser));
        setUser(currentUser);
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user && !!localStorage.getItem("accessToken"),
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
