"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewsletterCard } from "@/components/newsletter-card";

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
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-background to-cyan-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-transparent" />

        <nav className="relative z-10 max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📬</span>
            <span className="font-bold text-xl tracking-tight">
              Newsletter Hub
            </span>
          </div>
          <Link href="/create">
            <Button variant="default" size="sm">
              Crear Newsletter
            </Button>
          </Link>
        </nav>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm text-violet-300 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
            </span>
            100% generado por IA
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-[family-name:var(--font-display)]">
            Tu contenido,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              curado por IA
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Descubre newsletters únicos o crea el tuyo en segundos. La IA genera contenido
            fresco y relevante directo a tu inbox, cada día o cada semana.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create">
              <Button size="lg" className="text-base px-8 py-6 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 border-0">
                Crear mi newsletter
              </Button>
            </Link>
            <a href="#marketplace">
              <Button variant="outline" size="lg" className="text-base px-8 py-6">
                Explorar marketplace
              </Button>
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Sin escribir nada
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Más barato en grupo
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Cancela cuando quieras
            </div>
          </div>
        </div>
      </header>

      {/* Marketplace */}
      <section id="marketplace" className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold font-[family-name:var(--font-display)]">
              Marketplace
            </h2>
            <p className="text-muted-foreground mt-1">
              Newsletters creados por la comunidad
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-52 rounded-xl bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        ) : newsletters.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-lg">
              Aún no hay newsletters. ¡Sé el primero en crear uno!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section className="border-t border-border/40 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 font-[family-name:var(--font-display)]">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Describe tu newsletter",
                desc: "Chatea con nuestra IA y cuéntale qué tipo de contenido te interesa recibir.",
                icon: "💬",
              },
              {
                step: "02",
                title: "Preview instantáneo",
                desc: "La IA genera 2-3 ediciones de muestra para que veas exactamente lo que recibirás.",
                icon: "👀",
              },
              {
                step: "03",
                title: "Suscríbete",
                desc: "Elige tu frecuencia y empieza a recibir contenido fresco. Más suscriptores = más barato.",
                icon: "✉️",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-xs font-mono text-muted-foreground mb-2">
                  PASO {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>
            Newsletter Hub — Powered by OpenAI & Vercel AI SDK
          </p>
        </div>
      </footer>
    </div>
  );
}
