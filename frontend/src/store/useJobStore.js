import { create } from 'zustand';
import { getJobs } from '@/api/jobs';

const useJobStore = create((set, get) => ({
  jobs: [],
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  error: null,
  filters: { q: '', type: '', location: '', salaryMin: '', salaryMax: '', experienceLevel: '' },

  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),

  resetFilters: () =>
    set({ filters: { q: '', type: '', location: '', salaryMin: '', salaryMax: '', experienceLevel: '' }, page: 1 }),

  setPage: (page) => set({ page }),

  fetchJobs: async () => {
    const { filters, page } = get();
    set({ loading: true, error: null });
    try {
      const data = await getJobs({ ...filters, page, limit: 12 });
      set({ jobs: data.jobs, total: data.total, pages: data.pages, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

export default useJobStore;
