const User = require('../models/User.js');

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params; 
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { cnic, gender, address, postalCode, phone } = req.body;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cnic, gender, address, postalCode, phone },
      { new: true, runValidators: true }
    );

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    // Duplicate phone error
    if (error.code === 11000 && error.keyPattern.phone) {
      return res.status(400).json({ message: "Phone number already in use!" });
    }

    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

module.exports = { getProfile, updateProfile };