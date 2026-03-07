import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Newsletter } from "@/lib/models/newsletter";
import { zavu, zavuSendOptions } from "@/lib/zavu";

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

  const plainText = [
    newsletter.title,
    latestPreview.subject,
    "",
    ...latestPreview.sections.map((s) => s.title),
    "",
    "Abre este email para ver el contenido completo.",
    "Generado automaticamente con IA - Newsletter Hub",
  ].join("\n");

  const truncatedText =
    plainText.length > 1500
      ? plainText.slice(0, 1497) + "..."
      : plainText;

  const payload = {
    to: email,
    channel: "email" as const,
    subject: `[Preview] ${latestPreview.subject}`,
    text: truncatedText,
  };

  console.log("Zavu payload size:", JSON.stringify(payload).length);

  try {
    const result = await zavu.messages.send(payload, zavuSendOptions);

    return NextResponse.json({
      success: true,
      messageId: result.message?.id,
      status: result.message?.status,
    });
  } catch (err: unknown) {
    const errObj = err as Record<string, unknown>;
    console.error("Zavu error:", JSON.stringify(errObj?.error, null, 2));
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
