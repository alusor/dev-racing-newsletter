"use client";

import { calculatePrice, BASE_PRICES } from "@/lib/pricing";

interface PricingSectionProps {
  frequency: "daily" | "weekly";
  subscriberCount: number;
}

export function PricingSection({
  frequency,
  subscriberCount,
}: PricingSectionProps) {
  const { price, discount } = calculatePrice(frequency, subscriberCount);
  const originalPrice = BASE_PRICES[frequency];

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Precio</h3>

      <div className="flex items-end gap-2 mb-2">
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-muted-foreground mb-1">/mes</span>
      </div>

      {discount > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground line-through">
            ${originalPrice}/mes
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
            {discount}% descuento grupal
          </span>
        </div>
      )}

      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-emerald-500 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Contenido 100% generado por IA
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-emerald-500 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Entrega {frequency === "daily" ? "diaria" : "semanal"} en tu inbox
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-emerald-500 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Cancela en cualquier momento
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-emerald-500 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Más barato entre más suscriptores
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
        <p>
          Actualmente <strong>{subscriberCount}</strong> suscriptores.
          {subscriberCount < 35
            ? ` Con ${35 - subscriberCount} más, el precio baja a $${calculatePrice(frequency, 35).price}/mes.`
            : " ¡Gran descuento grupal activo!"}
        </p>
      </div>
    </div>
  );
}
