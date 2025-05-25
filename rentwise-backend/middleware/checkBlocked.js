const User = require('../models/User');

const checkBlocked = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked.' });
    }

    next();s
  } catch (err) {
    console.error('checkBlocked error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = checkBlocked;
