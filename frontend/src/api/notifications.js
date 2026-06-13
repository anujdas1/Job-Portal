import client from './client';

export const getNotifications = (params) => client.get('/notifications', { params }).then((r) => r.data);
export const markRead = (id) => client.patch(`/notifications/${id}/read`).then((r) => r.data);
export const markAllRead = () => client.patch('/notifications/mark-all-read').then((r) => r.data);
export const deleteNotification = (id) => client.delete(`/notifications/${id}`).then((r) => r.data);
