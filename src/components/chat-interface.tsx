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
            text: "Hola, soy tu asistente para crear newsletters. Cuéntame, ¿sobre qué tema te gustaría recibir un newsletter? Puede ser cualquier cosa: tecnología, finanzas, cocina, fitness, ciencia... tú decides.",
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

  const publishedPart = allParts.find(
    (p) =>
      String(p.type).startsWith("tool-") &&
      p.toolName === "publishNewsletter" &&
      p.state === "output-available"
  );

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
              className={`flex ${
                role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                  role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
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

                  if (partType.startsWith("tool-") || partType === "dynamic-tool") {
                    if (part.state === "output-available") {
                      const result = part.output as Record<string, unknown> | undefined;
                      return (
                        <div
                          key={i}
                          className="mt-2 p-2.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs"
                        >
                          {String(result?.message || "Procesado")}
                        </div>
                      );
                    }
                    return (
                      <div
                        key={i}
                        className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Procesando...
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
