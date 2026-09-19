import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star, Send } from "lucide-react";

import companies from "../data/companies";
import "../App.css";

function WriteReview() {
  const { companyName } = useParams();
  const navigate = useNavigate();

  const company = companies[companyName];

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!company) {
    return (
      <div className="company-page">
        <h1>Company Not Found</h1>
        <p>We couldn't find this company.</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || rating === 0 || !review.trim()) {
      alert("Please fill in all fields and select a rating.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="review-page">

      <div className="review-container">

        <button
          className="back-btn"
          onClick={() => navigate(`/company/${companyName}`)}
        >
          ← Back to {company.name}
        </button>

        <div className="review-header-section">
          <h1>Write a Review</h1>

          <p>
            Share your experience with{" "}
            <strong>{company.name}</strong>
          </p>
        </div>

        {submitted ? (
          <div className="success-card">
            <div className="success-icon">✓</div>

            <h2>Review Submitted!</h2>

            <p>
              Thank you, {name}! Your review has been submitted
              successfully.
            </p>

            <button
              className="primary-btn"
              onClick={() => navigate(`/company/${companyName}`)}
            >
              View Company
            </button>
          </div>
        ) : (
          <form
            className="review-form"
            onSubmit={handleSubmit}
          >

            {/* Name */}
            <div className="form-group">
              <label>Your Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>


            {/* Rating */}
            <div className="form-group">

              <label>Your Rating</label>

              <div className="star-selector">

                {[1, 2, 3, 4, 5].map((star) => (

                  <button
                    type="button"
                    key={star}
                    className={
                      star <= rating
                        ? "star-button active"
                        : "star-button"
                    }
                    onClick={() => setRating(star)}
                  >
                    <Star
                      size={32}
                      fill={
                        star <= rating
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                ))}

              </div>

              <p className="rating-text">
                {rating === 0
                  ? "Select your rating"
                  : `${rating} out of 5 stars`}
              </p>

            </div>


            {/* Review */}
            <div className="form-group">

              <label>Your Review</label>

              <textarea
                placeholder="Tell us about your experience..."
                rows="7"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />

              <span className="character-count">
                {review.length} characters
              </span>

            </div>


            {/* Submit */}
            <button
              type="submit"
              className="submit-review-btn"
            >
              <Send size={18} />
              Submit Review
            </button>

          </form>
        )}

      </div>

    </div>
  );
}

export default WriteReview;