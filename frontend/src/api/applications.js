import client from './client';

export const applyToJob = (formData) =>
  client.post('/applications', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);

export const getMyApplications = () => client.get('/applications/my').then((r) => r.data);
export const checkApplication = (jobId) => client.get(`/applications/check/${jobId}`).then((r) => r.data);
export const getJobApplications = (jobId) => client.get(`/applications/job/${jobId}`).then((r) => r.data);
export const updateApplicationStatus = (id, data) => client.patch(`/applications/${id}/status`, data).then((r) => r.data);
export const withdrawApplication = (id) => client.delete(`/applications/${id}`).then((r) => r.data);
