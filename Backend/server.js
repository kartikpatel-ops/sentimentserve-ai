const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Review = require("./models/Review");
const analyzeSentiment = require("./ai/sentimentAnalyzer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });

// Test
app.get("/", (req, res) => {
  res.json({
    message: "SentimentServe AI Backend is running 🚀",
  });
});

// CREATE REVIEW
app.post("/api/reviews", async (req, res) => {
  try {
    const { name, company, rating, text } = req.body;

    if (!name || !company || !rating || !text) {
      return res.status(400).json({
        message: "Please provide all review fields.",
      });
    }

    // AI ANALYSIS
    const aiResult = analyzeSentiment(text);

    console.log("================================");
    console.log("REVIEW TEXT:", text);
    console.log("AI RESULT:", aiResult);
    console.log("================================");

    // SAVE AI RESULT
    const review = new Review({
      name: name,
      company: company,
      rating: Number(rating),
      text: text,
      sentiment: aiResult.sentiment,
      confidence: aiResult.confidence,
      topics: aiResult.topics,
    });

    const savedReview = await review.save();

    res.status(201).json({
      message: "Review analyzed and saved successfully ✅",
      review: savedReview,
    });

  } catch (error) {
    console.error("Review error ❌:", error);

    res.status(500).json({
      message: "Failed to save review ❌",
      error: error.message,
    });
  }
});

// GET REVIEWS
app.get("/api/reviews/:company", async (req, res) => {
  try {
    const reviews = await Review.find({
      company: req.params.company,
    }).sort({
      createdAt: -1,
    });

    res.json({
      count: reviews.length,
      reviews: reviews,
    });

  } catch (error) {
    console.error("Fetch reviews error:", error);

    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});