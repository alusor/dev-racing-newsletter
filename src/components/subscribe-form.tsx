"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SubscribeFormProps {
  newsletterId: string;
  frequency: "daily" | "weekly";
  onSuccess: () => void;
}

export function SubscribeForm({
  newsletterId,
  frequency,
  onSuccess,
}: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [selectedFreq, setSelectedFreq] = useState(frequency);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newsletterId,
          frequency: selectedFreq,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al suscribirse");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1.5 block">Email</label>
        <Input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">Frecuencia</label>
        <div className="grid grid-cols-2 gap-2">
          {(["daily", "weekly"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setSelectedFreq(f)}
              className={`p-2.5 rounded-md border text-sm font-medium transition-colors ${
                selectedFreq === f
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
              }`}
            >
              {f === "daily" ? "Diario" : "Semanal"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Procesando..." : "Continuar al checkout"}
      </Button>
    </form>
  );
}
