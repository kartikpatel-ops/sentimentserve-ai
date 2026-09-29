const natural = require("natural");

const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;

const analyzer = new Analyzer(
  "English",
  stemmer,
  "afinn"
);

function getSentimentFromScore(score) {
  if (score > 0.2) {
    return "positive";
  }

  if (score < -0.2) {
    return "negative";
  }

  return "neutral";
}

function analyzeSentiment(text) {
  const tokenizer = new natural.WordTokenizer();

  const tokens = tokenizer.tokenize(
    text.toLowerCase()
  );

  const score = analyzer.getSentiment(tokens);

  console.log("SENTIMENT SCORE:", score);

  let sentiment;
  let confidence;

  if (score > 0.2) {
    sentiment = "positive";
    confidence = Math.min(
      95,
      Math.round(70 + score * 20)
    );
  } 
  else if (score < -0.2) {
    sentiment = "negative";
    confidence = Math.min(
      95,
      Math.round(70 + Math.abs(score) * 20)
    );
  } 
  else {
    sentiment = "neutral";
    confidence = 70;
  }

  /*
  ==========================================
  EXISTING TOPIC ANALYSIS
  ==========================================
  */

  const topics = [];

  const lowerText = text.toLowerCase();

  const topicKeywords = {
    delivery: [
      "delivery",
      "delivered",
      "shipping",
      "delay"
    ],

    quality: [
      "quality",
      "product",
      "excellent",
      "poor"
    ],

    support: [
      "support",
      "customer service",
      "response",
      "help"
    ],

    pricing: [
      "price",
      "pricing",
      "cost",
      "expensive",
      "cheap"
    ],

    refund: [
      "refund",
      "return",
      "money back"
    ]
  };

  for (const [topic, keywords] of Object.entries(
    topicKeywords
  )) {
    if (
      keywords.some((keyword) =>
        lowerText.includes(keyword)
      )
    ) {
      topics.push(topic);
    }
  }

  /*
  ==========================================
  NEW ASPECT ANALYSIS
  ==========================================
  */

  const aspectKeywords = {

    foodQuality: [
      "food",
      "taste",
      "tasty",
      "delicious",
      "fresh",
      "stale",
      "flavour",
      "flavor",
      "meal",
      "dish"
    ],

    cleanliness: [
      "clean",
      "cleanliness",
      "dirty",
      "hygiene",
      "sanitary",
      "unclean"
    ],

    ambience: [
      "ambience",
      "ambiance",
      "atmosphere",
      "environment",
      "interior",
      "music",
      "comfortable"
    ],

    customerService: [
      "service",
      "staff",
      "employee",
      "support",
      "waiter",
      "behavior",
      "behaviour",
      "helpful",
      "rude"
    ],

    waitingTime: [
      "wait",
      "waiting",
      "slow",
      "delay",
      "queue",
      "long time",
      "late"
    ],

    pricing: [
      "price",
      "pricing",
      "cost",
      "expensive",
      "cheap",
      "affordable",
      "value"
    ],

    safety: [
      "safe",
      "safety",
      "unsafe",
      "security",
      "danger",
      "dangerous"
    ],

    accessibility: [
      "accessible",
      "accessibility",
      "wheelchair",
      "disabled",
      "disability",
      "parking",
      "entrance"
    ]
  };

 const aspects = {};

const positiveWords = [
  "good",
  "great",
  "excellent",
  "amazing",
  "awesome",
  "delicious",
  "tasty",
  "fresh",
  "clean",
  "helpful",
  "friendly",
  "fast",
  "quick",
  "affordable",
  "comfortable",
  "safe",
  "easy",
  "smooth"
];

const negativeWords = [
  "bad",
  "poor",
  "terrible",
  "worst",
  "awful",
  "slow",
  "expensive",
  "dirty",
  "rude",
  "late",
  "delay",
  "delayed",
  "unsafe",
  "uncomfortable",
  "difficult",
  "stale",
  "waiting",
  "long"
];

const sentences = text
  .toLowerCase()
  .split(/[.!?]+/)
  .map((sentence) => sentence.trim())
  .filter(Boolean);

for (const [aspect, keywords] of Object.entries(
  aspectKeywords
)) {
  let aspectSentence = null;

  for (const sentence of sentences) {
    if (
      keywords.some((keyword) =>
        sentence.includes(keyword)
      )
    ) {
      aspectSentence = sentence;
      break;
    }
  }

  if (!aspectSentence) {
    continue;
  }

  const hasPositive = positiveWords.some((word) =>
    aspectSentence.includes(word)
  );

  const hasNegative = negativeWords.some((word) =>
    aspectSentence.includes(word)
  );

  let aspectSentiment = "neutral";

  if (hasPositive && !hasNegative) {
    aspectSentiment = "positive";
  } else if (hasNegative && !hasPositive) {
    aspectSentiment = "negative";
  }

  aspects[aspect] = {
    sentiment: aspectSentiment,
    confidence:
      aspectSentiment === "neutral" ? 70 : 85
  };
}

  /*
  ==========================================
  RETURN RESULT
  ==========================================
  */

  return {
    sentiment,
    confidence,
    topics,
    aspects
  };
}

module.exports = analyzeSentiment;