const express = require("express");
const router = express.Router();
const { sendEmailOTP, verifyEmailOTP, login, logout, completeProfile, getProfile, getAllUsers, blockUser, unblockUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuth");
const checkBlocked = require("../middleware/checkBlocked");

// Authentication Routes
router.get('/', adminAuthMiddleware, getAllUsers);
router.post("/registeration", sendEmailOTP);
router.post("/verify-email", verifyEmailOTP);
router.post("/login", login);
router.post("/logout", logout);
router.put("/complete-profile", completeProfile);
router.get("/profile", authMiddleware, checkBlocked, getProfile);

router.put('/block/:id', adminAuthMiddleware, blockUser);
router.put('/unblock/:id', adminAuthMiddleware, unblockUser);

module.exports = router;