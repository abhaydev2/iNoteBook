import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import {API_ENDPOINTS} from '../config/api.config';
import  API_BASE_URL  from '../config/api.config';

axios.defaults.withCredentials = true; // 👈 Always send cookies

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null, // Optional: if you also store token in cookie, not state
      isAuthenticated: false,
      loading: false,
      error: null,

      // Login function
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axios.post(
            API_ENDPOINTS.AUTH.LOGIN,
            { email, password },
            { withCredentials: true } // 👈 ensures cookie is sent
          );

          set({
            user: data.user,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true, user: data.user };
        } catch (err) {
          console.log(err);   
          set({
            loading: false,
            error: err.response?.data?.error || 'Login failed',
            user: null,
            isAuthenticated: false,
          });

          return { success: false, error: err.response?.data?.error || 'Login failed' };
        }
      },

      // Signup function
      signup: async (email, password, fullname) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axios.post(
            API_ENDPOINTS.AUTH.SIGNUP,
            { email, password, fullname },
            { withCredentials: true }
          );

          set({
            user: data.user,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true, user: data.user };
        } catch (err) {
          set({
            loading: false,
            error: err.response?.data?.error || 'Signup failed',
            user: null,
            isAuthenticated: false,
          });

          return { success: false, error: err.response?.data?.error || 'Signup failed' };
        }
      },

      logout: async () => {
        try {
          await axios.post(`${API_ENDPOINTS.AUTH.LOGOUT}`, {}, { withCredentials: true });
        } catch (_) {
          // Ignore errors
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        return !!get().user;
      },

      // Reset password request function
      resetPasswordRequest: async (email) => {
        try {
          const { data } = await axios.post(
            `${API_BASE_URL}/users/reset-password`,
            { email },
            { withCredentials: true }
          );
          return { success: data.success };
        } catch (err) {
          console.log(err);
          return {
            success: false,
            error: err.response?.data?.error || 'Failed to send reset link.'
          };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
