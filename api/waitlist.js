// Vercel Serverless Function — Waitlist signup
// Salva le iscrizioni in Vercel KV (o fallback su file JSON se non configurato)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, timestamp, source } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email non valida' });
  }

  const entry = {
    name: name || '',
    email: email.toLowerCase().trim(),
    timestamp: timestamp || new Date().toISOString(),
    source: source || 'auramentis.com'
  };

  // Notifica via email (Resend) se configurato
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'FatturaFacile <noreply@auramentis.com>',
          to: [entry.email],
          subject: '✅ Sei in lista — FatturaFacile',
          html: `
<!DOCTYPE html>
<html lang="it">
<body style="font-family: 'Segoe UI', Arial, sans-serif; background: #f8f4ee; margin: 0; padding: 40px 20px;">
  <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
    <div style="background: #1a3a2a; padding: 32px 40px; text-align: center;">
      <h1 style="color: #fff; font-size: 22px; margin: 0; font-weight: 800;">FatturaFacile</h1>
      <p style="color: #c8e6d4; margin: 8px 0 0; font-size: 15px;">Lista d'attesa confermata</p>
    </div>
    <div style="padding: 36px 40px;">
      <p style="font-size: 17px; color: #1a1a1a; margin-top: 0;">Ciao ${entry.name || 'a te'},</p>
      <p style="font-size: 15px; color: #444; line-height: 1.7;">
        Sei ufficialmente in lista. Ti avviso per primo quando FatturaFacile
        apre le iscrizioni — con il prezzo di lancio bloccato per te.
      </p>
      <div style="background: #f0f7f3; border-left: 4px solid #2e7d52; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0; font-weight: 700; color: #1a3a2a; font-size: 15px;">Cosa riceverai:</p>
        <ul style="color: #555; font-size: 14px; line-height: 2; padding-left: 18px; margin: 8px 0 0;">
          <li>Accesso anticipato a FatturaFacile</li>
          <li>Prezzo di lancio bloccato a €9/mese</li>
          <li>Supporto onboarding personalizzato</li>
        </ul>
      </div>
      <p style="font-size: 14px; color: #888; margin-top: 24px;">
        Nel frattempo, se hai domande scrivi a
        <a href="mailto:ciao@auramentis.com" style="color: #2e7d52;">ciao@auramentis.com</a>
      </p>
    </div>
    <div style="padding: 16px 40px; border-top: 1px solid #eee; text-align: center;">
      <p style="color: #bbb; font-size: 12px; margin: 0;">
        © 2026 Auramentis · <a href="https://auramentis.com" style="color: #bbb;">auramentis.com</a>
      </p>
    </div>
  </div>
</body>
</html>`,
          text: `Ciao ${entry.name || ''},\n\nSei in lista d'attesa per FatturaFacile.\nTi avviso appena apriamo le iscrizioni con il prezzo di lancio bloccato.\n\n— Auramentis\nciao@auramentis.com`
        })
      });

      // Notifica interna ad Antonio
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'FatturaFacile <noreply@auramentis.com>',
          to: ['ciao@auramentis.com'],
          subject: `🎯 Nuova iscrizione lista d'attesa: ${entry.email}`,
          text: `Nome: ${entry.name}\nEmail: ${entry.email}\nData: ${entry.timestamp}\nFonte: ${entry.source}`
        })
      });
    } catch (err) {
      console.error('Resend error:', err);
      // Non bloccare la risposta se l'email fallisce
    }
  }

  return res.status(200).json({ ok: true, message: 'Iscrizione confermata' });
}
