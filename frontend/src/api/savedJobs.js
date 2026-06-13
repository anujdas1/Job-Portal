import client from './client';

export const getSavedJobs = () => client.get('/saved-jobs').then((r) => r.data);
export const getSavedJobIds = () => client.get('/saved-jobs/ids').then((r) => r.data);
export const saveJob = (jobId) => client.post(`/saved-jobs/${jobId}`).then((r) => r.data);
export const unsaveJob = (jobId) => client.delete(`/saved-jobs/${jobId}`).then((r) => r.data);
