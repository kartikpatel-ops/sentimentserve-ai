const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Business = require("../models/Business");

dotenv.config();

const businesses = [
  {
    name: "TechNova Solutions",
    slug: "technova",
    category: "Technology",
    description: "Technology and software services.",
    location: {
      city: "Bhopal",
      state: "Madhya Pradesh",
      country: "India",
    },
    logo: "T",
    recommendation: {
      budget: "Medium",
      purposes: ["Business", "Technology", "Professional"],
      familyFriendly: true,
      accessibility: true,
    },
  },

  {
    name: "QuickKart",
    slug: "quickkart",
    category: "Shopping",
    description: "Online shopping and delivery platform.",
    location: {
      city: "Bhopal",
      state: "Madhya Pradesh",
      country: "India",
    },
    logo: "Q",
    recommendation: {
      budget: "Medium",
      purposes: ["Shopping", "Daily Needs"],
      familyFriendly: true,
      accessibility: true,
    },
  },

  {
    name: "TravelEase",
    slug: "travelease",
    category: "Travel",
    description: "Online travel and booking services.",
    location: {
      city: "Bhopal",
      state: "Madhya Pradesh",
      country: "India",
    },
    logo: "T",
    recommendation: {
      budget: "Medium",
      purposes: ["Travel", "Vacation", "Business"],
      familyFriendly: true,
      accessibility: true,
    },
  },
];

const seedBusinesses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    await Business.deleteMany({});

    await Business.insertMany(businesses);

    console.log("Businesses inserted successfully.");

    await mongoose.connection.close();

    console.log("Database connection closed.");
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedBusinesses();