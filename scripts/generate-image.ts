import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateCoverImage(
  topic: string,
  title: string,
  outputPath: string
) {
  console.log(`Generating cover image for "${title}" (${topic})...`);

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt: `Create a modern, minimalist newsletter cover image for "${title}". 
Topic: ${topic}. 
Style: Clean editorial design with subtle gradients. 
Abstract geometric shapes or icons related to the topic. 
Color palette: Deep purple and cyan tones on dark background. 
No text or letters in the image. 
Professional, high-end magazine aesthetic.`,
    n: 1,
    size: "1024x1024",
  });

  const imageData = response.data?.[0];
  if (!imageData) {
    console.error("No image data returned");
    return;
  }

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (imageData.b64_json) {
    const buffer = Buffer.from(imageData.b64_json, "base64");
    fs.writeFileSync(outputPath, buffer);
    console.log(`Image saved to ${outputPath}`);
  } else if (imageData.url) {
    console.log(`Image URL: ${imageData.url}`);
    const res = await fetch(imageData.url);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    console.log(`Image saved to ${outputPath}`);
  }
}

const topic = process.argv[2] || "technology";
const title = process.argv[3] || "Tech Newsletter";
const output = process.argv[4] || `public/covers/${topic}.png`;

generateCoverImage(topic, title, output).catch(console.error);
