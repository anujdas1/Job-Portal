import { X, Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import useNotificationStore from '@/store/useNotificationStore';
import { deleteNotification } from '@/api/notifications';
import './NotificationDrawer.css';

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function NotificationDrawer({ isOpen, onClose }) {
  const { notifications, unreadCount, markOne, markAll, fetch } = useNotificationStore();

  const handleDelete = async (id) => {
    await deleteNotification(id);
    fetch();
  };

  return (
    <>
      {isOpen && <div className="drawer-overlay" onClick={onClose} />}
      <aside className={`notification-drawer${isOpen ? ' open' : ''}`}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <Bell size={18} />
            <span>Notifications</span>
            {unreadCount > 0 && <span className="badge badge-blue">{unreadCount} new</span>}
          </div>
          <div className="drawer-actions">
            {unreadCount > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={markAll} title="Mark all read">
                <CheckCheck size={14} />
              </button>
            )}
            <button className="btn btn-ghost btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="divider" style={{ margin: 0 }} />

        {/* Body */}
        <div className="drawer-body">
          {notifications.length === 0 ? (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <Bell size={36} color="var(--gray-300)" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n._id} className={`notif-item${n.read ? '' : ' unread'}`}>
                <div className="notif-content">
                  <p className="notif-title">{n.title}</p>
                  <p className="notif-msg">{n.message}</p>
                  <span className="notif-time">{timeAgo(n.createdAt)}</span>
                </div>
                <div className="notif-btns">
                  {!n.read && (
                    <button className="btn btn-ghost btn-icon" onClick={() => markOne(n._id)} title="Mark read">
                      <Check size={13} />
                    </button>
                  )}
                  <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(n._id)} title="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
