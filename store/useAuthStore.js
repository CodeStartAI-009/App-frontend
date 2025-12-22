// store/useAuthStore.js
import { create } from "zustand";
import * as Auth from "../services/authService";
import { saveToken, getToken, deleteToken } from "../utils/storage";

export const useUserAuthStore = create((set, get) => ({
  /* ===================== AUTH ===================== */
  user: null,
  token: null,
  hydrated: false,
  loading: false,

  /* ===================== CACHES ===================== */
  summaryCache: null,
  activityCache: null,
  homeCache: null,

  /**
   * 🔑 SOURCE OF TRUTH
   * If true → Home MUST refetch from API
   */
  homeDirty: true,

  /* ===================== CACHE SETTERS ===================== */
  setSummaryCache: (data) => set({ summaryCache: data }),
  setActivityCache: (data) => set({ activityCache: data }),

  setHomeCache: (data) =>
    set({
      homeCache: data,
      homeDirty: false, // ✅ reset ONLY after successful fetch
    }),

  /**
   * Call this AFTER:
   * - add expense
   * - add income
   * - update/delete transaction
   * - finance update
   */
  markHomeDirty: () =>
    set({
      homeDirty: true,
      homeCache: null, // ❗ IMPORTANT: remove stale snapshot
    }),

  clearCaches: () =>
    set({
      summaryCache: null,
      activityCache: null,
      homeCache: null,
      homeDirty: true,
    }),

  /* ===================== USER STATE ===================== */
  setUser: (updater) =>
    set((state) => ({
      user:
        typeof updater === "function" ? updater(state.user) : updater,
    })),

  /* ===================== SIGNUP ===================== */
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
        homeDirty: true,
        homeCache: null,
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

  /* ===================== LOGIN ===================== */
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
        homeDirty: true,
        homeCache: null,
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

  /* ===================== PROFILE UPDATE ===================== */
  updateProfile: async (data) => {
    try {
      set({ loading: true });

      const res = await Auth.updateProfile(data);

      set({
        user: res.data.user,
        loading: false,
        homeDirty: true, // balance / currency may change
        homeCache: null,
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

  /* ===================== SESSION RESTORE ===================== */
  restoreSession: async () => {
    try {
      const token = await getToken("auth_token");

      if (token) {
        globalThis.authToken = token;
        const res = await Auth.getProfile();

        set({
          user: res.data.user,
          token,
          homeDirty: true,
          homeCache: null,
        });
      }

      set({ hydrated: true });
    } catch (err) {
      console.log("RESTORE SESSION ERROR:", err);
      set({ hydrated: true });
    }
  },

  /* ===================== LOGOUT ===================== */
  logout: async () => {
    await deleteToken("auth_token");
    globalThis.authToken = null;

    set({
      user: null,
      token: null,
      summaryCache: null,
      activityCache: null,
      homeCache: null,
      homeDirty: true,
    });
  },
}));
