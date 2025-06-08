const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { sendEmailOTP : sendOtpToEmail } = require("../utils/sendEmailOTP");
const otpStore = new Map();

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Send Email OTP (During Signup)
const sendEmailOTP = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, name, password }); // Temporarily store OTP & user data

    // Send OTP via email
    await sendOtpToEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email. Verify to complete signup." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify Email OTP & Store User in Database
const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const storedData = otpStore.get(email);

    if (!storedData || storedData.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(storedData.password, 10);

    const newUser = new User({
      name: storedData.name,
      email,
      password: hashedPassword,
      isEmailVerified: true,
    });
    await newUser.save();

    otpStore.delete(email); // Remove from memory after successful verification
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({
      token,
      userId: newUser._id,
      message: "Email verified and account created successfully!"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Complete Profile
const completeProfile = async (req, res) => {
  try {

    const { userId, cnic, gender, address, postalCode, phone } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    await User.findByIdAndUpdate(userId, { cnic, gender, address, postalCode, phone });

    res.status(200).json({ message: "Profile completed successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not Registered!" });

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked. Contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password!" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ token, userId: user._id, message: "Login successful!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout User
const logout = (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Block a user
const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found!" });

    res.status(200).json({ message: `User ${user.name} has been blocked.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unblock a user
const unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(userId, { isBlocked: false }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found!" });

    res.status(200).json({ message: `User ${user.name} has been unblocked.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllUsers, sendEmailOTP, verifyEmailOTP, completeProfile, login, logout, getProfile, blockUser, unblockUser };