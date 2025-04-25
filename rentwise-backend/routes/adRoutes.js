const express = require("express");
const router = express.Router();
const { displayAds, displayAd, getUserAds, createAd, uploadMiddleware, deleteAd } = require("../controllers/adController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes
router.get("/all", displayAds);
router.get("/:id", displayAd);
router.get("/user/:userId", authMiddleware, getUserAds);
router.post("/create", authMiddleware, uploadMiddleware, createAd);
router.delete("/delete/:adId", authMiddleware, deleteAd);

module.exports = router;