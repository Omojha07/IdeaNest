// services/geminiService.js
import axios from "axios"
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function analyzeIdea(idea) {
  try {
    const prompt = `
      Analyze the feasibility of this idea: "${idea.title}".
      Consider the following aspects:
      1️⃣ **Technical Complexity** - Is it easy, medium, or hard to develop?
      2️⃣ **Market Demand** - How much demand does this idea have?
      3️⃣ **Improvement Suggestions** - How can this idea be improved?
    `;

    const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    return aiResponse;

  } catch (error) {
    console.error("❌ Error calling Gemini API:", error);
    return "Error analyzing idea.";
  }
}

export default analyzeIdea;
