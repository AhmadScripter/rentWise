const express = require("express");
const router = express.Router();
const { displayAds, displayAd, getUserAds, createAd, uploadMiddleware, deleteAd } = require("../controllers/adController");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuth");
const allowAdminOrOwner = require("../middleware/allowAdminOrOwner");

const getEmailFromToken = require('../utils/jwt');

// Routes
router.get("/all", displayAds);
router.get("/:id", displayAd);
router.get("/user/:userId", authMiddleware, getUserAds);
router.post("/create", authMiddleware, uploadMiddleware, createAd);
// router.delete("/delete/:adId", authMiddleware, allowAdminOrOwner, deleteAd);
router.delete("/delete/:adId", (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "No token provided." });

  const email = getEmailFromToken(token);

  if (email === process.env.ADMIN_EMAIL) {
    return adminAuthMiddleware(req, res, next);
  } else {
    return authMiddleware(req, res, next);
  }
}, allowAdminOrOwner, deleteAd);

module.exports = router;