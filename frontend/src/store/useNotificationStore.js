import { create } from 'zustand';
import { getNotifications, markAllRead as apiMarkAll, markRead as apiMarkOne } from '@/api/notifications';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  open: false,

  setOpen: (open) => set({ open }),

  fetch: async () => {
    try {
      const data = await getNotifications();
      set({ notifications: data.notifications, unreadCount: data.unreadCount });
    } catch (_) {}
  },

  markOne: async (id) => {
    await apiMarkOne(id);
    set((s) => ({
      notifications: s.notifications.map((n) => (n._id === id ? { ...n, read: true } : n)),
      unreadCount: Math.max(0, s.unreadCount - 1),
    }));
  },

  markAll: async () => {
    await apiMarkAll();
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },
}));

export default useNotificationStore;
