export interface WebSource {
  // Fix: Made uri and title optional to align with the Gemini API response type.
  uri?: string;
  title?: string;
}

export interface GroundingChunk {
  // Fix: Made 'web' property optional to align with the Gemini API response type.
  web?: WebSource;
}

export interface GeminiSearchResult {
    text: string;
    sources: GroundingChunk[];
}