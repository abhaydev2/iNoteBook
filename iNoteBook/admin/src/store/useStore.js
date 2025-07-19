import { create } from 'zustand';

const API_BASE = 'http://localhost:5000/api/admin';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const useStore = create((set, get) => ({
  // Auth state
  isAuthenticated: false,
  user: null,

  // Theme state
  isDarkMode: false,

  // Dashboard data
  dashboardData: {
    totalUsers: 0,
    totalNotes: 0,
    growthRate: '0%',
    activeUsers: 0,
    userTrend: [],
    latestUsers: [],
  },

  // Notifications
  notifications: [],

  // Actions
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        set({ isAuthenticated: true, user: { email } });
        return true;
      } else {
        set({ isAuthenticated: false, user: null });
        return false;
      }
    } catch (err) {
      set({ isAuthenticated: false, user: null });
      return false;
    }
  },

  checkAuth: () => {
    const token = getCookie('admin_token');
    set({ isAuthenticated: !!token });
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    set({ isAuthenticated: false, user: null });
  },

  fetchDashboardData: async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard-data`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (data && typeof data === 'object') {
        // Set notifications from latestUsers with time information
        const notifications = Array.isArray(data.latestUsers)
          ? data.latestUsers.map((user, idx) => ({
              id: idx + 1,
              user: user.fullname,
              joinedAt: `${user.time} • ${user.date}`,
              avatar: user.fullname
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2),
              time: user.time,
              date: user.date
            }))
          : [];
        set({
          dashboardData: {
            totalUsers: data.totalUsers || 0,
            totalNotes: data.totalNotes || 0,
            growthRate: data.growthRate || '0%',
            activeUsers: data.activeUsers || 0,
            userTrend: Array.isArray(data.chartData)
              ? data.chartData.map(row => ({
                  month: row.month,
                  users: Number(row.users) || 0,
                  notes: Number(row.notes) || 0,
                }))
              : [],
            latestUsers: data.latestUsers || [],
          },
          notifications,
        });
      }
    } catch {}
  },

  toggleTheme: () => {
    const { isDarkMode } = get();
    set({ isDarkMode: !isDarkMode });
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  initializeTheme: () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    set({ isDarkMode: isDark });
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
}));

export default useStore;