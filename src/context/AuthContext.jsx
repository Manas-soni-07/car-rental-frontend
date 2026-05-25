import { createContext, useContext, useEffect, useMemo, useState } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const hydrateAuth = async () => {
      try {
        const res = await API.get("/auth/me");
        if (active) {
          setUser(res.data?.data?.user || null);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    };

    hydrateAuth();

    return () => {
      active = false;
    };
  }, []);

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      authLoading,
      logout,
    }),
    [user, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
