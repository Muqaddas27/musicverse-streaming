import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSongs() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a JSON array of 200 songs for a music streaming app. 
    100 English songs and 100 Pakistani/Urdu songs.
    Categories: Pop, Romantic, Chill, Sad, Rock, Classical, Coke Studio.
    Fields: id (1-200), title, artist, language (English/Urdu), category, cover (use https://picsum.photos/seed/{id}/300/300), audio (use https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3 but vary the number 1-10 randomly), duration (e.g. 3:45).
    Return ONLY the JSON array.`,
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text || "[]");
}
