import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function SocialMedia({ companyName, businessName }) {
  const name = companyName || businessName;

  const [data, setData] = useState({
    instagram: [],
    facebook: [],
    youtube: [],
    reviews: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSocialMedia = async () => {
    if (!name) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/social-media/${encodeURIComponent(name)}`
      );

      if (!response.ok) {
        throw new Error(
          `Social media API returned ${response.status}`
        );
      }

      const result = await response.json();

      setData({
        instagram: Array.isArray(result.instagram)
          ? result.instagram
          : [],
        facebook: Array.isArray(result.facebook)
          ? result.facebook
          : [],
        youtube: Array.isArray(result.youtube)
          ? result.youtube
          : [],
        reviews: Array.isArray(result.reviews)
          ? result.reviews
          : [],
      });
    } catch (err) {
      console.error("Social media error:", err);
      setError(
        "Unable to load social media information right now."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialMedia();
  }, [name]);

  const totalResults =
    data.instagram.length +
    data.facebook.length +
    data.youtube.length +
    data.reviews.length;

  if (loading) {
    return (
      <section className="social-media-section">
        <div className="social-media-header">
          <div>
            <h2>Social Media Intelligence</h2>
            <p>
              Searching public social media content for{" "}
              <strong>{name}</strong>...
            </p>
          </div>
        </div>

        <div className="social-loading">
          <div className="social-spinner"></div>
          <p>AI is searching social media...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="social-media-section">
        <div className="social-media-header">
          <div>
            <h2>Social Media Intelligence</h2>
            <p>
              Public content and reviews from social platforms.
            </p>
          </div>

          <button
            className="social-refresh-button"
            onClick={fetchSocialMedia}
          >
            Refresh
          </button>
        </div>

        <div className="social-error">
          <h3>Unable to load social media</h3>
          <p>{error}</p>

          <button
            className="social-retry-button"
            onClick={fetchSocialMedia}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="social-media-section">
      {/* HEADER */}
      <div className="social-media-header">
        <div>
          <h2>Social Media Intelligence</h2>

          <p>
            AI-powered public social media content,
            videos and customer opinions for{" "}
            <strong>{name}</strong>.
          </p>
        </div>

        <button
          className="social-refresh-button"
          onClick={fetchSocialMedia}
        >
          Refresh
        </button>
      </div>

      {/* SUMMARY */}
      <div className="social-summary">
        <div className="social-summary-card">
          <div className="social-summary-number">
            {totalResults}
          </div>

          <div className="social-summary-label">
            Total Results
          </div>
        </div>

        <div className="social-summary-card">
          <div className="social-summary-number">
            {data.instagram.length}
          </div>

          <div className="social-summary-label">
            Instagram
          </div>
        </div>

        <div className="social-summary-card">
          <div className="social-summary-number">
            {data.facebook.length}
          </div>

          <div className="social-summary-label">
            Facebook
          </div>
        </div>

        <div className="social-summary-card">
          <div className="social-summary-number">
            {data.youtube.length}
          </div>

          <div className="social-summary-label">
            YouTube
          </div>
        </div>
      </div>

      {/* INSTAGRAM */}
      <SocialPlatform
        title="Instagram"
        shortName="IG"
        description="Public Instagram content related to this business."
        items={data.instagram}
        type="instagram"
      />

      {/* FACEBOOK */}
      <SocialPlatform
        title="Facebook"
        shortName="f"
        description="Public Facebook pages, posts and mentions."
        items={data.facebook}
        type="facebook"
      />

      {/* YOUTUBE */}
      <SocialPlatform
        title="YouTube"
        shortName="▶"
        description="Public videos and YouTube content related to this business."
        items={data.youtube}
        type="youtube"
      />

      {/* SOCIAL REVIEWS */}
      <SocialPlatform
        title="Social Reviews & Mentions"
        shortName="★"
        description="Customer opinions and public mentions found across social platforms."
        items={data.reviews}
        type="reviews"
      />

      {/* NO RESULTS */}
      {totalResults === 0 && (
        <div className="social-empty">
          <div className="social-empty-icon">◎</div>

          <h3>No public social content found</h3>

          <p>
            We couldn't find publicly indexed social media
            content for this business at the moment.
          </p>

          <button
            className="social-retry-button"
            onClick={fetchSocialMedia}
          >
            Search Again
          </button>
        </div>
      )}
    </section>
  );
}


/* =====================================================
   SOCIAL PLATFORM COMPONENT
===================================================== */

function SocialPlatform({
  title,
  shortName,
  description,
  items,
  type,
}) {
  return (
    <div className={`social-platform ${type}-platform`}>
      {/* PLATFORM HEADER */}

      <div className="social-platform-header">
        <div
          className={`social-platform-icon ${type}-icon`}
        >
          {shortName}
        </div>

        <div className="social-platform-title">
          <h3>{title}</h3>

          <p>{description}</p>
        </div>

        <div className="social-platform-count">
          {items.length}
        </div>
      </div>

      {/* CONTENT */}

      {items.length === 0 ? (
        <div className="social-no-content">
          No public content found.
        </div>
      ) : (
        <div className="social-content-grid">
          {items.map((item, index) => (
            <SocialCard
              key={`${type}-${index}`}
              item={item}
              type={type}
            />
          ))}
        </div>
      )}
    </div>
  );
}


/* =====================================================
   SOCIAL CARD
===================================================== */

function SocialCard({ item, type }) {
  const title =
    item.title ||
    item.name ||
    "Social media content";

  const summary =
    item.summary ||
    item.description ||
    item.text ||
    "No description available.";

  const url = item.url || item.link || "";

  const publishedAt =
    item.publishedAt ||
    item.date ||
    "";

  const platform =
    item.platform ||
    type;

  const videoId =
    item.videoId ||
    "";

  return (
    <article className="social-content-card">

      {/* VIDEO PREVIEW */}

      {type === "youtube" && videoId ? (
        <div className="youtube-video-wrapper">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      ) : null}

      {/* CARD BODY */}

      <div className="social-card-body">

        <div className="social-card-top">
          <span className="social-card-platform">
            {platform}
          </span>

          {publishedAt && (
            <span className="social-card-date">
              {publishedAt}
            </span>
          )}
        </div>

        <h4>{title}</h4>

        <p>{summary}</p>

        {/* OPEN CONTENT */}

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-view-button"
          >
            View Original
            <span className="social-arrow">↗</span>
          </a>
        )}

      </div>
    </article>
  );
}

export default SocialMedia;