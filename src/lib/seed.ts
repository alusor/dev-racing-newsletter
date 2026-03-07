import { connectDB } from "./mongodb";
import { Newsletter } from "./models/newsletter";

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
        subject: "AI Weekly #42 — GPT-5 Rumors, Open Source LLMs & Robot Chefs",
        htmlContent: `<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">AI Weekly Digest</h1>
    <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Edición #42 — Marzo 2026</p>
  </div>
  <div style="padding: 30px; background: #fff; border: 1px solid #e5e7eb; border-top: none;">
    <h2 style="color: #667eea; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 8px;">🔬 Investigación</h2>
    <h3 style="margin: 16px 0 8px;">DeepMind publica Gemini Ultra 2.0</h3>
    <p style="color: #444; line-height: 1.7;">El nuevo modelo multimodal de Google establece récords en razonamiento matemático y generación de código, superando a GPT-4o en 12 de 15 benchmarks principales.</p>
    <h2 style="color: #667eea; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 8px; margin-top: 24px;">🛠️ Herramientas</h2>
    <h3 style="margin: 16px 0 8px;">Cursor 2.0 redefine el coding con IA</h3>
    <p style="color: #444; line-height: 1.7;">La nueva versión del editor integra agentes autónomos que pueden ejecutar pipelines completos de desarrollo, desde diseño hasta deployment.</p>
    <h2 style="color: #667eea; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 8px; margin-top: 24px;">📊 Tendencias</h2>
    <h3 style="margin: 16px 0 8px;">El 67% de developers ya usan IA diariamente</h3>
    <p style="color: #444; line-height: 1.7;">Según el último reporte de Stack Overflow, la adopción de herramientas de IA para desarrollo se ha triplicado en el último año.</p>
  </div>
  <div style="padding: 20px 30px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="color: #666; font-size: 13px; margin: 0;">AI Weekly Digest — Generado automáticamente con IA</p>
  </div>
</div>`,
        sections: [
          {
            title: "Investigación",
            content:
              "DeepMind publica Gemini Ultra 2.0, superando GPT-4o en benchmarks.",
          },
          {
            title: "Herramientas",
            content: "Cursor 2.0 redefine el coding con agentes autónomos.",
          },
          {
            title: "Tendencias",
            content: "67% de developers usan IA diariamente.",
          },
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
        subject:
          "🚀 Startup Radar — $2.3B en funding ayer + 3 startups que debes conocer",
        htmlContent: `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
  <div style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 40px 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🚀 Startup Radar</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">7 de Marzo, 2026</p>
  </div>
  <div style="padding: 30px; background: #fff; border: 1px solid #e5e7eb; border-top: none;">
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
      <p style="margin: 0; font-weight: 600; color: #92400e;">💰 Dato del día</p>
      <p style="margin: 8px 0 0; color: #78350f;">$2.3 billones en funding fueron anunciados ayer, el mayor día de Q1 2026.</p>
    </div>
    <h2 style="color: #ef4444; font-size: 18px;">Serie A destacada</h2>
    <h3 style="margin: 12px 0 8px;">NeuralKit — $45M Serie A</h3>
    <p style="color: #444; line-height: 1.7;">Plataforma no-code para desplegar modelos de ML. Liderada por a16z con participación de Sequoia. Ya tienen 500+ empresas en su plataforma.</p>
    <h2 style="color: #ef4444; font-size: 18px; margin-top: 24px;">Adquisiciones</h2>
    <h3 style="margin: 12px 0 8px;">Stripe adquiere PayFlow por $890M</h3>
    <p style="color: #444; line-height: 1.7;">La fintech de pagos B2B se integra al ecosistema de Stripe, consolidando su posición en el mercado de infraestructura financiera.</p>
    <h2 style="color: #ef4444; font-size: 18px; margin-top: 24px;">3 startups para seguir</h2>
    <ul style="color: #444; line-height: 2;">
      <li><strong>Arcane Energy</strong> — Baterías de estado sólido para EVs</li>
      <li><strong>HealthPilot</strong> — IA para diagnóstico médico en zonas rurales</li>
      <li><strong>CodeShip</strong> — CI/CD con IA predictiva</li>
    </ul>
  </div>
  <div style="padding: 20px 30px; background: #fef3c7; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="color: #92400e; font-size: 13px; margin: 0;">Startup Radar — Tu dosis diaria del ecosistema emprendedor</p>
  </div>
</div>`,
        sections: [
          {
            title: "Dato del día",
            content: "$2.3B en funding, mayor día de Q1 2026.",
          },
          {
            title: "Serie A destacada",
            content: "NeuralKit levanta $45M liderada por a16z.",
          },
          {
            title: "Adquisiciones",
            content: "Stripe adquiere PayFlow por $890M.",
          },
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
        subject: "Dev Tools Weekly #18 — Bun 2.0, nuevos frameworks CSS y más",
        htmlContent: `<div style="font-family: 'JetBrains Mono', monospace, sans-serif; max-width: 600px; margin: 0 auto; color: #e2e8f0; background: #0f172a;">
  <div style="background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); padding: 40px 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px; font-family: monospace;">{"Dev Tools Weekly"}</h1>
    <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Edición #18 — Marzo 2026</p>
  </div>
  <div style="padding: 30px; background: #1e293b;">
    <h2 style="color: #06b6d4; font-size: 18px; font-family: monospace;">$ tool --featured</h2>
    <div style="background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin: 12px 0;">
      <h3 style="color: #f1f5f9; margin: 0 0 8px;">Bun 2.0</h3>
      <p style="color: #94a3b8; line-height: 1.7; margin: 0;">Runtime de JavaScript que ahora incluye bundler nativo, test runner mejorado, y compatibilidad total con Node.js. 3x más rápido en benchmarks de I/O.</p>
      <code style="display: block; background: #0c1425; color: #06b6d4; padding: 8px; border-radius: 4px; margin-top: 12px; font-size: 13px;">curl -fsSL https://bun.sh/install | bash</code>
    </div>
    <h2 style="color: #8b5cf6; font-size: 18px; font-family: monospace; margin-top: 24px;">$ lib --new</h2>
    <div style="background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin: 12px 0;">
      <h3 style="color: #f1f5f9; margin: 0 0 8px;">Tailwind CSS v5</h3>
      <p style="color: #94a3b8; line-height: 1.7; margin: 0;">Container queries nativos, nuevo sistema de theming con CSS layers, y performance mejorado con 40% menos de CSS generado.</p>
    </div>
    <div style="background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin: 12px 0;">
      <h3 style="color: #f1f5f9; margin: 0 0 8px;">Drizzle ORM v1.0</h3>
      <p style="color: #94a3b8; line-height: 1.7; margin: 0;">El ORM type-safe para TypeScript alcanza su primera versión estable. Soporte completo para PostgreSQL, MySQL, y SQLite.</p>
    </div>
  </div>
  <div style="padding: 20px 30px; background: #0f172a; border-top: 1px solid #334155; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="color: #64748b; font-size: 13px; margin: 0;">Dev Tools Weekly — Código generado con IA</p>
  </div>
</div>`,
        sections: [
          {
            title: "Herramienta destacada",
            content: "Bun 2.0 con bundler nativo y 3x más rápido.",
          },
          {
            title: "Nuevas librerías",
            content:
              "Tailwind CSS v5 y Drizzle ORM v1.0 alcanzan versiones estables.",
          },
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
