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
    system: `Eres un editor de newsletters con estándares editoriales altos. Escribes como un periodista experimentado: directo, informativo, sin relleno.

Responde SOLO con JSON válido, sin markdown, sin backticks, sin explicaciones.
El JSON debe tener esta estructura exacta:
{
  "subject": "Línea de asunto concisa y clara",
  "sections": [
    { "title": "Título de sección", "content": "Contenido de 2-3 párrafos" }
  ],
  "htmlContent": "HTML completo del newsletter con estilos inline"
}

REGLAS ESTRICTAS PARA EL CONTENIDO:
- Escribe con voz humana natural. Evita frases genéricas como "en el mundo de", "es importante destacar", "sin lugar a dudas"
- No uses emojis en ningún lugar del newsletter
- Títulos de sección directos y específicos, no vagos
- Cada sección debe aportar información concreta, datos o análisis
- No repitas la descripción del newsletter como introducción

REGLAS DE DISEÑO HTML:
- Tipografía: font-family Georgia, 'Times New Roman', serif para el cuerpo. Sistema sans-serif para headers
- Colores: fondo #ffffff, texto principal #1a1a2e, headers #0f0f1a, links y acentos #4f46e5
- Sin gradientes, sin fondos de color en headers, sin colores neón
- Header: solo el nombre del newsletter en texto, con un borde inferior sutil (#e5e5e5)
- Secciones separadas con padding generoso (24px) y bordes sutiles entre ellas
- Footer simple con texto gris (#6b7280) y tamaño 12px
- Máximo 600px de ancho, centrado
- Todos los estilos inline para compatibilidad con clientes de email
- Sin imágenes, sin iconos, solo tipografía limpia`,
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
      htmlContent: `<div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 24px; font-weight: 600; margin-bottom: 24px; color: #0f0f1a;">${title}</h1>
        <div style="font-size: 16px; line-height: 1.7;">${text}</div>
      </div>`,
      sections: [{ title: "Contenido", content: text }],
    };
  }
}
