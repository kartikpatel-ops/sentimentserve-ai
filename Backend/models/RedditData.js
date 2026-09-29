const mongoose = require("mongoose");

const redditDataSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      default: null,
    },

    businessName: {
      type: String,
      default: "",
    },

    redditPostId: {
      type: String,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      default: "",
    },

    subreddit: {
      type: String,
      default: "",
    },

    postScore: {
      type: Number,
      default: 0,
    },

    commentCount: {
      type: Number,
      default: 0,
    },

    comments: [
      {
        commentId: String,
        body: String,
        author: String,
        score: Number,
        sentiment: String,
      },
    ],

    sentiment: {
      positive: {
        type: Number,
        default: 0,
      },

      neutral: {
        type: Number,
        default: 0,
      },

      negative: {
        type: Number,
        default: 0,
      },

      positivePercent: {
        type: Number,
        default: 0,
      },

      neutralPercent: {
        type: Number,
        default: 0,
      },

      negativePercent: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const RedditData = mongoose.model(
  "RedditData",
  redditDataSchema
);

module.exports = RedditData;