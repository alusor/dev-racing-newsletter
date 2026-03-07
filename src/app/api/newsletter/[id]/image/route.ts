import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Newsletter } from "@/lib/models/newsletter";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await connectDB();

  let newsletter;
  try {
    newsletter = await Newsletter.findById(id).select("coverImageUrl").lean();
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  if (!newsletter?.coverImageUrl) {
    return new NextResponse("No image", { status: 404 });
  }

  const b64Match = newsletter.coverImageUrl.match(
    /^data:image\/(\w+);base64,(.+)$/
  );
  if (b64Match) {
    const [, format, data] = b64Match;
    const buffer = Buffer.from(data, "base64");
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": `image/${format}`,
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  return NextResponse.redirect(newsletter.coverImageUrl);
}
