// Fix: Implement the Gemini API call to fetch learning resources.
import { GoogleGenAI } from "@google/genai";
import { GeminiSearchResult, GroundingChunk } from '../types';

// Per coding guidelines, initialize GoogleGenAI with an API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * An array of regular expressions to detect if a query is a homework request.
 * This approach is more flexible than simple string matching and can detect patterns
 * regardless of their position in the query, case, or minor variations in wording.
 */
const homeworkRequestPatterns: RegExp[] = [
    // Matches imperative phrases asking to do the work, e.g., "écris-moi", "fais-moi un code", "solve this for me".
    /\b(écris-moi|ecris-moi|écris moi|ecris moi|fais-moi|fais moi|fait moi|code-moi|code moi|résous|resous|résoudre|resoudre|solve|write|code|do)\s+(moi|pour moi|me|for me|ceci|cela|this|cet exercice|this exercise)/i,

    // Matches phrases asking for help to do something, e.g., "aide-moi à faire", "help me solve".
    /\b(aide-moi à|aide moi a|peux-tu m'aider à|help me to?)\s+(faire|résoudre|resoudre|coder|solve|do|code)\b/i,

    // Matches keywords related to schoolwork, e.g., "mon devoir", "cet exercice", "my assignment".
    /\b(mon|cet|l'|the|my|this)\s*(exercice|devoir|DM|assignment|homework)\b/i,

    // Matches specific, common exercise function names.
    /\b(my_putchar|my_putstr|my_strlen)\b/i,

    // Matches phrases that frame the request as a problem to solve.
    /comment\s+(résoudre|resoudre|faire|réaliser)\s+(cet|l')\s*exercice/i,
];


/**
 * Checks if a query is likely a request for homework help by testing it against a list of regex patterns.
 * @param query - The user's search query.
 * @returns True if the query is likely a homework request, false otherwise.
 */
const isHomeworkRequest = (query: string): boolean => {
  const sanitizedQuery = query.trim();
  if (sanitizedQuery.length === 0) {
    return false;
  }
  return homeworkRequestPatterns.some(pattern => pattern.test(sanitizedQuery));
};

/**
 * Counts the number of sentences in a given text by splitting on sentence-ending punctuation.
 * @param text The input text.
 * @returns The number of sentences detected.
 */
const countSentences = (text: string): number => {
    if (!text) return 0;
    // Split the text by periods, question marks, or exclamation points.
    // Filter out any empty strings that result from the split (e.g., text ending with a period).
    const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
    return sentences.length;
};


/**
 * Fetches information about a technology tool using the Gemini API with Google Search grounding.
 * @param query - The technology, tool, or topic to search for.
 * @returns A promise that resolves to a GeminiSearchResult object.
 */
export const fetchToolInfo = async (query: string): Promise<GeminiSearchResult> => {
  // Guardrail: Check if the query is longer than 2 sentences.
  if (countSentences(query) > 2) {
    throw new Error("Si tu continue tu auras -42");
  }
  
  // Guardrail: Check if the query is a homework request.
  if (isHomeworkRequest(query)) {
    throw new Error("c'est dohi petit");
  }

  try {
    // Per coding guidelines, use `ai.models.generateContent` to query the model.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `For the topic "${query}", provide a short, concise list of the best learning resources you can find online. Include official documentation, key articles, and helpful video tutorials. Briefly describe why each resource is useful. Format the response using Markdown lists.`,
      // Per coding guidelines, enable Google Search grounding for up-to-date information.
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Per coding guidelines, extract text directly from `response.text`.
    const text = response.text;
    
    // Per coding guidelines, extract grounding metadata for sources.
    const sources: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    if (!text) {
        throw new Error("No content received from Gemini API.");
    }
    
    return {
      text,
      sources,
    };
  } catch (error) {
    console.error("Error fetching data from Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch learning resources: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching learning resources.");
  }
};