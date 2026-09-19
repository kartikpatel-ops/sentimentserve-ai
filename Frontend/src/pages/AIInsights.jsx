import {
  Brain,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Lightbulb,
} from "lucide-react";

import "../App.css";

function AIInsights() {
  return (
    <div className="ai-insights-page">

      <div className="ai-insights-header">
        <div>
          <div className="ai-title-badge">
            <Brain size={18} />
            AI POWERED
          </div>

          <h1>Customer Intelligence</h1>

          <p>
            AI-powered analysis of customer reviews and feedback.
          </p>
        </div>
      </div>

      {/* Summary Cards */}

      <div className="ai-summary-grid">

        <div className="ai-summary-card">
          <div className="ai-summary-icon">
            <ThumbsUp />
          </div>
          <p>Positive Sentiment</p>
          <h2>78%</h2>
          <span>Customers are satisfied</span>
        </div>

        <div className="ai-summary-card">
          <div className="ai-summary-icon">
            <MessageSquare />
          </div>
          <p>Reviews Analyzed</p>
          <h2>2,341</h2>
          <span>AI analyzed reviews</span>
        </div>

        <div className="ai-summary-card">
          <div className="ai-summary-icon">
            <TrendingUp />
          </div>
          <p>Customer Trend</p>
          <h2>+12%</h2>
          <span>Positive trend this month</span>
        </div>

      </div>

      {/* Main AI Analysis */}

      <section className="ai-analysis-card">

        <div className="ai-section-heading">
          <Brain />
          <div>
            <h2>AI Analysis</h2>
            <p>
              Understanding what customers really think.
            </p>
          </div>
        </div>

        <div className="ai-analysis-grid">

          <div className="ai-analysis-box positive-analysis">
            <ThumbsUp />
            <h3>What customers love</h3>

            <ul>
              <li>Fast delivery</li>
              <li>Product quality</li>
              <li>Helpful customer support</li>
              <li>Easy ordering process</li>
            </ul>
          </div>

          <div className="ai-analysis-box negative-analysis">
            <ThumbsDown />
            <h3>What customers dislike</h3>

            <ul>
              <li>Slow support response</li>
              <li>Occasional delivery delays</li>
              <li>Refund processing time</li>
            </ul>
          </div>

        </div>

      </section>

      {/* Topics */}

      <section className="ai-analysis-card">

        <div className="ai-section-heading">
          <MessageSquare />
          <div>
            <h2>Most Discussed Topics</h2>
            <p>
              Topics frequently detected in customer reviews.
            </p>
          </div>
        </div>

        <div className="topic-list">

          <div className="topic-item">
            <span>Delivery</span>
            <div className="topic-bar">
              <div style={{ width: "85%" }}></div>
            </div>
            <strong>85%</strong>
          </div>

          <div className="topic-item">
            <span>Product Quality</span>
            <div className="topic-bar">
              <div style={{ width: "78%" }}></div>
            </div>
            <strong>78%</strong>
          </div>

          <div className="topic-item">
            <span>Customer Support</span>
            <div className="topic-bar">
              <div style={{ width: "64%" }}></div>
            </div>
            <strong>64%</strong>
          </div>

          <div className="topic-item">
            <span>Pricing</span>
            <div className="topic-bar">
              <div style={{ width: "52%" }}></div>
            </div>
            <strong>52%</strong>
          </div>

        </div>

      </section>

      {/* AI Recommendation */}

      <section className="ai-recommendation">

        <div className="recommendation-icon">
          <Lightbulb />
        </div>

        <div>
          <h2>AI Recommendation</h2>

          <p>
            Customers are highly satisfied with delivery speed and
            product quality. The largest opportunity for improvement
            is customer support response time.
          </p>

          <strong>
            Suggested action: Improve support response time during
            high-volume periods.
          </strong>
        </div>

      </section>

    </div>
  );
}

export default AIInsights;