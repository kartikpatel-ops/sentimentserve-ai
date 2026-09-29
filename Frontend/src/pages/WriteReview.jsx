import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Star, Send, CheckCircle } from "lucide-react";

import "../App.css";

function WriteReview() {
  const { companyName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Google business data passed from Company page
  const googleBusiness = location.state?.googleBusiness || null;

  // Logged-in user
  const savedUser = localStorage.getItem("user");

  const loggedInUser = savedUser
    ? JSON.parse(savedUser)
    : null;

  // Determine company name
  const company =
    googleBusiness?.name ||
    companyName ||
    loggedInUser?.company;

  // ================================
  // SUBMIT REVIEW
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !text.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (!company) {
      setError("Company information is missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://sentimentserve-ai.onrender.com/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            company,
            rating,
            text: text.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit review"
        );
      }

      console.log("Review saved:", data);

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setError(
        "Could not submit review. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // SUCCESS PAGE
  // ================================
  if (submitted) {
    return (
      <div className="review-page">

        <button
          className="back-home-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <div className="review-success-card">

          <div className="success-icon">
            <CheckCircle size={60} />
          </div>

          <h1>Review Submitted! 🎉</h1>

          <p>
            Thank you for sharing your experience.
            Your review has been saved successfully.
          </p>

          <button
            className="back-company-btn"
            onClick={() =>
              navigate(
                googleBusiness
                  ? "/company/google"
                  : `/company/${company}`,
                {
                  state: {
                    business: googleBusiness,
                  },
                }
              )
            }
          >
            Back to Company
          </button>

        </div>
      </div>
    );
  }

  // ================================
  // REVIEW FORM
  // ================================
  return (
    <div className="review-page">

      {/* Back to Home */}
      <button
        className="back-home-btn"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      <div className="review-card">

        {/* Header */}
        <div className="review-header">
          <div>
            <h1>Write a Review</h1>
            <p>
              Share your experience with other customers.
            </p>
          </div>

          {company && (
            <span className="review-company">
              {company}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="form-group">

            <label>Your Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>

          {/* Rating */}
          <div className="form-group">

            <label>Rating</label>

            <div className="rating-buttons">

              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={
                    star <= rating
                      ? "star active"
                      : "star"
                  }
                  onClick={() => setRating(star)}
                  aria-label={`${star} star`}
                >
                  <Star
                    size={30}
                    fill={
                      star <= rating
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              ))}

            </div>

            <span className="rating-text">
              {rating} out of 5
            </span>

          </div>

          {/* Review */}
          <div className="form-group">

            <label>Your Review</label>

            <textarea
              rows="6"
              placeholder="Tell us about your experience..."
              value={text}
              onChange={(e) =>
                setText(e.target.value)
              }
            />

          </div>

          {/* Error */}
          {error && (
            <p className="review-error">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="submit-review-button"
            disabled={loading}
          >
            <Send size={18} />

            {loading
              ? "Submitting..."
              : "Submit Review"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default WriteReview;