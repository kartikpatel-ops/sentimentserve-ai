const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},

business: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Business",
  default: null,
},
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
    authenticityRisk: {
  type: String,
  default: "low",
},

authenticityScore: {
  type: Number,
  default: 0,
},

authenticityReasons: {
  type: [String],
  default: [],
},
reviewerCredibilityScore: {
  type: Number,
  default: 0,
},

reviewerCredibilityLevel: {
  type: String,
  default: "medium",
},
aspects: {
  type: Object,
  default: {},
},
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
