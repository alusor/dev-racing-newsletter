import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export interface GeneratedEdition {
  subject: string;
  htmlContent: string;
  sections: { title: string; content: string }[];
}

export async function generateNewsletterEdition(
  topic: string,
  style: string,
  frequency: "daily" | "weekly",
  title: string
): Promise<GeneratedEdition> {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `Eres un generador experto de newsletters. Generas contenido de alta calidad, relevante y atractivo.
Responde SOLO con JSON válido, sin markdown, sin backticks, sin explicaciones.
El JSON debe tener esta estructura exacta:
{
  "subject": "Línea de asunto atractiva del email",
  "sections": [
    { "title": "Título de sección", "content": "Contenido de 2-3 párrafos" }
  ],
  "htmlContent": "HTML completo del newsletter con estilos inline"
}

El htmlContent debe ser un email HTML hermoso con:
- Estilos inline (no CSS externo)
- Header con gradiente de colores llamativos
- Secciones bien definidas con tipografía clara
- Footer con créditos
- Máximo 600px de ancho
- Responsive-friendly
- Tema de colores coherente con el tópico`,
    prompt: `Genera una edición ${frequency === "daily" ? "diaria" : "semanal"} del newsletter "${title}".
Tópico: ${topic}
Estilo: ${style}
Incluye 3-4 secciones con contenido actual y relevante del tópico.
Fecha: ${new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}`,
  });

  try {
    return JSON.parse(text);
  } catch {
    return {
      subject: `${title} — Nueva edición`,
      htmlContent: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
        <h1>${title}</h1>
        <div>${text}</div>
      </div>`,
      sections: [{ title: "Contenido", content: text }],
    };
  }
}
