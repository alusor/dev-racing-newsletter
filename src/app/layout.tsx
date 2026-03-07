import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Newsletter Hub — AI-Powered Newsletter Marketplace",
  description:
    "Descubre, crea y suscríbete a newsletters generados 100% por inteligencia artificial. Tu contenido personalizado, cada día o cada semana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${jakarta.variable} ${instrumentSerif.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
