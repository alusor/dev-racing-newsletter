"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { ArrowUp, ArrowRight, Loader2 } from "lucide-react";

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
            text: "Hola, soy tu asistente para crear newsletters personalizados. Vamos a diseñar el tuyo paso a paso.\n\n¿Sobre qué tema te gustaría recibir un newsletter? Puede ser cualquier cosa: tecnología, ciberseguridad, startups, cocina, fitness, ciencia, finanzas... tú decides.",
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
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-2xl mx-auto">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-3 pb-4">
          {messages.map((message) => {
            const role = message.role as string;
            return (
              <div
                key={message.id}
                className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-xl px-4 py-2.5 ${
                    role === "user"
                      ? "max-w-[80%] bg-primary text-primary-foreground"
                      : "max-w-[90%] bg-muted text-foreground"
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
                              <div className="mb-2 p-2 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs">
                                Vista previa generada
                              </div>
                              <div className="rounded-lg border border-border overflow-hidden">
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
                            className="mt-2 p-2.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs"
                          >
                            {String(result?.message || "Procesado")}
                          </div>
                        );
                      }

                      if (part.state === "error") {
                        return (
                          <div
                            key={i}
                            className="mt-2 p-2.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs"
                          >
                            Error al procesar. Intenta de nuevo.
                          </div>
                        );
                      }

                      const toolName = getToolName(part);
                      const labels: Record<string, string> = {
                        defineNewsletter: "Creando newsletter...",
                        generatePreview: "Generando preview...",
                        publishNewsletter: "Publicando...",
                      };

                      return (
                        <div
                          key={i}
                          className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <Loader2 className="w-3 h-3 animate-spin" />
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
              <div className="bg-muted rounded-xl px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {newsletterId && (
        <div className="px-4 pb-2">
          <Link href={`/newsletter/${newsletterId}`}>
            <Button className="w-full">
              Ver mi newsletter en el marketplace
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
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
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
