const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeError = async (errorMessage) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a senior software engineer.

Return ONLY valid JSON. No markdown, no explanation.

Format:
{
  "explanation": "...",
  "rootCause": "...",
  "solution": "..."
}

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