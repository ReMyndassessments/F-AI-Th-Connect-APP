import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { AdminUser } from "@shared/schema";

interface AdminAuthState {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sessionId: string | null;
}

export function useAdminAuth() {
  const [authState, setAuthState] = useState<AdminAuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    sessionId: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const sessionId = localStorage.getItem("adminSession");
      const storedUser = localStorage.getItem("adminUser");

      if (!sessionId) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          sessionId: null,
        });
        return;
      }

      // Verify session with server
      const response = await fetch("/api/admin/verify", {
        headers: {
          "x-admin-session": sessionId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
          sessionId,
        });
      } else {
        // Session is invalid, clear local storage
        localStorage.removeItem("adminSession");
        localStorage.removeItem("adminUser");
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          sessionId: null,
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("adminSession");
      localStorage.removeItem("adminUser");
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        sessionId: null,
      });
    }
  };

  const logout = async () => {
    try {
      const sessionId = localStorage.getItem("adminSession");
      if (sessionId) {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: {
            "x-admin-session": sessionId,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("adminSession");
      localStorage.removeItem("adminUser");
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        sessionId: null,
      });
    }
  };

  return {
    ...authState,
    checkAuth,
    logout,
  };
}