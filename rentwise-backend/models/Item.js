const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    availableDates: [Date],
    images: [String]
});

module.exports = mongoose.model("Item", ItemSchema);
