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
        <label className="text-sm font-medium mb-2 block">Email</label>
        <Input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Frecuencia</label>
        <div className="grid grid-cols-2 gap-2">
          {(["daily", "weekly"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setSelectedFreq(f)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                selectedFreq === f
                  ? "border-violet-500 bg-violet-500/10 text-violet-300"
                  : "border-border/50 text-muted-foreground hover:border-border"
              }`}
            >
              {f === "daily" ? "Diario" : "Semanal"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500"
      >
        {loading ? "Procesando..." : "Continuar al checkout"}
      </Button>
    </form>
  );
}
