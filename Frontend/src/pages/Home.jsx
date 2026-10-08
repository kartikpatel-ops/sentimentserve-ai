import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Star,
  ShieldCheck,
  Brain,
  TrendingUp,
} from "lucide-react";

import "../App.css";

/*
=========================================================
API CONFIGURATION
=========================================================
*/

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://sentimentserve-ai.onrender.com";


/*
=========================================================
HOME
=========================================================
*/

function Home() {

  const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState("All");

  const [preference, setPreference] =
    useState("All");

  const [realBusinesses, setRealBusinesses] =
    useState([]);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const [user, setUser] =
    useState(null);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const navigate = useNavigate();


  /*
  ========================================================
  LOAD LOGGED-IN USER
  ========================================================
  */

  useEffect(() => {

    const savedUser =
      localStorage.getItem("user");

    if (savedUser) {

      try {

        const loggedInUser =
          JSON.parse(savedUser);

        setUser(loggedInUser);

      } catch (error) {

        console.error(
          "Failed to load user:",
          error
        );

      }

    }

  }, []);


  /*
  ========================================================
  PREFERENCE OPTIONS
  ========================================================
  */

  const preferenceOptions = {

    All: [
      {
        value: "All",
        label: "All Preferences",
      },
    ],


    /*
    ======================================================
    RESTAURANTS
    ======================================================
    */

    Restaurants: [

      {
        value: "All",
        label: "All Restaurants",
      },

      {
        value: "Vegetarian",
        label: "🥗 Vegetarian",
      },

      {
        value: "Non-Vegetarian",
        label: "🍗 Non-Vegetarian",
      },

      {
        value: "Vegan",
        label: "🌱 Vegan",
      },

      {
        value: "Jain",
        label: "🥗 Jain",
      },

      {
        value: "Budget",
        label: "💰 Budget",
      },

      {
        value: "Premium",
        label: "💎 Premium",
      },

      {
        value: "Family",
        label: "👨‍👩‍👧 Family Friendly",
      },

      {
        value: "FastFood",
        label: "🍔 Fast Food",
      },

      {
        value: "FineDining",
        label: "🍽️ Fine Dining",
      },

      {
        value: "Outdoor",
        label: "🌳 Outdoor Seating",
      },

    ],


    /*
    ======================================================
    CAFES
    ======================================================
    */

    Cafes: [

      {
        value: "All",
        label: "All Cafes",
      },

      {
        value: "Vegetarian",
        label: "🥗 Vegetarian",
      },

      {
        value: "Vegan",
        label: "🌱 Vegan",
      },

      {
        value: "Budget",
        label: "💰 Budget",
      },

      {
        value: "Premium",
        label: "💎 Premium",
      },

      {
        value: "Work",
        label: "💻 Work Friendly",
      },

      {
        value: "Outdoor",
        label: "🌳 Outdoor Seating",
      },

      {
        value: "Desserts",
        label: "🍰 Desserts",
      },

      {
        value: "Coffee",
        label: "☕ Coffee",
      },

      {
        value: "Family",
        label: "👨‍👩‍👧 Family Friendly",
      },

    ],


    /*
    ======================================================
    HOTELS
    ======================================================
    */

    Hotels: [

      {
        value: "All",
        label: "All Hotels",
      },

      {
        value: "Budget",
        label: "💰 Budget",
      },

      {
        value: "Luxury",
        label: "✨ Luxury",
      },

      {
        value: "Family",
        label: "👨‍👩‍👧 Family",
      },

      {
        value: "Business",
        label: "💼 Business",
      },

      {
        value: "Couple",
        label: "❤️ Couple Friendly",
      },

      {
        value: "PetFriendly",
        label: "🐕 Pet Friendly",
      },

      {
        value: "Pool",
        label: "🏊 Swimming Pool",
      },

      {
        value: "Parking",
        label: "🚗 Parking",
      },

      {
        value: "Breakfast",
        label: "🍳 Breakfast",
      },

      {
        value: "Airport",
        label: "✈️ Near Airport",
      },

    ],


    /*
    ======================================================
    OTHER CATEGORIES
    ======================================================
    */

    Shopping: [

      {
        value: "All",
        label: "All Shopping",
      },

      {
        value: "Budget",
        label: "💰 Budget",
      },

      {
        value: "Premium",
        label: "💎 Premium",
      },

    ],


    Travel: [

      {
        value: "All",
        label: "All Travel",
      },

      {
        value: "Family",
        label: "👨‍👩‍👧 Family",
      },

      {
        value: "Adventure",
        label: "🏔️ Adventure",
      },

      {
        value: "Honeymoon",
        label: "❤️ Honeymoon",
      },

    ],


    Technology: [

      {
        value: "All",
        label: "All Technology",
      },

      {
        value: "Software",
        label: "💻 Software",
      },

      {
        value: "Hardware",
        label: "🖥️ Hardware",
      },

    ],


    Transportation: [

      {
        value: "All",
        label: "All Transportation",
      },

      {
        value: "Bus",
        label: "🚌 Bus",
      },

      {
        value: "Taxi",
        label: "🚕 Taxi",
      },

      {
        value: "Train",
        label: "🚆 Train",
      },

    ],


    Banking: [

      {
        value: "All",
        label: "All Banks",
      },

      {
        value: "Government",
        label: "🏛️ Government Bank",
      },

      {
        value: "Private",
        label: "🏦 Private Bank",
      },

    ],

  };


  /*
  ========================================================
  PREFERENCE → GOOGLE SEARCH QUERY
  ========================================================
  */

  const preferenceQueries = {

    /*
    RESTAURANTS
    */

    Restaurants: {

      All:
        "restaurants",

      Vegetarian:
        "vegetarian restaurants",

      "Non-Vegetarian":
        "non vegetarian restaurants",

      Vegan:
        "vegan restaurants",

      Jain:
        "Jain restaurants",

      Budget:
        "budget restaurants",

      Premium:
        "premium restaurants",

      Family:
        "family friendly restaurants",

      FastFood:
        "fast food restaurants",

      FineDining:
        "fine dining restaurants",

      Outdoor:
        "restaurants with outdoor seating",

    },


    /*
    CAFES
    */

    Cafes: {

      All:
        "cafes",

      Vegetarian:
        "vegetarian cafes",

      Vegan:
        "vegan cafes",

      Budget:
        "budget cafes",

      Premium:
        "premium cafes",

      Work:
        "work friendly cafes",

      Outdoor:
        "cafes with outdoor seating",

      Desserts:
        "dessert cafes",

      Coffee:
        "coffee shops",

      Family:
        "family friendly cafes",

    },


    /*
    HOTELS
    */

    Hotels: {

      All:
        "hotels",

      Budget:
        "budget hotels",

      Luxury:
        "luxury hotels",

      Family:
        "family hotels",

      Business:
        "business hotels",

      Couple:
        "couple friendly hotels",

      PetFriendly:
        "pet friendly hotels",

      Pool:
        "hotels with swimming pool",

      Parking:
        "hotels with parking",

      Breakfast:
        "hotels with breakfast",

      Airport:
        "hotels near airport",

    },


    /*
    OTHER CATEGORIES
    */

    Shopping: {

      All:
        "shopping malls",

      Budget:
        "budget shopping malls",

      Premium:
        "premium shopping malls",

    },


    Travel: {

      All:
        "travel agencies",

      Family:
        "family travel agencies",

      Adventure:
        "adventure travel agencies",

      Honeymoon:
        "honeymoon travel agencies",

    },


    Technology: {

      All:
        "technology companies",

      Software:
        "software companies",

      Hardware:
        "hardware companies",

    },


    Transportation: {

      All:
        "transportation services",

      Bus:
        "bus services",

      Taxi:
        "taxi services",

      Train:
        "train services",

    },


    Banking: {

      All:
        "banks",

      Government:
        "government banks",

      Private:
        "private banks",

    },

  };


  /*
  ========================================================
  CATEGORY + PREFERENCE SEARCH
  ========================================================
  */

  const handleCategoryChange = async (
    selectedCategory,
    selectedPreference = "All"
  ) => {

    setCategory(selectedCategory);

    setPreference(selectedPreference);

    try {

      setSearchLoading(true);

      setRealBusinesses([]);


      /*
      Find query based on category
      and preference.
      */

      let query = "businesses";


      if (
        preferenceQueries[selectedCategory] &&
        preferenceQueries[selectedCategory][
          selectedPreference
        ]
      ) {

        query =
          preferenceQueries[
            selectedCategory
          ][selectedPreference];

      } else {

        const categoryQueries = {

          All:
            "businesses",

          Restaurants:
            "restaurants",

          Cafes:
            "cafes",

          Shopping:
            "shopping malls",

          Travel:
            "travel agencies",

          Technology:
            "technology companies",

          Hotels:
            "hotels",

          Transportation:
            "transportation services",

          Banking:
            "banks",

        };

        query =
          categoryQueries[
            selectedCategory
          ] || "businesses";

      }


      console.log(
        "Google Places search:",
        query
      );


      /*
      ====================================================
      CALL RENDER BACKEND
      ====================================================
      */

      const response =
        await fetch(
          `${API_URL}/api/google-businesses?query=${encodeURIComponent(
            query
          )}`
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Business search failed."
        );

      }


      setRealBusinesses(
        data.businesses || []
      );


    } catch (error) {

      console.error(
        "Preference business search error:",
        error
      );


      alert(
        error.message ||
        "Unable to load businesses for this preference."
      );


    } finally {

      setSearchLoading(false);

    }

  };


  /*
  ========================================================
  LOAD BUSINESSES WHEN HOME OPENS
  ========================================================
  */

  useEffect(() => {

    handleCategoryChange(
      "All",
      "All"
    );

  }, []);


  /*
  ========================================================
  GOOGLE BUSINESS SEARCH
  ========================================================
  */

  const handleSearch = async () => {

    const searchText =
      search.trim();


    if (searchText === "") {

      alert(
        "Please enter a business or location."
      );

      return;

    }


    try {

      setSearchLoading(true);

      setRealBusinesses([]);


      const response =
        await fetch(
          `${API_URL}/api/google-businesses?query=${encodeURIComponent(
            searchText
          )}`
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Google business search failed."
        );

      }


      setRealBusinesses(
        data.businesses || []
      );


    } catch (error) {

      console.error(
        "Google business search error:",
        error
      );


      alert(
        error.message ||
        "Unable to search Google businesses."
      );


    } finally {

      setSearchLoading(false);

    }

  };


  /*
  ========================================================
  BUSINESS STATISTICS
  ========================================================
  */

  const businessesWithRatings =
    realBusinesses

      .map((business) =>
        Number(business.rating)
      )

      .filter(
        (rating) =>
          !Number.isNaN(rating) &&
          rating > 0
      );


  const averageRating =
    businessesWithRatings.length > 0

      ? (
          businessesWithRatings.reduce(
            (sum, rating) =>
              sum + rating,
            0
          ) /
          businessesWithRatings.length
        ).toFixed(1)

      : "—";


  const totalReviews =
    realBusinesses.reduce(
      (total, business) =>
        total +
        Number(
          business.reviewCount ||
          business.total_ratings ||
          0
        ),
      0
    );


  /*
  ========================================================
  LOGOUT
  ========================================================
  */

  const handleLogout = () => {

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    setUser(null);

    setProfileOpen(false);

    navigate("/");

  };


  /*
  ========================================================
  RETURN
  ========================================================
  */

  return (

    <div className="app">


      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="navbar">


        <div className="logo">

          <span>
            Sentiment
          </span>

          Serve AI

        </div>


        <div className="nav-links">


          <a href="#businesses">
            Businesses
          </a>


          <button
            onClick={() =>
              navigate("/ai-insights")
            }
          >
            AI Insights
          </button>


          <button
            onClick={() =>
              navigate("/recommendations")
            }
          >
            Recommendations
          </button>


          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Dashboard
          </button>


          <a href="#about">
            About
          </a>


        </div>


        {/* =================================================
            PROFILE / LOGIN
        ================================================= */}

        {user ? (

          <div className="nav-auth-buttons">


            <div className="profile-menu">


              <button
                className="profile-button"
                onClick={() =>
                  setProfileOpen(
                    !profileOpen
                  )
                }
                aria-expanded={
                  profileOpen
                }
              >


                <span className="profile-avatar">
                  👤
                </span>


                <span className="profile-name">

                  {user.name ||
                    "User"}

                </span>


                <span className="profile-arrow">

                  {profileOpen
                    ? "▲"
                    : "▼"}

                </span>


              </button>


              {profileOpen && (

                <div className="profile-dropdown">


                  <div className="profile-dropdown-header">


                    <div className="profile-large-avatar">
                      👤
                    </div>


                    <div>

                      <strong>

                        {user.name ||
                          "User"}

                      </strong>


                      {user.email && (

                        <span>
                          {user.email}
                        </span>

                      )}

                    </div>


                  </div>


                  <div className="profile-details">


                    {user.company && (

                      <div className="profile-detail">

                        <span>
                          Company
                        </span>

                        <strong>
                          {user.company}
                        </strong>

                      </div>

                    )}


                    {user.role && (

                      <div className="profile-detail">

                        <span>
                          Role
                        </span>

                        <strong>
                          {user.role}
                        </strong>

                      </div>

                    )}


                    {user.username && (

                      <div className="profile-detail">

                        <span>
                          Username
                        </span>

                        <strong>
                          {user.username}
                        </strong>

                      </div>

                    )}


                  </div>


                  <div className="profile-dropdown-footer">


                    <button
                      className="profile-logout"
                      onClick={
                        handleLogout
                      }
                    >
                      Logout
                    </button>


                  </div>


                </div>

              )}


            </div>


          </div>

        ) : (

          <div className="nav-auth-buttons">


            <button
              className="login-btn"
              onClick={() =>
                navigate("/login")
              }
            >
              Login
            </button>


            <button
              className="signup-btn"
              onClick={() =>
                navigate("/signup")
              }
            >
              Sign Up
            </button>


          </div>

        )}


      </nav>


      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">


        <div className="hero-content">


          <div className="ai-badge">

            <Brain size={18} />

            AI-Powered Insights

          </div>


          <h1>

            Find Real Opinions.

            <br />

            Make Better Choices.

          </h1>


          <p>

            Discover trusted reviews,
            understand customer sentiment,
            and get smarter AI-powered
            insights before you decide.

          </p>


          <div className="search-box">


            <Search size={22} />


            <input
              type="text"
              placeholder="Search for a business..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {

                  handleSearch();

                }

              }}
            />


            <button
              onClick={
                handleSearch
              }
            >
              Search
            </button>


          </div>


          <div className="trusted-text">

            <ShieldCheck size={16} />

            Trusted reviews •
            AI-powered analysis •
            Real insights

          </div>


        </div>


      </section>


      {/* =================================================
          POPULAR BUSINESSES
      ================================================= */}

      <section
        className="business-section"
        id="businesses"
      >


        <div className="section-heading">


          <div>

            <h2>
              Popular Businesses
            </h2>

            <p>
              See what customers are
              saying right now.
            </p>

          </div>


          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="filters-container">


            {/* CATEGORY */}

            <div className="category-dropdown">


              <label htmlFor="category">
                Category:
              </label>


              <select
                id="category"
                value={category}
                onChange={(e) => {

                  const newCategory =
                    e.target.value;


                  setCategory(
                    newCategory
                  );


                  setPreference(
                    "All"
                  );


                  handleCategoryChange(
                    newCategory,
                    "All"
                  );

                }}
              >


                <option value="All">
                  All Categories
                </option>


                <option value="Restaurants">
                  🍽️ Restaurants
                </option>


                <option value="Cafes">
                  ☕ Cafes
                </option>


                <option value="Hotels">
                  🏨 Hotels
                </option>


                <option value="Shopping">
                  🛍️ Shopping
                </option>


                <option value="Travel">
                  ✈️ Travel
                </option>


                <option value="Technology">
                  💻 Technology
                </option>


                <option value="Transportation">
                  🚌 Transportation
                </option>


                <option value="Banking">
                  🏦 Banking
                </option>


              </select>


            </div>


            {/* =================================================
                PREFERENCE
            ================================================= */}

            <div className="category-dropdown">


              <label htmlFor="preference">
                Preference:
              </label>


              <select
                id="preference"
                value={preference}
                onChange={(e) => {

                  const newPreference =
                    e.target.value;


                  handleCategoryChange(
                    category,
                    newPreference
                  );

                }}
              >


                {(
                  preferenceOptions[
                    category
                  ] ||
                  preferenceOptions.All
                ).map(
                  (option) => (

                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >

                      {option.label}

                    </option>

                  )
                )}


              </select>


            </div>


          </div>


          {/* =================================================
              REFRESH
          ================================================= */}

          <button
            className="view-btn"
            onClick={() => {

              setCategory(
                "All"
              );

              setPreference(
                "All"
              );

              setSearch("");

              handleCategoryChange(
                "All",
                "All"
              );

            }}
          >
            Refresh Businesses
          </button>


        </div>


        {/* =================================================
            BUSINESS GRID
        ================================================= */}

        <div className="business-grid">


          {searchLoading ? (

            <p>
              Finding businesses...
            </p>

          ) : realBusinesses.length > 0 ? (

            realBusinesses.map(
              (business) => (

                <BusinessCard

                  key={
                    business.placeId ||
                    business.id ||
                    business.name
                  }


                  name={
                    business.name
                  }


                  category={
                    business.category ||
                    "Google Business"
                  }


                  rating={
                    business.rating ||
                    "New"
                  }


                  reviews={
                    business.reviewCount ||
                    business.total_ratings ||
                    0
                  }


                  onClick={() => {

                    navigate(
                      "/company/google",
                      {
                        state: {
                          business,
                        },
                      }
                    );

                  }}

                />

              )
            )

          ) : (

            <p>

              No Google businesses
              found yet.

              <br />

              Search for a business
              or select a category.

            </p>

          )}


        </div>


      </section>


      {/* =================================================
          AI INSIGHTS SECTION
      ================================================= */}

      <section
        className="insights"
        id="insights"
      >


        <div className="insights-text">


          <div className="badge">

            <Brain size={18} />

            Powered by AI

          </div>


          <h2>

            Reviews tell the story.

            <span>
              {" "}AI explains it.
            </span>

          </h2>


          <p>

            Instead of simply showing
            star ratings, SentimentServe AI
            analyzes customer reviews to
            discover what people love, what
            frustrates them, and what
            businesses can improve.

          </p>


          <div className="features">


            <Feature
              icon={<Brain />}
              title="Sentiment Analysis"
              text="Automatically detect positive, neutral, and negative opinions."
            />


            <Feature
              icon={<TrendingUp />}
              title="Customer Trends"
              text="Discover changing customer opinions and important trends."
            />


            <Feature
              icon={<Star />}
              title="Smart Ratings"
              text="Combine ratings and AI insights to understand businesses better."
            />


          </div>


        </div>


        {/* =================================================
            REAL BUSINESS INSIGHTS
        ================================================= */}

        <div className="ai-card">


          <div className="ai-header">

            <Brain size={22} />

            Live Business Insights

          </div>


          {realBusinesses.length > 0 ? (

            <>


              <p className="ai-description">

                Real information from the
                businesses currently returned
                by Google Places.

              </p>


              {/* BUSINESSES FOUND */}

              <div className="sentiment-row">

                <span>
                  Businesses found
                </span>

                <strong>
                  {realBusinesses.length}
                </strong>

              </div>


              <div className="progress">

                <div
                  style={{
                    width:
                      "100%",
                  }}
                />

              </div>


              {/* AVERAGE RATING */}

              <div className="sentiment-row">

                <span>
                  Average Google rating
                </span>

                <strong>

                  {averageRating}

                  {averageRating !==
                  "—"
                    ? " ★"
                    : ""}

                </strong>

              </div>


              <div className="progress">

                <div
                  style={{
                    width:
                      averageRating !==
                      "—"
                        ? `${Math.min(
                            Number(
                              averageRating
                            ) *
                              20,
                            100
                          )}%`
                        : "0%",
                  }}
                />

              </div>


              {/* TOTAL REVIEWS */}

              <div className="sentiment-row">

                <span>
                  Total Google reviews
                </span>

                <strong>

                  {totalReviews.toLocaleString()}

                </strong>

              </div>


              <div className="progress">

                <div
                  style={{
                    width:
                      totalReviews >
                      0
                        ? "100%"
                        : "0%",
                  }}
                />

              </div>


              {/* AI NOTE */}

              <div className="ai-message">

                <Brain size={18} />

                <span>

                  Select a business
                  to open its detailed
                  AI analysis. Sentiment
                  percentages are calculated
                  only when actual review
                  data is available.

                </span>

              </div>


            </>

          ) : (

            <>


              <p className="ai-description">

                Search for a business or
                select a category to see
                live business insights.

              </p>


              <div className="ai-message">

                <Search size={18} />

                <span>

                  Google ratings, review
                  counts, and business
                  information will appear
                  here when results are
                  available.

                </span>

              </div>


            </>

          )}


        </div>


      </section>


      {/* =================================================
          ABOUT
      ================================================= */}

      <section
        id="about"
        className="about-section"
      >


        <div className="about-container">


          {/* ABOUT PROJECT */}

          <div className="about-content">


            <span className="about-badge">

              About SentimentServe AI

            </span>


            <h2>

              Understand Customer Opinions.

              <span>
                {" "}Make Smarter Decisions.
              </span>

            </h2>


            <p className="about-intro">

              SentimentServe AI is an
              AI-powered business review
              and customer insights platform
              designed to help users discover
              genuine opinions and help
              businesses understand their
              customers better.

            </p>


            <p>

              The platform analyzes customer
              reviews and feedback using
              Artificial Intelligence to identify
              sentiment, important topics,
              customer satisfaction and common
              concerns.

            </p>


            <p>

              Instead of simply displaying
              reviews, SentimentServe AI
              transforms customer feedback
              into meaningful insights that can
              help businesses improve their
              services and help users make
              more informed decisions.

            </p>


            {/* PROJECT FEATURES */}

            <div className="about-features">


              <div className="about-feature">

                <div className="about-feature-icon">
                  🧠
                </div>

                <div>

                  <h4>
                    AI Sentiment Analysis
                  </h4>

                  <p>

                    Understand whether
                    customer feedback is
                    positive, neutral or
                    negative.

                  </p>

                </div>

              </div>


              <div className="about-feature">

                <div className="about-feature-icon">
                  📊
                </div>

                <div>

                  <h4>
                    Business Insights
                  </h4>

                  <p>

                    Convert customer reviews
                    into useful business insights
                    and trends.

                  </p>

                </div>

              </div>


              <div className="about-feature">

                <div className="about-feature-icon">
                  ⭐
                </div>

                <div>

                  <h4>
                    Customer Reviews
                  </h4>

                  <p>

                    Share experiences, ratings
                    and opinions about businesses.

                  </p>

                </div>

              </div>


              <div className="about-feature">

                <div className="about-feature-icon">
                  🔍
                </div>

                <div>

                  <h4>
                    Smart Discovery
                  </h4>

                  <p>

                    Search businesses and
                    explore customer experiences
                    in one place.

                  </p>

                </div>

              </div>


            </div>


          </div>


          {/* CONTACT CARD */}

          <div className="about-contact-card">


            <div className="contact-card-header">


              <div className="contact-main-icon">
                💬
              </div>


              <div>

                <h3>
                  Get in Touch
                </h3>

                <p>

                  Have questions, suggestions
                  or feedback? Contact the
                  SentimentServe AI team.

                </p>

              </div>


            </div>


            {/* PHONE */}

            <div className="contact-detail">


              <div className="contact-detail-icon">
                📞
              </div>


              <div>

                <span>
                  Contact Number
                </span>


                <a href="tel:+918817874033">

                  +91 8817874033

                </a>

              </div>


            </div>


            {/* EMAIL */}

            <div className="contact-detail">


              <div className="contact-detail-icon">
                ✉️
              </div>


              <div>

                <span>
                  Email
                </span>


                <a href="mailto:kartikpatel@181007@gmail.com">

                  kartikpatel@181007@gmail.com

                </a>

              </div>


            </div>


            {/* PLATFORM */}

            <div className="contact-detail">


              <div className="contact-detail-icon">
                🌐
              </div>


              <div>

                <span>
                  Platform
                </span>


                <strong>
                  SentimentServe AI
                </strong>

              </div>


            </div>


            {/* PROJECT */}

            <div className="contact-detail">


              <div className="contact-detail-icon">
                🚀
              </div>


              <div>

                <span>
                  Project
                </span>


                <strong>
                  AI-Powered Customer Insights
                </strong>

              </div>


            </div>


            {/* SOCIAL LINKS */}

            <div className="contact-social">


              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>


              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>


            </div>


            <div className="contact-footer">

              Built with ❤️ by the
              SentimentServe AI Team

            </div>


          </div>


        </div>


        {/* PROJECT HIGHLIGHTS */}

        <div className="project-info">


          <div className="project-info-item">

            <strong>
              AI Powered
            </strong>

            <span>
              Intelligent review analysis
            </span>

          </div>


          <div className="project-info-item">

            <strong>
              Real Insights
            </strong>

            <span>
              Customer-driven business information
            </span>

          </div>


          <div className="project-info-item">

            <strong>
              Smart Decisions
            </strong>

            <span>
              Better choices through data
            </span>

          </div>


          <div className="project-info-item">

            <strong>
              Customer Focused
            </strong>

            <span>
              Built around real experiences
            </span>

          </div>


        </div>


      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer>


        <div className="logo">

          <span>
            Sentiment
          </span>

          Serve AI

        </div>


        <p>

          AI-powered customer intelligence
          platform.

        </p>


        <div className="footer-contact">

          <span>
            📞 +91 8817874033
          </span>

          <span>
            ✉️ kartikpatel@181007@gmail.com
          </span>

        </div>


        <p className="copyright">

          © 2026 SentimentServe AI.
          Built for Hackathon.

        </p>


      </footer>


    </div>

  );

}


/*
=========================================================
BUSINESS EMOJI
=========================================================
*/

function getBusinessEmoji(
  name,
  category
) {

  const businessName =
    String(name || "")
      .toLowerCase();

  const businessCategory =
    String(category || "")
      .toLowerCase();


  /*
  SHOPPING
  */

  if (
    businessName.includes("mall") ||
    businessName.includes("market") ||
    businessName.includes("mart") ||
    businessName.includes("shopping")
  ) {

    return "🛍️";

  }


  /*
  RESTAURANTS
  */

  if (
    businessName.includes("restaurant") ||
    businessName.includes("cafe") ||
    businessName.includes("café") ||
    businessName.includes("food") ||
    businessName.includes("dhaba") ||
    businessName.includes("kitchen")
  ) {

    return "🍽️";

  }


  /*
  HOTELS
  */

  if (
    businessName.includes("hotel") ||
    businessName.includes("resort") ||
    businessName.includes("inn")
  ) {

    return "🏨";

  }


  /*
  BANKS
  */

  if (
    businessName.includes("bank") ||
    businessName.includes("hdfc") ||
    businessName.includes("icici") ||
    businessName.includes("sbi") ||
    businessName.includes("axis")
  ) {

    return "🏦";

  }


  /*
  HOSPITALS
  */

  if (
    businessName.includes("hospital") ||
    businessName.includes("clinic") ||
    businessName.includes("health")
  ) {

    return "🏥";

  }


  /*
  CINEMA
  */

  if (
    businessName.includes("inox") ||
    businessName.includes("cinema") ||
    businessName.includes("movie") ||
    businessName.includes("theatre") ||
    businessName.includes("theater")
  ) {

    return "🎬";

  }


  /*
  TRAVEL
  */

  if (
    businessName.includes("travel") ||
    businessName.includes("tour") ||
    businessName.includes("trip")
  ) {

    return "✈️";

  }


  /*
  CATEGORY FALLBACK
  */

  if (
    businessCategory.includes("food") ||
    businessCategory.includes("restaurant")
  ) {

    return "🍽️";

  }


  if (
    businessCategory.includes("cafe")
  ) {

    return "☕";

  }


  if (
    businessCategory.includes("shopping")
  ) {

    return "🛍️";

  }


  if (
    businessCategory.includes("hotel")
  ) {

    return "🏨";

  }


  if (
    businessCategory.includes("bank")
  ) {

    return "🏦";

  }


  return "🏢";

}


/*
=========================================================
BUSINESS IMAGE CACHE
=========================================================
*/

const imageCache = {};


/*
=========================================================
BUSINESS CARD
=========================================================
*/

function BusinessCard({
  name,
  category,
  rating,
  reviews,
  onClick,
}) {


  const [imageUrl, setImageUrl] =
    useState("");


  const [photographer, setPhotographer] =
    useState("");


  useEffect(() => {


    const loadBusinessImage =
      async () => {


        const cacheKey =
          `${name}-${category}`;


        /*
        CHECK CACHE
        */

        if (
          imageCache[cacheKey]
        ) {

          setImageUrl(
            imageCache[cacheKey]
          );

          return;

        }


        try {


          const response =
            await fetch(
              `${API_URL}/api/business-image?query=${encodeURIComponent(
                `${name} ${category}`
              )}`
            );


          const data =
            await response.json();


          if (
            response.ok &&
            data.imageUrl
          ) {


            setImageUrl(
              data.imageUrl
            );


            setPhotographer(
              data.photographer ||
              ""
            );


            imageCache[
              cacheKey
            ] =
              data.imageUrl;


          }


        } catch (error) {


          console.error(
            "Business image loading error:",
            error
          );


        }

      };


    loadBusinessImage();


  }, [name, category]);


  /*
  ========================================================
  REAL STAR DISPLAY
  ========================================================
  */

  const numericRating =
    Number(rating) || 0;


  const roundedRating =
    Math.round(
      numericRating
    );


  return (


    <div
      className="business-card"
      onClick={onClick}
      style={{
        cursor: "pointer",
      }}
    >


      {/* IMAGE */}

      <div className="company-image">


        {imageUrl ? (


          <img
            src={imageUrl}
            alt={name}
          />


        ) : (


          <div className="image-placeholder">

            {getBusinessEmoji(
              name,
              category
            )}

          </div>

        )}


      </div>


      {/* BUSINESS INFO */}

      <div className="company-info">


        <h3>
          {name}
        </h3>


        <p>
          {category}
        </p>


        {/* RATING */}

        <div className="rating">


          <div className="stars">


            {"★★★★★"
              .split("")
              .map(
                (_, index) =>
                  index <
                  roundedRating
                    ? "★"
                    : "☆"
              )
              .join("")}


          </div>


          <strong>
            {rating}
          </strong>


          <span>

            {Number(
              reviews || 0
            ).toLocaleString()}

            {" "}
            reviews

          </span>


        </div>


        {/* PHOTO CREDIT */}

        {photographer && (

          <small>

            Photo by {photographer}
            {" "} / Pexels

          </small>

        )}


      </div>


    </div>

  );

}


/*
=========================================================
FEATURE
=========================================================
*/

function Feature({
  icon,
  title,
  text,
}) {


  return (


    <div className="feature">


      <div className="feature-icon">

        {icon}

      </div>


      <div>


        <h3>
          {title}
        </h3>


        <p>
          {text}
        </p>


      </div>


    </div>

  );

}


export default Home;