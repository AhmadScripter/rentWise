const express = require('express');
const router = express.Router();
const { getNotificationFromUser, createNotification, markNotificationAsRead } = require('../controllers/notificationController');

router.get('/:userId', getNotificationFromUser);
router.post('/', createNotification);
router.put('/read/:id', markNotificationAsRead);

module.exports = router;