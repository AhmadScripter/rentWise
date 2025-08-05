const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuth');
const { createBooking, getAllBookings, getBookingsByUser, cancelBooking } = require('../controllers/bookingController');
const router = express.Router();

router.get('/', adminAuth, getAllBookings);
router.get('/user/:userId', authMiddleware, getBookingsByUser);
router.post('/', authMiddleware, createBooking);
router.put('/cancel/:bookingId', authMiddleware, cancelBooking);

module.exports = router;