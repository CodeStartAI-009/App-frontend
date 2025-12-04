// store/useAuthStore.js
import { create } from "zustand";
import * as Auth from "../services/authService";
import { saveToken, getToken, deleteToken } from "../utils/storage";

export const useUserAuthStore = create((set, get) => ({
  user: null,
  token: null,
  hydrated: false,
  loading: false,

  // SIGNUP
  signupUser: async ({ name, email, password }) => {
    try {
      set({ loading: true });

      const res = await Auth.signup({ name, email, password });

      const token = res.data.token;
      const user = res.data.user;

      globalThis.authToken = token;
      await saveToken("auth_token", token);

      set({ user, token, loading: false });
      return { ok: true };
    } catch (err) {
      set({ loading: false });
      return {
        ok: false,
        error: err.response?.data?.error || "Signup failed",
      };
    }
  },

  // LOGIN
  loginUser: async ({ emailOrPhone, password }) => {
    try {
      set({ loading: true });

      const res = await Auth.login({ emailOrPhone, password });

      const token = res.data.token;
      const user = res.data.user;

      globalThis.authToken = token;
      await saveToken("auth_token", token);

      set({ user, token, loading: false });
      return { ok: true };
    } catch (err) {
      set({ loading: false });
      return {
        ok: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  },

  // UPDATE PROFILE (FIXED)
  updateProfile: async (data) => {
    try {
      const res = await Auth.updateProfile(data);
      useUserAuthStore.setState({ user: res.data.user });
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.error || "Profile update failed",
      };
    }
  },
  // RESTORE SESSION
  restoreSession: async () => {
    try {
      const token = await getToken("auth_token");

      if (token) {
        globalThis.authToken = token;
        set({ token });

        const res = await Auth.getProfile();
        set({ user: res.data.user });
      }

      set({ hydrated: true });
    } catch (err) {
      set({ hydrated: true });
    }
  },

  logout: async () => {
    globalThis.authToken = null;
    await deleteToken("auth_token");
    set({ user: null, token: null });
  },
}));
