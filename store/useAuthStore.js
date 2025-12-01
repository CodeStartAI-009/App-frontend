import { create } from "zustand";
import * as Auth from "../services/authService";
import { saveToken, getToken, deleteToken } from "../utils/storage";

export const useUserAuthStore = create((set, get) => ({
  user: null,
  token: undefined,
  hydrated: false,
  loading: false,

  loginUser: async ({ emailOrPhone, password }) => {
    try {
      set({ loading: true });

      const res = await Auth.login({ emailOrPhone, password });

      const token = res.data.token;
      const user = res.data.user;

      console.log("🔑 SAVING LOGIN TOKEN:", token);

      globalThis.authToken = token;
      await saveToken("auth_token", token);

      set({ user, token, loading: false });
      return { ok: true };
    } catch (err) {
      set({ loading: false });
      return { ok: false, error: err.response?.data?.error || "Login failed" };
    }
  },

  restoreSession: async () => {
    try {
      const saved = await getToken("auth_token");

      if (saved) {
        console.log("♻ Restored token:", saved);
        globalThis.authToken = saved;

        set({ token: saved });

        const res = await Auth.getProfile();
        set({ user: res.data.user });
      }

      set({ hydrated: true });
    } catch (err) {
      console.log("restoreSession error", err);
      set({ hydrated: true });
    }
  },

  logout: async () => {
    globalThis.authToken = null;
    await deleteToken("auth_token");
    set({ user: null, token: null });
  },
  updateProfile: async (data) => {
    try {
      const token = get().token;
      if (!token) {
        return { ok: false, error: "No token — user not logged in" };
      }
  
      const res = await Auth.updateProfile(data);
  
      // update store user object
      set({ user: res.data.user });
  
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.error || "Profile update failed",
      };
    }
  },
  
}));
