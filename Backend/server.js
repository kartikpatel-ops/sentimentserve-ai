const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const Business = require("./models/Business");
const RedditData = require("./models/RedditData");
const analyzeSentiment = require("./ai/opensentiment");


const Review = require("./models/Review");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const analyzeAuthenticity = require("./ai/authenticityAnalyzer");
const calculateReviewerCredibility = require("./ai/reviewerCredibility");
const generateBusinessInsights = require("./ai/businessInsightAnalyzer");
const calculateBusinessHealthScore = require("./ai/businessHealthScore");



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
const aiResult = await analyzeSentiment(text);

const authenticityResult = analyzeAuthenticity(
  text,
  name
);

const credibilityResult =
  calculateReviewerCredibility({
    reviewText: text,
    authenticityRisk:
      authenticityResult.riskLevel,
    authenticityScore:
      authenticityResult.riskScore,
  });

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

  summary: aiResult.summary,
  recommendation: aiResult.recommendation,

  authenticityRisk:
    authenticityResult.riskLevel,

  authenticityScore:
    authenticityResult.riskScore,

  authenticityReasons:
    authenticityResult.reasons,

  reviewerCredibilityScore:
    credibilityResult.score,

  reviewerCredibilityLevel:
    credibilityResult.level,
});
    const savedReview = await review.save();
    console.log("REVIEW SAVED SUCCESSFULLY:", savedReview._id);

   
    // UPDATE BUSINESS STATISTICS
const business = await Business.findOne({
  slug: company,
});

if (business) {
  const businessReviews = await Review.find({
    company: company,
  });

  const totalRating = businessReviews.reduce(
    (sum, review) => sum + Number(review.rating),
    0
  );

  const averageRating =
    businessReviews.length > 0
      ? Number((totalRating / businessReviews.length).toFixed(1))
      : 0;

  business.averageRating = averageRating;
  business.reviewCount = businessReviews.length;

  await business.save();

  console.log("BUSINESS UPDATED:", {
    averageRating,
    reviewCount: businessReviews.length,
  });
}
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
// SENTIMENT TREND
app.get("/api/trends/:company", async (req, res) => {
  try {
    const reviews = await Review.find({
      company: req.params.company,
    }).sort({
      createdAt: 1,
    });

    const trend = reviews.map((review) => ({
      date: review.createdAt,
      sentiment: review.sentiment,
      rating: review.rating,
    }));

    res.json({
      company: req.params.company,
      count: trend.length,
      trend,
    });
  } catch (error) {
    console.error("Trend error:", error);

    res.status(500).json({
      message: "Failed to generate sentiment trend",
      error: error.message,
    });
  }
});
// AI BUSINESS INSIGHTS
app.get("/api/business-insights/:company", async (req, res) => {
  try {
    const reviews = await Review.find({
      company: req.params.company,
    }).sort({
      createdAt: -1,
    });

    const insights = generateBusinessInsights(reviews);

    res.json({
      company: req.params.company,
      reviewCount: reviews.length,
      insights,
    });
  } catch (error) {
    console.error("Business insights error:", error);

    res.status(500).json({
      message: "Failed to generate business insights",
      error: error.message,
    });
  }
});
// BUSINESS HEALTH SCORE
app.get("/api/business-health/:company", async (req, res) => {
  try {
    const reviews = await Review.find({
      company: req.params.company,
    }).sort({
      createdAt: -1,
    });

    const healthScore = calculateBusinessHealthScore(reviews);

    res.json({
      company: req.params.company,
      reviewCount: reviews.length,
      healthScore,
    });
  } catch (error) {
    console.error("Business health score error:", error);

    res.status(500).json({
      message: "Failed to calculate business health score",
      error: error.message,
    });
  }
});

app.get("/api/businesses", async (req, res) => {
  try {
    const businesses = await Business.find().sort({
      createdAt: -1,
    });

    res.json({
      count: businesses.length,
      businesses: businesses,
    });
  } catch (error) {
    console.error("Fetch businesses error:", error);

    res.status(500).json({
      message: "Failed to fetch businesses",
      error: error.message,
    });
  }
});
app.get("/api/businesses/:slug", async (req, res) => {
  try {
    const business = await Business.findOne({
      slug: req.params.slug,
    });

    if (!business) {
      return res.status(404).json({
        message: "Business not found",
      });
    }

    res.json(business);
  } catch (error) {
    console.error("Fetch business error:", error);

    res.status(500).json({
      message: "Failed to fetch business",
      error: error.message,
    });
  }
});
// ================= SIGNUP =================

app.post("/api/auth/signup", async (req, res) => {
  try {
   const { name, email, password, company } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email and password.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
   const user = await User.create({
  name: name.trim(),
  email: cleanEmail,
  password: hashedPassword,
  company: company?.trim() || "technova",
});

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
});


// ================= LOGIN =================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token: token,
      user: {
  id: user._id,
  name: user.name,
  email: user.email,
  company: user.company,
},
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});
// ===============================
// OPENSTREETMAP REAL BUSINESS SEARCH
// ===============================

// ===============================
// REAL BHOPAL BUSINESS SEARCH
// ===============================

app.get("/api/real-businesses", async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({
        message: "Please provide a business name or category.",
      });
    }

    // Bhopal geographic boundary
    const viewbox = "77.20,23.40,77.60,23.05";

    const searchQuery = `${query}, Bhopal, Madhya Pradesh, India`;

    const url =
      "https://nominatim.openstreetmap.org/search" +
      `?q=${encodeURIComponent(searchQuery)}` +
      "&format=jsonv2" +
      "&addressdetails=1" +
      "&limit=20" +
      `&viewbox=${viewbox}` +
      "&bounded=1";

    const response = await fetch(url, {
      headers: {
        "User-Agent": "SentimentServeAI/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(
        "OpenStreetMap request failed"
      );
    }

    const places = await response.json();

    const businesses = places
      .filter((place) => {
        const address =
          place.address || {};

        const city =
          (
            address.city ||
            address.town ||
            address.municipality ||
            ""
          ).toLowerCase();

        const state =
          (
            address.state || ""
          ).toLowerCase();

        return (
          city.includes("bhopal") ||
          state.includes("madhya pradesh")
        );
      })
      .map((place) => ({
        name:
          place.name ||
          place.display_name.split(",")[0],

        address: place.display_name,

        latitude: Number(place.lat),

        longitude: Number(place.lon),

        osmId: place.osm_id,

        osmType: place.osm_type,

        category: place.category || "",

        type: place.type || "",

        source: "OpenStreetMap",

        city: "Bhopal",

        state: "Madhya Pradesh",

        country: "India",
      }));

    res.json({
      count: businesses.length,

      location: {
        city: "Bhopal",
        state: "Madhya Pradesh",
        country: "India",
      },

      businesses,
    });
  } catch (error) {
    console.error(
      "Bhopal business search error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to search Bhopal businesses.",

      error: error.message,
    });
  }
});
// ==========================================
// SAVE OPENSTREETMAP BUSINESS TO MONGODB
// ==========================================

app.post("/api/businesses/import", async (req, res) => {
  try {
    const {
      name,
      address,
      latitude,
      longitude,
      osmId,
      osmType,
      category,
      type,
    } = req.body;

    if (!name || !osmId) {
      return res.status(400).json({
        message: "Business name and OSM ID are required.",
      });
    }

    // Check whether this OSM business already exists
    const existingBusiness = await Business.findOne({
      osmId: String(osmId),
      osmType: osmType || "node",
    });

    if (existingBusiness) {
      return res.json({
        message: "Business already exists.",
        business: existingBusiness,
      });
    }

    // Create a URL-friendly slug
    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      String(osmId);

    const business = await Business.create({
      name: name,
      slug: slug,
      category: category || "Restaurant",
      description: "",
      source: "OpenStreetMap",

      osmId: String(osmId),
      osmType: osmType || "node",

      address: address || "",

      latitude: latitude
        ? Number(latitude)
        : null,

      longitude: longitude
        ? Number(longitude)
        : null,

      logo: name.charAt(0).toUpperCase(),
      website: "",
      isVerified: false,

      averageRating: 0,
      reviewCount: 0,
    });

    res.status(201).json({
      message: "Real business imported successfully.",
      business: business,
    });

  } catch (error) {
    console.error(
      "Business import error:",
      error
    );

    res.status(500).json({
      message: "Failed to import business.",
      error: error.message,
    });
  }
});
app.post("/api/businesses/import", async (req, res) => {
  try {
    const {
      name,
      address,
      latitude,
      longitude,
      osmId,
      osmType,
      category,
      type,
    } = req.body;

    if (!name || !osmId) {
      return res.status(400).json({
        message: "Business name and OSM ID are required.",
      });
    }

    const existingBusiness = await Business.findOne({
      osmId: String(osmId),
      osmType: osmType || "node",
    });

    if (existingBusiness) {
      return res.json({
        message: "Business already exists.",
        business: existingBusiness,
      });
    }

    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      String(osmId);

    const business = await Business.create({
      name,
      slug,
      category: category || "Restaurant",
      description: "",
      source: "OpenStreetMap",
      osmId: String(osmId),
      osmType: osmType || "node",
      address: address || "",
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      logo: name.charAt(0).toUpperCase(),
      website: "",
      isVerified: false,
      averageRating: 0,
      reviewCount: 0,
    });

    res.status(201).json({
      message: "Real business imported successfully.",
      business,
    });
  } catch (error) {
    console.error("Business import error:", error);

    res.status(500).json({
      message: "Failed to import business.",
      error: error.message,
    });
  }
});
app.get("/api/foursquare-test", async (req, res) => {
  try {
    const query = req.query.query || "restaurant";
    const near = req.query.near || "Bhopal, India";

    const response = await fetch(
      "https://places-api.foursquare.com/places/search" +
        `?query=${encodeURIComponent(query)}` +
        `&near=${encodeURIComponent(near)}` +
        "&limit=5" +
        "&fields=fsq_place_id,name,rating,total_ratings,location,categories,tips",
      {
        headers: {
          Authorization: `Bearer ${process.env.FOURSQUARE_API_KEY}`,
          "X-Places-Api-Version": "2025-06-17",
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Foursquare API request failed.",
        error: data,
      });
    }

    res.json({
      source: "Foursquare",
      results: data.results || [],
    });

  } catch (error) {
    console.error("Foursquare error:", error);

    res.status(500).json({
      message: "Failed to connect to Foursquare.",
      error: error.message,
    });
  }
});
// OpenStreetMap / Overpass business search
// Geoapify business search
app.get("/api/osm-businesses", async (req, res) => {
  try {
    const query = (req.query.query || "restaurant").toLowerCase();
    const near = req.query.near || "Bhopal, India";

    const categoryMap = {
      restaurant: "catering.restaurant",
      restaurants: "catering.restaurant",
      cafe: "catering.cafe",
      cafes: "catering.cafe",
      hotel: "accommodation.hotel",
      hotels: "accommodation.hotel",
      bank: "service.financial.bank",
      banks: "service.financial.bank",
      supermarket: "commercial.supermarket",
      shopping: "commercial",
      "shopping mall": "commercial.shopping_mall",
      pharmacy: "healthcare.pharmacy",
      hospital: "healthcare.hospital",
      tourist: "tourism",
      tourism: "tourism",
    };

    const category = categoryMap[query] || "commercial";

    // First find the requested city/location.
    const geocodeResponse = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        near
      )}&format=json&limit=1&apiKey=${process.env.GEOAPIFY_API_KEY}`,
      {
        headers: {
          "User-Agent": "SentimentServeAI/1.0",
        },
      }
    );

    const geocodeText = await geocodeResponse.text();

    if (!geocodeResponse.ok) {
      return res.status(geocodeResponse.status).json({
        message: "Geoapify location search failed.",
        error: geocodeText.substring(0, 1000),
      });
    }

    const geocodeData = JSON.parse(geocodeText);

    if (!geocodeData.results || geocodeData.results.length === 0) {
      return res.status(404).json({
        message: `Location "${near}" was not found.`,
        businesses: [],
      });
    }

    const location = geocodeData.results[0];

    const latitude = location.lat;
    const longitude = location.lon;

    // Search businesses around the location.
    const placesUrl =
      `https://api.geoapify.com/v2/places` +
      `?categories=${encodeURIComponent(category)}` +
      `&filter=circle:${longitude},${latitude},10000` +
      `&bias=proximity:${longitude},${latitude}` +
      `&limit=20` +
      `&lang=en` +
      `&apiKey=${process.env.GEOAPIFY_API_KEY}`;

    const placesResponse = await fetch(placesUrl, {
      headers: {
        "User-Agent": "SentimentServeAI/1.0",
      },
    });

    const placesText = await placesResponse.text();

    if (!placesResponse.ok) {
      return res.status(placesResponse.status).json({
        message: "Geoapify business search failed.",
        error: placesText.substring(0, 1000),
      });
    }

    const placesData = JSON.parse(placesText);

    const businesses = (placesData.features || []).map((place) => {
      const properties = place.properties || {};

      return {
        id: properties.place_id,

        name: properties.name || "Unnamed business",

        address:
          properties.formatted ||
          [
            properties.housenumber,
            properties.street,
            properties.city,
            properties.state,
          ]
            .filter(Boolean)
            .join(", "),

        latitude: properties.lat || null,
        longitude: properties.lon || null,

        category:
          properties.categories?.[0] ||
          category,

        source: "Geoapify / OpenStreetMap",
      };
    });

    res.json({
      source: "Geoapify / OpenStreetMap",
      count: businesses.length,
      businesses,
    });
  } catch (error) {
    console.error("Geoapify search error:", error);

    res.status(500).json({
      message: "Failed to search businesses.",
      error: error.message,
    });
  }
});
// ===============================
// REDDIT DATA IMPORT
// ===============================

app.post("/api/reddit/import", async (req, res) => {
  try {
    const {
      businessName,
      redditPostId,
      title,
      subreddit,
      postScore,
      commentCount,
      comments,
      sentiment,
    } = req.body;

    if (!redditPostId) {
      return res.status(400).json({
        message: "redditPostId is required.",
      });
    }

    const redditData = await RedditData.findOneAndUpdate(
      { redditPostId },
      {
        businessName: businessName || "",
        title: title || "",
        subreddit: subreddit || "",
        postScore: postScore || 0,
        commentCount: commentCount || 0,
        comments: comments || [],
        sentiment: sentiment || {},
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json({
      message: "Reddit data imported successfully.",
      data: redditData,
    });
  } catch (error) {
    console.error("Reddit import error:", error);

    res.status(500).json({
      message: "Failed to import Reddit data.",
      error: error.message,
    });
  }
});
// =========================================
// GOOGLE PLACES - SEARCH BHOPAL BUSINESSES
// =========================================

// ==========================================
// GOOGLE PLACES - SEARCH BHOPAL BUSINESSES
// ==========================================

app.get("/api/google-businesses", async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({
        message: "Please provide a business or category.",
      });
    }

    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key":
            process.env.GOOGLE_PLACES_API_KEY,

          "X-Goog-FieldMask":
  "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri,places.photos",
        },

        body: JSON.stringify({
          textQuery: `${query}, Bhopal, Madhya Pradesh, India`,
          languageCode: "en",
        }),
      }
    );

    const data = await response.json();

   if (!response.ok) {
  console.error("Google Places error:", data);

  if (response.status === 429) {
    return res.status(429).json({
      message:
        "Google Places daily search quota has been exceeded. Please try again later.",
      quotaExceeded: true,
    });
  }

  return res.status(response.status).json({
    message:
      data.error?.message ||
      "Google Places request failed.",
  });
}
    const businesses = (data.places || []).map((place) => ({
      placeId: place.id,

      name:
        place.displayName?.text ||
        "Unknown Business",

      address:
        place.formattedAddress || "",

      rating:
        place.rating || null,

      reviewCount:
        place.userRatingCount || 0,

      googleMapsUri:
        place.googleMapsUri || "",
        photos: place.photos || [],

      source: "Google Places",

      city: "Bhopal",
      state: "Madhya Pradesh",
      country: "India",
    }));

    res.json({
      count: businesses.length,

      location: {
        city: "Bhopal",
        state: "Madhya Pradesh",
        country: "India",
      },

      businesses,
    });

  } catch (error) {
    console.error(
      "Google business search error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to search Google Places.",

      error: error.message,
    });
  }
});
app.get("/test", (req, res) => {
  res.send("TEST ROUTE WORKING");
});
// =========================================
// GOOGLE PLACES - GET BUSINESS DETAILS
// =========================================

app.get("/api/google-place/:placeId", async (req, res) => {
  try {
    const placeId = req.params.placeId;

    if (!placeId) {
      return res.status(400).json({
        message: "Google Place ID is required.",
      });
    }

    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(
        placeId
      )}`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",

          "X-Goog-Api-Key":
            process.env.GOOGLE_PLACES_API_KEY,

          "X-Goog-FieldMask":
            "id,displayName,formattedAddress,rating,userRatingCount,googleMapsUri,photos",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Google Place Details error:",
        data
      );

      return res.status(response.status).json({
        message:
          data.error?.message ||
          "Google Place Details request failed.",
      });
    }

    res.json({
      placeId: data.id || placeId,

      name:
        data.displayName?.text ||
        "Unknown Business",

      address:
        data.formattedAddress || "",

      rating:
        data.rating || 0,

      reviewCount:
        data.userRatingCount || 0,

      googleMapsUri:
        data.googleMapsUri || "",

      photos:
        data.photos || [],

      source: "Google Places",
    });

  } catch (error) {
    console.error(
      "Google Place Details error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch Google Place Details.",

      error: error.message,
    });
  }
});

// =========================================
// GOOGLE PLACES - GET REAL REVIEWS
// =========================================

app.get("/api/google-reviews/:placeId", async (req, res) => {
  try {
    const placeId = req.params.placeId;

    if (!placeId) {
      return res.status(400).json({
        message: "Google Place ID is required.",
      });
    }

    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",

          "X-Goog-Api-Key":
            process.env.GOOGLE_PLACES_API_KEY,

          "X-Goog-FieldMask":
            "id,displayName,rating,userRatingCount,reviews",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Google review error:",
        data
      );

      return res.status(response.status).json({
        message:
          data.error?.message ||
          "Google review request failed.",
      });
    }

    const reviews = (data.reviews || []).map((review) => ({
      reviewId:
        review.name || "",

      author:
        review.authorAttribution?.displayName ||
        "Google user",

      rating:
        review.rating || 0,

      text:
        review.text?.text || "",

      relativePublishTimeDescription:
        review.relativePublishTimeDescription ||
        "",

      googleMapsUri:
        review.googleMapsUri || "",

      source:
        "Google Places",
    }));

    res.json({
      placeId:
        data.id || placeId,

      businessName:
        data.displayName?.text || "",

      rating:
        data.rating || 0,

      reviewCount:
        data.userRatingCount || 0,

      reviews,
    });

  } catch (error) {
    console.error(
      "Google review fetch error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch Google reviews.",

      error: error.message,
    });
  }
});
console.log("GOOGLE PLACE DETAILS ROUTE LOADED");
// =========================================
// PEXELS - BUSINESS IMAGE SEARCH
// =========================================

app.get("/api/business-image", async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({
        message: "Please provide a business or category.",
      });
    }

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=1`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Pexels error:", data);

      return res.status(response.status).json({
        message:
          data.error ||
          "Pexels image search failed.",
      });
    }

    const photo = data.photos?.[0];

    res.json({
      imageUrl: photo?.src?.large || "",
      photographer: photo?.photographer || "",
      photographerUrl: photo?.photographer_url || "",
      pexelsUrl: photo?.url || "",
      source: "Pexels",
    });

  } catch (error) {
    console.error(
      "Pexels image search error:",
      error
    );

    res.status(500).json({
      message: "Failed to search Pexels.",
      error: error.message,
    });
  }
});
app.post("/api/ai/query", async (req, res) => {
  try {
    const {
      query,
      company,
      business,
    } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        message: "Please enter a question.",
      });
    }

    const businessName =
      business?.name ||
      company ||
      "";

    if (!businessName) {
      return res.status(400).json({
        message:
          "Please select a business or provide a business name.",
      });
    }

 // -----------------------------------------
// SENTIMENTSERVE REVIEWS
// -----------------------------------------

const reviews = await Review.find({
  company: businessName,
})
  .sort({
    createdAt: -1,
  })
  .limit(100);


// -----------------------------------------
// SERPAPI PUBLIC GOOGLE REVIEWS
// -----------------------------------------

const publicReviewsResponse = await fetch(
  `https://sentimentserve-ai.onrender.com/api/serpapi-reviews?business=${encodeURIComponent(
    businessName
  )}`
);

const publicReviewsData =
  await publicReviewsResponse.json();

const publicReviews =
  publicReviewsResponse.ok
    ? publicReviewsData.reviews || []
    : [];

const publicBusiness =
  publicReviewsData.business || null;


// -----------------------------------------
// GOOGLE BUSINESS INFORMATION
// -----------------------------------------

const googleRating =
  business?.rating !== null &&
  business?.rating !== undefined
    ? business.rating
    : publicBusiness?.rating ?? null;

const googleReviewCount =
  business?.reviewCount !== null &&
  business?.reviewCount !== undefined
    ? business.reviewCount
    : publicBusiness?.reviewCount ?? null;

const googleBusinessInfo = `
BUSINESS INFORMATION

Business name:
${businessName}

Google rating:
${
  googleRating !== null
    ? `${googleRating}/5`
    : "Not available"
}

Google user rating count:
${
  googleReviewCount !== null
    ? googleReviewCount
    : "Not available"
}

Address:
${
  business?.address ||
  publicBusiness?.address ||
  "Not available"
}

Google Maps:
${business?.googleMapsUri || "Not available"}
`;
    let publicReviewsText =
  "No public Google Maps reviews were found.";

if (publicReviews.length > 0) {
  publicReviewsText = publicReviews
    .map(
      (review, index) => `
Public Review ${index + 1}:
Rating: ${review.rating}/5
Date: ${review.date || "Unknown"}
Author: ${review.author || "Anonymous"}
Text: ${review.text || "No written review text available."}
`
    )
    .join("\n");
}

    let reviewsText = "No SentimentServe reviews available.";

    if (reviews.length > 0) {
      reviewsText = reviews
        .map(
          (review, index) => `
Review ${index + 1}:
Rating: ${review.rating}/5
Sentiment: ${review.sentiment || "unknown"}
Text: ${review.text}
`
        )
        .join("\n");
    }

    // -----------------------------------------
    // OPENROUTER
    // -----------------------------------------

    const OpenAI = require("openai");

    const openrouter = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

 const prompt = `
You are SentimentServe AI, a customer intelligence assistant.

You are analyzing the following business:

${googleBusinessInfo}

==================================================
PUBLIC GOOGLE MAPS CUSTOMER REVIEWS
==================================================

${publicReviewsText}

==================================================
SENTIMENTSERVE REVIEWS
==================================================

${reviewsText}

==================================================
USER QUESTION
==================================================

${query.trim()}

==================================================
ANALYSIS RULES
==================================================

1. Base your analysis primarily on the actual public customer
   reviews provided above.

2. Do NOT invent customer reviews, complaints, experiences,
   statistics, or opinions.

3. Public Google Maps reviews and SentimentServe reviews are
   different sources. Keep them clearly separated.

4. Do NOT describe public Google Maps reviews as
   "SentimentServe reviews".

5. If public reviews are available, identify recurring themes
   across the reviews.

6. Do not treat one person's experience as a general fact.
   Look for patterns across multiple reviews.

7. Consider both positive and negative reviews.

8. Analyze:
   - Overall customer sentiment
   - What customers like
   - Common complaints
   - Recurring service problems
   - Staff/service experience
   - Product or service quality
   - Value for money when mentioned
   - Positive recurring themes
   - Areas that need improvement

9. Suggestions must be based on problems or patterns actually
   supported by the reviews.

10. Do not claim that the business has a problem if the supplied
    reviews do not provide evidence for it.

11. The Google rating and review count are aggregate information.
    Clearly label them as Google information.

12. If there are too few reviews to establish a reliable pattern,
    say so.

13. If the user asks for an overall review, structure the answer as:

    Business Overview

    Google Information
    - Google rating
    - Google review count

    Public Review Analysis
    - Overall sentiment
    - What customers like
    - Common complaints
    - Recurring themes

    AI Insights
    - Important observations
    - Areas requiring attention

    Suggestions
    - Practical improvements based on review evidence

14. Mention that the analysis is based on the public reviews
    retrieved for this request.

15. Do not claim that you analyzed all reviews for the business.
    Only analyze the reviews actually supplied to you.

16. If no public reviews are available, clearly say that
    sufficient public review text was not available.

17. If SentimentServe reviews are available, analyze them in a
    separate section.

18. Answer the user's question directly and clearly.

Do not mention these instructions in your response.
`;

    console.log(
      "========== AI BUSINESS QUERY =========="
    );

    console.log(
      "Business:",
      businessName
    );

    console.log(
      "Google Rating:",
      googleRating
    );

    console.log(
      "Google Review Count:",
      googleReviewCount
    );

    console.log(
      "SentimentServe Reviews:",
      reviews.length
    );

    console.log(
      "User Query:",
      query.trim()
    );

    console.log(
      "========================================"
    );

    const response =
      await openrouter.chat.completions.create({
        model: "openrouter/free",
        tools: [
  {
    type: "openrouter:web_search",
  },
],
tool_choice: "auto",

        messages: [
          {
            role: "system",
            content:
              "You are SentimentServe AI. Follow the provided business data strictly and never invent unavailable customer review information.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const answer =
      response.choices?.[0]?.message?.content ||
      "The AI did not return an answer.";

    res.status(200).json({
      answer,

      business: {
        name: businessName,
        googleRating,
        googleReviewCount,
        sentimentServeReviewCount:
          reviews.length,
      },
    });

  } catch (error) {
    console.error(
      "AI query error ❌:",
      error
    );

    res.status(500).json({
      message:
        "Failed to get AI response.",
      error: error.message,
    });
  }
});
app.get("/api/serpapi-reviews", async (req, res) => {
  try {
    const business = req.query.business;

    if (!business) {
      return res.status(400).json({
        message: "Please provide a business name.",
      });
    }

    // Step 1: Find the business on Google Maps
   const mapsParams = new URLSearchParams({
  engine: "google_maps",
  type: "search",
  q: business,
  location: "Bhopal, Madhya Pradesh, India",
  m: "50000",
  hl: "en",
  api_key: process.env.SERPAPI_API_KEY,
});
console.log(
  "SERPAPI URL:",
  `https://serpapi.com/search.json?${mapsParams.toString().replace(
    process.env.SERPAPI_API_KEY,
    "HIDDEN"
  )}`
);

const mapsResponse = await fetch(
  `https://serpapi.com/search.json?${mapsParams.toString()}`
);

    const mapsData = await mapsResponse.json();

    if (!mapsResponse.ok) {
      console.error("SerpApi Maps error:", mapsData);

      return res.status(mapsResponse.status).json({
        message: "SerpApi business search failed.",
        error: mapsData.error,
      });
    }

    const place = mapsData.local_results?.[0];

    if (!place) {
      return res.status(404).json({
        message: `Could not find "${business}" on Google Maps.`,
      });
    }

    console.log("SERPAPI BUSINESS FOUND:");
    console.log("Name:", place.title);
    console.log("Rating:", place.rating);
    console.log("Reviews:", place.reviews);
    console.log("Place ID:", place.place_id);
    console.log("Data ID:", place.data_id);

    // Step 2: Get public Google Maps reviews
    const reviewsResponse = await fetch(
     `https://serpapi.com/search.json?engine=google_maps_reviews&data_id=${encodeURIComponent(
    place.data_id
  )}&hl=en&sort_by=newestFirst&api_key=${process.env.SERPAPI_API_KEY}`
    );

    const reviewsData = await reviewsResponse.json();

    if (!reviewsResponse.ok) {
      console.error(
        "SerpApi Reviews error:",
        reviewsData
      );

      return res.status(reviewsResponse.status).json({
        message: "SerpApi review search failed.",
        error: reviewsData.error,
      });
    }

    const reviews = (reviewsData.reviews || []).map(
      (review) => ({
        author:
          review.user?.name ||
          "Anonymous",

        rating:
          review.rating ?? null,

        date:
          review.date ||
          review.iso_date ||
          "",

        text:
          review.snippet ||
          review.extracted_snippet?.original ||
          review.extracted_snippet?.translated ||
          "",

        source:
          review.source ||
          "Google Maps",

        reviewId:
          review.review_id ||
          "",
      })
    );

    res.json({
      business: {
        name: place.title,
        rating: place.rating ?? null,
        reviewCount: place.reviews ?? 0,
        address: place.address || "",
        placeId: place.place_id || "",
        dataId: place.data_id || "",
      },

      reviews,

      count: reviews.length,

      source: "SerpApi / Google Maps",
    });

  } catch (error) {
    console.error(
      "SerpApi review error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch public reviews.",
      error: error.message,
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});