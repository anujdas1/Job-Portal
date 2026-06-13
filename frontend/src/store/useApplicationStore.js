import { create } from 'zustand';
import { getMyApplications } from '@/api/applications';
import { getSavedJobIds } from '@/api/savedJobs';

const useApplicationStore = create((set) => ({
  myApplications: [],
  savedJobIds: new Set(),
  loading: false,

  fetchMyApplications: async () => {
    set({ loading: true });
    try {
      const data = await getMyApplications();
      set({ myApplications: data, loading: false });
    } catch (_) {
      set({ loading: false });
    }
  },

  fetchSavedIds: async () => {
    try {
      const ids = await getSavedJobIds();
      set({ savedJobIds: new Set(ids) });
    } catch (_) {}
  },

  addSaved: (id) => set((s) => ({ savedJobIds: new Set([...s.savedJobIds, id]) })),
  removeSaved: (id) =>
    set((s) => {
      const next = new Set(s.savedJobIds);
      next.delete(id);
      return { savedJobIds: next };
    }),
}));

export default useApplicationStore;
