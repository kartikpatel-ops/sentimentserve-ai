const OpenAI = require("openai");

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

function cleanJson(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {}

  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {}

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {}
  }

  return null;
}

function extractYouTubeId(url = "") {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v") || "";
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1].split("/")[0];
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/embed/")[1].split("/")[0];
      }
    }

    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.replace("/", "").split("?")[0];
    }
  } catch {}

  return "";
}

function normalizeItems(items, platform) {
  if (!Array.isArray(items)) return [];

  return items
    .filter((item) => item && item.url)
    .map((item) => {
      const url = String(item.url).trim();

      return {
        title: item.title || "Untitled",
        summary: item.summary || item.description || "",
        url,
        type: item.type || "content",
        publishedAt: item.publishedAt || "",
        platform,
        videoId:
          platform === "youtube"
            ? extractYouTubeId(url)
            : "",
      };
    })
    .slice(0, 8);
}

async function searchSocialMedia(businessName) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured on the backend."
    );
  }

  const prompt = `
You are the social media research engine for SentimentServe AI.

Business to research:
"${businessName}"

Search the public web for social-media content connected to this EXACT business.

Prioritize:
1. Instagram
2. Facebook
3. YouTube

Search for:
- official business pages/accounts
- public posts
- reels
- public videos
- customer experiences
- customer review-like posts
- public mentions
- recent content

IMPORTANT RULES:

1. Only return real URLs that were found through your web search or page fetch.
2. NEVER invent a URL.
3. Do not create fake Instagram, Facebook, or YouTube links.
4. Prefer the actual business over similarly named businesses.
5. If you cannot confidently identify relevant content, leave that platform array empty.
6. Do not claim that you found private content.
7. Do not claim that you read comments that were not accessible.
8. Facebook and Instagram may have limited publicly indexed information.
9. For YouTube, return actual video/watch URLs when available.
10. Review-like content should only be placed in "reviews" when it genuinely contains a customer experience or opinion.
11. Keep summaries short and factual.

Return ONLY valid JSON.

Required format:

{
  "instagram": [
    {
      "title": "string",
      "summary": "short factual summary",
      "url": "real URL",
      "type": "post|reel|profile|content",
      "publishedAt": ""
    }
  ],
  "facebook": [
    {
      "title": "string",
      "summary": "short factual summary",
      "url": "real URL",
      "type": "post|page|video|content",
      "publishedAt": ""
    }
  ],
  "youtube": [
    {
      "title": "string",
      "summary": "short factual summary",
      "url": "real YouTube URL",
      "type": "video|short|channel",
      "publishedAt": ""
    }
  ],
  "reviews": [
    {
      "platform": "Instagram|Facebook|YouTube",
      "title": "string",
      "summary": "customer experience or opinion",
      "url": "real URL",
      "type": "review|mention"
    }
  ]
}
`;

  const response =
    await openrouter.chat.completions.create({
      model:
        process.env.OPENROUTER_SOCIAL_MODEL ||
        "openrouter/free",

      tools: [
        {
          type: "openrouter:web_search",
          parameters: {
            max_results: 8,
            max_total_results: 20,
            allowed_domains: [
              "instagram.com",
              "facebook.com",
              "youtube.com"
            ]
          }
        },
        {
          type: "openrouter:web_fetch",
          parameters: {
            engine: "openrouter",
            max_content_tokens: 5000,
            allowed_domains: [
              "instagram.com",
              "facebook.com",
              "youtube.com"
            ]
          }
        }
      ],

      tool_choice: "auto",

      messages: [
        {
          role: "system",
          content:
            "You are a careful public social-media research assistant. Never invent links or unavailable content."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

  const message =
    response.choices?.[0]?.message || {};

  const parsed = cleanJson(message.content);

  const result = parsed || {
    instagram: [],
    facebook: [],
    youtube: [],
    reviews: []
  };

  return {
    businessName,

    instagram: normalizeItems(
      result.instagram,
      "instagram"
    ),

    facebook: normalizeItems(
      result.facebook,
      "facebook"
    ),

    youtube: normalizeItems(
      result.youtube,
      "youtube"
    ),

    reviews: normalizeItems(
      result.reviews,
      "social"
    ),

    citations:
      (message.annotations || [])
        .filter(
          (item) =>
            item.type === "url_citation" &&
            item.url_citation?.url
        )
        .map((item) => ({
          title:
            item.url_citation.title || "",
          url:
            item.url_citation.url,
        }))
  };
}

module.exports = searchSocialMedia;