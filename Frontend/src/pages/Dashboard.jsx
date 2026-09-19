import {
  Brain,
  Star,
  MessageSquare,
  TrendingUp,
  ThumbsUp,
  AlertTriangle,
} from "lucide-react";

import "../App.css";

function Dashboard() {
  return (
    <div className="dashboard-page">

      {/* Header */}
      <div className="dashboard-header">

        <div>
          <p className="dashboard-label">
            BUSINESS DASHBOARD
          </p>

          <h1>TechNova Solutions</h1>

          <p>
            Customer intelligence and AI insights
          </p>
        </div>

        <div className="dashboard-logo">
          T
        </div>

      </div>


      {/* Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">
            <Star />
          </div>

          <div>
            <p>Overall Rating</p>
            <h2>4.8</h2>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">
            <MessageSquare />
          </div>

          <div>
            <p>Total Reviews</p>
            <h2>2,341</h2>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">
            <ThumbsUp />
          </div>

          <div>
            <p>Positive Sentiment</p>
            <h2>78%</h2>
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp />
          </div>

          <div>
            <p>Customer Growth</p>
            <h2>+12%</h2>
          </div>
        </div>

      </div>


      {/* AI Insights */}
      <section className="dashboard-section">

        <div className="dashboard-section-title">
          <Brain />

          <div>
            <h2>AI Customer Insights</h2>

            <p>
              What your customers are saying about your business.
            </p>
          </div>
        </div>


        <div className="dashboard-insights">

          <div className="dashboard-insight positive-dashboard">

            <ThumbsUp />

            <div>
              <h3>What's working well?</h3>

              <p>
                Customers frequently mention fast delivery,
                product quality and helpful customer support.
              </p>
            </div>

          </div>


          <div className="dashboard-insight warning-dashboard">

            <AlertTriangle />

            <div>
              <h3>What needs attention?</h3>

              <p>
                Some customers mention slow responses from
                customer support during busy periods.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* Sentiment */}
      <section className="dashboard-section">

        <div className="dashboard-section-title">

          <Brain />

          <div>
            <h2>Sentiment Overview</h2>

            <p>
              AI analysis of your customer reviews.
            </p>
          </div>

        </div>


        <div className="sentiment-dashboard">

          <div className="dashboard-sentiment-row">
            <span>Positive</span>
            <strong>78%</strong>
          </div>

          <div className="dashboard-progress">
            <div
              className="dashboard-positive"
              style={{ width: "78%" }}
            ></div>
          </div>


          <div className="dashboard-sentiment-row">
            <span>Neutral</span>
            <strong>14%</strong>
          </div>

          <div className="dashboard-progress">
            <div
              className="dashboard-neutral"
              style={{ width: "14%" }}
            ></div>
          </div>


          <div className="dashboard-sentiment-row">
            <span>Negative</span>
            <strong>8%</strong>
          </div>

          <div className="dashboard-progress">
            <div
              className="dashboard-negative"
              style={{ width: "8%" }}
            ></div>
          </div>

        </div>

      </section>


      {/* Recommendations */}
      <section className="dashboard-section">

        <div className="dashboard-section-title">

          <TrendingUp />

          <div>
            <h2>AI Recommendations</h2>

            <p>
              Suggested actions based on customer feedback.
            </p>
          </div>

        </div>


        <div className="recommendation-grid">

          <div className="recommendation-card">
            <span>01</span>

            <h3>Improve Support Response</h3>

            <p>
              Customers frequently mention response time.
              Consider increasing support availability.
            </p>
          </div>


          <div className="recommendation-card">
            <span>02</span>

            <h3>Maintain Delivery Speed</h3>

            <p>
              Fast delivery is one of the most appreciated
              aspects of your service.
            </p>
          </div>


          <div className="recommendation-card">
            <span>03</span>

            <h3>Monitor Product Quality</h3>

            <p>
              Product quality strongly influences positive
              customer sentiment.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;