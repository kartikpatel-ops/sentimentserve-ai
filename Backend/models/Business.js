const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    location: {
      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      country: {
        type: String,
        default: "India",
      },
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    logo: { type: String, default: "" },
website: { type: String, default: "" },
isVerified: { type: Boolean, default: false },

// OpenStreetMap information
source: {
  type: String,
  default: "SentimentServe"
},

osmId: {
  type: String,
  default: ""
},

osmType: {
  type: String,
  default: ""
},

address: {
  type: String,
  default: ""
},

latitude: {
  type: Number,
  default: null
},

longitude: {
  type: Number,
  default: null
},

    recommendation: {
      budget: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
      },

      purposes: {
        type: [String],
        default: [],
      },

      familyFriendly: {
        type: Boolean,
        default: true,
      },

      accessibility: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Business = mongoose.model(
  "Business",
  businessSchema
);

module.exports = Business;