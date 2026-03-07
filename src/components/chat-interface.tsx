"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

type AnyPart = UIMessage["parts"][number] & Record<string, unknown>;

function isToolPart(part: AnyPart): boolean {
  const t = String(part.type);
  return t.startsWith("tool-") || t === "dynamic-tool";
}

function getToolName(part: AnyPart): string | null {
  const t = String(part.type);
  if (t === "dynamic-tool") return String(part.toolName || "");
  if (t.startsWith("tool-")) return t.slice(5);
  return null;
}

function isPublishResult(part: AnyPart): boolean {
  return getToolName(part) === "publishNewsletter" && part.state === "output-available";
}

function isPreviewResult(part: AnyPart): boolean {
  return getToolName(part) === "generatePreview" && part.state === "output-available";
}

export function ChatInterface() {
  const { messages, sendMessage, status } = useChat({
    id: "newsletter-creator",
    messages: [
      {
        id: "welcome",
        role: "assistant" as const,
        parts: [
          {
            type: "text" as const,
            text: "¡Hola! Soy tu asistente para crear newsletters personalizados. Vamos a diseñar el tuyo paso a paso.\n\n¿Sobre qué tema te gustaría recibir un newsletter? Puede ser cualquier cosa: tecnología, ciberseguridad, startups, cocina, fitness, ciencia, finanzas... ¡tú decides!",
          },
        ],
      },
    ],
  });

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    await sendMessage({ text });
  };

  const allParts = messages
    .filter((m) => m.role === "assistant")
    .flatMap((m) => m.parts as AnyPart[]);

  const publishedPart = allParts.find(isPublishResult);
  const newsletterId = publishedPart
    ? (publishedPart.output as { id?: string } | undefined)?.id ?? null
    : null;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-3xl mx-auto">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4 pb-4">
          {messages.map((message) => {
            const role = message.role as string;
            return (
              <div
                key={message.id}
                className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    role === "user"
                      ? "max-w-[80%] bg-violet-600 text-white"
                      : "max-w-[90%] bg-muted/80 text-foreground"
                  }`}
                >
                  {(message.parts as AnyPart[]).map((part, i) => {
                    const partType = String(part.type);

                    if (partType === "text" && part.text) {
                      return (
                        <p
                          key={i}
                          className="text-sm leading-relaxed whitespace-pre-wrap"
                        >
                          {String(part.text)}
                        </p>
                      );
                    }

                    if (isToolPart(part)) {
                      if (part.state === "output-available") {
                        const result = part.output as Record<string, unknown> | undefined;

                        if (isPreviewResult(part) && result?.htmlContent) {
                          return (
                            <div key={i} className="mt-3">
                              <div className="mb-2 p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs">
                                Vista previa generada — así se verá tu newsletter
                              </div>
                              <div className="rounded-xl border border-border/50 overflow-hidden shadow-lg">
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: String(result.htmlContent),
                                  }}
                                />
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={i}
                            className="mt-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs"
                          >
                            {String(result?.message || "Procesado")}
                          </div>
                        );
                      }

                      if (part.state === "error") {
                        return (
                          <div
                            key={i}
                            className="mt-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                          >
                            Error al procesar. Intenta de nuevo.
                          </div>
                        );
                      }

                      const toolName = getToolName(part);
                      const labels: Record<string, string> = {
                        defineNewsletter: "Creando newsletter...",
                        generatePreview: "Generando preview...",
                        sendTestEmail: "Enviando email de prueba...",
                        publishNewsletter: "Publicando...",
                      };

                      return (
                        <div
                          key={i}
                          className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <span className="animate-spin">⚙️</span>
                          {(toolName && labels[toolName]) || "Procesando..."}
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            );
          })}

          {isLoading && (messages[messages.length - 1]?.role as string) === "user" && (
            <div className="flex justify-start">
              <div className="bg-muted/80 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {newsletterId && (
        <div className="px-4 pb-2">
          <Link href={`/newsletter/${newsletterId}`}>
            <Button className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500">
              Ver mi newsletter en el marketplace
            </Button>
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t border-border/40">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }
            }}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="shrink-0 h-11 w-11"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
}
