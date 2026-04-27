import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
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

function buildUserData(data, fallbackName, fallbackEmail) {
  const name = data.name || data.user?.name || fallbackName;
  const email = data.email || data.user?.email || fallbackEmail;
  return {
    id: data._id || data.id || data.user?._id || data.user?.id,
    name,
    email,
    initials: getInitials(name),
    token: data.token || data.access_token,
  };
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
    try {
      const { data } = await axios.post(
        `${API}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUser(buildUserData(data, email.split("@")[0], email)));
    } catch (err) {
      throw new Error(
        err.response?.data?.message || err.response?.data?.error || "Login failed"
      );
    }
  }

  async function register(name, email, password) {
    try {
      const { data } = await axios.post(
        `${API}/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );
      dispatch(setUser(buildUserData(data, name, email)));
    } catch (err) {
      throw new Error(
        err.response?.data?.message || err.response?.data?.error || "Registration failed"
      );
    }
  }

  async function updateProfile({ name, currentPassword, newPassword }) {
    const body = {};
    if (name) body.name = name;
    if (currentPassword) body.currentPassword = currentPassword;
    if (newPassword) body.newPassword = newPassword;

    try {
      const { data } = await axios.patch(`${API}/auth/update-profile`, body, {
        withCredentials: true,
      });
      const updatedName = data.user?.name || name;
      dispatch(setUser({ ...user, name: updatedName, initials: getInitials(updatedName) }));
    } catch (err) {
      if (err.response?.status === 401) {
        dispatch(clearUser());
        setAuthModal({ open: true, mode: "login" });
        throw new Error("Session expired. Please log in again.");
      }
      throw new Error(
        err.response?.data?.error || err.response?.data?.message || "Update failed"
      );
    }
  }

  async function logout() {
    try {
      await axios.post(`${API}/logout`, {}, { withCredentials: true });
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
