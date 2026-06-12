import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axiosClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function JobPost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    tags: [],
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagSelect = (value) => {
    setForm((prev) => ({ ...prev, tags: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = 'Title is required';
    if (!form.description) newErrors.description = 'Description is required';
    if (!form.location) newErrors.location = 'Location is required';
    if (!form.salaryMin || !form.salaryMax) newErrors.salary = 'Salary range is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        salaryRange: {
          min: Number(form.salaryMin),
          max: Number(form.salaryMax)
        }
      };
      await api.post('/api/jobs', payload);
      navigate('/recruiter/dashboard');
    } catch (err) {
      console.error('Failed to create job', err);
      // You could show a toast here
    } finally {
      setSubmitting(false);
    }
  };

  // Example tag options – replace with your actual tags
  const tagOptions = ['Frontend', 'Backend', 'Fullstack', 'AI', 'Design'];

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Create a New Job Posting</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              name="title"
              placeholder="Job Title"
              value={form.title}
              onChange={handleChange}
            />
            {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
          </div>
          <div>
            <Textarea
              name="description"
              placeholder="Job description…"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
            />
            {errors.location && <p className="text-sm text-red-600 col-span-2">{errors.location}</p>}
            <Input
              name="salaryMin"
              placeholder="Min Salary (e.g., 80000)"
              type="number"
              value={form.salaryMin}
              onChange={handleChange}
            />
            <Input
              name="salaryMax"
              placeholder="Max Salary (e.g., 120000)"
              type="number"
              value={form.salaryMax}
              onChange={handleChange}
            />
            {errors.salary && <p className="text-sm text-red-600 col-span-2">{errors.salary}</p>}
          </div>
          <div>
            <Select multiple value={form.tags} onValueChange={handleTagSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tags" />
              </SelectTrigger>
              <SelectContent>
                {tagOptions.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Creating…' : 'Create Job'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
