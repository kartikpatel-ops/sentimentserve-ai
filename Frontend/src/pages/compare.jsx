import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Star, TrendingUp, MessageSquare } from "lucide-react";
import "../App.css";

const companies = [
  {
    id: "technova",
    name: "TechNova Solutions",
    category: "Technology • Software & Services",
  },
  {
    id: "quickkart",
    name: "QuickKart",
    category: "E-Commerce • Online Shopping",
  },
  {
    id: "travelease",
    name: "TravelEase",
    category: "Travel • Booking Services",
  },
];

function Compare() {
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const results = await Promise.all(
          companies.map(async (company) => {
            const response = await fetch(
              `http://localhost:5000/api/reviews/${company.id}`
            );

            const data = response.ok
              ? await response.json()
              : { reviews: [] };

            const reviews = data.reviews || [];

            const total = reviews.length;

            const positive = reviews.filter(
              (review) => review.sentiment === "positive"
            ).length;

            const neutral = reviews.filter(
              (review) => review.sentiment === "neutral"
            ).length;

            const negative = reviews.filter(
              (review) => review.sentiment === "negative"
            ).length;

            const averageRating =
              total > 0
                ? (
                    reviews.reduce(
                      (sum, review) =>
                        sum + Number(review.rating),
                      0
                    ) / total
                  ).toFixed(1)
                : "0.0";

            const positivePercent =
              total > 0
                ? Math.round((positive / total) * 100)
                : 0;

            const negativePercent =
              total > 0
                ? Math.round((negative / total) * 100)
                : 0;

            const neutralPercent =
              total > 0
                ? Math.round((neutral / total) * 100)
                : 0;

            const topicCounts = {};

            reviews.forEach((review) => {
              if (Array.isArray(review.topics)) {
                review.topics.forEach((topic) => {
                  topicCounts[topic] =
                    (topicCounts[topic] || 0) + 1;
                });
              }
            });

            const topics = Object.entries(topicCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([topic]) => topic);

            return {
              ...company,
              total,
              averageRating,
              positivePercent,
              neutralPercent,
              negativePercent,
              topics,
            };
          })
        );

        setCompanyData(results);
      } catch (error) {
        console.error(
          "Error loading comparison:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  if (loading) {
    return (
      <div className="compare-page">
        <button
  className="back-home-btn"
  onClick={() => navigate("/")}
>
  ← Back to Home
</button>
        <h1>Loading comparison...</h1>
      </div>
    );
  }

  return (
    <div className="compare-page">

      {/* HEADER */}

      <div className="compare-header">

        <div>
          <h1>Business Comparison</h1>

          <p>
            Compare customer sentiment, ratings and
            AI-detected topics.
          </p>
        </div>

        <Brain size={42} />

      </div>


      {/* COMPANY CARDS */}

      <div className="comparison-grid">

        {companyData.map((company) => (

          <div
            className="comparison-card"
            key={company.id}
          >

            <div className="comparison-company">

              <div className="comparison-logo">
                {company.name.charAt(0)}
              </div>

              <div>

                <h2>{company.name}</h2>

                <p>{company.category}</p>

              </div>

            </div>


            {/* RATING */}

            <div className="comparison-rating">

              <Star
                size={20}
                fill="currentColor"
              />

              <strong>
                {company.averageRating}
              </strong>

              <span>
                ({company.total} reviews)
              </span>

            </div>


            {/* POSITIVE */}

            <div className="comparison-metric">

              <div>
                <span>Positive Sentiment</span>

                <strong>
                  {company.positivePercent}%
                </strong>
              </div>

              <div className="comparison-bar">

                <div
                  className="comparison-positive"
                  style={{
                    width: `${company.positivePercent}%`,
                  }}
                />

              </div>

            </div>


            {/* NEUTRAL */}

            <div className="comparison-metric">

              <div>
                <span>Neutral</span>

                <strong>
                  {company.neutralPercent}%
                </strong>
              </div>

              <div className="comparison-bar">

                <div
                  className="comparison-neutral"
                  style={{
                    width: `${company.neutralPercent}%`,
                  }}
                />

              </div>

            </div>


            {/* NEGATIVE */}

            <div className="comparison-metric">

              <div>
                <span>Negative Sentiment</span>

                <strong>
                  {company.negativePercent}%
                </strong>
              </div>

              <div className="comparison-bar">

                <div
                  className="comparison-negative"
                  style={{
                    width: `${company.negativePercent}%`,
                  }}
                />

              </div>

            </div>


            {/* TOPICS */}

            <div className="comparison-topics">

              <div className="topics-heading">

                <MessageSquare size={18} />

                <strong>
                  Top Topics
                </strong>

              </div>

              {company.topics.length > 0 ? (

                <div className="topic-tags">

                  {company.topics.map((topic) => (

                    <span key={topic}>
                      {topic}
                    </span>

                  ))}

                </div>

              ) : (

                <p>
                  No topics detected yet.
                </p>

              )}

            </div>

          </div>

        ))}

      </div>


      {/* AI INSIGHT */}

      <section className="comparison-ai">

        <div className="comparison-ai-header">

          <Brain size={30} />

          <div>

            <h2>
              AI Comparison Insight
            </h2>

            <p>
              Analysis based on customer reviews
              currently stored in the platform.
            </p>

          </div>

        </div>


        <div className="comparison-ai-content">

          {companyData.length > 0 ? (

            companyData.map((company) => (

              <div
                className="ai-company-insight"
                key={company.id}
              >

                <TrendingUp size={20} />

                <p>

                  <strong>
                    {company.name}:
                  </strong>{" "}

                  {company.total > 0
                    ? `${company.positivePercent}% of analyzed reviews are positive, while ${company.negativePercent}% are negative.`
                    : "There are not enough reviews yet for AI comparison."}

                </p>

              </div>

            ))

          ) : (

            <p>
              No business data available.
            </p>

          )}

        </div>

      </section>

    </div>
  );
}

export default Compare;