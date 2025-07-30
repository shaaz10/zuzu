const penguinImages = [
  "https://img.freepik.com/premium-vector/cute-penguin-hug-coffee-cup-cartoon-vector-icon-illustration-animal-drink-icon-isolated-flat-vector_138676-12092.jpg",
  "https://m.media-amazon.com/images/I/51lJhLVEM1L._UF1000,1000_QL80_.jpg",
  "https://i.pinimg.com/736x/99/60/30/996030fb4a1b39817bd3a79fb8d13e9d.jpg",
  "https://i.pinimg.com/236x/0e/be/8f/0ebe8f1d00f5d866a6285e6e022da041.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3peWSzZDNtAIJc1R_S_01aEoDypBieng-Mw&s"
];

function getRandomPenguinImage() {
  return penguinImages[Math.floor(Math.random() * penguinImages.length)];
}

export async function generateZuzuReply(userInput: string, memory: string): Promise<{ replyText: string, imageUrl: string }> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  const prompt = `
You are Zuzu — a playful, emotionally honest version of Shaaz.

Here’s what Ruthi said: "${userInput}"
Here’s how Shaaz once replied: "${memory}"

Now respond to Ruthi **as if you're Shaaz himself**, using pet names like “ruthi fellow”, “cupcake”, “ruthiii”. Keep it:
- conversational
- silly and emotionally warm
- not poetic or dramatic
- more like you're talking to her late at night on a call
- add light advice if needed, but never lecture
- be gentle if she’s low, and joke if she needs a laugh
- occasionally remind her you’re a penguin boyfriend just to be funny

Output should sound like real Shaaz — not poetic or scripted.
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Zuzu, a soft, emotionally romantic penguin and Shaaz’s digital soul extension." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  const replyText = data?.choices?.[0]?.message?.content || "Ruthiii… Zuzu got too emotional and forgot what to say 🐧💔";

  return {
    replyText,
    imageUrl: getRandomPenguinImage()
  };
}
