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
        <p className="text-sm">Aún no hay previews disponibles.</p>
      </div>
    );
  }

  const active = previews[activeIndex];

  return (
    <div>
      {previews.length > 1 && (
        <div className="flex gap-1.5 mb-4">
          {previews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                i === activeIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Edición {i + 1}
            </button>
          ))}
        </div>
      )}

      <div className="mb-3">
        <h3 className="text-base font-semibold">{active.subject}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Generado:{" "}
          {new Date(active.generatedAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="rounded-lg border border-border overflow-hidden bg-white">
        <div
          className="newsletter-preview"
          dangerouslySetInnerHTML={{ __html: active.htmlContent }}
        />
      </div>
    </div>
  );
}
