import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star, Send, CheckCircle } from "lucide-react";

import "../App.css";

function WriteReview() {
  const { companyName } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const company = companyName || "technova";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !text.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          company,
          rating,
          text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      console.log("Review saved:", data);

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setError("Could not submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="review-page">
        <div className="review-success-card">
          <CheckCircle size={60} />

          <h1>Review Submitted! 🎉</h1>

          <p>
            Thank you for sharing your experience. Your review has been saved
            successfully.
          </p>

          <button onClick={() => navigate(`/company/${company}`)}>
            Back to Company
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-page">
      <div className="review-card">
        <div className="review-header">
          <h1>Write a Review</h1>
          <p>Share your experience with other customers.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Rating</label>

            <div className="rating-buttons">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={star <= rating ? "star active" : "star"}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={28}
                    fill={star <= rating ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Your Review</label>

            <textarea
              rows="6"
              placeholder="Tell us about your experience..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {error && <p className="review-error">{error}</p>}

          <button
            type="submit"
            className="submit-review-button"
            disabled={loading}
          >
            <Send size={18} />

            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default WriteReview;