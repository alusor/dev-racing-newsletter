import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Newsletter } from "@/lib/models/newsletter";
import { generateNewsletterEdition } from "@/lib/newsletter-generator";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { newsletterId } = await req.json();

  if (!newsletterId) {
    return NextResponse.json(
      { error: "newsletterId requerido" },
      { status: 400 }
    );
  }

  await connectDB();
  const newsletter = await Newsletter.findById(newsletterId);

  if (!newsletter) {
    return NextResponse.json(
      { error: "Newsletter no encontrado" },
      { status: 404 }
    );
  }

  const edition = await generateNewsletterEdition(
    newsletter.topic,
    newsletter.style,
    newsletter.frequency,
    newsletter.title
  );

  newsletter.previews.push({
    subject: edition.subject,
    htmlContent: edition.htmlContent,
    sections: edition.sections,
    generatedAt: new Date(),
  });

  await newsletter.save();

  return NextResponse.json({ success: true, edition });
}
