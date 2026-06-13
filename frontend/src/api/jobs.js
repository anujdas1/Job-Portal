import client from './client';

export const getJobs = (params) => client.get('/jobs', { params }).then((r) => r.data);
export const getJob = (id) => client.get(`/jobs/${id}`).then((r) => r.data);
export const getMyJobs = () => client.get('/jobs/my').then((r) => r.data);
export const createJob = (data) => client.post('/jobs', data).then((r) => r.data);
export const updateJob = (id, data) => client.put(`/jobs/${id}`, data).then((r) => r.data);
export const deleteJob = (id) => client.delete(`/jobs/${id}`).then((r) => r.data);
