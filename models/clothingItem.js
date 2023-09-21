const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    required: true,
    type: String,
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    required: true,
    type: String,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: "You must enter a valid URL",
    },
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  likes: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItem", clothingItemSchema);
