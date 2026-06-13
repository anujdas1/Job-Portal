const Notification = require('../models/Notification');

/**
 * GET /api/notifications
 * Get notifications for the current user
 */
exports.listNotifications = async (req, res, next) => {
  try {
    const { unreadOnly } = req.query;
    const filter = { user: req.dbUser._id };
    if (unreadOnly === 'true') filter.read = false;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ user: req.dbUser._id, read: false });

    res.json({ notifications, unreadCount });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read
 */
exports.markRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.dbUser._id },
      { read: true }
    );
    res.json({ message: 'Marked as read' });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/mark-all-read
 * Mark all notifications as read
 */
exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.dbUser._id, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
exports.deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, user: req.dbUser._id });
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
};
