// gemini.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyBrXMvU91YJqjRpBbFfrBI0THjEEoqiq_E" }); // 🔁 Thay YOUR_API_KEY

export async function askGemini(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const result = await response.response;
    return result.text(); // Trả về string
  } catch (err) {
    console.error("Gemini API error:", err);
    return "Nart gặp chút trục trặc khi gọi AI 😢";
  }
}
