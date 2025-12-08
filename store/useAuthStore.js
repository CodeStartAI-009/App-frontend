import { create } from "zustand";
import * as Auth from "../services/authService";
import { saveToken, getToken, deleteToken } from "../utils/storage";

export const useUserAuthStore = create((set) => ({
  user: null,
  token: null,
  hydrated: false,
  loading: false,

  signupUser: async ({ name, email, password }) => {
    try {
      set({ loading: true });

      const res = await Auth.signup({ name, email, password });

      globalThis.authToken = res.data.token;
      await saveToken("auth_token", res.data.token);

      set({ user: res.data.user, token: res.data.token, loading: false });

      return { ok: true };
    } catch (err) {
      console.log("❌ SIGNUP CLIENT ERROR:", err.response?.data || err);
      set({ loading: false });
      return { ok: false, error: err.response?.data?.error || "Signup failed" };
    }
  },

  loginUser: async ({ emailOrPhone, password }) => {
    try {
      set({ loading: true });

      const res = await Auth.login({ emailOrPhone, password });

      globalThis.authToken = res.data.token;
      await saveToken("auth_token", res.data.token);

      set({ user: res.data.user, token: res.data.token, loading: false });

      return { ok: true };
    } catch (err) {
      console.log("❌ LOGIN CLIENT ERROR:", err.response?.data || err);
      set({ loading: false });
      return { ok: false, error: err.response?.data?.error || "Login failed" };
    }
  },

  restoreSession: async () => {
    try {
      const token = await getToken("auth_token");

      if (token) {
        globalThis.authToken = token;
        const res = await Auth.getProfile();
        set({ user: res.data.user, token });
      }

      set({ hydrated: true });
    } catch (err) {
      console.log("❌ RESTORE SESSION ERROR:", err);
      set({ hydrated: true });
    }
  },

  logout: async () => {
    globalThis.authToken = null;
    await deleteToken("auth_token");
    set({ user: null, token: null });
  },
}));
