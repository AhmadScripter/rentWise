const express = require("express");
const router = express.Router();
const { sendEmailOTP, verifyEmailOTP, login, logout, completeProfile, getProfile, getAllUsers } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuth");

// Authentication Routes
router.get('/', adminAuthMiddleware, getAllUsers);
router.post("/registeration", sendEmailOTP);
router.post("/verify-email", verifyEmailOTP);
router.post("/login", login);
router.post("/logout", logout);
router.put("/complete-profile", completeProfile);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;