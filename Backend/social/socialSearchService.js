const { getJson } = require("serpapi");

const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY;

if (!SERPAPI_API_KEY) {
  console.warn("⚠️ SERPAPI_API_KEY is missing from Backend/.env");
}

function emptyResult() {
  return {
    instagram: [],
    facebook: [],
    youtube: [],
    reviews: [],
  };
}

function getDomain(url = "") {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function makeItem(result, platform) {
  return {
    title: result.title || "Public content",
    summary:
      result.snippet ||
      result.description ||
      "Public information found on Google.",
    url: result.link || "",
    publishedAt: result.date || "",
    platform,
  };
}

function uniqueByUrl(items) {
  const seen = new Set();

  return items.filter((item) => {
    if (!item.url || seen.has(item.url)) {
      return false;
    }

    seen.add(item.url);
    return true;
  });
}

async function googleSearch(query) {
  console.log(`🔎 SerpApi search: ${query}`);

  const result = await getJson({
    engine: "google",
    q: query,
    location: "Bhopal, Madhya Pradesh, India",
    google_domain: "google.co.in",
    hl: "en",
    gl: "in",
    api_key: SERPAPI_API_KEY,
  });

  if (result.error) {
    throw new Error(result.error);
  }

  return result;
}

async function searchSocialMedia(companyName) {
  if (!companyName) {
    throw new Error("Company name is required.");
  }

  if (!SERPAPI_API_KEY) {
    throw new Error(
      "SERPAPI_API_KEY is missing. Add it to Backend/.env"
    );
  }

  console.log(
    `🔎 Starting SerpApi social search for: ${companyName}`
  );

  const result = emptyResult();

  try {
    // =========================================
    // INSTAGRAM
    // =========================================

    const instagramData = await googleSearch(
      `"${companyName}" site:instagram.com`
    );

    const instagramResults =
      instagramData.organic_results || [];

    result.instagram = uniqueByUrl(
      instagramResults
        .filter((item) =>
          getDomain(item.link).includes("instagram.com")
        )
        .slice(0, 5)
        .map((item) =>
          makeItem(item, "Instagram")
        )
    );

    // =========================================
    // FACEBOOK
    // =========================================

    const facebookData = await googleSearch(
      `"${companyName}" site:facebook.com`
    );

    const facebookResults =
      facebookData.organic_results || [];

    result.facebook = uniqueByUrl(
      facebookResults
        .filter((item) =>
          getDomain(item.link).includes("facebook.com")
        )
        .slice(0, 5)
        .map((item) =>
          makeItem(item, "Facebook")
        )
    );

    // =========================================
    // YOUTUBE
    // =========================================

    const youtubeData = await googleSearch(
      `"${companyName}" site:youtube.com`
    );

    const youtubeResults =
      youtubeData.organic_results || [];

    result.youtube = uniqueByUrl(
      youtubeResults
        .filter((item) =>
          getDomain(item.link).includes("youtube.com")
        )
        .slice(0, 5)
        .map((item) => ({
          ...makeItem(item, "YouTube"),
          videoId: extractYouTubeId(item.link),
        }))
    );

    // =========================================
    // PUBLIC REVIEWS / MENTIONS
    // =========================================

    const reviewsData = await googleSearch(
      `"${companyName}" reviews customer experience`
    );

    const reviewResults =
      reviewsData.organic_results || [];

    result.reviews = uniqueByUrl(
      reviewResults
        .filter((item) => {
          const domain = getDomain(item.link);

          return (
            !domain.includes("instagram.com") &&
            !domain.includes("facebook.com") &&
            !domain.includes("youtube.com")
          );
        })
        .slice(0, 5)
        .map((item) =>
          makeItem(item, "Public Review")
        )
    );

    console.log(
      `✅ SerpApi social search completed for: ${companyName}`
    );

    console.log(
      `Instagram: ${result.instagram.length}`
    );

    console.log(
      `Facebook: ${result.facebook.length}`
    );

    console.log(
      `YouTube: ${result.youtube.length}`
    );

    console.log(
      `Reviews: ${result.reviews.length}`
    );

    return result;

  } catch (error) {
    console.error(
      "❌ SerpApi social search error:"
    );

    console.error(error);

    throw new Error(
      error?.message ||
      "SerpApi social media search failed."
    );
  }
}

function extractYouTubeId(url = "") {
  try {
    const parsed = new URL(url);

    // youtube.com/watch?v=XXXX
    if (parsed.searchParams.get("v")) {
      return parsed.searchParams.get("v");
    }

    // youtube.com/shorts/XXXX
    const shortsMatch =
      parsed.pathname.match(/\/shorts\/([^/]+)/);

    if (shortsMatch) {
      return shortsMatch[1];
    }

    // youtube.com/embed/XXXX
    const embedMatch =
      parsed.pathname.match(/\/embed\/([^/]+)/);

    if (embedMatch) {
      return embedMatch[1];
    }

    return "";
  } catch {
    return "";
  }
}

module.exports = searchSocialMedia;