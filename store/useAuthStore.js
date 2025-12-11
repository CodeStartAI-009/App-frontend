// store/useUserAuthStore.js
import { create } from "zustand";
import * as Auth from "../services/authService";
import { saveToken, getToken, deleteToken } from "../utils/storage";

export const useUserAuthStore = create((set) => ({
  user: null,
  token: null,
  hydrated: false,
  loading: false,

  /* ---------------- SIGNUP ---------------- */
  signupUser: async ({ name, email, password, agreedToTerms }) => {
    try {
      set({ loading: true });

      const res = await Auth.signup({
        name,
        email,
        password,
        agreedToTerms,
      });

      const token = res.data.token;

      globalThis.authToken = token;
      await saveToken("auth_token", token);

      set({
        user: res.data.user,
        token,
        loading: false,
      });

      return { ok: true };
    } catch (err) {
      set({ loading: false });
      return {
        ok: false,
        error: err.response?.data?.error || "Signup failed",
      };
    }
  },

  /* ---------------- LOGIN ---------------- */
  loginUser: async ({ emailOrPhone, password }) => {
    try {
      set({ loading: true });

      const res = await Auth.login({ emailOrPhone, password });
      const token = res.data.token;

      globalThis.authToken = token;
      await saveToken("auth_token", token);

      set({
        user: res.data.user,
        token,
        loading: false,
      });

      return { ok: true };
    } catch (err) {
      set({ loading: false });
      return {
        ok: false,
        error: err.response?.data?.error || "Login failed",
      };
    }
  },

  /* ---------------- UPDATE PROFILE ---------------- */
  updateProfile: async (data) => {
    try {
      set({ loading: true });

      const res = await Auth.updateProfile(data);

      set({
        user: res.data.user,
        loading: false,
      });

      return { ok: true };
    } catch (err) {
      set({ loading: false });
      return {
        ok: false,
        error: err.response?.data?.error || "Profile update failed",
      };
    }
  },

  /* ---------------- RESTORE SESSION ---------------- */
  restoreSession: async () => {
    try {
      const token = await getToken("auth_token");

      if (token) {
        globalThis.authToken = token;

        const res = await Auth.getProfile();

        set({
          user: res.data.user,
          token,
        });
      }

      set({ hydrated: true });
    } catch (err) {
      console.log("RESTORE SESSION ERROR:", err);
      set({ hydrated: true });
    }
  },

  /* ---------------- LOGOUT ---------------- */
  logout: async () => {
    await deleteToken("auth_token");
    globalThis.authToken = null;

    set({
      user: null,
      token: null,
    });
  },
}));
