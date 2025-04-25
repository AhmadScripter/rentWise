const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  img: { type: String }, // Store image path
  uploadTime: { type: Date, default: Date.now },

  ownerName: { type: String, required: true },
  ownerPhone: { type: String, required: true },
});

module.exports = mongoose.model("Ad", AdSchema);