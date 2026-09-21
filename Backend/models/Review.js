const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    text: {
      type: String,
      required: true,
    },

    sentiment: {
      type: String,
      default: "pending",
    },

    confidence: {
      type: Number,
      default: 0,
    },

    topics: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;