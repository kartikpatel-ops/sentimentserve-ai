function analyzeAuthenticity(text, name) {
  const reasons = [];
  let riskScore = 0;

  const reviewText = text.trim();
  const lowerText = reviewText.toLowerCase();

  // 1. Very short review
  if (reviewText.length < 20) {
    riskScore += 25;
    reasons.push("Very short review");
  }

  // 2. Repeated words
  const words = lowerText
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const wordCounts = {};

  words.forEach((word) => {
    wordCounts[word] =
      (wordCounts[word] || 0) + 1;
  });

  const repeatedWords = Object.values(wordCounts)
    .filter((count) => count >= 3);

  if (repeatedWords.length > 0) {
    riskScore += 20;
    reasons.push("Repeated wording detected");
  }

  // 3. Excessive punctuation
  const punctuationMatches =
    reviewText.match(/[!?]{2,}/g);

  if (punctuationMatches) {
    riskScore += 15;
    reasons.push("Excessive punctuation");
  }

  // 4. Generic promotional language
  const promotionalWords = [
    "best ever",
    "number one",
    "100% guaranteed",
    "must buy",
    "perfect perfect",
    "amazing amazing",
  ];

  const promotionalDetected =
    promotionalWords.some((phrase) =>
      lowerText.includes(phrase)
    );

  if (promotionalDetected) {
    riskScore += 20;
    reasons.push(
      "Promotional or exaggerated language"
    );
  }

  // 5. Missing reviewer name
  if (!name || name.trim().length < 2) {
    riskScore += 10;
    reasons.push("Limited reviewer information");
  }

  // Keep score between 0 and 100
  riskScore = Math.min(100, riskScore);

  let riskLevel;

  if (riskScore >= 60) {
    riskLevel = "high";
  } else if (riskScore >= 30) {
    riskLevel = "medium";
  } else {
    riskLevel = "low";
  }

  return {
    riskScore,
    riskLevel,
    reasons,
  };
}

module.exports = analyzeAuthenticity;