import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

export async function GET() {
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

    const result = await streamText({
      model,
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.log("Error During Suggestion Message", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Error During Suggestion Message",
      }),
      { status: 500 }
    );
  }
}