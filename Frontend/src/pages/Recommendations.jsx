import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  MapPin,
  Wallet,
  Headphones,
  Search,
  Sparkles,
} from "lucide-react";

import "../App.css";



function Recommendations() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("Any");
  const [priority, setPriority] = useState("Customer Service");
  const [budget, setBudget] = useState("Medium");
  const [location, setLocation] = useState("Any");

  const [businessData, setBusinessData] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadReviews = async () => {
    try {
      const businessResponse = await fetch(
        "http://localhost:5000/api/businesses"
      );

      const businessResult = await businessResponse.json();

      if (!businessResponse.ok) {
        throw new Error("Failed to fetch businesses");
      }

      const businessList = businessResult.businesses || [];

      setBusinesses(businessList);

      const results = await Promise.all(
        businessList.map(async (business) => {
          const response = await fetch(
            `http://localhost:5000/api/reviews/${business.slug}`
          );

          if (!response.ok) {
            return {
              ...business,
              reviews: [],
            };
          }

          const data = await response.json();

          return {
            ...business,
            reviews: data.reviews || [],
          };
        })
      );

      setBusinessData(results);
      console.log("ALL BUSINESSES LOADED:", results.length);
console.log("ALL BUSINESSES:", results);
    } catch (error) {
      console.error(
        "Error loading recommendation data:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  loadReviews();
}, []);

  const generateRecommendations = () => {
    const scoredBusinesses = businessData
  .filter((business) => {
    if (category === "Any") {
      return true;
    }

    return (
      business.category &&
      business.category.toLowerCase() ===
        category.toLowerCase()
    );

  })
      .map((business) => {
        const reviews = business.reviews;

        const total = reviews.length;

        const positive = reviews.filter(
          (review) => review.sentiment === "positive"
        ).length;

        const positivePercent =
          total > 0
            ? Math.round((positive / total) * 100)
            : 0;

        const averageRating =
          total > 0
            ? reviews.reduce(
                (sum, review) =>
                  sum + Number(review.rating),
                0
              ) / total
            : 0;

        const priorityMatches = reviews.filter(
          (review) =>
            Array.isArray(review.topics) &&
            review.topics.some(
              (topic) =>
                topic.toLowerCase() ===
                priority.toLowerCase()
            )
        ).length;

        let score = 0;

        // Rating contribution
        score += averageRating * 10;

        // Positive sentiment contribution
        score += positivePercent * 0.4;

        // Priority contribution
        if (priorityMatches > 0) {
          score += 15;
        }

        // Budget is currently a preference signal.
        // Real pricing data can be connected later.
       // Budget preference
if (
  business.recommendation &&
  business.recommendation.budget === budget
) {
  score += 5;
}

        return {
          ...business,
          score: Math.min(100, Math.round(score)),
          averageRating: averageRating.toFixed(1),
          positivePercent,
          priorityMatches,
          total,
        };
      })
      .sort((a, b) => b.score - a.score);

    console.log("RECOMMENDATIONS GENERATED:", scoredBusinesses.length);
console.log("RECOMMENDATIONS:", scoredBusinesses);

setRecommendations(scoredBusinesses);
  };

  if (loading) {
    return (
      <div className="recommendation-page">
        <h1>Loading AI recommendations...</h1>
      </div>
    );
  }

  return (
    <div className="recommendation-page">
      <button
  className="back-home-btn"
  onClick={() => navigate("/")}
>
  ← Back to Home
</button>

      {/* HEADER */}

      <div className="recommendation-header">

        <div>

          <div className="recommendation-title">

            <Brain size={40} />

            <div>

              <h1>
                AI Recommendations
              </h1>

              <p>
                Find businesses based on your
                preferences and customer feedback.
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* PREFERENCES */}

      <section className="preference-card">

        <div className="preference-heading">

          <Sparkles size={22} />

          <div>

            <h2>
              Tell us what matters to you
            </h2>

            <p>
              Our recommendation engine will
              analyze customer feedback.
            </p>

          </div>

        </div>


        <div className="preference-grid">

          {/* CATEGORY */}

          <div className="preference-field">

            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option value="Any">
                Any Category
              </option>

              <option value="Technology">
                Technology
              </option>

              <option value="Shopping">Shopping</option>

              <option value="Travel">
                Travel
              </option>

            </select>

          </div>


          {/* PRIORITY */}

          <div className="preference-field">

            <label>
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
            >

              <option value="Customer Service">
                Customer Service
              </option>

              <option value="delivery">
                Delivery
              </option>

              <option value="quality">
                Product Quality
              </option>

              <option value="pricing">
                Pricing
              </option>

              <option value="refund">
                Refunds
              </option>

            </select>

          </div>


          {/* BUDGET */}

          <div className="preference-field">

            <label>
              <Wallet size={16} />
              Budget
            </label>

            <select
              value={budget}
              onChange={(e) =>
                setBudget(e.target.value)
              }
            >

              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>

            </select>

          </div>


          {/* LOCATION */}

          <div className="preference-field">

            <label>
              <MapPin size={16} />
              Location
            </label>

            <select
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            >

              <option value="Any">
                Any Location
              </option>

              <option value="Local">
                Local
              </option>

              <option value="Online">
                Online
              </option>

            </select>

          </div>

        </div>


        <button
          className="recommend-button"
          onClick={generateRecommendations}
        >

          <Search size={19} />

          Generate AI Recommendations

        </button>

      </section>


      {/* RESULTS */}

      {recommendations.length > 0 && (

        <section className="recommendation-results">

          <div className="results-heading">

            <Brain size={24} />

            <div>

              <h2>
                AI Results
              </h2>

              <p>
                Recommendations generated from
                analyzed customer reviews.
              </p>

            </div>

          </div>


          <div className="recommendation-grid">

            {recommendations.map(
              (business, index) => (

                <div
                  className="recommendation-card"
                 key={business._id}
                >

                  {index === 0 && (

                    <div className="recommended-badge">
                      AI Match
                    </div>

                  )}


                  <div className="recommendation-company">

                    <div className="recommendation-logo">
                      {business.name.charAt(0)}
                    </div>

                    <div>

                      <h3>
                        {business.name}
                      </h3>

                      <p>
                        {business.category}
                      </p>

                    </div>

                  </div>


                  <div className="recommendation-score">

                    <span>
                      AI Match Score
                    </span>

                    <strong>
                      {business.score}
                    </strong>

                    <small>
                      / 100
                    </small>

                  </div>


                  <div className="recommendation-stats">

                    <div>
                      <strong>
                        ⭐ {business.averageRating}
                      </strong>

                      <span>
                        Rating
                      </span>
                    </div>

                    <div>
                      <strong>
                        {business.positivePercent}%
                      </strong>

                      <span>
                        Positive
                      </span>
                    </div>

                    <div>
                      <strong>
                        {business.total}
                      </strong>

                      <span>
                        Reviews
                      </span>
                    </div>

                  </div>


                  <div className="recommendation-explanation">

                    <h4>
                      <Brain size={17} />
                      Why this matches
                    </h4>

                    <p>

                      {business.positivePercent}% of
                      analyzed reviews are positive.

                      {business.priorityMatches > 0
                        ? ` Customer feedback contains mentions related to ${priority.toLowerCase()}.`
                        : ` There are currently limited mentions related to ${priority.toLowerCase()}.`}

                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

      )}

    </div>
  );
}

export default Recommendations;