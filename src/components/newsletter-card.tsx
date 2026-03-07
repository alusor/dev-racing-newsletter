"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { calculatePrice } from "@/lib/pricing";

interface NewsletterCardProps {
  id: string;
  title: string;
  description: string;
  topic: string;
  frequency: "daily" | "weekly";
  subscriberCount: number;
}

const topicIcons: Record<string, string> = {
  "artificial-intelligence": "🧠",
  startups: "🚀",
  "developer-tools": "⚡",
  finance: "💰",
  health: "🏥",
  design: "🎨",
  science: "🔬",
  marketing: "📈",
};

export function NewsletterCard({
  id,
  title,
  description,
  topic,
  frequency,
  subscriberCount,
}: NewsletterCardProps) {
  const { price, discount } = calculatePrice(frequency, subscriberCount);
  const icon = topicIcons[topic] || "📬";

  return (
    <Link href={`/newsletter/${id}`}>
      <Card className="group cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <span className="text-3xl">{icon}</span>
            <div className="flex gap-2">
              <Badge
                variant="secondary"
                className="text-xs"
              >
                {frequency === "daily" ? "Diario" : "Semanal"}
              </Badge>
              {discount > 0 && (
                <Badge
                  variant="default"
                  className="text-xs bg-emerald-600 hover:bg-emerald-700"
                >
                  -{discount}%
                </Badge>
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{subscriberCount} suscriptores</span>
            </div>
            <span className="text-sm font-semibold text-primary">
              ${price}/mes
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
