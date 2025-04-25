const express = require("express");
const router = express.Router();
const { sendEmailOTP, verifyEmailOTP, login, logout, completeProfile, getProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Authentication Routes
router.post("/registeration", sendEmailOTP);
router.post("/verify-email", verifyEmailOTP);
router.post("/login", login);
router.post("/logout", logout);
router.put("/complete-profile", completeProfile);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;