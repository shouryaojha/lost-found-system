const mongoose = require("mongoose");

// Item Schema — stores lost/found item data
const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Type is required"],
    enum: ["lost", "found"], // Only allow "lost" or "found"
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User who posted this item
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model("Item", itemSchema);
