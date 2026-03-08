"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { calculatePrice } from "@/lib/pricing";
import {
  Brain,
  Rocket,
  Zap,
  DollarSign,
  Heart,
  Palette,
  FlaskConical,
  TrendingUp,
  Mail,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NewsletterCardProps {
  id: string;
  title: string;
  description: string;
  topic: string;
  frequency: "daily" | "weekly";
  subscriberCount: number;
}

const topicIcons: Record<string, LucideIcon> = {
  "artificial-intelligence": Brain,
  startups: Rocket,
  "developer-tools": Zap,
  finance: DollarSign,
  health: Heart,
  design: Palette,
  science: FlaskConical,
  marketing: TrendingUp,
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
  const Icon = topicIcons[topic] || Mail;

  return (
    <Link href={`/newsletter/${id}`}>
      <Card className="group cursor-pointer border-border bg-card transition-all duration-200 hover:shadow-md hover:border-border/80">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center">
              <Icon className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className="flex gap-1.5">
              <Badge variant="secondary" className="text-xs font-medium">
                {frequency === "daily" ? "Diario" : "Semanal"}
              </Badge>
              {discount > 0 && (
                <Badge
                  variant="default"
                  className="text-xs bg-green-600 hover:bg-green-700"
                >
                  -{discount}%
                </Badge>
              )}
            </div>
          </div>

          <h3 className="text-sm font-semibold mb-1.5 group-hover:text-primary transition-colors">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{subscriberCount} suscriptores</span>
            </div>
            <span className="font-semibold text-foreground">
              ${price}/mes
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
