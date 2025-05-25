const Ad = require("../models/Ad");

const allowAdminOrOwner = async (req, res, next) => {
  try {
    const ad = await Ad.findById(req.params.adId);
    if (!ad) return res.status(404).json({ message: "Ad not found." });

    const isOwner = req.user?.id && ad.userId.toString() === req.user.id;
    const isAdmin = req.user?.email === process.env.ADMIN_EMAIL;
    

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this ad." });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

module.exports = allowAdminOrOwner;