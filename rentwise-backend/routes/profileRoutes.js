const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profileController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/:userId", authMiddleware, getProfile);
router.put("/:userId",authMiddleware, updateProfile);

module.exports = router;