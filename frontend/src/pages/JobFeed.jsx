import { useEffect, useState } from 'react';
import useJobStore from '@/store/useJobStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import ApplicationModal from '@/components/ApplicationModal';

export default function JobFeed() {
  const { fetchJobs, loading, error, filteredJobs, setFilters, filters } = useJobStore((state) => ({
    fetchJobs: state.fetchJobs,
    loading: state.loading,
    error: state.error,
    filteredJobs: state.filteredJobs,
    setFilters: state.setFilters,
    filters: state.filters,
  }));

  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleLocationChange = (value) => {
    setFilters({ location: value });
  };
  const handleSalaryChange = ([min, max]) => {
    setFilters({ salaryMin: min, salaryMax: max });
  };
  const handleTagChange = (value) => {
    setFilters({ tags: value });
  };

  const salaryRange = [filters.salaryMin || 0, filters.salaryMax || 200000];

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="flex gap-6">
      {/* Filter sidebar */}
      <aside className="w-64 p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        {/* Location */}
        <div className="mb-4">
          <Select onValueChange={handleLocationChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="NYC">NYC</SelectItem>
              <SelectItem value="London">London</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Salary */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Salary Range</label>
          <Slider
            min={0}
            max={200000}
            step={5000}
            value={salaryRange}
            onValueChange={handleSalaryChange}
            className="w-full"
          />
          <div className="text-sm mt-1">
            {salaryRange[0]} – {salaryRange[1]}
          </div>
        </div>
        {/* Tags */}
        <div className="mb-4">
          <Select onValueChange={(val) => handleTagChange([val])}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Frontend">Frontend</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
              <SelectItem value="AI">AI</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setFilters({ location: '', salaryMin: 0, salaryMax: 0, tags: [] })}>
          Clear Filters
        </Button>
      </aside>

      {/* Job cards */}
      <section className="flex-1 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="col-span-full text-center">Loading jobs…</p>}
        {error && <p className="col-span-full text-center text-red-600">{error}</p>}
        {filteredJobs.map((job) => (
          <Card key={job._id} className="p-4 flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm mb-2">
                Salary: ${job.salaryRange?.min?.toLocaleString() || 'N/A'} - ${job.salaryRange?.max?.toLocaleString() || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">{job.tags?.join(', ')}</p>
            </CardContent>
            <Button className="mt-2 w-full" onClick={() => openApplyModal(job)}>
              Apply
            </Button>
          </Card>
        ))}
      </section>

      {/* Application Modal */}
      {selectedJob && (
        <ApplicationModal
          job={selectedJob}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </div>
  );
}
