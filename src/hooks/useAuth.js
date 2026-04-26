import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../store/userSlice";
import { API } from "../constants";

function getInitials(name) {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.info);
  const [authModal, setAuthModal] = useState({ open: false, mode: "login" });

  function openLogin() {
    setAuthModal({ open: true, mode: "login" });
  }

  function openSignup() {
    setAuthModal({ open: true, mode: "signup" });
  }

  function closeModal() {
    setAuthModal((v) => ({ ...v, open: false }));
  }

  async function login(email, password) {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || "Login failed");
    const userData = {
      name: data.name || data.user?.name || email.split("@")[0],
      email: data.email || data.user?.email || email,
      initials: getInitials(data.name || data.user?.name || email.split("@")[0]),
      token: data.token || data.access_token,
    };
    dispatch(setUser(userData));
  }

  async function register(name, email, password) {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || "Registration failed");
    const userData = {
      name: data.name || data.user?.name || name,
      email: data.email || data.user?.email || email,
      initials: getInitials(data.name || data.user?.name || name),
      token: data.token || data.access_token,
    };
  }

  function logout() {
    dispatch(clearUser());
  }

  return {
    user,
    authModal,
    openLogin,
    openSignup,
    closeModal,
    login,
    register,
    logout,
  };
}
