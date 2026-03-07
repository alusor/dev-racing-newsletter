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
<body style="margin: 0; padding: 0; background-color: #f8f8f6; font-family: Georgia, 'Times New Roman', serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="padding: 32px 24px 20px; border-bottom: 1px solid #e5e5e5;">
      <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 18px; font-weight: 600; color: #0f0f1a; letter-spacing: -0.01em;">${newsletterTitle}</h1>
    </div>
    <div style="padding: 0;">
      ${edition.htmlContent}
    </div>
    <div style="padding: 24px; border-top: 1px solid #e5e5e5; text-align: center; color: #6b7280; font-size: 12px; line-height: 1.5;">
      <p style="margin: 0 0 8px;">Recibiste este email porque estás suscrito a <strong style="color: #374151;">${newsletterTitle}</strong>.</p>
      <a href="#" style="color: #4f46e5; text-decoration: none;">Cancelar suscripción</a>
    </div>
  </div>
</body>
</html>`;
}
