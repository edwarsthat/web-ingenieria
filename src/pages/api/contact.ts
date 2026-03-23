import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json() as Record<string, string>;
    const { nombre, email, telefono, empresa, servicio, mensaje } = body;

    if (!nombre || !email || !mensaje) {
      return res({ error: 'Faltan campos requeridos.' }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res({ error: 'Email inválido.' }, 400);
    }

    // Cloudflare Worker env (adapter) o variables de entorno locales
    const env = (locals as any).runtime?.env ?? {};
    const RESEND_API_KEY = env.RESEND_API_KEY ?? import.meta.env.RESEND_API_KEY;
    const CONTACT_EMAIL  = env.CONTACT_EMAIL  ?? import.meta.env.CONTACT_EMAIL ?? 'proyectos@sigmaprosas.com';

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY no configurada');
      return res({ error: 'Configuración del servidor incompleta.' }, 500);
    }

    const mail = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SigmaPro <noreply@sigmaprosas.com>',
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject: `Contacto web: ${nombre}${servicio ? ` — ${servicio}` : ''}`,
        html: `
          <h2 style="color:#2563EB;font-family:sans-serif">Nuevo mensaje desde el sitio web</h2>
          <p><strong>Nombre:</strong> ${esc(nombre)}</p>
          <p><strong>Email:</strong> ${esc(email)}</p>
          ${telefono ? `<p><strong>Teléfono:</strong> ${esc(telefono)}</p>` : ''}
          ${empresa  ? `<p><strong>Empresa:</strong>  ${esc(empresa)}</p>`  : ''}
          ${servicio ? `<p><strong>Servicio:</strong> ${esc(servicio)}</p>` : ''}
          <p><strong>Mensaje:</strong><br>${esc(mensaje).replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    if (!mail.ok) {
      console.error('Resend error:', await mail.text());
      return res({ error: 'No se pudo enviar el mensaje. Intente de nuevo.' }, 500);
    }

    return res({ ok: true });
  } catch (err) {
    console.error(err);
    return res({ error: 'Error interno del servidor.' }, 500);
  }
};

function res(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function esc(str: string) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
