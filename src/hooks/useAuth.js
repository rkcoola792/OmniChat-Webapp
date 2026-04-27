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
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || "Login failed");
    const userData = {
      id: data._id || data.id || data.user?._id || data.user?.id,
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
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || "Registration failed");
    const userData = {
      id: data._id || data.id || data.user?._id || data.user?.id,
      name: data.name || data.user?.name || name,
      email: data.email || data.user?.email || email,
      initials: getInitials(data.name || data.user?.name || name),
      token: data.token || data.access_token,
    };
    dispatch(setUser(userData));
  }

  async function updateProfile({ name, currentPassword, newPassword }) {
    const body = {};
    if (name) body.name = name;
    if (currentPassword) body.currentPassword = currentPassword;
    if (newPassword) body.newPassword = newPassword;

    const res = await fetch(`${API}/auth/update-profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.status === 401) {
      dispatch(clearUser());
      setAuthModal({ open: true, mode: "login" });
      throw new Error("Session expired. Please log in again.");
    }
    if (!res.ok) throw new Error(data.error || data.message || "Update failed");
    const updatedName = data.user?.name || name;
    dispatch(setUser({ ...user, name: updatedName, initials: getInitials(updatedName) }));
  }

  async function logout() {
    try {
      await fetch(`${API}/logout`, { method: "POST", credentials: "include" });
    } catch {
      // ignore — clear client state regardless
    }
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
    updateProfile,
    logout,
  };
}
