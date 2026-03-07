import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import OpenAI from "openai";
import { z } from "zod";

const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface GeneratedEdition {
  subject: string;
  htmlContent: string;
  headerImageUrl?: string;
  sections: { title: string; content: string }[];
}

const PALETTE: Record<string, { primary: string; accent: string; bg: string }> =
  {
    "artificial-intelligence": { primary: "#7c3aed", accent: "#a78bfa", bg: "#f5f3ff" },
    startups: { primary: "#ea580c", accent: "#fb923c", bg: "#fff7ed" },
    "developer-tools": { primary: "#0891b2", accent: "#22d3ee", bg: "#ecfeff" },
    finance: { primary: "#059669", accent: "#34d399", bg: "#ecfdf5" },
    health: { primary: "#e11d48", accent: "#fb7185", bg: "#fff1f2" },
    design: { primary: "#d946ef", accent: "#e879f9", bg: "#fdf4ff" },
    science: { primary: "#2563eb", accent: "#60a5fa", bg: "#eff6ff" },
    marketing: { primary: "#ca8a04", accent: "#facc15", bg: "#fefce8" },
    cybersecurity: { primary: "#16a34a", accent: "#4ade80", bg: "#f0fdf4" },
    default: { primary: "#6366f1", accent: "#818cf8", bg: "#eef2ff" },
  };

function getColors(topic: string) {
  return PALETTE[topic] || PALETTE.default;
}

function buildHtml(
  title: string,
  date: string,
  sections: { title: string; emoji: string; content: string }[],
  topic: string,
  headerImageUrl?: string
): string {
  const c = getColors(topic);
  const sectionHtml = sections
    .map(
      (s) => `
    <tr><td style="padding:0 32px 24px">
      <h2 style="margin:0 0 8px;font-size:18px;color:${c.primary};font-weight:700">${s.emoji} ${s.title}</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:#374151">${s.content}</p>
    </td></tr>`
    )
    .join("");

  const headerImageHtml = headerImageUrl
    ? `<tr><td style="padding:0"><img src="${headerImageUrl}" alt="${title}" style="width:100%;height:200px;object-fit:cover;display:block" /></td></tr>`
    : "";

  return `<div style="background:${c.bg};padding:24px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
  ${headerImageHtml}
  <tr><td style="background:linear-gradient(135deg,${c.primary},${c.accent});padding:32px 32px;text-align:center">
    <h1 style="margin:0;font-size:28px;color:#fff;font-weight:800;letter-spacing:-0.5px">${title}</h1>
    <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.85)">${date}</p>
  </td></tr>
  <tr><td style="height:24px"></td></tr>
  ${sectionHtml}
  <tr><td style="padding:16px 32px;border-top:1px solid #e5e7eb;text-align:center">
    <p style="margin:0;font-size:12px;color:#9ca3af">${title} — Generado con IA por Newsletter Hub</p>
  </td></tr>
</table>
</div>`;
}

async function generateHeaderImage(
  topic: string,
  title: string
): Promise<string | undefined> {
  try {
    const c = getColors(topic);
    const response = await openaiClient.images.generate({
      model: "gpt-image-1",
      prompt: `A wide panoramic header illustration for a newsletter called "${title}" about ${topic}. 
Abstract, modern editorial style. Flowing gradients using colors ${c.primary} and ${c.accent}. 
Subtle geometric shapes, clean minimal design. No text, no letters, no words.
Professional magazine quality, wide aspect ratio banner.`,
      n: 1,
      size: "1536x1024",
      quality: "low",
    });

    const data = response.data?.[0];
    if (!data) return undefined;

    if (data.url) return data.url;
    if (data.b64_json) return `data:image/png;base64,${data.b64_json}`;
    return undefined;
  } catch (err) {
    console.error("Image generation failed:", err);
    return undefined;
  }
}

export async function generateNewsletterEdition(
  topic: string,
  style: string,
  frequency: "daily" | "weekly",
  title: string,
  options: { withImage?: boolean; newsletterId?: string } = {}
): Promise<GeneratedEdition> {
  const { withImage = true, newsletterId } = options;
  const date = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [{ object }, rawImageData] = await Promise.all([
    generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        subject: z
          .string()
          .describe("Línea de asunto atractiva y concisa para el email"),
        sections: z
          .array(
            z.object({
              emoji: z
                .string()
                .describe("Un emoji relevante para la sección"),
              title: z.string().describe("Título corto de la sección"),
              content: z
                .string()
                .describe(
                  "Contenido de 2-3 párrafos informativos y atractivos"
                ),
            })
          )
          .describe("3-4 secciones del newsletter"),
      }),
      prompt: `Genera el contenido para una edición ${frequency === "daily" ? "diaria" : "semanal"} del newsletter "${title}".
Tópico: ${topic}
Estilo: ${style}
Fecha: ${date}

Genera 3-4 secciones con contenido informativo, relevante y actual sobre el tópico.
Cada sección debe tener un emoji representativo, un título corto y 2-3 párrafos de contenido.
La línea de asunto debe ser atractiva e incluir un emoji al inicio.`,
    }),
    withImage ? generateHeaderImage(topic, title) : Promise.resolve(undefined),
  ]);

  const headerImageUrl = newsletterId
    ? `/api/newsletter/${newsletterId}/image`
    : undefined;

  const htmlContent = buildHtml(
    title,
    date,
    object.sections,
    topic,
    rawImageData ? headerImageUrl : undefined
  );

  return {
    subject: object.subject,
    htmlContent,
    headerImageUrl: rawImageData,
    sections: object.sections.map((s) => ({
      title: `${s.emoji} ${s.title}`,
      content: s.content,
    })),
  };
}
