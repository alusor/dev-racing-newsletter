import { connectDB } from "./mongodb";
import { Newsletter } from "./models/newsletter";

function buildSeedHtml(
  title: string,
  date: string,
  sections: { emoji: string; title: string; content: string }[],
  primary: string,
  accent: string,
  bg: string
): string {
  const sectionHtml = sections
    .map(
      (s) => `
    <tr><td style="padding:0 32px 24px">
      <h2 style="margin:0 0 8px;font-size:18px;color:${primary};font-weight:700">${s.emoji} ${s.title}</h2>
      <p style="margin:0;font-size:15px;line-height:1.7;color:#374151">${s.content}</p>
    </td></tr>`
    )
    .join("");

  return `<div style="background:${bg};padding:24px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
  <tr><td style="background:linear-gradient(135deg,${primary},${accent});padding:40px 32px;text-align:center">
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

const seedNewsletters = [
  {
    title: "AI Weekly Digest",
    description:
      "Tu resumen semanal de los avances más importantes en inteligencia artificial. Desde papers revolucionarios hasta nuevas herramientas y productos.",
    topic: "artificial-intelligence",
    frequency: "weekly" as const,
    style: "professional",
    subscriberCount: 24,
    coverImageUrl: "",
    previews: [
      {
        subject: "🧠 AI Weekly #42 — GPT-5 Rumors, Open Source LLMs & Robot Chefs",
        htmlContent: buildSeedHtml(
          "AI Weekly Digest",
          "Edición #42 — Marzo 2026",
          [
            {
              emoji: "🔬",
              title: "Investigación",
              content:
                "DeepMind publica Gemini Ultra 2.0, el nuevo modelo multimodal que establece récords en razonamiento matemático y generación de código, superando a GPT-4o en 12 de 15 benchmarks principales. El paper detalla una arquitectura novedosa de mixture-of-experts con 16 expertos especializados.",
            },
            {
              emoji: "🛠️",
              title: "Herramientas",
              content:
                "Cursor 2.0 redefine el coding con IA integrando agentes autónomos que pueden ejecutar pipelines completos de desarrollo, desde diseño hasta deployment. La nueva versión también incluye un modo de pair programming con IA que reduce errores un 40%.",
            },
            {
              emoji: "📊",
              title: "Tendencias",
              content:
                "El 67% de developers ya usan IA diariamente según el último reporte de Stack Overflow. La adopción de herramientas de IA para desarrollo se ha triplicado en el último año, con especial crecimiento en startups y empresas medianas.",
            },
          ],
          "#7c3aed",
          "#a78bfa",
          "#f5f3ff"
        ),
        sections: [
          { title: "🔬 Investigación", content: "DeepMind publica Gemini Ultra 2.0." },
          { title: "🛠️ Herramientas", content: "Cursor 2.0 redefine el coding con agentes autónomos." },
          { title: "📊 Tendencias", content: "67% de developers usan IA diariamente." },
        ],
        generatedAt: new Date(),
      },
    ],
  },
  {
    title: "Startup Radar",
    description:
      "Las startups más prometedoras, rondas de inversión y tendencias del ecosistema emprendedor. Cada mañana en tu inbox.",
    topic: "startups",
    frequency: "daily" as const,
    style: "casual",
    subscriberCount: 58,
    coverImageUrl: "",
    previews: [
      {
        subject: "🚀 Startup Radar — $2.3B en funding ayer + 3 startups que debes conocer",
        htmlContent: buildSeedHtml(
          "Startup Radar",
          "7 de Marzo, 2026",
          [
            {
              emoji: "💰",
              title: "Dato del día",
              content:
                "$2.3 billones en funding fueron anunciados ayer, el mayor día de Q1 2026. El sector de IA enterprise lidera con un 45% del total, seguido por fintech (22%) y healthtech (15%). Los inversores muestran confianza renovada tras un Q4 2025 conservador.",
            },
            {
              emoji: "⭐",
              title: "Serie A destacada — NeuralKit $45M",
              content:
                "Plataforma no-code para desplegar modelos de ML. Liderada por a16z con participación de Sequoia. Ya tienen 500+ empresas en su plataforma y un crecimiento MoM del 25%. Su diferenciador: fine-tuning automático con datos propios del usuario.",
            },
            {
              emoji: "🏢",
              title: "Adquisición — Stripe x PayFlow $890M",
              content:
                "Stripe adquiere PayFlow por $890M. La fintech de pagos B2B se integra al ecosistema de Stripe, consolidando su posición en el mercado de infraestructura financiera. PayFlow procesaba $2B anuales en transacciones B2B.",
            },
            {
              emoji: "👀",
              title: "3 startups para seguir",
              content:
                "Arcane Energy — Baterías de estado sólido para EVs con 2x la densidad energética actual. HealthPilot — IA para diagnóstico médico en zonas rurales, ya operando en 3 países. CodeShip — CI/CD con IA predictiva que reduce tiempos de deploy un 60%.",
            },
          ],
          "#ea580c",
          "#fb923c",
          "#fff7ed"
        ),
        sections: [
          { title: "💰 Dato del día", content: "$2.3B en funding, mayor día de Q1 2026." },
          { title: "⭐ Serie A destacada", content: "NeuralKit levanta $45M liderada por a16z." },
          { title: "🏢 Adquisición", content: "Stripe adquiere PayFlow por $890M." },
          { title: "👀 3 startups para seguir", content: "Arcane Energy, HealthPilot, CodeShip." },
        ],
        generatedAt: new Date(),
      },
    ],
  },
  {
    title: "Dev Tools Weekly",
    description:
      "Cada semana descubre las mejores herramientas, librerías y recursos para desarrolladores. Curado por IA, verificado por la comunidad.",
    topic: "developer-tools",
    frequency: "weekly" as const,
    style: "technical",
    subscriberCount: 12,
    coverImageUrl: "",
    previews: [
      {
        subject: "⚡ Dev Tools Weekly #18 — Bun 2.0, Tailwind v5 y más",
        htmlContent: buildSeedHtml(
          "Dev Tools Weekly",
          "Edición #18 — Marzo 2026",
          [
            {
              emoji: "🏆",
              title: "Herramienta de la semana — Bun 2.0",
              content:
                "Runtime de JavaScript que ahora incluye bundler nativo, test runner mejorado, y compatibilidad total con Node.js. 3x más rápido en benchmarks de I/O. La v2 trae hot module replacement nativo y un sistema de plugins compatible con Vite.",
            },
            {
              emoji: "📦",
              title: "Nuevas librerías",
              content:
                "Tailwind CSS v5 llega con container queries nativos, nuevo sistema de theming con CSS layers, y 40% menos CSS generado. Drizzle ORM v1.0 alcanza estabilidad con soporte completo para PostgreSQL, MySQL y SQLite, incluyendo migraciones type-safe.",
            },
            {
              emoji: "🔧",
              title: "Tips & Tricks",
              content:
                "Usa `node --experimental-strip-types` en Node 23+ para ejecutar TypeScript directamente sin compilación. Combínalo con el nuevo `--watch` flag para un DX instantáneo sin herramientas externas. Ideal para scripts y prototipos rápidos.",
            },
          ],
          "#0891b2",
          "#22d3ee",
          "#ecfeff"
        ),
        sections: [
          { title: "🏆 Herramienta de la semana", content: "Bun 2.0 con bundler nativo y 3x más rápido." },
          { title: "📦 Nuevas librerías", content: "Tailwind CSS v5 y Drizzle ORM v1.0." },
          { title: "🔧 Tips & Tricks", content: "TypeScript directo en Node sin compilación." },
        ],
        generatedAt: new Date(),
      },
    ],
  },
];

export async function seedDatabase() {
  await connectDB();
  const count = await Newsletter.countDocuments();
  if (count === 0) {
    await Newsletter.insertMany(seedNewsletters);
    console.log("Seed data inserted");
  }
}
