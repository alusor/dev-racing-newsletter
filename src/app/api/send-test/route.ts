import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Newsletter } from "@/lib/models/newsletter";
import { wrapEmailTemplate } from "@/lib/email-template";
import { resend } from "@/lib/resend";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { email, newsletterId } = await req.json();

  if (!email || !newsletterId) {
    return NextResponse.json(
      { error: "email and newsletterId are required" },
      { status: 400 }
    );
  }

  await connectDB();

  let newsletter;
  try {
    newsletter = await Newsletter.findById(newsletterId);
  } catch {
    return NextResponse.json(
      { error: "Invalid newsletter ID" },
      { status: 400 }
    );
  }

  if (!newsletter || newsletter.previews.length === 0) {
    return NextResponse.json(
      { error: "Newsletter not found or has no previews" },
      { status: 404 }
    );
  }

  const latestPreview = newsletter.previews[newsletter.previews.length - 1];

  const htmlEmail = wrapEmailTemplate(newsletter.title, {
    subject: latestPreview.subject,
    htmlContent: latestPreview.htmlContent,
    sections: latestPreview.sections,
    generatedAt: latestPreview.generatedAt,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: "Newsletter Hub <onboarding@resend.dev>",
      to: email,
      subject: `[Preview] ${latestPreview.subject}`,
      html: htmlEmail,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to send email", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailId: data?.id,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
