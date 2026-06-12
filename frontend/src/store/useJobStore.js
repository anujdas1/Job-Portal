import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import api from '@/api/axiosClient';

// -------------------------------------------------------------------
// Zustand store for job feed state & filters
// -------------------------------------------------------------------
const useJobStore = create(
  devtools(
    immer((set, get) => ({
      // ---------------------------------------------------------------
      // State
      // ---------------------------------------------------------------
      jobs: [],               // raw job list from backend
      loading: false,        // loading flag for fetchJobs
      error: null,           // error message if fetch fails
      filters: {
        location: '',
        salaryMin: 0,
        salaryMax: 0,
        tags: [], // array of tag strings
      },

      // ---------------------------------------------------------------
      // Actions
      // ---------------------------------------------------------------
      fetchJobs: async () => {
        set((state) => {
          state.loading = true;
          state.error = null;
        });
        try {
          const response = await api.get('/api/jobs'); // adjust endpoint as needed
          set((state) => {
            state.jobs = response.data;
          });
        } catch (err) {
          set((state) => {
            state.error = err?.message ?? 'Failed to load jobs';
          });
        } finally {
          set((state) => {
            state.loading = false;
          });
        }
      },

      setFilters: (newFilters) => {
        set((state) => {
          state.filters = { ...state.filters, ...newFilters };
        });
      },

      // ---------------------------------------------------------------
      // Computed selector – filtered jobs based on active filters
      // ---------------------------------------------------------------
      get filteredJobs() {
        const { jobs, filters } = get();
        return jobs.filter((job) => {
          if (filters.location && job.location !== filters.location) return false;
          if (filters.salaryMin && job.salaryRange?.min && job.salaryRange.min < filters.salaryMin) return false;
          if (filters.salaryMax && job.salaryRange?.max && job.salaryRange.max > filters.salaryMax) return false;
          if (filters.tags.length && !filters.tags.every((t) => job.tags?.includes(t))) return false;
          return true;
        });
      },
    }))
  )
);

export default useJobStore;
