"use client";

import { useState } from "react";

interface Edition {
  subject: string;
  htmlContent: string;
  generatedAt: string;
}

interface NewsletterPreviewProps {
  previews: Edition[];
}

export function NewsletterPreview({ previews }: NewsletterPreviewProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (previews.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-4xl mb-3">📝</p>
        <p>Aún no hay previews disponibles.</p>
      </div>
    );
  }

  const active = previews[activeIndex];

  return (
    <div>
      {previews.length > 1 && (
        <div className="flex gap-2 mb-4">
          {previews.map((p, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                i === activeIndex
                  ? "bg-violet-600 text-white"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              Edición {i + 1}
            </button>
          ))}
        </div>
      )}

      <div className="mb-3">
        <h3 className="text-lg font-semibold">{active.subject}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Generado:{" "}
          {new Date(active.generatedAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="rounded-xl border border-border/50 overflow-hidden bg-white">
        <div
          className="newsletter-preview"
          dangerouslySetInnerHTML={{ __html: active.htmlContent }}
        />
      </div>
    </div>
  );
}
