import { streamText, tool, stepCountIs, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { Newsletter } from "@/lib/models/newsletter";
import { generateNewsletterEdition } from "@/lib/newsletter-generator";
import { wrapEmailTemplate } from "@/lib/email-template";
import { resend } from "@/lib/resend";
import {
  BASE_PRICES,
  CREATOR_FREE_THRESHOLD,
} from "@/lib/pricing";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: `Eres el asistente de Newsletter Hub, una plataforma donde la gente crea newsletters generados por IA.
Tu rol es guiar al usuario paso a paso para definir y previsualizar su newsletter ideal.

## FLUJO DE CONVERSACIÓN (sigue este orden estrictamente)

PASO 1 — TEMA
Pregunta al usuario sobre qué tema le gustaría su newsletter. Da ejemplos concretos y variados.
Espera su respuesta antes de continuar.

PASO 2 — FRECUENCIA
Una vez que sepas el tema, pregunta si lo quiere diario o semanal.
Menciona brevemente los precios: diario $${BASE_PRICES.daily}/mes, semanal $${BASE_PRICES.weekly}/mes.
Espera su respuesta.

PASO 3 — ESTILO
Pregunta qué tono prefiere: profesional, casual, técnico, o divertido.
Espera su respuesta.

PASO 4 — CREAR Y PREVIEW
Ahora que tienes los 3 datos:
a) Usa defineNewsletter para crear el newsletter.
b) Usa generatePreview para generar UN preview.
c) Dile al usuario: "Aquí tienes un preview de cómo se vería tu newsletter. Esto es una muestra generada por IA."

PASO 5 — ENVIAR PRUEBA
Pregunta al usuario: "¿Quieres que te envíe este preview a tu email para que lo veas en tu inbox?"
Si dice que sí, pide su email y usa sendTestEmail para enviarlo.
Si dice que no, continúa al paso 6.

PASO 6 — PRICING Y PUBLICACIÓN
Explica el modelo de precios:
- El precio base es $X/mes según la frecuencia elegida
- Entre más suscriptores tenga, más barato se vuelve para todos (hasta 70% de descuento)
- A partir de ${CREATOR_FREE_THRESHOLD} suscriptores, el creador recibe su newsletter GRATIS porque queda subsidiado por los demás
- Recomiéndale invitar a más personas para llegar al umbral gratuito

Pregunta si quiere publicarlo en el marketplace.
Si dice que sí, usa publishNewsletter.
Después confirma que ya está disponible y puede compartir el link.

## REGLAS
- Habla en español
- NUNCA saltes pasos. Haz UNA pregunta a la vez y espera la respuesta
- Sé amigable y entusiasta pero conciso
- Cuando muestres info del preview, describe brevemente las secciones que se generaron
- NO uses todas las herramientas de golpe. Sigue el flujo paso a paso`,
    messages: await convertToModelMessages(messages),
    tools: {
      defineNewsletter: tool({
        description:
          "Define un nuevo newsletter con los datos recopilados del usuario. Solo usar después de tener tema, frecuencia y estilo.",
        inputSchema: z.object({
          title: z.string().describe("Título atractivo para el newsletter"),
          description: z
            .string()
            .describe("Descripción breve de 1-2 oraciones"),
          topic: z
            .string()
            .describe(
              "Tópico slug: artificial-intelligence, startups, developer-tools, finance, health, design, science, marketing, cybersecurity, u otro"
            ),
          frequency: z.enum(["daily", "weekly"]).describe("Frecuencia"),
          style: z
            .string()
            .describe("Estilo: professional, casual, technical, fun"),
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
            frequency,
            message: `Newsletter "${title}" creado exitosamente.`,
          };
        },
      }),

      generatePreview: tool({
        description:
          "Genera una edición preview del newsletter para mostrársela al usuario. Retorna el HTML del preview.",
        inputSchema: z.object({
          newsletterId: z.string().describe("ID del newsletter"),
          topic: z.string().describe("Tópico del newsletter"),
          style: z.string().describe("Estilo del newsletter"),
          frequency: z.enum(["daily", "weekly"]),
          title: z.string().describe("Título del newsletter"),
        }),
        execute: async ({ newsletterId, topic, style, frequency, title }) => {
          const edition = await generateNewsletterEdition(
            topic,
            style,
            frequency,
            title,
            { withImage: true, newsletterId }
          );

          await connectDB();

          const updateData: Record<string, unknown> = {
            $push: {
              previews: {
                subject: edition.subject,
                htmlContent: edition.htmlContent,
                sections: edition.sections,
                generatedAt: new Date(),
              },
            },
          };

          if (edition.headerImageUrl) {
            updateData.$set = { coverImageUrl: edition.headerImageUrl };
          }

          await Newsletter.findByIdAndUpdate(newsletterId, updateData);

          return {
            subject: edition.subject,
            sections: edition.sections.map((s) => s.title).join(", "),
            htmlContent: edition.htmlContent,
            newsletterId,
            message: `Preview generado: "${edition.subject}"`,
          };
        },
      }),

      sendTestEmail: tool({
        description:
          "Envía un preview del newsletter al email del usuario para que lo vea en su inbox",
        inputSchema: z.object({
          email: z.string().email().describe("Email del usuario"),
          newsletterId: z.string().describe("ID del newsletter"),
        }),
        execute: async ({ email, newsletterId }) => {
          await connectDB();
          const newsletter = await Newsletter.findById(newsletterId);
          if (!newsletter || newsletter.previews.length === 0) {
            return { message: "No se encontró el newsletter o no tiene previews." };
          }

          const latest = newsletter.previews[newsletter.previews.length - 1];
          const html = wrapEmailTemplate(newsletter.title, {
            subject: latest.subject,
            htmlContent: latest.htmlContent,
            sections: latest.sections,
            generatedAt: latest.generatedAt,
          });

          const { error } = await resend.emails.send({
            from: "Newsletter Hub <onboarding@resend.dev>",
            to: email,
            subject: `[Preview] ${latest.subject}`,
            html,
          });

          if (error) {
            return { message: `Error al enviar: ${error.message}` };
          }

          return {
            message: `Preview enviado exitosamente a ${email}. Revisa tu inbox.`,
          };
        },
      }),

      publishNewsletter: tool({
        description:
          "Publica el newsletter en el marketplace para que otros puedan suscribirse",
        inputSchema: z.object({
          newsletterId: z.string().describe("ID del newsletter"),
        }),
        execute: async ({ newsletterId }) => {
          return {
            id: newsletterId,
            url: `/newsletter/${newsletterId}`,
            message:
              "Newsletter publicado en el marketplace. Los usuarios ya pueden verlo y suscribirse.",
          };
        },
      }),
    },
    stopWhen: stepCountIs(10),
  });

  return result.toUIMessageStreamResponse();
}
