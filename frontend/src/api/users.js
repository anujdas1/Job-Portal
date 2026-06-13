import client from './client';

export const getProfile = () => client.get('/users/me').then((r) => r.data);
export const updateProfile = (data) => client.put('/users/me', data).then((r) => r.data);
export const updateResume = (file) => {
  const fd = new FormData();
  fd.append('resume', file);
  return client.put('/users/me/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
};
export const setRole = (role, token, profileData = {}) => client.post('/users/set-role', { role, profileData }, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data);
export const getPublicProfile = (id) => client.get(`/users/${id}`).then((r) => r.data);
