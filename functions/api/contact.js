export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, empresa, servicio, mensaje } = body;

    if (!nombre || !email || !mensaje) {
      return json({ error: 'Faltan campos requeridos.' }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({ error: 'Email inválido.' }, 400);
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SigmaPro <noreply@sigmapro.com.co>',
        to: [env.CONTACT_EMAIL ?? 'contacto@sigmapro.com.co'],
        reply_to: email,
        subject: `Contacto web: ${nombre}${servicio ? ` — ${servicio}` : ''}`,
        html: `
          <h2 style="color:#2563EB">Nuevo mensaje desde el sitio web</h2>
          <p><strong>Nombre:</strong> ${esc(nombre)}</p>
          <p><strong>Email:</strong> ${esc(email)}</p>
          ${telefono ? `<p><strong>Teléfono:</strong> ${esc(telefono)}</p>` : ''}
          ${empresa  ? `<p><strong>Empresa:</strong>  ${esc(empresa)}</p>`  : ''}
          ${servicio ? `<p><strong>Servicio:</strong> ${esc(servicio)}</p>` : ''}
          <p><strong>Mensaje:</strong><br>${esc(mensaje).replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('Resend error:', detail);
      return json({ error: 'No se pudo enviar el mensaje. Intente de nuevo.' }, 500);
    }

    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ error: 'Error interno del servidor.' }, 500);
  }
}

// ── helpers ────────────────────────────────────────────────────────────────

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
