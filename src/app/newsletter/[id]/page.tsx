"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NewsletterPreview } from "@/components/newsletter-preview";
import { PricingSection } from "@/components/pricing-section";
import { SubscribeForm } from "@/components/subscribe-form";
import { CheckoutModal } from "@/components/checkout-modal";
import { Mail, Plus, Loader2 } from "lucide-react";

interface Newsletter {
  _id: string;
  title: string;
  description: string;
  topic: string;
  frequency: "daily" | "weekly";
  style: string;
  subscriberCount: number;
  previews: {
    subject: string;
    htmlContent: string;
    generatedAt: string;
    sections: { title: string; content: string }[];
  }[];
  createdAt: string;
}

const topicLabels: Record<string, string> = {
  "artificial-intelligence": "Inteligencia Artificial",
  startups: "Startups",
  "developer-tools": "Dev Tools",
  finance: "Finanzas",
  health: "Salud",
  design: "Diseno",
  science: "Ciencia",
  marketing: "Marketing",
};

export default function NewsletterDetailPage() {
  const params = useParams();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/newsletter/${params.id}`)
        .then((r) => r.json())
        .then((data) => {
          setNewsletter(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  const handleGeneratePreview = async () => {
    if (!newsletter) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/newsletter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsletterId: newsletter._id }),
      });
      if (res.ok) {
        const updated = await fetch(`/api/newsletter/${newsletter._id}`);
        const data = await updated.json();
        setNewsletter(data);
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!newsletter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Mail className="w-12 h-12 text-muted-foreground/30" />
        <p className="text-muted-foreground">Newsletter no encontrado</p>
        <Link href="/">
          <Button variant="outline">Volver al marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              Newsletter Hub
            </span>
          </Link>
          <Link href="/create">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Crear Newsletter
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">
                  {topicLabels[newsletter.topic] || newsletter.topic}
                </Badge>
                <Badge variant="outline">
                  {newsletter.frequency === "daily" ? "Diario" : "Semanal"}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold tracking-tight mb-3">
                {newsletter.title}
              </h1>

              <p className="text-base text-muted-foreground leading-relaxed">
                {newsletter.description}
              </p>

              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span>{newsletter.subscriberCount} suscriptores</span>
                <span>
                  Creado{" "}
                  {new Date(newsletter.createdAt).toLocaleDateString("es-ES")}
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold tracking-tight">
                  Previews
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGeneratePreview}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    "Generar nuevo preview"
                  )}
                </Button>
              </div>

              <NewsletterPreview previews={newsletter.previews} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <PricingSection
              frequency={newsletter.frequency}
              subscriberCount={newsletter.subscriberCount}
            />

            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <h3 className="text-base font-semibold mb-4">Suscribirse</h3>
              {subscribed ? (
                <div className="text-center py-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="font-medium">Ya estas suscrito!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Revisa tu inbox.
                  </p>
                </div>
              ) : (
                <SubscribeForm
                  newsletterId={newsletter._id}
                  frequency={newsletter.frequency}
                  onSuccess={() => setShowCheckout(true)}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <CheckoutModal
        open={showCheckout}
        onOpenChange={(open) => {
          setShowCheckout(open);
          if (!open) setSubscribed(true);
        }}
        newsletterTitle={newsletter.title}
        frequency={newsletter.frequency}
        subscriberCount={newsletter.subscriberCount}
      />
    </div>
  );
}
