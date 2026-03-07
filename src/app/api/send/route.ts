import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Newsletter } from "@/lib/models/newsletter";
import { Subscriber } from "@/lib/models/subscriber";
import { generateNewsletterEdition } from "@/lib/newsletter-generator";
import { wrapEmailTemplate } from "@/lib/email-template";
import { zavu, zavuSendOptions } from "@/lib/zavu";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { newsletterId, frequency } = await req.json();

  await connectDB();

  const query: Record<string, unknown> = {};
  if (newsletterId) query._id = newsletterId;
  if (frequency) query.frequency = frequency;

  const newsletters = await Newsletter.find(query);
  const results = [];

  for (const newsletter of newsletters) {
    const edition = await generateNewsletterEdition(
      newsletter.topic,
      newsletter.style,
      newsletter.frequency,
      newsletter.title,
      { withImage: false }
    );

    newsletter.previews.push({
      subject: edition.subject,
      htmlContent: edition.htmlContent,
      sections: edition.sections,
      generatedAt: new Date(),
    });
    await newsletter.save();

    const subscribers = await Subscriber.find({
      newsletterId: newsletter._id,
    });

    const htmlEmail = wrapEmailTemplate(newsletter.title, {
      subject: edition.subject,
      htmlContent: edition.htmlContent,
      sections: edition.sections,
      generatedAt: new Date(),
    });

    for (const subscriber of subscribers) {
      try {
        await zavu.messages.send(
          {
            to: subscriber.email,
            channel: "email",
            subject: edition.subject,
            text: edition.sections
              .map((s) => `${s.title}\n${s.content}`)
              .join("\n\n"),
            htmlBody: htmlEmail,
          },
          zavuSendOptions
        );
        results.push({
          email: subscriber.email,
          newsletter: newsletter.title,
          status: "sent",
        });
      } catch (err) {
        results.push({
          email: subscriber.email,
          newsletter: newsletter.title,
          status: "error",
          error: err instanceof Error ? err.message : "Unknown",
        });
      }
    }
  }

  return NextResponse.json({ sent: results.length, results });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const frequency = searchParams.get("frequency");
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = await POST(
    new Request(req.url, {
      method: "POST",
      body: JSON.stringify({ frequency: frequency || "daily" }),
      headers: { "Content-Type": "application/json" },
    })
  );

  return response;
}
