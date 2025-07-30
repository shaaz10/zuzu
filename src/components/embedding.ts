import { GoogleGenerativeAI } from "@google/generative-ai";
import { SHA256 } from "crypto-js";

// Convert sentence to basic embedding using hashing (simplified fallback)
export function basicEmbed(text: string): number[] {
  const hash = SHA256(text.toLowerCase()).toString();
  return Array.from(hash.slice(0, 64)).map((char) => char.charCodeAt(0));
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((acc, val, i) => acc + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
  const magB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));
  return dot / (magA * magB);
}

export function getClosestShaazReply(input: string, dataset: any[]): string {
  const inputVec = basicEmbed(input);
  let bestScore = -1;
  let bestReply = "Hmm, cupcake... I'm still figuring out how to hold your feeling.";

  for (const entry of dataset) {
    const compareVec = basicEmbed(entry.prompt);
    const score = cosineSimilarity(inputVec, compareVec);

    if (score > bestScore) {
      bestScore = score;
      bestReply = entry.reply;
    }
  }

  return bestReply;
}
