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

function buildHtml(
  title: string,
  date: string,
  sections: { title: string; content: string }[],
  headerImageUrl?: string
): string {
  const sectionHtml = sections
    .map(
      (s) => `
    <tr><td style="padding:24px 32px;border-bottom:1px solid #e5e5e5">
      <h2 style="margin:0 0 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:17px;color:#0f0f1a;font-weight:600">${s.title}</h2>
      <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.75;color:#374151">${s.content}</p>
    </td></tr>`
    )
    .join("");

  const headerImageHtml = headerImageUrl
    ? `<tr><td style="padding:0"><img src="${headerImageUrl}" alt="${title}" style="width:100%;height:200px;object-fit:cover;display:block" /></td></tr>`
    : "";

  return `<div style="background:#f8f8f6;padding:24px 0;font-family:Georgia,'Times New Roman',serif">
<table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff">
  ${headerImageHtml}
  <tr><td style="padding:32px 32px 24px;border-bottom:1px solid #e5e5e5">
    <h1 style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:24px;color:#0f0f1a;font-weight:600;letter-spacing:-0.01em">${title}</h1>
    <p style="margin:8px 0 0;font-size:13px;color:#6b7280">${date}</p>
  </td></tr>
  ${sectionHtml}
  <tr><td style="padding:20px 32px;text-align:center">
    <p style="margin:0;font-size:12px;color:#9ca3af">${title}</p>
  </td></tr>
</table>
</div>`;
}

async function generateHeaderImage(
  topic: string,
  title: string
): Promise<string | undefined> {
  try {
    const response = await openaiClient.images.generate({
      model: "gpt-image-1",
      prompt: `A wide panoramic header photograph for a newsletter called "${title}" about ${topic}. 
Editorial style, photographic quality. Subtle, muted tones. 
Abstract composition with depth of field. No text, no letters, no words, no logos.
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
          .describe("Línea de asunto concisa y directa, sin emojis"),
        sections: z
          .array(
            z.object({
              title: z.string().describe("Título directo y específico de la sección, sin emojis"),
              content: z
                .string()
                .describe(
                  "Contenido de 2-3 párrafos informativos con voz humana natural, sin frases genéricas"
                ),
            })
          )
          .describe("3-4 secciones del newsletter"),
      }),
      system: `Eres un editor de newsletters con estándares editoriales altos. Escribes como un periodista experimentado: directo, informativo, sin relleno.

REGLAS:
- Voz humana natural. Evita frases como "en el mundo de", "es importante destacar", "sin lugar a dudas"
- Sin emojis en ningún lugar
- Títulos directos y específicos
- Cada sección aporta información concreta, datos o análisis
- No repitas la descripción del newsletter como introducción`,
      prompt: `Genera el contenido para una edición ${frequency === "daily" ? "diaria" : "semanal"} del newsletter "${title}".
Tópico: ${topic}
Estilo: ${style}
Fecha: ${date}

Genera 3-4 secciones con contenido informativo, relevante y actual sobre el tópico.`,
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
    rawImageData ? headerImageUrl : undefined
  );

  return {
    subject: object.subject,
    htmlContent,
    headerImageUrl: rawImageData,
    sections: object.sections.map((s) => ({
      title: s.title,
      content: s.content,
    })),
  };
}
