const Ad = require("../models/Ad");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

const uploadMiddleware = upload.single("img");

// Get all ads
const displayAds = async (req, res) => {
  try {
    const ads = await Ad.find();
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get single ad
const displayAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get ads by a specific user
const getUserAds = async (req, res) => {
  try {
    const ads = await Ad.find({ userId: req.params.userId });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: "Error fetching ads" });
  }
};

// Create a new ad
const createAd = async (req, res) => {
  try {
    const { title, category, description, price, location, userId } = req.body;

    if (!title || !category || !description || !price || !location || !userId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user || !user.name || !user.phone) {
      return res.status(400).json({ error: "Please Complete your profile first" });
    }

    const imgPath = req.file ? `/uploads/${req.file.filename}` : "";

    const newAd = new Ad({
      title,
      category,
      description,
      price,
      location,
      img: imgPath,
      userId,
      ownerName: user.name,
      ownerPhone: user.phone
    });

    console.log('Request body:', req.body);
    console.log('Files:', req.files);
    
    await newAd.save();
    res.status(201).json(newAd);
  } catch (error) {
    res.status(500).json({ error: error.message || "Error creating ad" });
  }
};

// Delete an ad
const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.adId);
    if (!ad) return res.status(404).json({ error: "Ad not found" });

    if (ad.img) {
      const imagePath = path.join(__dirname, "..", ad.img);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Ad.findByIdAndDelete(req.params.adId);
    res.json({ message: "Ad deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting ad" });
  }
};

module.exports = {deleteAd, createAd, getUserAds, displayAd, displayAds, uploadMiddleware}