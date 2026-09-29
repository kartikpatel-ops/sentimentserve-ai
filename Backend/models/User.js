const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    company: {
  type: String,
  default: "technova",
  trim: true,
},

    preferences: {
      budget: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium",
      },

      categories: {
        type: [String],
        default: [],
      },

      location: {
        type: String,
        default: "",
      },

      purposes: {
        type: [String],
        default: [],
      },

      familyFriendly: {
        type: Boolean,
        default: false,
      },

      accessibilityRequired: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;