function generateBusinessInsights(reviews) {
  if (!reviews || reviews.length === 0) {
    return {
      summary: "Not enough customer data yet.",
      strengths: [],
      weaknesses: [],
      recommendations: [],
    };
  }

  const topicStats = {};

  let positive = 0;
  let negative = 0;
  let neutral = 0;

  reviews.forEach((review) => {
    if (review.sentiment === "positive") {
      positive++;
    } else if (review.sentiment === "negative") {
      negative++;
    } else {
      neutral++;
    }

    if (Array.isArray(review.topics)) {
      review.topics.forEach((topic) => {
        if (!topicStats[topic]) {
          topicStats[topic] = {
            total: 0,
            positive: 0,
            negative: 0,
          };
        }

        topicStats[topic].total++;

        if (review.sentiment === "positive") {
          topicStats[topic].positive++;
        }

        if (review.sentiment === "negative") {
          topicStats[topic].negative++;
        }
      });
    }
  });

  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  Object.entries(topicStats).forEach(
    ([topic, stats]) => {
      const positiveRate =
        stats.positive / stats.total;

      const negativeRate =
        stats.negative / stats.total;

      if (
        stats.total >= 2 &&
        positiveRate >= 0.6
      ) {
        strengths.push(topic);
      }

      if (
        stats.total >= 2 &&
        negativeRate >= 0.4
      ) {
        weaknesses.push(topic);
      }
    }
  );

  weaknesses.forEach((topic) => {
    recommendations.push(
      `Improve ${topic} based on recurring negative customer feedback.`
    );
  });

  let summary;

  const total = reviews.length;
  const positivePercent = Math.round(
    (positive / total) * 100
  );

  if (positivePercent >= 70) {
    summary =
      "Customers are generally satisfied with the business.";
  } else if (positivePercent >= 50) {
    summary =
      "Customer sentiment is mixed and there are areas that could be improved.";
  } else {
    summary =
      "Customer feedback indicates several areas requiring attention.";
  }

  return {
    summary,
    strengths,
    weaknesses,
    recommendations,
  };
}

module.exports = generateBusinessInsights;