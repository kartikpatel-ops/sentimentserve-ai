import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  ShieldCheck,
  Brain,
  TrendingUp,
} from "lucide-react";

import "../App.css";

function Home() {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const handleSearch = () => {
    const company = search.trim();

    if (company === "") {
      alert("Please enter a company name.");
      return;
    }

    navigate(`/company/${encodeURIComponent(company.toLowerCase())}`);
  };

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo">
          <span>Sentiment</span>Serve AI
        </div>

       <div className="nav-links">
  <a href="#businesses">Businesses</a>

  <button onClick={() => navigate("/ai-insights")}>
    AI Insights
  </button>

  <button onClick={() => navigate("/dashboard")}>
    Dashboard
  </button>

  <a href="#about">About</a>
</div>
       <button
  className="login-btn"
  onClick={() => navigate("/login")}
>
  Login
</button>

      </nav>


      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">

          <div className="badge">
            <Brain size={18} />
            AI-Powered Customer Intelligence
          </div>

          <h1>
            Find out what
            <span> customers really think.</span>
          </h1>

          <p>
            Discover trusted reviews, understand customer sentiment,
            and get AI-powered insights about businesses.
          </p>


          {/* Search */}
          <div className="search-box">

            <Search size={22} />

            <input
              type="text"
              placeholder="Search for a company or product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <button onClick={handleSearch}>
              Search
            </button>

          </div>


          <div className="trusted">
            <ShieldCheck size={18} />
            Trusted reviews • AI analyzed • Real customer insights
          </div>

        </div>

      </section>


      {/* Popular Businesses */}
      <section
        className="business-section"
        id="businesses"
      >

        <div className="section-heading">

          <div>
            <h2>Popular Businesses</h2>

            <p>
              See what customers are saying right now.
            </p>
          </div>

          <button className="view-btn">
            View all
          </button>

        </div>


        <div className="business-grid">

          <BusinessCard
            name="TechNova Solutions"
            category="Technology"
            rating="4.8"
            reviews="2,341"
            onClick={() => navigate("/company/technova")}
          />

          <BusinessCard
            name="QuickKart"
            category="E-Commerce"
            rating="4.5"
            reviews="1,892"
            onClick={() => navigate("/company/quickkart")}
          />

          <BusinessCard
            name="TravelEase"
            category="Travel"
            rating="4.2"
            reviews="987"
            onClick={() => navigate("/company/travelease")}
          />

        </div>

      </section>


      {/* AI Insights */}
      <section
        className="insights"
        id="insights"
      >

        <div className="insights-text">

          <div className="badge">
            <Brain size={18} />
            Powered by AI
          </div>

          <h2>
            Reviews tell the story.
            <span> AI explains it.</span>
          </h2>

          <p>
            Instead of simply showing star ratings, SentimentServe AI
            analyzes customer reviews to discover what people love,
            what frustrates them, and what businesses can improve.
          </p>


          <div className="features">

            <Feature
              icon={<Brain />}
              title="Sentiment Analysis"
              text="Automatically detect positive, neutral, and negative opinions."
            />

            <Feature
              icon={<TrendingUp />}
              title="Customer Trends"
              text="Discover changing customer opinions and important trends."
            />

            <Feature
              icon={<Star />}
              title="Smart Ratings"
              text="Combine ratings and AI insights to understand businesses better."
            />

          </div>

        </div>


        {/* AI Card */}
        <div className="ai-card">

          <div className="ai-header">
            <Brain size={22} />
            AI Customer Insights
          </div>

          <div className="sentiment-row">
            <span>Positive</span>
            <strong>78%</strong>
          </div>

          <div className="progress">
            <div className="positive"></div>
          </div>


          <div className="sentiment-row">
            <span>Neutral</span>
            <strong>14%</strong>
          </div>

          <div className="progress">
            <div className="neutral"></div>
          </div>


          <div className="sentiment-row">
            <span>Negative</span>
            <strong>8%</strong>
          </div>

          <div className="progress">
            <div className="negative"></div>
          </div>


          <div className="ai-message">
            💡 Customers especially appreciate fast delivery
            and responsive customer support.
          </div>

        </div>

      </section>


      {/* Footer */}
      <footer id="about">

        <div className="logo">
          <span>Sentiment</span>Serve AI
        </div>

        <p>
          AI-powered customer intelligence platform.
        </p>

        <p className="copyright">
          © 2026 SentimentServe AI. Built for Hackathon.
        </p>

      </footer>

    </div>
  );
}


/* Business Card */

function BusinessCard({
  name,
  category,
  rating,
  reviews,
  onClick,
}) {

  return (
    <div
      className="business-card"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >

      <div className="company-icon">
        {name.charAt(0)}
      </div>

      <div className="company-info">

        <h3>{name}</h3>

        <p>{category}</p>

        <div className="rating">

          <div className="stars">
            ★★★★★
          </div>

          <strong>{rating}</strong>

          <span>
            {reviews} reviews
          </span>

        </div>

      </div>

    </div>
  );
}


/* Feature */

function Feature({
  icon,
  title,
  text,
}) {

  return (
    <div className="feature">

      <div className="feature-icon">
        {icon}
      </div>

      <div>

        <h3>{title}</h3>

        <p>{text}</p>

      </div>

    </div>
  );
}


export default Home;