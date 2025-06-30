import { useState, useCallback, useRef } from "react";

interface PasswordStrengthResult {
  score: number; // 0-100
  feedback: string;
  suggestions: string[];
}

interface PasswordStrengthState {
  result: PasswordStrengthResult | null;
  isAnalyzing: boolean;
  error: string | null;
}

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

export const usePasswordStrength = () => {
  const [state, setState] = useState<PasswordStrengthState>({
    result: null,
    isAnalyzing: false,
    error: null,
  });

  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const analyzePassword = useCallback(async (password: string) => {
    if (!password) {
      setState({
        result: null,
        isAnalyzing: false,
        error: null,
      });
      return;
    }

    if (!apiKey) {
      setState({
        result: null,
        isAnalyzing: false,
        error: "Gemini API key not configured",
      });
      return;
    }

    // Debounce the API call
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState((prev) => ({ ...prev, isAnalyzing: true, error: null }));

    timeoutRef.current = setTimeout(async () => {
      try {
        const prompt = `Analyze this password strength and return ONLY a JSON response with the following format:
{
  "score": number (0-100),
  "feedback": "brief description of strength",
  "suggestions": ["suggestion1", "suggestion2"]
}

Password to analyze: "${password}"

Consider these factors:
- Length (minimum 8 characters)
- Uppercase and lowercase letters
- Numbers
- Special characters
- Common patterns or dictionary words
- Repetitive characters

Score guidelines:
- 0-25: Very weak
- 26-50: Weak  
- 51-75: Good
- 76-100: Strong

Keep feedback concise and suggestions actionable. Return only the JSON, no other text.`;

        const response = await fetch(GEMINI_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to analyze password");
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
          throw new Error("Invalid response from AI");
        }

        // Extract JSON from response (in case there's extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("Could not parse AI response");
        }

        const result: PasswordStrengthResult = JSON.parse(jsonMatch[0]);

        // Validate the result structure
        if (
          typeof result.score !== "number" ||
          !result.feedback ||
          !Array.isArray(result.suggestions)
        ) {
          throw new Error("Invalid response format");
        }

        // Ensure score is within bounds
        result.score = Math.max(0, Math.min(100, result.score));

        setState({
          result,
          isAnalyzing: false,
          error: null,
        });
      } catch (error) {
        console.error("Password analysis error:", error);
        setState({
          result: null,
          isAnalyzing: false,
          error: error instanceof Error ? error.message : "Analysis failed",
        });
      }
    }, 500); // 500ms debounce
  }, []);

  return {
    ...state,
    analyzePassword,
  };
};
