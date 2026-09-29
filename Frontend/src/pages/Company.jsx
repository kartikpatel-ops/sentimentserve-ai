import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Brain, MessageSquare, ThumbsUp } from "lucide-react";

import companies from "../data/companies";
import "../App.css";

function Company() {
  const { companyName } = useParams();

  

  const [company, setCompany] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState(null);

  const [redditData, setRedditData] = useState([]);
  const [redditLoading, setRedditLoading] = useState(false);
const location = useLocation();
 const navigate = useNavigate();
const googleBusiness = location.state?.business || null;
const [companyImage, setCompanyImage] = useState("");
const [imagePhotographer, setImagePhotographer] = useState("");
  useEffect(() => {
    const fetchData = async () => {
  if (googleBusiness) {
  setCompany({
    name: googleBusiness.name,
    category: "Google Business",
    description: "",
    averageRating: googleBusiness.rating || 0,
    reviewCount: googleBusiness.reviewCount || 0,
    address: googleBusiness.address || "",
    source: "Google Places",
    googleMapsUri: googleBusiness.googleMapsUri || "",
  });
try {
 const imageQuery =
  googleBusiness.name ||
  googleBusiness.category ||
  "business";

const imageResponse = await fetch(
  `http://localhost:5000/api/business-image?query=${encodeURIComponent(
    imageQuery
  )}`
);
  const imageData = await imageResponse.json();

  if (imageResponse.ok && imageData.imageUrl) {
    setCompanyImage(imageData.imageUrl);
    setImagePhotographer(imageData.photographer || "");
  }
} catch (imageError) {
  console.error(
    "Pexels image error:",
    imageError
  );
}
  // Get SentimentServe reviews for this Google business
  try {
    const reviewResponse = await fetch(
      `http://localhost:5000/api/reviews/${encodeURIComponent(
        googleBusiness.name
      )}`
    );

    const reviewData = await reviewResponse.json();

    setReviews(reviewData.reviews || []);

    console.log(
      "GOOGLE BUSINESS SENTIMENTSERVE REVIEWS:",
      reviewData.reviews
    );
  } catch (reviewError) {
    console.error(
      "Google business review error:",
      reviewError
    );

    setReviews([]);
  }

  setLoading(false);

  if (googleBusiness.placeId) {
    console.log(
      "Google business selected:",
      googleBusiness.placeId
    );
  }

  return;
}
      try {
        // ===============================
        // GET BUSINESS
        // ===============================

        const businessResponse = await fetch(
          `http://localhost:5000/api/businesses/${companyName}`
        );

        if (businessResponse.ok) {
          const businessData = await businessResponse.json();
          setCompany(businessData);
        } else {
          setCompany(null);
        }

        // ===============================
        // GET REVIEWS
        // ===============================

        const reviewResponse = await fetch(
          `http://localhost:5000/api/reviews/${companyName}`
        );

        const reviewData = await reviewResponse.json();

        setReviews(reviewData.reviews || []);
        setLoading(false);

        console.log(
          "REVIEWS FROM BACKEND:",
          reviewData.reviews
        );

        // ===============================
        // GET BUSINESS HEALTH SCORE
        // ===============================

        const healthResponse = await fetch(
          `http://localhost:5000/api/business-health/${companyName}`
        );

        const healthData = await healthResponse.json();

        if (healthResponse.ok) {
          setHealthScore(healthData.healthScore);
        }

        // ===============================
        // GET REDDIT DATA
        // ===============================

        try {
          setRedditLoading(true);

          const redditResponse = await fetch(
            `http://localhost:5000/api/reddit/${encodeURIComponent(
              companyName
            )}`
          );

          const redditResult = await redditResponse.json();

          if (!redditResponse.ok) {
            throw new Error(
              redditResult.message ||
                "Failed to load Reddit data."
            );
          }

          setRedditData(redditResult.data || []);

          console.log(
            "REDDIT DATA FROM BACKEND:",
            redditResult.data
          );
        } catch (redditError) {
          console.error(
            "Reddit data error:",
            redditError
          );

          setRedditData([]);
        } finally {
          setRedditLoading(false);
        }
      } catch (error) {
        console.error(
          "Error fetching company data:",
          error
        );

        setLoading(false);
      }
    };

    fetchData();
  }, [companyName]);

  // ===============================
  // COMPANY NOT FOUND
  // ===============================

  if (!company) {
    return (
      <div className="company-page">
        <h1>Company Not Found</h1>

        <p>
          We don't have information about "
          {companyName}" yet.
        </p>

        <button onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  // ===============================
  // SENTIMENT CALCULATION
  // ===============================

  const totalReviews = reviews.length;

  const positive = reviews.filter(
    (review) => review.sentiment === "positive"
  ).length;

  const neutral = reviews.filter(
    (review) => review.sentiment === "neutral"
  ).length;

  const negative = reviews.filter(
    (review) => review.sentiment === "negative"
  ).length;

  const positivePercent =
    totalReviews > 0
      ? Math.round(
          (positive / totalReviews) * 100
        )
      : 0;

  const neutralPercent =
    totalReviews > 0
      ? Math.round(
          (neutral / totalReviews) * 100
        )
      : 0;

  const negativePercent =
    totalReviews > 0
      ? Math.round(
          (negative / totalReviews) * 100
        )
      : 0;

  // ===============================
  // AVERAGE RATING
  // ===============================

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (sum, review) =>
              sum + Number(review.rating),
            0
          ) / totalReviews
        ).toFixed(1)
      : company.averageRating || 0;

  // ===============================
  // TOPIC CALCULATION
  // ===============================

  const topicCounts = {};

  reviews.forEach((review) => {
    if (Array.isArray(review.topics)) {
      review.topics.forEach((topic) => {
        topicCounts[topic] =
          (topicCounts[topic] || 0) + 1;
      });
    }
  });

  const topics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // ===============================
  // REDDIT SOCIAL SENTIMENT TOTAL
  // ===============================

  const redditPosts = redditData.length;

  const redditPositive =
    redditData.reduce(
      (sum, post) =>
        sum +
        Number(
          post.sentiment?.positivePercent || 0
        ),
      0
    );

  const redditNeutral =
    redditData.reduce(
      (sum, post) =>
        sum +
        Number(
          post.sentiment?.neutralPercent || 0
        ),
      0
    );

  const redditNegative =
    redditData.reduce(
      (sum, post) =>
        sum +
        Number(
          post.sentiment?.negativePercent || 0
        ),
      0
    );

  const redditPositivePercent =
    redditPosts > 0
      ? Math.round(
          redditPositive / redditPosts
        )
      : 0;

  const redditNeutralPercent =
    redditPosts > 0
      ? Math.round(
          redditNeutral / redditPosts
        )
      : 0;

  const redditNegativePercent =
    redditPosts > 0
      ? Math.round(
          redditNegative / redditPosts
        )
      : 0;

  return (
    <div className="company-page">
      <button
  className="back-home-btn"
  onClick={() => navigate("/")}
>
  ← Back to Home
</button>

      {/* ===============================
          COMPANY HEADER
      =============================== */}

      <div className="company-hero">

        <div className="company-header-left">

 <div className="company-logo">
  {companyImage ? (
    <img
      src={companyImage}
      alt={`${company.name} representative`}
      className="company-logo-image"
    />
  ) : (
    <div className="company-logo-placeholder">
      🏢
    </div>
  )}
</div>
  <button
    className="write-review-btn"
    onClick={() =>
  navigate("/company/google/review", {
    state: {
      googleBusiness: {
        ...company,
        placeId: company.placeId,
        name: company.name,
        address: company.address,
        rating: company.averageRating,
        reviewCount: company.reviewCount,
        googleMapsUri: company.googleMapsUri,
      },
    },
  })
}
  >
    ✍ Write a Review
  </button>

</div>

        <div>

          <h1>{company.name}</h1>

          {/* BUSINESS HEALTH */}

          {healthScore && (
            <section className="health-score-section">

              <h2>Business Health Score</h2>

              <div className="health-score-number">
                {healthScore.score}/100
              </div>

              <div className="health-score-level">
                {healthScore.level.toUpperCase()}
              </div>

              <div className="health-breakdown">

                <div>
                  ⭐ Rating
                  <strong>
                    {healthScore.breakdown.rating}/100
                  </strong>
                </div>

                <div>
                  🧠 Sentiment
                  <strong>
                    {healthScore.breakdown.sentiment}/100
                  </strong>
                </div>

                <div>
                  🛡️ Authenticity
                  <strong>
                    {healthScore.breakdown.authenticity}/100
                  </strong>
                </div>

                <div>
                  💬 Engagement
                  <strong>
                    {healthScore.breakdown.engagement}/100
                  </strong>
                </div>

              </div>

            </section>
          )}

          <p>{company.category}</p>

          {company.address && (
            <p className="company-address">
              📍 {company.address}
            </p>
          )}

          {company.source && (
            <p className="company-source">
              Data source: {company.source}
            </p>
          )}

          <div className="company-rating">
  {googleBusiness ? (
    <>
      <div className="google-rating-summary">
        <span className="big-rating">
          {googleBusiness.rating || 0}
        </span>

        <span className="stars">
          ★★★★★
        </span>

        <span className="google-review-count">
          {googleBusiness.reviewCount || 0} Google reviews
        </span>
      </div>

      <div className="sentiment-source">
        <div className="sentiment-title">
          🤖 SentimentServe AI
        </div>

        <div className="sentiment-count">
          {totalReviews} SentimentServe reviews analyzed
        </div>
      </div>
    </>
  ) : (
    <>
      <span className="big-rating">
        {averageRating}
      </span>

      <span className="stars">
        ★★★★★
      </span>

      <span>
        {totalReviews} reviews
      </span>
    </>
  )}

</div>
        </div>

      </div>

      {/* ===============================
          RATING + SENTIMENT
      =============================== */}

      <div className="company-content">

        {/* RATING */}

        <section className="rating-summary">

          <div className="rating-card">
  <h2>Customer Rating</h2>

  {googleBusiness ? (
    <>
      <div className="rating-number">
        {googleBusiness.rating || 0}
      </div>

      <div className="stars">
        ★★★★★
      </div>

      <p>
        Based on {googleBusiness.reviewCount || 0} Google reviews
      </p>

      <div className="rating-source">
        Source: Google Places
      </div>
    </>
  ) : (
    <>
      <div className="rating-number">
        {averageRating}
      </div>

      <div className="stars">
        ★★★★★
      </div>

      <p>
        Based on {totalReviews} SentimentServe reviews
      </p>
    </>
  )}
</div>
        </section>

        {/* AI SENTIMENT */}

      <section className="sentiment-card">

  <div className="card-title">
    <Brain />

    <h2>
      AI Sentiment Analysis
    </h2>
  </div>

  {totalReviews === 0 ? (
    <div className="ai-empty-state">

      <div className="ai-empty-icon">
        🤖
      </div>

      <h3>
        No SentimentServe reviews yet
      </h3>

      <p>
        AI sentiment analysis will appear here after
        customers submit reviews through SentimentServe.
      </p>

      {googleBusiness && (
        <small>
          Google provides the business rating separately.
          SentimentServe does not analyze that rating as
          its own review dataset.
        </small>
      )}

    </div>
  ) : (
    <>

      <div className="sentiment-stat">
        <span>Positive</span>

        <strong>
          {positivePercent}%
        </strong>
      </div>

      <div className="sentiment-bar">
        <div
          className="positive"
          style={{
            width: `${positivePercent}%`,
          }}
        />
      </div>


      <div className="sentiment-stat">
        <span>Neutral</span>

        <strong>
          {neutralPercent}%
        </strong>
      </div>

      <div className="sentiment-bar">
        <div
          className="neutral"
          style={{
            width: `${neutralPercent}%`,
          }}
        />
      </div>


      <div className="sentiment-stat">
        <span>Negative</span>

        <strong>
          {negativePercent}%
        </strong>
      </div>

      <div className="sentiment-bar">
        <div
          className="negative"
          style={{
            width: `${negativePercent}%`,
          }}
        />
      </div>

    </>
  )}

</section>

      </div>

      {/* ===============================
          REDDIT SOCIAL SENTIMENT
      =============================== */}

      <section className="company-section reddit-section">

        <div className="section-title">

          <MessageSquare />

          <div>

            <h2>
              📊 Reddit Social Sentiment
            </h2>

            <p>
              Public Reddit discussions and
              sentiment analysis.
            </p>

          </div>

        </div>

        {redditLoading && (
          <p>
            Loading Reddit insights...
          </p>
        )}

        {!redditLoading &&
          redditData.length === 0 && (
            <p>
              No Reddit discussions found
              for this business yet.
            </p>
          )}

        {!redditLoading &&
          redditData.length > 0 && (
            <>

              {/* REDDIT SUMMARY */}

              <div className="insight-grid">

                <div className="insight positive-insight">

                  <ThumbsUp />

                  <div>

                    <h3>
                      Social Sentiment
                    </h3>

                    <p>
                      😊 Positive:{" "}
                      {redditPositivePercent}%
                    </p>

                    <p>
                      😐 Neutral:{" "}
                      {redditNeutralPercent}%
                    </p>

                    <p>
                      😞 Negative:{" "}
                      {redditNegativePercent}%
                    </p>

                  </div>

                </div>

                <div className="insight">

                  <MessageSquare />

                  <div>

                    <h3>
                      Reddit Discussions
                    </h3>

                    <p>
                      Analyzed{" "}
                      {redditPosts} Reddit posts.
                    </p>

                  </div>

                </div>

              </div>

              {/* REDDIT POSTS */}

              {redditData.map((post) => (

                <div
                  key={post.redditPostId}
                  className="reddit-card"
                >

                  <h3>
                    {post.title}
                  </h3>

                  <p>
                    r/{post.subreddit}
                  </p>

                  <p>
                    👍 {post.postScore || 0}
                    {" · "}
                    💬 {post.commentCount || 0}
                  </p>

                  {post.sentiment && (
                    <div className="reddit-sentiment">

                      <p>
                        😊 Positive:{" "}
                        {post.sentiment
                          .positivePercent || 0}
                        %
                      </p>

                      <p>
                        😐 Neutral:{" "}
                        {post.sentiment
                          .neutralPercent || 0}
                        %
                      </p>

                      <p>
                        😞 Negative:{" "}
                        {post.sentiment
                          .negativePercent || 0}
                        %
                      </p>

                    </div>
                  )}

                </div>

              ))}

            </>
          )}

      </section>

      {/* ===============================
          AI TOPICS
      =============================== */}

      <section className="company-section">

        <div className="section-title">

          <Brain />

          <div>

            <h2>
              AI-Detected Customer Topics
            </h2>

            <p>
              Topics detected from customer
              reviews.
            </p>

          </div>

        </div>

        <div className="insight-grid">

          <div className="insight positive-insight">

            <ThumbsUp />

            <div>

              <h3>
                Common Topics
              </h3>

              {topics.length > 0 ? (
                <p>
                  {topics
                    .map(
                      ([topic, count]) =>
                        `${topic} (${count})`
                    )
                    .join(" • ")}
                </p>
              ) : (
                <p>
                  No topics detected yet.
                </p>
              )}

            </div>

          </div>

          <div className="insight">

            <MessageSquare />

            <div>

              <h3>
                AI Analysis
              </h3>

              <p>
                AI analyzes customer reviews
                to identify sentiment and
                frequently discussed topics.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ===============================
          CUSTOMER REVIEWS
      =============================== */}

      <section className="company-section">

        <h2>
          Customer Reviews
        </h2>

        <p
          style={{
            color: "red",
            fontWeight: "bold",
          }}
        >
          Reviews loaded: {reviews.length}
        </p>

        {loading ? (

          <p>
            Loading reviews...
          </p>

        ) : reviews.length > 0 ? (

          reviews.map((review) => (

            <div
              className="review-card"
              key={review._id}
            >

              <div className="review-header">

                <strong>
                  {review.name}
                </strong>

                <span className="stars">

                  {"★".repeat(
                    Number(review.rating)
                  )}

                  {"☆".repeat(
                    5 - Number(review.rating)
                  )}

                </span>

              </div>

              <p>
                {review.text}
              </p>

              {/* AI RESULT */}

              <p>

                <strong>
                  AI Sentiment:
                </strong>{" "}

                {review.sentiment}

              </p>

              {review.topics &&
                review.topics.length > 0 && (

                  <p>

                    <strong>
                      Topics:
                    </strong>{" "}

                    {review.topics.join(", ")}

                  </p>

                )}

              {review.confidence > 0 && (

                <p>

                  <strong>
                    AI Confidence:
                  </strong>{" "}

                  {review.confidence}%

                </p>

              )}

              {/* AUTHENTICITY */}

              {review.authenticityRisk && (
                <div
                  className={`authenticity-badge ${review.authenticityRisk}`}
                >
                  🛡️ Authenticity Risk:{" "}
                  {review.authenticityRisk.toUpperCase()}
                </div>
              )}

              {review.authenticityReasons &&
                review.authenticityReasons.length > 0 && (

                  <p className="authenticity-reasons">

                    <strong>
                      Why:
                    </strong>{" "}

                    {review.authenticityReasons.join(
                      ", "
                    )}

                  </p>

                )}

              {/* REVIEWER CREDIBILITY */}

              {review.reviewerCredibilityScore > 0 && (

                <div className="reviewer-credibility">

                  👤{" "}

                  <strong>
                    Reviewer Credibility:
                  </strong>{" "}

                  {review.reviewerCredibilityScore}
                  /100

                  <span
                    className={`credibility-level ${review.reviewerCredibilityLevel}`}
                  >
                    {review.reviewerCredibilityLevel.toUpperCase()}
                  </span>

                </div>

              )}

              <span className="review-date">

                {review.createdAt
                  ? new Date(
                      review.createdAt
                    ).toLocaleDateString()
                  : ""}

              </span>

            </div>

          ))

        ) : (

          <p>
            No reviews yet. Be the first to
            write one!
          </p>

        )}

      </section>

    </div>
  );
}

export default Company;