const OpenAI = require("openai");

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function analyzeSentiment(text) {
  try {
    const response = await openrouter.chat.completions.create({
      model: "openrouter/free",

      messages: [
        {
          role: "system",
          content: `
You are SentimentServe AI, an AI customer review analysis system.

Analyze the customer review and return ONLY valid JSON.

Return exactly this structure:

{
  "sentiment": "positive",
  "confidence": 95,
  "topics": ["service"],
  "summary": "Short summary of the review.",
  "recommendation": "Actionable recommendation for the business."
}

Rules:

1. sentiment MUST be exactly one of:
   "positive"
   "negative"
   "neutral"

2. confidence MUST be an integer from 0 to 100.

3. topics MUST be an array.

4. Valid topics are:
   delivery,
   quality,
   support,
   pricing,
   refund,
   product,
   service,
   staff,
   usability,
   experience,
   reliability

5. Only include topics actually mentioned or strongly implied.

6. summary must briefly explain the customer's main feedback.

7. recommendation must give an actionable suggestion for the business.

8. Do not invent information.

9. Return JSON only.

10. Do not include Markdown code fences.

11. Do not include explanations outside the JSON object.
          `,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    let output = response.choices?.[0]?.message?.content;

    console.log("========== AI RAW RESPONSE ==========");
    console.log(output);
    console.log("======================================");

    if (!output) {
      throw new Error("AI returned an empty response.");
    }

    // Remove Markdown code fences if returned
    output = output
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Extract JSON object if extra text was returned
    const start = output.indexOf("{");
    const end = output.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      output = output.substring(start, end + 1);
    }

    const result = JSON.parse(output);

    const confidence = Number(result.confidence);

    const allowedTopics = [
      "delivery",
      "quality",
      "support",
      "pricing",
      "refund",
      "product",
      "service",
      "staff",
      "usability",
      "experience",
      "reliability",
    ];

    const topics = Array.isArray(result.topics)
      ? result.topics.filter((topic) =>
          allowedTopics.includes(String(topic).toLowerCase())
        )
      : [];

    const finalResult = {
      sentiment: ["positive", "negative", "neutral"].includes(
        result.sentiment
      )
        ? result.sentiment
        : "neutral",

      confidence: Number.isFinite(confidence)
        ? Math.max(0, Math.min(100, Math.round(confidence)))
        : 0,

      topics,

      summary:
        typeof result.summary === "string"
          ? result.summary.trim()
          : "",

      recommendation:
        typeof result.recommendation === "string"
          ? result.recommendation.trim()
          : "",
    };

    console.log("========== AI PARSED RESULT ==========");
    console.log(finalResult);
    console.log("=======================================");

    return finalResult;
  } catch (error) {
    console.error("OpenRouter sentiment error ❌:", error);

    return {
      sentiment: "neutral",
      confidence: 0,
      topics: [],
      summary: "AI analysis unavailable.",
      recommendation: "Review the feedback manually.",
    };
  }
}

module.exports = analyzeSentiment;