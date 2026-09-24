const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Review = require("./models/Review");
const User = require("./models/user");
const analyzeSentiment = require("./ai/openaiSentimentAnalyzer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ===============================
// MongoDB CONNECTION
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "SentimentServe AI Backend is running 🚀",
  });
});

// ===============================
// USER REGISTRATION
// ===============================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name: name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Save user to MongoDB
    const savedUser = await user.save();

    console.log("New user registered:", savedUser.email);

    res.status(201).json({
      message: "Account created successfully ✅",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });

  } catch (error) {
    console.error("Registration error ❌:", error);

    res.status(500).json({
      message: "Failed to create account.",
      error: error.message,
    });
  }
});
// ===============================
// USER LOGIN
// ===============================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Compare entered password with hashed password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    console.log("User logged in:", user.email);

    res.status(200).json({
      message: "Login successful ✅",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login error ❌:", error);

    res.status(500).json({
      message: "Login failed.",
      error: error.message,
    });
  }
});
// ===============================
// CREATE REVIEW
// ===============================

app.post("/api/reviews", async (req, res) => {
  try {
    const { name, company, rating, text } = req.body;

    if (!name || !company || !rating || !text) {
      return res.status(400).json({
        message: "Please provide all review fields.",
      });
    }

    // AI ANALYSIS
    const aiResult = await analyzeSentiment(text);

    console.log("================================");
    console.log("REVIEW TEXT:", text);
    console.log("AI RESULT:", aiResult);
    console.log("================================");

    // SAVE REVIEW + AI RESULT
    const review = new Review({
      name: name,
      company: company,
      rating: Number(rating),
      text: text,

      sentiment: aiResult.sentiment,
      confidence: aiResult.confidence,
      topics: aiResult.topics,

      summary: aiResult.summary || "",
      recommendation: aiResult.recommendation || "",
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

// ===============================
// GET REVIEWS BY COMPANY
// ===============================

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

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});