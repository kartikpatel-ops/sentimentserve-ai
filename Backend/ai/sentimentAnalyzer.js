const natural = require("natural");

const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;

const analyzer = new Analyzer(
  "English",
  stemmer,
  "afinn"
);

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

  return {
    sentiment,
    confidence,
    topics
  };
}

module.exports = analyzeSentiment;