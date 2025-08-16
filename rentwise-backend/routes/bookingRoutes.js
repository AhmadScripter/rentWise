const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminAuth = require('../middleware/adminAuth');
const { createBooking, getAllBookings, getBookingsByUser, cancelBooking, getBookingsByOwner, approveBooking, completeBooking, getOwnerStats } = require('../controllers/bookingController');
const router = express.Router();

router.get('/', adminAuth, getAllBookings);
router.get('/user/:userId', authMiddleware, getBookingsByUser);
router.get('/owner/:ownerId', authMiddleware, getBookingsByOwner);
router.post('/', authMiddleware, createBooking);
// Actions
router.put('/:bookingId/approve', authMiddleware, approveBooking);
router.put('/:bookingId/cancel', authMiddleware, cancelBooking);
router.put('/:bookingId/complete', authMiddleware, completeBooking);
// Owner stats
router.get('/owner/:ownerId/stats', authMiddleware, getOwnerStats);

module.exports = router;