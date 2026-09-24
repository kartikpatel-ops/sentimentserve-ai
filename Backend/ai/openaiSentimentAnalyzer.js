const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeSentiment(text) {
  const response = await openai.responses.create({
    model: "gpt-5-mini",
    instructions: `
You are a review analysis AI for a business review platform.

Analyze the customer's review and return ONLY valid JSON.

The JSON must contain:
- sentiment: "positive", "negative", or "neutral"
- confidence: integer from 0 to 100
- topics: array containing relevant topics
- summary: short summary of the review
- recommendation: useful recommendation for the business

Possible topics include:
delivery, quality, support, pricing, refund, product,
service, staff, usability, experience, reliability

Rules:
- sentiment should represent the overall opinion
- confidence should represent how certain the classification is
- topics should contain only topics actually mentioned or strongly implied
- summary should be concise
- recommendation should be actionable
- do not invent information
`,
    input: text,
  });

  const result = response.output_text;

  try {
    return JSON.parse(result);
  } catch (error) {
    console.error("OpenAI returned invalid JSON:", result);

    return {
      sentiment: "neutral",
      confidence: 0,
      topics: [],
      summary: "Unable to analyze the review.",
      recommendation: "Review the feedback manually.",
    };
  }
}

module.exports = analyzeSentiment;