"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewsletterCard } from "@/components/newsletter-card";
import { Mail, Plus, Check, MessageSquare, Eye, Send } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="border-b border-border">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-foreground">
              Newsletter Hub
            </span>
          </div>
          <Link href="/create">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Crear Newsletter
            </Button>
          </Link>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-sm text-primary font-medium mb-8">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            100% generado por IA
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-5">
            Tu contenido,{" "}
            <span className="text-primary">
              curado por IA
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Descubre newsletters o crea el tuyo en segundos. La IA genera contenido
            fresco y relevante directo a tu inbox.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/create">
              <Button size="lg" className="text-sm px-6 h-11">
                Crear mi newsletter
              </Button>
            </Link>
            <a href="#marketplace">
              <Button variant="outline" size="lg" className="text-sm px-6 h-11">
                Explorar marketplace
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary" />
              Sin escribir nada
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary" />
              Mas barato en grupo
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary" />
              Cancela cuando quieras
            </div>
          </div>
        </div>
      </header>

      {/* Marketplace */}
      <section id="marketplace" className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Marketplace
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Newsletters creados por la comunidad
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : newsletters.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-base">
              Aun no hay newsletters. Se el primero en crear uno.
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

      {/* How it works */}
      <section className="border-t border-border bg-muted/40">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-center mb-12">
            Como funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Describe tu newsletter",
                desc: "Chatea con nuestra IA y cuentale que tipo de contenido te interesa recibir.",
                icon: MessageSquare,
              },
              {
                step: "02",
                title: "Preview instantaneo",
                desc: "La IA genera 2-3 ediciones de muestra para que veas exactamente lo que recibiras.",
                icon: Eye,
              },
              {
                step: "03",
                title: "Suscribete",
                desc: "Elige tu frecuencia y empieza a recibir contenido fresco. Mas suscriptores = mas barato.",
                icon: Send,
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
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

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          Newsletter Hub — Powered by OpenAI & Vercel AI SDK
        </div>
      </footer>
    </div>
  );
}
