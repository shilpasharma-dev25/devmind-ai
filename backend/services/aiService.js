const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeError = async (errorMessage) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

   const prompt = `
You are a Senior Software Engineer and Technical Mentor.

Analyze the following software error.

Return ONLY valid JSON.

Do NOT return markdown.
Do NOT return code fences.
Do NOT return any explanation outside JSON.

Return exactly this structure:

{
  "explanation": "A short explanation in 2-3 sentences.",

  "rootCause": [
    "Cause 1",
    "Cause 2",
    "Cause 3"
  ],

  "solution": [
    "Step 1",
    "Step 2",
    "Step 3",
    "Step 4"
  ],

  "bestPractices": [
    "Best practice 1",
    "Best practice 2"
  ]
}

Rules:

- explanation should be concise.
- rootCause must be an array.
- solution must be an ordered list of actionable steps.
- bestPractices must contain short recommendations.
- Never return paragraphs inside arrays.
- Never return markdown.

Error:



Error:
${errorMessage}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // 🔥 CLEAN RESPONSE (VERY IMPORTANT)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      return JSON.parse(text);
    } catch (err) {
      console.log("JSON Parse Failed. Raw Output:", text);

      return {
        explanation: text,
        rootCause: "Parsing issue from AI response",
        solution: "Check raw output logs",
      };
    }
  } catch (error) {
    console.error("Gemini Error:", error);

    return {
      explanation: "AI service failed",
      rootCause: "API or network error",
      solution: "Try again later",
    };
  }
};

module.exports = { analyzeError };