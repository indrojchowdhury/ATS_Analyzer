import { useState } from "react";
import AuthContext from "./auth-context";
import { authRequest } from "../services/auth";

const STORAGE_KEY = "ats-scanner-auth";

function readStoredAuth() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored?.token && stored?.user) return stored;
  } catch {
    return null;
  }
  return null;
}

function saveAuth(auth) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  } catch {
    throw new Error("Could not save your login in this browser.");
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  async function login(identifier, password) {
    const response = await authRequest("login/", {
      body: { identifier, password },
    });
    const nextAuth = response.data;
    saveAuth(nextAuth);
    setAuth(nextAuth);
    return nextAuth.user;
  }

  async function register({ username, email, password, passwordConfirm }) {
    const response = await authRequest("register/", {
      body: {
        username,
        email,
        password,
        password_confirm: passwordConfirm,
      },
    });
    const nextAuth = response.data;
    saveAuth(nextAuth);
    setAuth(nextAuth);
    return nextAuth.user;
  }

  async function logout() {
    if (auth?.token) {
      await authRequest("logout/", { token: auth.token, method: "POST" });
    }

    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user ?? null,
        token: auth?.token ?? null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
