import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Newsletter } from "@/lib/models/newsletter";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  await connectDB();
  await seedDatabase();

  const newsletters = await Newsletter.find()
    .select("-previews.htmlContent")
    .sort({ subscriberCount: -1 })
    .lean();

  return NextResponse.json(newsletters);
}
