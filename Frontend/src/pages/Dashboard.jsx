import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Brain,
  Star,
  MessageSquare,
  TrendingUp,
  ThumbsUp,
  AlertTriangle,
} from "lucide-react";

import "../App.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  const [positiveSentiment, setPositiveSentiment] = useState(0);
  const [neutralSentiment, setNeutralSentiment] = useState(0);
  const [negativeSentiment, setNegativeSentiment] = useState(0);

  const [businessInsights, setBusinessInsights] = useState(null);

  const [customerGrowth, setCustomerGrowth] = useState(0);

  const [loading, setLoading] = useState(true);

  // =========================================================
  // LOAD DASHBOARD DATA
  // =========================================================

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      console.log("No logged-in user found.");
      setLoading(false);
      return;
    }

    let loggedInUser;

    try {
      loggedInUser = JSON.parse(savedUser);

      setUser(loggedInUser);
    } catch (error) {
      console.error("Failed to read saved user:", error);

      setLoading(false);

      return;
    }

    // IMPORTANT:
    // Use loggedInUser directly.
    // Do NOT use user?.company here because setUser()
    // updates state asynchronously.

    const company =
      loggedInUser?.company ||
      localStorage.getItem("company") ||
      "";

    console.log("=================================");
    console.log("DASHBOARD USER:", loggedInUser);
    console.log("DASHBOARD COMPANY:", company);
    console.log("=================================");

    if (!company) {
      console.warn(
        "No company found for the logged-in user."
      );

      setLoading(false);

      return;
    }

    // =========================================================
    // GET REVIEWS
    // =========================================================

    fetch(
      `https://sentimentserve-ai.onrender.com/api/reviews/${encodeURIComponent(
        company
      )}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch reviews"
          );
        }

        return response.json();
      })
      .then((data) => {
        const reviews = data.reviews || [];

        console.log(
          "DASHBOARD REVIEWS:",
          reviews
        );

        // =====================================================
        // TOTAL REVIEWS
        // =====================================================

        setReviewCount(reviews.length);

        // =====================================================
        // AVERAGE RATING
        // =====================================================

        if (reviews.length > 0) {
          const totalRating = reviews.reduce(
            (sum, review) =>
              sum + Number(review.rating || 0),
            0
          );

          const realAverageRating =
            totalRating / reviews.length;

          setAverageRating(
            Number(
              realAverageRating.toFixed(1)
            )
          );
        } else {
          setAverageRating(0);
        }

        // =====================================================
        // CUSTOMER GROWTH
        // =====================================================

        const now = new Date();

        const currentPeriodStart =
          new Date();

        currentPeriodStart.setDate(
          now.getDate() - 30
        );

        const previousPeriodStart =
          new Date();

        previousPeriodStart.setDate(
          now.getDate() - 60
        );

        const currentPeriod =
          reviews.filter((review) => {
            if (!review.createdAt) {
              return false;
            }

            const reviewDate =
              new Date(review.createdAt);

            return (
              reviewDate >=
                currentPeriodStart &&
              reviewDate <= now
            );
          });

        const previousPeriod =
          reviews.filter((review) => {
            if (!review.createdAt) {
              return false;
            }

            const reviewDate =
              new Date(review.createdAt);

            return (
              reviewDate >=
                previousPeriodStart &&
              reviewDate <
                currentPeriodStart
            );
          });

        let growth = 0;

        if (previousPeriod.length > 0) {
          growth =
            ((currentPeriod.length -
              previousPeriod.length) /
              previousPeriod.length) *
            100;
        } else if (
          currentPeriod.length > 0
        ) {
          growth = 100;
        }

        setCustomerGrowth(
          Math.round(growth)
        );

        // =====================================================
        // SENTIMENT CALCULATION
        // =====================================================

        if (reviews.length === 0) {
          setPositiveSentiment(0);
          setNeutralSentiment(0);
          setNegativeSentiment(0);

          return;
        }

        const positiveReviews =
          reviews.filter(
            (review) =>
              String(
                review.sentiment || ""
              ).toLowerCase() ===
              "positive"
          );

        const neutralReviews =
          reviews.filter(
            (review) =>
              String(
                review.sentiment || ""
              ).toLowerCase() ===
              "neutral"
          );

        const negativeReviews =
          reviews.filter(
            (review) =>
              String(
                review.sentiment || ""
              ).toLowerCase() ===
              "negative"
          );

        setPositiveSentiment(
          Math.round(
            (positiveReviews.length /
              reviews.length) *
              100
          )
        );

        setNeutralSentiment(
          Math.round(
            (neutralReviews.length /
              reviews.length) *
              100
          )
        );

        setNegativeSentiment(
          Math.round(
            (negativeReviews.length /
              reviews.length) *
              100
          )
        );
      })
      .catch((error) => {
        console.error(
          "Failed to fetch reviews:",
          error
        );

        setReviewCount(0);
        setAverageRating(0);
        setPositiveSentiment(0);
        setNeutralSentiment(0);
        setNegativeSentiment(0);
      });

    // =========================================================
    // GET AI BUSINESS INSIGHTS
    // =========================================================

    fetch(
      `https://sentimentserve-ai.onrender.com/api/business-insights/${encodeURIComponent(
        company
      )}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch business insights"
          );
        }

        return response.json();
      })
      .then((data) => {
        console.log(
          "DASHBOARD AI INSIGHTS:",
          data.insights
        );

        setBusinessInsights(
          data.insights || null
        );
      })
      .catch((error) => {
        console.error(
          "Failed to fetch business insights:",
          error
        );

        setBusinessInsights(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("company");

    navigate("/login");
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="dashboard-page">

        <button
          className="back-home-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <div className="dashboard-loading">
          <Brain size={42} />

          <h2>
            Loading Dashboard...
          </h2>

          <p>
            Analyzing your business data.
          </p>
        </div>

      </div>
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <div className="dashboard-page">

      {/* =====================================================
          BACK TO HOME
      ===================================================== */}

      <button
        className="back-home-btn"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="dashboard-header">

        <div>

          <p className="dashboard-label">
            BUSINESS DASHBOARD
          </p>

          <h1>
            Welcome,{" "}
            {user?.name || "User"}!
          </h1>

          <p className="dashboard-business-name">
            Business:{" "}
            {user?.company ||
              "No business selected"}
          </p>

          <p>
            Customer intelligence and AI
            insights
          </p>

        </div>

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="stats-grid">

        {/* OVERALL RATING */}

        <div className="stat-card">

          <div className="stat-icon">
            <Star />
          </div>

          <div>

            <p>
              Overall Rating
            </p>

            <h2>
              {reviewCount > 0
                ? averageRating
                : "0"}
            </h2>

          </div>

        </div>


        {/* TOTAL REVIEWS */}

        <div className="stat-card">

          <div className="stat-icon">
            <MessageSquare />
          </div>

          <div>

            <p>
              Total Reviews
            </p>

            <h2>
              {reviewCount}
            </h2>

          </div>

        </div>


        {/* POSITIVE SENTIMENT */}

        <div className="stat-card">

          <div className="stat-icon">
            <ThumbsUp />
          </div>

          <div>

            <p>
              Positive Sentiment
            </p>

            <h2>
              {positiveSentiment}%
            </h2>

          </div>

        </div>


        {/* CUSTOMER GROWTH */}

        <div className="stat-card">

          <div className="stat-icon">
            <TrendingUp />
          </div>

          <div>

            <p>
              Customer Growth
            </p>

            <h2>
              {customerGrowth >= 0
                ? `+${customerGrowth}%`
                : `${customerGrowth}%`}
            </h2>

          </div>

        </div>

      </div>


      {/* =====================================================
          AI CUSTOMER INSIGHTS
      ===================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-title">

          <Brain />

          <div>

            <h2>
              AI Customer Insights
            </h2>

            <p>
              What your customers are
              saying about your business.
            </p>

          </div>

        </div>


        <div className="dashboard-insights">

          {/* POSITIVE */}

          <div className="dashboard-insight positive-dashboard">

            <ThumbsUp />

            <div>

              <h3>
                What's working well?
              </h3>

              <p>
                {reviewCount > 0 &&
                businessInsights?.strengths
                  ?.length > 0
                  ? businessInsights.strengths.join(
                      ", "
                    )
                  : "No positive insights available yet."}
              </p>

            </div>

          </div>


          {/* WARNING */}

          <div className="dashboard-insight warning-dashboard">

            <AlertTriangle />

            <div>

              <h3>
                What needs attention?
              </h3>

              <p>
                {reviewCount > 0 &&
                businessInsights?.weaknesses
                  ?.length > 0
                  ? businessInsights.weaknesses.join(
                      ", "
                    )
                  : "No major weaknesses detected yet."}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SENTIMENT OVERVIEW
      ===================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-title">

          <Brain />

          <div>

            <h2>
              Sentiment Overview
            </h2>

            <p>
              AI analysis of your
              customer reviews.
            </p>

          </div>

        </div>


        <div className="sentiment-dashboard">

          {reviewCount === 0 ? (

            <div className="ai-empty-state">

              <div className="ai-empty-icon">
                🤖
              </div>

              <h3>
                No reviews to analyze yet
              </h3>

              <p>
                Positive, neutral, and
                negative sentiment
                percentages will appear
                after customers submit
                reviews.
              </p>

            </div>

          ) : (

            <>

              {/* POSITIVE */}

              <div className="dashboard-sentiment-row">

                <span>
                  Positive
                </span>

                <strong>
                  {positiveSentiment}%
                </strong>

              </div>

              <div className="dashboard-progress">

                <div
                  className="dashboard-positive"
                  style={{
                    width: `${positiveSentiment}%`,
                  }}
                />

              </div>


              {/* NEUTRAL */}

              <div className="dashboard-sentiment-row">

                <span>
                  Neutral
                </span>

                <strong>
                  {neutralSentiment}%
                </strong>

              </div>

              <div className="dashboard-progress">

                <div
                  className="dashboard-neutral"
                  style={{
                    width: `${neutralSentiment}%`,
                  }}
                />

              </div>


              {/* NEGATIVE */}

              <div className="dashboard-sentiment-row">

                <span>
                  Negative
                </span>

                <strong>
                  {negativeSentiment}%
                </strong>

              </div>

              <div className="dashboard-progress">

                <div
                  className="dashboard-negative"
                  style={{
                    width: `${negativeSentiment}%`,
                  }}
                />

              </div>

            </>

          )}

        </div>

      </section>


      {/* =====================================================
          AI RECOMMENDATIONS
      ===================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-title">

          <TrendingUp />

          <div>

            <h2>
              AI Recommendations
            </h2>

            <p>
              Suggested actions based on
              customer feedback.
            </p>

          </div>

        </div>


        <div className="recommendation-grid">

          {reviewCount === 0 ? (

            <div className="recommendation-card">

              <span>
                🤖
              </span>

              <h3>
                No recommendations yet
              </h3>

              <p>
                AI recommendations will
                appear after customers
                submit reviews and
                SentimentServe analyzes
                their feedback.
              </p>

            </div>

          ) : (

            <>

              {/* RECOMMENDATION 1 */}

              <div className="recommendation-card">

                <span>
                  01
                </span>

                <h3>
                  Improve Support Response
                </h3>

                <p>
                  Customers frequently
                  mention response time.
                  Consider increasing
                  support availability.
                </p>

              </div>


              {/* RECOMMENDATION 2 */}

              <div className="recommendation-card">

                <span>
                  02
                </span>

                <h3>
                  Maintain Delivery Speed
                </h3>

                <p>
                  Fast delivery is one of
                  the most appreciated
                  aspects of your service.
                </p>

              </div>


              {/* RECOMMENDATION 3 */}

              <div className="recommendation-card">

                <span>
                  03
                </span>

                <h3>
                  Monitor Product Quality
                </h3>

                <p>
                  Product quality strongly
                  influences positive
                  customer sentiment.
                </p>

              </div>

            </>

          )}

        </div>

      </section>


     

    </div>
  );
}

export default Dashboard;