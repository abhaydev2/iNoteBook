import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      login: async (email, password) => {
        set({ loading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Dummy authentication - in real app, this would be an API call
          if (email && password) {
            const userData = {
              id: 1,
              email: email,
              name: email.split('@')[0],
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
              createdAt: new Date().toISOString(),
            };
            
            const token = `dummy-token-${Date.now()}`;
            
            set({
              user: userData,
              token: token,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
            
            return { success: true, user: userData };
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          set({
            loading: false,
            error: error.message,
            user: null,
            token: null,
            isAuthenticated: false,
          });
          
          return { success: false, error: error.message };
        }
      },

      signup: async (email, password, confirmPassword) => {
        set({ loading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Basic validation
          if (!email || !password || !confirmPassword) {
            throw new Error('All fields are required');
          }
          
          if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
          }
          
          if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
          }
          
          // Dummy signup - in real app, this would be an API call
          const userData = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0],
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
            createdAt: new Date().toISOString(),
          };
          
          const token = `dummy-token-${Date.now()}`;
          
          set({
            user: userData,
            token: token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
          
          return { success: true, user: userData };
        } catch (error) {
          set({
            loading: false,
            error: error.message,
            user: null,
            token: null,
            isAuthenticated: false,
          });
          
          return { success: false, error: error.message };
        }
      },

      logout: () => {
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

      // Helper to check if user is authenticated
      checkAuth: () => {
        const { token } = get();
        return !!token;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;