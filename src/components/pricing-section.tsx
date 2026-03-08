"use client";

import {
  calculatePrice,
  BASE_PRICES,
  CREATOR_FREE_THRESHOLD,
  isCreatorFree,
  subscribersUntilFree,
} from "@/lib/pricing";
import { Check, Info } from "lucide-react";

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
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h3 className="text-base font-semibold mb-4">Precio</h3>

      <div className="flex items-end gap-2 mb-2">
        <span className="text-3xl font-bold tracking-tight">${price}</span>
        <span className="text-muted-foreground text-sm mb-0.5">/mes</span>
      </div>

      {discount > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground line-through">
            ${originalPrice}/mes
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium border border-green-200">
            {discount}% descuento grupal
          </span>
        </div>
      )}

      <div className="space-y-2.5 text-sm text-muted-foreground">
        {[
          "Contenido 100% generado por IA",
          `Entrega ${frequency === "daily" ? "diaria" : "semanal"} en tu inbox`,
          "Cancela en cualquier momento",
          "Mas barato entre mas suscriptores",
        ].map((feature) => (
          <div key={feature} className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <div className="p-3 rounded-md bg-muted text-xs text-muted-foreground flex items-start gap-2">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <p>
            Actualmente <strong className="text-foreground">{subscriberCount}</strong> suscriptores.
            {subscriberCount < 35
              ? ` Con ${35 - subscriberCount} mas, el precio baja a $${calculatePrice(frequency, 35).price}/mes.`
              : " Gran descuento grupal activo!"}
          </p>
        </div>
        <div className={`p-3 rounded-md text-xs flex items-start gap-2 ${isCreatorFree(subscriberCount) ? "bg-green-50 text-green-700 border border-green-200" : "bg-primary/5 text-primary border border-primary/15"}`}>
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          {isCreatorFree(subscriberCount) ? (
            <p>El creador recibe este newsletter <strong>gratis</strong> — subsidiado por los suscriptores.</p>
          ) : (
            <p>
              Creadores: con <strong>{subscribersUntilFree(subscriberCount)}</strong> suscriptores mas (total {CREATOR_FREE_THRESHOLD}), el creador lo recibe <strong>gratis</strong>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
