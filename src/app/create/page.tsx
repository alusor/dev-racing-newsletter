import Link from "next/link";
import { ChatInterface } from "@/components/chat-interface";

export default function CreatePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <span className="text-2xl">📬</span>
            <span className="font-bold text-xl tracking-tight">
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
