"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { calculatePrice } from "@/lib/pricing";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newsletterTitle: string;
  frequency: "daily" | "weekly";
  subscriberCount: number;
}

export function CheckoutModal({
  open,
  onOpenChange,
  newsletterTitle,
  frequency,
  subscriberCount,
}: CheckoutModalProps) {
  const [step, setStep] = useState<"payment" | "success">("payment");
  const { price, originalPrice, discount } = calculatePrice(
    frequency,
    subscriberCount
  );

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === "payment" ? (
          <>
            <DialogHeader>
              <DialogTitle>Checkout</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{newsletterTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      Suscripción{" "}
                      {frequency === "daily" ? "diaria" : "semanal"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${price}/mes</p>
                    {discount > 0 && (
                      <p className="text-xs text-muted-foreground line-through">
                        ${originalPrice}/mes
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <form onSubmit={handlePay} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Número de tarjeta
                  </label>
                  <Input
                    placeholder="4242 4242 4242 4242"
                    defaultValue="4242 4242 4242 4242"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Expiración
                    </label>
                    <Input placeholder="12/28" defaultValue="12/28" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      CVC
                    </label>
                    <Input placeholder="123" defaultValue="123" />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Demo — No se realizará ningún cargo real
                </p>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-cyan-600"
                >
                  Pagar ${price}/mes
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2">¡Suscripción exitosa!</h3>
            <p className="text-muted-foreground mb-6">
              Recibirás <strong>{newsletterTitle}</strong>{" "}
              {frequency === "daily"
                ? "todos los días"
                : "cada semana"}{" "}
              en tu inbox.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setStep("payment");
              }}
            >
              Cerrar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
