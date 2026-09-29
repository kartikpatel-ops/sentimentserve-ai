function calculateReviewerCredibility({
  reviewText,
  authenticityRisk,
  authenticityScore,
}) {
  let score = 70;

  // Detailed reviews provide more useful evidence
  if (reviewText.length >= 100) {
    score += 10;
  } else if (reviewText.length < 30) {
    score -= 10;
  }

  // Authenticity risk affects the credibility signal
  if (authenticityRisk === "high") {
    score -= 25;
  } else if (authenticityRisk === "medium") {
    score -= 10;
  }

  // Additional penalty based on authenticity score
  if (authenticityScore >= 60) {
    score -= 10;
  }

  // Keep score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  let level;

  if (score >= 75) {
    level = "high";
  } else if (score >= 50) {
    level = "medium";
  } else {
    level = "low";
  }

  return {
    score,
    level,
  };
}

module.exports = calculateReviewerCredibility;