import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Brain,
  Send,
  Sparkles,
  Loader2,
  Building2,
} from "lucide-react";

import "../App.css";

function AIInsights() {
  const [businessName, setBusinessName] = useState("");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Selected Google business
  const googleBusiness = location.state?.business || null;

  // Business that AI should analyze
 const selectedBusinessName =
  businessName ||
  googleBusiness?.name ||
  "";

  // -----------------------------
  // LOAD LOGGED-IN USER
  // -----------------------------
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return;
    }

    try {
      const loggedInUser = JSON.parse(savedUser);
      setUser(loggedInUser);
    } catch (error) {
      console.error(
        "Failed to load logged-in user:",
        error
      );
    }
  }, []);

  // -----------------------------
  // ASK AI
  // -----------------------------
  const handleAskAI = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    // Allow either:
    // 1. Selected Google business
    // 2. Logged-in user's business
    if (!selectedBusinessName) {
      setAnswer(
        "Please select a business or log in with a business account."
      );
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/query",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            query: query.trim(),

            // Use selected Google business if available.
            // Otherwise use logged-in user's business.
            company: selectedBusinessName,

            // Send Google information to backend.
            business: googleBusiness
              ? {
                  name: googleBusiness.name || "",
                  rating:
                    googleBusiness.rating ?? null,
                  reviewCount:
                    googleBusiness.reviewCount ?? 0,
                  address:
                    googleBusiness.address || "",
                  googleMapsUri:
                    googleBusiness.googleMapsUri || "",
                }
              : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setAnswer(
          data.message ||
            "AI request failed."
        );

        return;
      }

      setAnswer(
        data.answer ||
          "The AI did not return an answer."
      );

    } catch (error) {
      console.error(
        "AI query error:",
        error
      );

      setAnswer(
        "Could not connect to the AI service. Please make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // EXAMPLE QUESTIONS
  // -----------------------------
  const exampleQuestions = [
    "Give me an overall review of this business.",
    "What do customers like most about this business?",
    "What are the common customer complaints?",
    "What should this business improve?",
  ];

  const useExample = (question) => {
    setQuery(question);
  };

  return (
    <div className="ai-insights-page">

      {/* BACK TO HOME */}
      <button
        className="back-home-btn"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      <div className="ai-insights-container">

        {/* HEADER */}
        <div className="ai-insights-header">

          <div className="ai-icon">
            <Brain size={30} />
          </div>

          <div>
            <h1>AI Insights</h1>

            <p>
              Ask SentimentServe AI about
              any business.
            </p>
          </div>

        </div>

        {/* BUSINESS */}
        <div className="ai-business-card">

          <Building2 size={22} />

          <div>
            <span>
              Analyzing business
            </span>

          <strong>
  {selectedBusinessName || "Select a business to analyze"}
</strong>
          </div>

        </div>

        {/* QUERY CARD */}
        <div className="ai-business-input-card">
  <label>Business Name</label>

  <input
    type="text"
    value={businessName}
    onChange={(e) => setBusinessName(e.target.value)}
    placeholder="Enter any business name, e.g. Air India"
    disabled={loading}
  />
</div>
        <section className="ai-query-card">

          <div className="ai-query-title">

            <Sparkles size={22} />

            <div>
              <h2>
                Ask SentimentServe AI
              </h2>

              <p>
                Get an AI-powered overview
                using available business data.
              </p>
            </div>

          </div>

          {/* EXAMPLE QUESTIONS */}
          <div className="ai-example-questions">

            {exampleQuestions.map(
              (question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() =>
                    useExample(question)
                  }
                  disabled={loading}
                >
                  {question}
                </button>
              )
            )}

          </div>

          {/* FORM */}
          <form
            className="ai-query-form"
            onSubmit={handleAskAI}
          >

            <textarea
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Example: Give me an overall review of this business..."
              rows={5}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={
                loading ||
                !query.trim() ||
                !selectedBusinessName
              }
              className="ai-query-btn"
            >

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="spin"
                  />

                  Analyzing...
                </>
              ) : (
                <>
                  <Send size={18} />

                  Ask AI
                </>
              )}

            </button>

          </form>

        </section>

        {/* AI RESPONSE */}
        {answer && (
          <section className="ai-response-card">

            <div className="ai-response-header">

              <Brain size={22} />

              <h2>
                AI Response
              </h2>

            </div>

            <div className="ai-response">
              {answer}
            </div>

          </section>
        )}

      </div>

    </div>
  );
}

export default AIInsights;