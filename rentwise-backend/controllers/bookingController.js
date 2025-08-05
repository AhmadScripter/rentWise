const MyBooking = require('../models/MyBooking');
const mongoose = require('mongoose');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const booking = new MyBooking({
      userId: req.body.userId,
      adId: req.body.adId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      message: req.body.message,
      totalAmount: req.body.totalAmount
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking', details: err });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await MyBooking.find()
      .populate('userId', 'username email')
      .populate('adId', 'title img ownerName ownerPhone');
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get bookings', details: err });
  }
};

// Get bookings by user ID
const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const bookings = await MyBooking.find({ userId: userObjectId })
      .populate('adId', 'title img ownerName ownerPhone');

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error in getBookingsByUser:", error);
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

//cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await MyBooking.findByIdAndUpdate(
      req.params.bookingId,
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err });
  }
}

module.exports = { createBooking, getAllBookings, getBookingsByUser, cancelBooking };