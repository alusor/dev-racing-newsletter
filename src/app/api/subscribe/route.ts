import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Subscriber } from "@/lib/models/subscriber";
import { Newsletter } from "@/lib/models/newsletter";

export async function POST(req: Request) {
  const { email, newsletterId, frequency } = await req.json();

  if (!email || !newsletterId || !frequency) {
    return NextResponse.json(
      { error: "Faltan campos requeridos" },
      { status: 400 }
    );
  }

  await connectDB();

  const existing = await Subscriber.findOne({ email, newsletterId });
  if (existing) {
    return NextResponse.json(
      { error: "Ya estás suscrito a este newsletter" },
      { status: 409 }
    );
  }

  await Subscriber.create({ email, newsletterId, frequency });

  await Newsletter.findByIdAndUpdate(newsletterId, {
    $inc: { subscriberCount: 1 },
  });

  return NextResponse.json({ success: true });
}
