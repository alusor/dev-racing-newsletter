import Link from "next/link";
import { ChatInterface } from "@/components/chat-interface";
import { Mail } from "lucide-react";

export default function CreatePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition"
          >
            <Mail className="w-5 h-5 text-primary" />
            <span className="font-semibold text-lg tracking-tight">
              Newsletter Hub
            </span>
          </Link>
          <span className="text-sm text-muted-foreground">
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
