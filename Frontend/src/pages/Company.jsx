import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Brain, MessageSquare, ThumbsUp } from "lucide-react";

import companies from "../data/companies";
import "../App.css";

function Company() {
  const { companyName } = useParams();
  const navigate = useNavigate();

  const company = companies[companyName];

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/reviews/${companyName}`
        );

        const data = await response.json();

        if (response.ok) {
          setReviews(data.reviews || []);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    getReviews();
  }, [companyName]);

  // Company not found
  if (!company) {
    return (
      <div className="company-page">
        <h1>Company Not Found</h1>

        <p>
          We don't have information about "{companyName}" yet.
        </p>

        <button onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  // -----------------------------
  // SENTIMENT CALCULATION
  // -----------------------------

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
      ? Math.round((positive / totalReviews) * 100)
      : 0;

  const neutralPercent =
    totalReviews > 0
      ? Math.round((neutral / totalReviews) * 100)
      : 0;

  const negativePercent =
    totalReviews > 0
      ? Math.round((negative / totalReviews) * 100)
      : 0;

  // -----------------------------
  // AVERAGE RATING
  // -----------------------------

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + Number(review.rating),
            0
          ) / totalReviews
        ).toFixed(1)
      : company.rating;

  // -----------------------------
  // TOPICS
  // -----------------------------

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

  return (
    <div className="company-page">

      {/* COMPANY HEADER */}

      <div className="company-hero">

        <div className="company-logo">
          {company.logo}

          <button
            className="write-review-btn"
            onClick={() =>
              navigate(
                `/company/${companyName}/review`
              )
            }
          >
            ✍ Write a Review
          </button>
        </div>

        <div>
          <h1>{company.name}</h1>

          <p>{company.category}</p>

          <div className="company-rating">

            <span className="big-rating">
              {averageRating}
            </span>

            <span className="stars">
              ★★★★★
            </span>

            <span>
              {totalReviews} reviews
            </span>

          </div>
        </div>

      </div>


      {/* RATING + SENTIMENT */}

      <div className="company-content">

        {/* RATING */}

        <section className="rating-summary">

          <h2>Customer Rating</h2>

          <div className="rating-number">
            {averageRating}
          </div>

          <div className="stars big-stars">
            ★★★★★
          </div>

          <p>
            Based on {totalReviews} reviews
          </p>

        </section>


        {/* AI SENTIMENT */}

        <section className="sentiment-card">

          <div className="card-title">

            <Brain />

            <h2>
              AI Sentiment Analysis
            </h2>

          </div>


          <div className="sentiment-stat">
            <span>Positive</span>
            <strong>{positivePercent}%</strong>
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
            <strong>{neutralPercent}%</strong>
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
            <strong>{negativePercent}%</strong>
          </div>

          <div className="sentiment-bar">

            <div
              className="negative"
              style={{
                width: `${negativePercent}%`,
              }}
            />

          </div>

        </section>

      </div>


      {/* AI TOPICS */}

      <section className="company-section">

        <div className="section-title">

          <Brain />

          <div>
            <h2>
              AI-Detected Customer Topics
            </h2>

            <p>
              Topics detected from customer reviews.
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


      {/* CUSTOMER REVIEWS */}

      <section className="company-section">

        <h2>
          Customer Reviews
        </h2>


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