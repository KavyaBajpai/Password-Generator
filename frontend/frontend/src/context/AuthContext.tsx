"use client";
import React, { createContext, useContext, useState } from "react";

type AuthState = {
  token: string | null;
  keyHex: string | null; // derived key (temporary in sessionStorage)
  setAuth: (token: string, keyHex: string, email?: string) => void;
  clearAuth: () => void;
};

// Default empty context
const AuthContext = createContext<AuthState>({
  token: null,
  keyHex: null,
  setAuth: () => {},
  clearAuth: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  //  Token is still persistent (localStorage)
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || null;
    }
    return null;
  });
  //  keyHex restored from sessionStorage (survives reloads but not tab close)
  const [keyHex, setKeyHex] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("keyHex") || null;
    }
    return null;
  });

  // 🔹 Called after login/signup or unlocking
  const setAuth = (t: string, k: string, email?: string) => {
    setToken(t);
    setKeyHex(k);

    if (typeof window !== "undefined") {
      localStorage.setItem("token", t);
      if (email) localStorage.setItem("email", email);
      sessionStorage.setItem("keyHex", k); // ✅ Save key only for current tab/session
    }
  };

  // 🔹 Called on logout or when clearing user data
  const clearAuth = () => {
    setToken(null);
    setKeyHex(null);

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      sessionStorage.removeItem("keyHex"); // ✅ clear key on logout
    }
  };

  return (
    <AuthContext.Provider value={{ token, keyHex, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use anywhere
export const useAuth = () => useContext(AuthContext);
