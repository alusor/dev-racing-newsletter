import Link from "next/link";
import { ChatInterface } from "@/components/chat-interface";
import { Mail } from "lucide-react";

export default function CreatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              Newsletter Hub
            </span>
          </Link>
          <span className="text-sm text-muted-foreground font-medium">
            Crear nuevo newsletter
          </span>
        </div>
      </nav>

      <main className="flex-1">
        <ChatInterface />
      </main>
    </div>
  );
}
