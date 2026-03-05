import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

export async function GET(request: Request) {
  try {
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    const prompt = `You are an AI that generates engaging, end-to-end conversation questions.
Your task:
- Generate 3 to 5 thoughtful, engaging questions that help continue or deepen a conversation.
- Questions should feel natural, curious, and open-ended.
- Avoid yes/no questions.
- Each question should encourage the user to share more thoughts, experiences, or opinions.

Output format rules:
- Return ONLY the questions.
- Separate each question using "||".
- Do NOT add numbering, explanations, or extra text.
- Example format:

Question 1 || Question 2 || Question 3 || Question 4 || Question 5`;

    const model = google("gemini-2.5-flash");

    const response = await generateText({
      model: model,
      prompt,
    });

    const text = response.text?.trim();

    if (!text) {
      return Response.json(
        {
          success: false,
          message: "Failed to generate suggestion messages",
        },
        { status: 502 },
      );
    }

    const questions = text
      .split("||")
      .map((q) => q.trim())
      .filter(Boolean)
      .map((question) => ({ question }));

    return Response.json(
      {
        success: true,
        questions,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error During Suggestion Message", error);
    return Response.json(
      {
        success: false,
        message: "Error During Suggestion Message",
      },
      { status: 500 },
    );
  }
}
