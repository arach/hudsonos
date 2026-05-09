interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
  RESEND_API_KEY: string;
  NOTIFY_EMAIL: string;
}

interface ContactRequestBody {
  email?: string;
  useCase?: string;
  context?: string;
  honeypot?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory rate limiting: 3 requests per minute per IP
const rateMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const window = 60_000;
  const max = 3;

  const timestamps = (rateMap.get(ip) ?? []).filter((t) => now - t < window);
  if (timestamps.length >= max) return true;
  timestamps.push(now);
  rateMap.set(ip, timestamps);
  return false;
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  const ip =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (isRateLimited(ip)) {
    return Response.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  let body: ContactRequestBody;
  try {
    body = (await request.json()) as ContactRequestBody;
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { email, useCase, context, honeypot } = body;

  // Honeypot check — silently succeed to confuse bots
  if (honeypot) {
    return Response.json({ success: true });
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return Response.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    );
  }

  const cleanEmail = email.toLowerCase().trim();
  const notifyTo = env.NOTIFY_EMAIL || 'arach@hudsonos.com';

  try {
    if (env.RESEND_API_KEY) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Hudson <hello@hudsonos.com>',
          to: notifyTo,
          subject: `Hudson interest from ${cleanEmail}`,
          text: [
            `New Hudson Interest`,
            `Email: ${cleanEmail}`,
            useCase ? `Use case: ${useCase}` : '',
            context ? `Context: ${context}` : '',
            `Sent from hudsonos.com`,
          ]
            .filter(Boolean)
            .join('\n'),
          html: `
<div style="font-family: monospace; padding: 20px;">
  <h2>New Hudson Interest</h2>
  <p><strong>Email:</strong> ${cleanEmail}</p>
  ${useCase ? `<p><strong>Use case:</strong> ${useCase}</p>` : ''}
  ${context ? `<p><strong>Context:</strong> ${context}</p>` : ''}
  <p style="color: #666; font-size: 12px;">Sent from hudsonos.com</p>
</div>`.trim(),
        }),
      });

      if (!emailResponse.ok) {
        const err = await emailResponse.text();
        console.error('Resend API error:', emailResponse.status, err);
        return Response.json(
          { error: 'Something went wrong. Please try again.' },
          { status: 500 },
        );
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Contact handler error:', error);
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
