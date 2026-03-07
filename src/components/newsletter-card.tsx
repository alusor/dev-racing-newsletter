"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { calculatePrice } from "@/lib/pricing";
import { Users } from "lucide-react";

interface NewsletterCardProps {
  id: string;
  title: string;
  description: string;
  topic: string;
  frequency: "daily" | "weekly";
  subscriberCount: number;
}

const topicLabels: Record<string, string> = {
  "artificial-intelligence": "IA",
  startups: "Startups",
  "developer-tools": "Dev Tools",
  finance: "Finanzas",
  health: "Salud",
  design: "Diseño",
  science: "Ciencia",
  marketing: "Marketing",
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

  return (
    <Link href={`/newsletter/${id}`}>
      <Card className="group cursor-pointer border-border bg-card transition-colors duration-200 hover:border-primary/25">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <Badge variant="secondary" className="text-xs font-medium">
              {topicLabels[topic] || topic}
            </Badge>
            <div className="flex gap-1.5">
              <Badge variant="outline" className="text-xs">
                {frequency === "daily" ? "Diario" : "Semanal"}
              </Badge>
              {discount > 0 && (
                <Badge variant="default" className="text-xs">
                  -{discount}%
                </Badge>
              )}
            </div>
          </div>

          <h3 className="text-base font-semibold mb-1.5 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{subscriberCount}</span>
            </div>
            <span className="font-semibold text-primary">
              ${price}/mes
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
