
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL = "gemini-1.5-pro";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, messages, prompt, courseId, courseTitle } = await req.json();

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    // For chatbot conversations
    if (action === "chat") {
      const response = await fetch(
        `${GEMINI_API_URL}/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: messages.map((msg: any) => ({
              role: msg.role === "user" ? "user" : "model",
              parts: [{ text: msg.content }],
            })),
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      const data = await response.json();
      console.log("Gemini API Response:", JSON.stringify(data));

      if (!data.candidates || !data.candidates[0]?.content) {
        throw new Error("Invalid response from Gemini API");
      }

      const aiMessage = data.candidates[0].content.parts[0].text;
      return new Response(JSON.stringify({ message: aiMessage }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For generating quizzes
    if (action === "generateQuiz") {
      if (!courseId || !courseTitle) {
        throw new Error("Course ID and title are required for quiz generation");
      }

      const quizPrompt = `Generate a quiz for a course titled "${courseTitle}". 
      The quiz should have 5 multiple-choice questions. 
      For each question, provide 4 options and mark the correct answer. 
      Format the response as a JSON object with this structure:
      {
        "title": "Quiz title here",
        "description": "Brief description of the quiz",
        "questions": [
          {
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option A",
            "explanation": "Explanation for why this is correct"
          }
        ]
      }`;

      const response = await fetch(
        `${GEMINI_API_URL}/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: quizPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      const data = await response.json();
      console.log("Quiz Generation Response:", JSON.stringify(data));

      if (!data.candidates || !data.candidates[0]?.content) {
        throw new Error("Invalid response from Gemini API for quiz generation");
      }

      const quizContent = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response (Gemini might wrap it in markdown)
      const jsonMatch = quizContent.match(/```json\n([\s\S]*?)\n```/) || 
                         quizContent.match(/```\n([\s\S]*?)\n```/) ||
                         [null, quizContent];
      
      let parsedQuiz;
      try {
        parsedQuiz = JSON.parse(jsonMatch[1] || quizContent);
      } catch (e) {
        console.error("Failed to parse quiz JSON:", e);
        throw new Error("Failed to parse quiz JSON from Gemini response");
      }

      return new Response(JSON.stringify({ quiz: parsedQuiz }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action specified" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in Gemini function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
