"use client";

import { calculatePrice, BASE_PRICES } from "@/lib/pricing";
import { Check } from "lucide-react";

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
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-base font-semibold mb-4">Precio</h3>

      <div className="flex items-end gap-1.5 mb-2">
        <span className="text-3xl font-bold tracking-tight">${price}</span>
        <span className="text-muted-foreground text-sm mb-0.5">/mes</span>
      </div>

      {discount > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground line-through">
            ${originalPrice}/mes
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
            {discount}% descuento grupal
          </span>
        </div>
      )}

      <div className="space-y-2.5 text-sm text-muted-foreground">
        {[
          "Contenido generado por IA",
          `Entrega ${frequency === "daily" ? "diaria" : "semanal"} en tu inbox`,
          "Cancela en cualquier momento",
          "Más barato entre más suscriptores",
        ].map((text) => (
          <div key={text} className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-primary shrink-0" />
            {text}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-md bg-muted text-xs text-muted-foreground">
        <p>
          Actualmente <strong className="text-foreground">{subscriberCount}</strong> suscriptores.
          {subscriberCount < 35
            ? ` Con ${35 - subscriberCount} más, el precio baja a $${calculatePrice(frequency, 35).price}/mes.`
            : " Descuento grupal activo."}
        </p>
      </div>
    </div>
  );
}
