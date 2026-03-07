import { IEdition } from "./models/newsletter";

export function wrapEmailTemplate(
  newsletterTitle: string,
  edition: IEdition
): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${edition.subject}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="max-width: 640px; margin: 0 auto;">
    ${edition.htmlContent}
    <div style="text-align: center; padding: 24px; color: #9ca3af; font-size: 12px;">
      <p>Recibiste este email porque estás suscrito a <strong>${newsletterTitle}</strong>.</p>
      <p>Generado automáticamente con IA — Powered by Newsletter Hub</p>
      <a href="#" style="color: #6b7280;">Cancelar suscripción</a>
    </div>
  </div>
</body>
</html>`;
}
