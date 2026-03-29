import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as Record<string, string>;
    const { nombre, email, telefono, empresa, servicio, mensaje } = body;

    if (!nombre || !email || !mensaje) {
      return res({ error: 'Faltan campos requeridos.' }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res({ error: 'Email inválido.' }, 400);
    }

    // En Cloudflare Worker usa cloudflare:workers; en dev (Node.js) usa import.meta.env
    let cfEnv: Record<string, string> = {};
    try {
      // @ts-ignore
      const m = await import('cloudflare:workers');
      cfEnv = m.env ?? {};
    } catch { /* entorno local */ }

    const RESEND_API_KEY = cfEnv.RESEND_API_KEY ?? import.meta.env.RESEND_API_KEY;
    const CONTACT_EMAIL  = cfEnv.CONTACT_EMAIL  ?? import.meta.env.CONTACT_EMAIL ?? 'proyectos@sigmaprosas.com';

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
      const errBody = await mail.text();
      console.error('Resend error status:', mail.status, 'body:', errBody);
      return res({ error: `Resend ${mail.status}: ${errBody}` }, 500);
    }

    return res({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error(err);
    return res({ error: msg }, 500);
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
