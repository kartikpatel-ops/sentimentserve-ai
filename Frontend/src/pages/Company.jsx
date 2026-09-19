import { useParams, useNavigate } from "react-router-dom";
import {
  Brain,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";

import companies from "../data/companies";
import "../App.css";

function Company() {
  const { companyName } = useParams();
  const navigate = useNavigate();

  const company = companies[companyName];

  // If company doesn't exist
  if (!company) {
    return (
      <div className="company-page">
        <h1>Company Not Found</h1>
        <p>
          Sorry, we don't have information about "{companyName}" yet.
        </p>
      </div>
    );
  }

  return (
    <div className="company-page">

      {/* Company Header */}
      <div className="company-hero">
        <div className="company-logo">
          {company.logo}
          <button
  className="write-review-btn"
  onClick={() =>
    navigate(`/company/${companyName}/review`)
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
              {company.rating}
            </span>

            <span className="stars">
              ★★★★★
            </span>

            <span>
              {company.reviews} reviews
            </span>
          </div>
        </div>
      </div>


      {/* Rating + Sentiment */}
      <div className="company-content">

        {/* Rating */}
        <section className="rating-summary">
          <h2>Customer Rating</h2>

          <div className="rating-number">
            {company.rating}
          </div>

          <div className="stars big-stars">
            ★★★★★
          </div>

          <p>
            Based on {company.reviews} reviews
          </p>
        </section>


        {/* AI Sentiment */}
        <section className="sentiment-card">

          <div className="card-title">
            <Brain />
            <h2>AI Sentiment Analysis</h2>
          </div>


          <div className="sentiment-stat">
            <span>Positive</span>
            <strong>
              {company.sentiment.positive}%
            </strong>
          </div>

          <div className="sentiment-bar">
            <div
              className="positive"
              style={{
                width: `${company.sentiment.positive}%`,
              }}
            ></div>
          </div>


          <div className="sentiment-stat">
            <span>Neutral</span>
            <strong>
              {company.sentiment.neutral}%
            </strong>
          </div>

          <div className="sentiment-bar">
            <div
              className="neutral"
              style={{
                width: `${company.sentiment.neutral}%`,
              }}
            ></div>
          </div>


          <div className="sentiment-stat">
            <span>Negative</span>
            <strong>
              {company.sentiment.negative}%
            </strong>
          </div>

          <div className="sentiment-bar">
            <div
              className="negative"
              style={{
                width: `${company.sentiment.negative}%`,
              }}
            ></div>
          </div>

        </section>

      </div>


      {/* AI Insights */}
      <section className="company-section">

        <div className="section-title">
          <Brain />

          <div>
            <h2>What customers are saying</h2>
            <p>
              AI-generated insights from customer reviews.
            </p>
          </div>
        </div>


        <div className="insight-grid">

          {/* Customers Love */}
          <div className="insight positive-insight">

            <ThumbsUp />

            <div>
              <h3>Customers love</h3>

              <p>
                {company.insights.love}
              </p>
            </div>

          </div>


          {/* Common Topics */}
          <div className="insight">

            <MessageSquare />

            <div>
              <h3>Common topics</h3>

              <p>
                {company.insights.topics}
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* Reviews */}
      <section className="company-section">

        <h2>Customer Reviews</h2>

        {company.reviewsList.map((review, index) => (

          <div
            className="review-card"
            key={index}
          >

            <div className="review-header">

              <strong>
                {review.name}
              </strong>

              <span className="stars">
                {review.rating}
              </span>

            </div>

            <p>
              {review.text}
            </p>

            <span className="review-date">
              {review.date}
            </span>

          </div>

        ))}

      </section>

    </div>
  );
}

export default Company;