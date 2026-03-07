"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewsletterCard } from "@/components/newsletter-card";
import { Mail, ArrowRight, MessageSquareText, Eye, Send } from "lucide-react";

interface Newsletter {
  _id: string;
  title: string;
  description: string;
  topic: string;
  frequency: "daily" | "weekly";
  subscriberCount: number;
}

export default function Home() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/newsletters")
      .then((r) => r.json())
      .then((data) => {
        setNewsletters(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.65_0.15_265_/_0.08),transparent)]" />

        <nav className="relative z-10 max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-primary" />
            <span className="font-semibold text-lg tracking-tight">
              Newsletter Hub
            </span>
          </div>
          <Link href="/create">
            <Button size="sm">Crear Newsletter</Button>
          </Link>
        </nav>

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
          <h1 className="text-5xl md:text-6xl font-[family-name:var(--font-display)] tracking-tight mb-6 text-balance leading-[1.1]">
            Newsletters que{" "}
            <span className="text-primary">merecen tu atención</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 text-balance leading-relaxed">
            Crea o descubre newsletters con contenido generado por IA.
            Elige un tema, personaliza el estilo y recibe ediciones frescas
            directo en tu inbox.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/create">
              <Button size="lg" className="text-sm px-6 h-11">
                Crear mi newsletter
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <a href="#marketplace">
              <Button variant="outline" size="lg" className="text-sm px-6 h-11">
                Explorar marketplace
              </Button>
            </a>
          </div>
        </div>
      </header>

      <section id="marketplace" className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-[family-name:var(--font-display)] tracking-tight">
            Marketplace
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Newsletters creados por la comunidad
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-lg bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        ) : newsletters.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Mail className="w-10 h-10 mx-auto mb-4 opacity-30" />
            <p className="text-base">
              Aún no hay newsletters. Sé el primero en crear uno.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {newsletters.map((nl) => (
              <NewsletterCard
                key={nl._id}
                id={nl._id}
                title={nl.title}
                description={nl.description}
                topic={nl.topic}
                frequency={nl.frequency}
                subscriberCount={nl.subscriberCount}
              />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-[family-name:var(--font-display)] tracking-tight text-center mb-12">
            Cómo funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Describe tu newsletter",
                desc: "Conversa con el asistente y define el tema, frecuencia y estilo de tu newsletter ideal.",
                icon: MessageSquareText,
              },
              {
                step: "02",
                title: "Revisa los previews",
                desc: "Se generan ediciones de muestra para que veas exactamente el contenido que recibirás.",
                icon: Eye,
              },
              {
                step: "03",
                title: "Suscríbete y recibe",
                desc: "Elige tu plan y empieza a recibir contenido fresco. Más suscriptores, mejor precio.",
                icon: Send,
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-medium text-muted-foreground tracking-wider uppercase mb-2">
                  Paso {item.step}
                </div>
                <h3 className="text-base font-semibold mb-1.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-6 text-center text-xs text-muted-foreground">
          Newsletter Hub
        </div>
      </footer>
    </div>
  );
}
