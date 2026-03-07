# Newsletter Hub

Plataforma de newsletters generados por IA. Crea, explora y suscríbete a newsletters personalizados impulsados por GPT-4o, con envío automático por email.

## Características

- **Creación con IA** — Crea newsletters mediante un chat conversacional que define tema, frecuencia, estilo y genera ediciones de muestra automáticamente.
- **Marketplace** — Explora y descubre newsletters de la comunidad, organizados por tópico y frecuencia.
- **Precios dinámicos** — Sistema de descuentos grupales: a más suscriptores, menor el precio (hasta 70% de descuento).
- **Envío automatizado** — Crons en Vercel generan y envían ediciones diarias y semanales a todos los suscriptores.
- **Generación de portadas** — Imágenes de portada generadas con DALL-E.

## Stack tecnológico

| Categoría | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| Frontend | React 19, Tailwind CSS v4, shadcn/ui |
| Base de datos | MongoDB (Mongoose) |
| IA | Vercel AI SDK, OpenAI GPT-4o |
| Email | Zavu |
| Deploy | Vercel |

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                        # Home + marketplace
│   ├── create/page.tsx                 # Creación de newsletters con chat IA
│   ├── newsletter/[id]/page.tsx        # Detalle + suscripción
│   └── api/
│       ├── chat/route.ts               # Chat IA (herramientas de creación)
│       ├── newsletters/route.ts        # Listado + seed inicial
│       ├── newsletter/[id]/route.ts    # Newsletter por ID
│       ├── newsletter/generate/route.ts # Generar edición preview
│       ├── subscribe/route.ts          # Suscripción
│       ├── send/route.ts               # Envío masivo (cron)
│       └── image/route.ts              # Generación de portadas
├── components/                         # UI components
├── lib/
│   ├── mongodb.ts                      # Conexión con cache
│   ├── models/                         # Schemas Mongoose
│   ├── newsletter-generator.ts         # Generación de contenido con GPT-4o
│   ├── email-template.ts               # Template HTML para emails
│   ├── pricing.ts                      # Lógica de precios y descuentos
│   └── seed.ts                         # Datos iniciales
└── scripts/
    └── generate-image.ts               # CLI para generar portadas
```

## Requisitos previos

- Node.js 18+
- MongoDB (local o Atlas)
- Cuentas en OpenAI y Zavu

## Configuración

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/dev-racing-newsletter.git
cd dev-racing-newsletter
```

2. Instala dependencias:

```bash
npm install
```

3. Crea un archivo `.env.local` con las siguientes variables:

```env
OPENAI_API_KEY=tu-api-key-de-openai
MONGODB_URI=tu-uri-de-mongodb
ZAVU_API_KEY=tu-api-key-de-zavu
CRON_SECRET=un-secreto-para-proteger-los-crons
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Crons (producción)

En Vercel, los crons están configurados para el envío automático:

| Cron | Horario | Descripción |
|---|---|---|
| Diario | 7:00 UTC | Genera y envía ediciones diarias |
| Semanal | Lunes 7:00 UTC | Genera y envía ediciones semanales |

## Licencia

Proyecto privado. Todos los derechos reservados.
