const MyBooking = require('../models/MyBooking');
const Ad = require('../models/Ad');
const mongoose = require('mongoose');

// helper to detect date overlap
function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart <= bEnd && bStart <= aEnd;
}

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { userId, adId, startDate, endDate, message, totalAmount } = req.body;

    if (!userId || !adId || !startDate || !endDate) {
      return res.status(400).json({ message: 'userId, adId, startDate, endDate are required' });
    }

    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ message: 'Ad not found' });

    // deny if dates overlap an existing confirmed booking for this ad
    const s = new Date(startDate);
    const e = new Date(endDate);

    if (e < s) {
      return res.status(400).json({ message: 'endDate must be after startDate' });
    }

    // find any confirmed booking overlapping these dates
    const overlapping = await MyBooking.findOne({
      adId: ad._id,
      status: 'confirmed',
      $or: [
        { startDate: { $lte: e }, endDate: { $gte: s } } // classic overlap condition
      ]
    });

    if (overlapping) {
      return res.status(409).json({ message: 'Dates overlap an existing confirmed booking' });
    }

    const booking = new MyBooking({
      userId,
      adId,
      ownerId: ad.ownerId,
      startDate: s,
      endDate: e,
      message: message || '',
      totalAmount: totalAmount || 0,
      status: 'pending'
    });

    const saved = await booking.save();

    const populated = await MyBooking.findById(saved._id)
      .populate('adId', 'title img ownerName ownerPhone')
      .populate('userId', 'username email')
      .populate('ownerId', 'username email');

    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create booking', error: err });
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
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    const bookings = await MyBooking.find({ userId })
      .sort({ status: 1, createdAt: -1 })
      .populate('adId', 'title img ownerName ownerPhone')
      .populate('ownerId', 'username email');
    res.json(bookings);
  } catch (err) {
    console.error('getBookingsByUser error', err);
    res.status(500).json({ message: 'Error fetching bookings', error: err });
  }
};

// // Get bookings by Owner ID
const getBookingsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const bookings = await MyBooking.find()
      .populate({
        path: "adId",
        match: { userId: ownerId },
        select: "title img userId"
      })
      .populate("userId", "username email");

    // Remove bookings where adId didn't match
    const ownerBookings = bookings.filter(b => b.adId !== null);

    res.status(200).json(ownerBookings);
  } catch (err) {
    console.error("Error in getBookingsByOwner:", err);
    res.status(500).json({ error: "Failed to get owner bookings" });
  }
};

// Approve booking
const approveBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const updated = await MyBooking.findByIdAndUpdate(
      bookingId,
      { status: 'confirmed' },
      { new: true }
    )
      .populate('adId', 'title img ownerName ownerPhone')
      .populate('userId', 'username email')
      .populate('ownerId', 'username email');

    if (!updated) return res.status(404).json({ message: 'Booking not found' });

    res.json({ message: 'Booking approved', booking: updated });
  } catch (err) {
    console.error('approveBooking error', err);
    res.status(500).json({ message: 'Failed to approve booking', error: err });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const updated = await MyBooking.findByIdAndUpdate(
      bookingId,
      { status: 'cancelled' },
      { new: true }
    )
      .populate('adId', 'title img ownerName ownerPhone')
      .populate('userId', 'username email')
      .populate('ownerId', 'username email');

    if (!updated) return res.status(404).json({ message: 'Booking not found' });

    res.json({ message: 'Booking cancelled', booking: updated });
  } catch (err) {
    console.error('cancelBooking error', err);
    res.status(500).json({ message: 'Failed to cancel booking', error: err });
  }
};

// Mark completed
const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updated = await MyBooking.findByIdAndUpdate(
      bookingId,
      { status: 'completed' },
      { new: true }
    )
      .populate('adId', 'title img ownerName ownerPhone')
      .populate('userId', 'username email')
      .populate('ownerId', 'username email');

    if (!updated) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking completed', booking: updated });
  } catch (err) {
    console.error('completeBooking error', err);
    res.status(500).json({ message: 'Failed to complete booking', error: err });
  }
};

// Owner dashboard quick stats
const getOwnerStats = async (req, res) => {
  try {
    const { ownerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: 'Invalid owner ID format' });
    }
    const [stats] = await MyBooking.aggregate([
      { $match: { ownerId: new mongoose.Types.ObjectId(ownerId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // also list which ads have confirmed bookings upcoming
    const upcoming = await MyBooking.find({
      ownerId,
      status: 'confirmed',
      endDate: { $gte: new Date() }
    }).populate('adId', 'title img');

    res.json({ stats, upcoming });
  } catch (err) {
    console.error('getOwnerStats error', err);
    res.status(500).json({ message: 'Failed to get stats', error: err });
  }
};

module.exports = { createBooking, getAllBookings, getBookingsByUser, getBookingsByOwner, approveBooking, cancelBooking, completeBooking, getOwnerStats };