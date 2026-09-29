function calculateBusinessHealthScore(reviews) {
  if (!reviews || reviews.length === 0) {
    return {
      score: 0,
      level: "insufficient data",
      breakdown: {
        rating: 0,
        sentiment: 0,
        authenticity: 0,
        engagement: 0,
      },
    };
  }

  // -----------------------------
  // 1. RATING SCORE — 35%
  // -----------------------------

  const averageRating =
    reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0
    ) / reviews.length;

  const ratingScore =
    (averageRating / 5) * 100;


  // -----------------------------
  // 2. SENTIMENT SCORE — 35%
  // -----------------------------

  const positive = reviews.filter(
    (review) => review.sentiment === "positive"
  ).length;

  const negative = reviews.filter(
    (review) => review.sentiment === "negative"
  ).length;

  const neutral = reviews.filter(
    (review) => review.sentiment === "neutral"
  ).length;

  const sentimentScore =
    (
      (positive + neutral * 0.5) /
      reviews.length
    ) * 100;


  // -----------------------------
  // 3. AUTHENTICITY — 20%
  // -----------------------------

  const authenticityScores =
    reviews.map(
      (review) =>
        100 -
        Number(review.authenticityScore || 0)
    );

  const authenticityScore =
    authenticityScores.reduce(
      (sum, value) => sum + value,
      0
    ) / reviews.length;


  // -----------------------------
  // 4. ENGAGEMENT — 10%
  // -----------------------------

  // More detailed reviews provide more
  // customer feedback information.

  const detailedReviews =
    reviews.filter(
      (review) =>
        review.text &&
        review.text.length >= 50
    ).length;

  const engagementScore = Math.min(
    100,
    (detailedReviews / reviews.length) * 100
  );


  // -----------------------------
  // FINAL SCORE
  // -----------------------------

  const score = Math.round(
    ratingScore * 0.35 +
    sentimentScore * 0.35 +
    authenticityScore * 0.20 +
    engagementScore * 0.10
  );


  // -----------------------------
  // HEALTH LEVEL
  // -----------------------------

  let level;

  if (score >= 80) {
    level = "excellent";
  } else if (score >= 65) {
    level = "good";
  } else if (score >= 50) {
    level = "needs attention";
  } else {
    level = "critical";
  }


  return {
    score,
    level,
    breakdown: {
      rating: Math.round(ratingScore),
      sentiment: Math.round(sentimentScore),
      authenticity: Math.round(authenticityScore),
      engagement: Math.round(engagementScore),
    },
  };
}

module.exports = calculateBusinessHealthScore;