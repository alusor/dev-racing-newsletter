import { streamText, tool, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Newsletter } from "@/lib/models/newsletter";
import { generateNewsletterEdition } from "@/lib/newsletter-generator";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: `Eres el asistente de Newsletter Hub, una plataforma donde la gente crea newsletters generados por IA.
Tu rol es guiar al usuario para definir su newsletter ideal. Sé amigable, creativo y entusiasta.

Flujo de conversación:
1. Pregunta sobre el TEMA del newsletter (tecnología, finanzas, salud, etc.)
2. Pregunta sobre la FRECUENCIA preferida (diario o semanal)
3. Pregunta sobre el ESTILO (profesional, casual, técnico, divertido)
4. Una vez tengas los 3 datos, usa la herramienta defineNewsletter para crear la definición
5. Después genera 2 previews usando generatePreview
6. Finalmente usa publishNewsletter para publicarlo en el marketplace

Habla en español. Sé conciso pero entusiasta. Usa preguntas directas para avanzar rápido.
Cuando tengas suficiente información, no preguntes más y procede a crear el newsletter.`,
    messages,
    tools: {
      defineNewsletter: tool({
        description:
          "Define un nuevo newsletter con los datos recopilados del usuario",
        inputSchema: z.object({
          title: z.string().describe("Título atractivo para el newsletter"),
          description: z.string().describe("Descripción breve de 1-2 oraciones"),
          topic: z.string().describe("Tópico slug: artificial-intelligence, startups, developer-tools, finance, health, design, science, marketing, u otro"),
          frequency: z.enum(["daily", "weekly"]).describe("Frecuencia"),
          style: z.string().describe("Estilo: professional, casual, technical, fun"),
        }),
        execute: async ({ title, description, topic, frequency, style }) => {
          await connectDB();
          const newsletter = await Newsletter.create({
            title,
            description,
            topic,
            frequency,
            style,
            subscriberCount: 0,
            coverImageUrl: "",
            previews: [],
          });
          return {
            id: newsletter._id.toString(),
            title,
            message: `Newsletter "${title}" creado. Ahora voy a generar previews.`,
          };
        },
      }),

      generatePreview: tool({
        description: "Genera una edición preview del newsletter",
        inputSchema: z.object({
          newsletterId: z.string().describe("ID del newsletter"),
          topic: z.string().describe("Tópico del newsletter"),
          style: z.string().describe("Estilo del newsletter"),
          frequency: z.enum(["daily", "weekly"]),
          title: z.string().describe("Título del newsletter"),
        }),
        execute: async ({ newsletterId, topic, style, frequency, title }) => {
          const edition = await generateNewsletterEdition(topic, style, frequency, title);

          await connectDB();
          await Newsletter.findByIdAndUpdate(newsletterId, {
            $push: {
              previews: {
                subject: edition.subject,
                htmlContent: edition.htmlContent,
                sections: edition.sections,
                generatedAt: new Date(),
              },
            },
          });

          return {
            subject: edition.subject,
            sectionCount: edition.sections.length,
            message: `Preview generado: "${edition.subject}"`,
          };
        },
      }),

      publishNewsletter: tool({
        description: "Publica el newsletter en el marketplace (después de generar previews)",
        inputSchema: z.object({
          newsletterId: z.string().describe("ID del newsletter"),
        }),
        execute: async ({ newsletterId }) => {
          return {
            id: newsletterId,
            url: `/newsletter/${newsletterId}`,
            message: "Newsletter publicado en el marketplace. Los usuarios ya pueden verlo y suscribirse.",
          };
        },
      }),
    },
    stopWhen: stepCountIs(10),
  });

  return result.toUIMessageStreamResponse();
}
