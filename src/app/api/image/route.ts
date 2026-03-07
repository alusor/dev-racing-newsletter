import { NextResponse } from "next/server";
import OpenAI from "openai";
import { connectDB } from "@/lib/mongodb";
import { Newsletter } from "@/lib/models/newsletter";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const maxDuration = 60;

export async function POST(req: Request) {
  const { newsletterId, topic, title } = await req.json();

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

  const imageUrl = response.data?.[0]?.url || "";

  if (newsletterId) {
    await connectDB();
    await Newsletter.findByIdAndUpdate(newsletterId, {
      coverImageUrl: imageUrl,
    });
  }

  return NextResponse.json({ imageUrl });
}
