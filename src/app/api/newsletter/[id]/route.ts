import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Newsletter } from "@/lib/models/newsletter";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const newsletter = await Newsletter.findById(id).lean();

  if (!newsletter) {
    return NextResponse.json(
      { error: "Newsletter not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(newsletter);
}
