const Notification = require('../models/Notification');

// Get notifications for a user
const getNotificationFromUser = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Create a notification
const createNotification = async (req, res) => {
    try {
        const { userId, message } = req.body;
        const notification = new Notification({ userId, message });
        await notification.save();
        res.status(201).json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getNotificationFromUser, createNotification, markNotificationAsRead };