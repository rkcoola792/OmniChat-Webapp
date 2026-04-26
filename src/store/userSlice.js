import { createSlice } from "@reduxjs/toolkit";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem("rag-user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    info: loadFromStorage(),
  },
  reducers: {
    setUser(state, action) {
      state.info = action.payload;
      localStorage.setItem("rag-user", JSON.stringify(action.payload));
    },
    clearUser(state) {
      state.info = null;
      localStorage.removeItem("rag-user");
      // clear all cookies
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
