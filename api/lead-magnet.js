export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, guide = 'guida-generale' } = req.body || {};
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Email non valida' });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const cleanName = (name || 'imprenditore').trim();
  const cleanEmail = email.toLowerCase().trim();

  const GUIDE_CONTENTS = {
    'scadenze-fiscali': {
      title: 'Le 5 Scadenze Fiscali che Ogni Artigiano Deve Conoscere',
      html: `
        <h2 style="color:#2a6041">Le 5 Scadenze Fiscali che Ogni Artigiano Deve Conoscere</h2>
        <p>Ciao ${cleanName},<br>ecco la guida completa che hai richiesto.</p>
        <hr style="border:1px solid #e8e8e8;margin:24px 0">

        <h3 style="color:#1a1a2e">1. IVA Trimestrale</h3>
        <p>Se sei in regime ordinario, versi l'IVA ogni trimestre entro il <strong>16 del secondo mese successivo</strong>:</p>
        <ul>
          <li>I trimestre (gen–mar): <strong>16 maggio</strong></li>
          <li>II trimestre (apr–giu): <strong>16 agosto</strong> (con maggiorazione 0,40%)</li>
          <li>III trimestre (lug–set): <strong>16 novembre</strong></li>
          <li>IV trimestre: con la dichiarazione annuale IVA (febbraio–aprile)</li>
        </ul>
        <p><em>Attenzione: in regime forfettario non hai IVA da versare.</em></p>

        <h3 style="color:#1a1a2e">2. Contributi INPS Artigiani</h3>
        <p>Hai una quota fissa (dovuta anche se non guadagni nulla) e una variabile sul reddito eccedente il minimale:</p>
        <ul>
          <li><strong>16 maggio</strong> — I rata acconto contributi fissi</li>
          <li><strong>20 agosto</strong> — II rata acconto contributi fissi</li>
          <li><strong>16 novembre</strong> — III rata acconto contributi fissi</li>
          <li><strong>16 febbraio (anno successivo)</strong> — IV rata</li>
          <li><strong>Saldo eccedenza</strong>: con F24 entro giugno/luglio dell'anno successivo</li>
        </ul>
        <p>Il minimale contributivo 2025 è circa <strong>€ 4.427/anno</strong>.</p>

        <h3 style="color:#1a1a2e">3. INAIL — Premio Assicurativo</h3>
        <p>Ogni anno entro il <strong>16 febbraio</strong> paghi il premio INAIL con autoliquidazione:</p>
        <ul>
          <li>Anticipo anno corrente (80% del premio dell'anno precedente)</li>
          <li>Regolazione anno precedente (saldo sulle retribuzioni reali)</li>
        </ul>
        <p>Se non hai dipendenti, il premio è calcolato sul tuo reddito presunto.</p>

        <h3 style="color:#1a1a2e">4. Acconti e Saldo IRPEF</h3>
        <p>Le imposte sui redditi seguono questo calendario:</p>
        <ul>
          <li><strong>30 giugno</strong> — saldo anno precedente + I acconto anno corrente (oppure luglio con +0,40%)</li>
          <li><strong>30 novembre</strong> — II acconto IRPEF (e IRAP se dovuta)</li>
        </ul>
        <p>Il calcolo avviene con il Modello Redditi PF, da inviare entro il <strong>30 novembre</strong>.</p>

        <h3 style="color:#1a1a2e">5. Ritenute d'Acconto (se hai collaboratori)</h3>
        <p>Se paghi professionisti o collaboratori che emettono fattura con ritenuta, devi versare quella ritenuta entro il <strong>16 del mese successivo al pagamento</strong> tramite modello F24.</p>
        <p>Esempio: paghi un grafico il 5 marzo → versi la ritenuta entro il 16 aprile.</p>

        <hr style="border:1px solid #e8e8e8;margin:24px 0">
        <h3 style="color:#2a6041">Consiglio Pratico</h3>
        <p>Tieni un <strong>calendario fiscale</strong> e metti un promemoria 10 giorni prima di ogni scadenza. Le sanzioni per ritardo partono dal <strong>0,1% al giorno</strong> nei primi 14 giorni.</p>
        <p>Un gestionale come <a href="https://pmiapp.net" style="color:#2a6041">PMIApp</a> ti aiuta a tenere sotto controllo fatture, incassi e scadenze senza perdere ore in fogli Excel.</p>

        <hr style="border:1px solid #e8e8e8;margin:24px 0">
        <p style="color:#666;font-size:13px">Questa guida è a scopo informativo. Per la tua situazione specifica consulta sempre il tuo commercialista.</p>
      `
    }
  };

  const guideData = GUIDE_CONTENTS[guide] || GUIDE_CONTENTS['scadenze-fiscali'];

  // ── Invia guida via email ──────────────────────────────────────────────────
  if (RESEND_API_KEY) {
    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Valeria <noreply@pmi.auramentis.com>',
          to: [cleanEmail],
          subject: `La tua guida: ${guideData.title}`,
          html: `
            <!DOCTYPE html><html lang="it"><body style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;padding:32px 16px;color:#1a1a2e;background:#fff">
              ${guideData.html}
              <div style="margin-top:40px;padding-top:24px;border-top:2px solid #2a6041">
                <p style="color:#2a6041;font-weight:600;margin:0">Valeria — Auramentis</p>
                <p style="color:#666;font-size:13px;margin:4px 0">Guide pratiche per imprenditori italiani</p>
                <p style="color:#666;font-size:12px;margin:16px 0 0">Hai ricevuto questa email perché hai richiesto la guida su <a href="https://auramentis.com">auramentis.com</a></p>
              </div>
            </body></html>
          `
        })
      });
      if (!emailRes.ok) {
        console.error('Resend error:', emailRes.status, await emailRes.text());
      }
    } catch (e) {
      console.error('Resend exception:', e.message);
    }
  }

  // ── Notifica Telegram ad Antonio ───────────────────────────────────────────
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    try {
      const msg = `🎯 *Nuovo lead — Auramentis*\n\n👤 Nome: ${cleanName}\n📧 Email: \`${cleanEmail}\`\n📄 Guida: ${guideData.title}\n⏰ ${new Date().toLocaleString('it-IT', {timeZone:'Europe/Rome'})}`;
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: msg,
          parse_mode: 'Markdown'
        })
      });
    } catch (e) {
      console.error('Telegram error:', e.message);
    }
  }

  // ── Salva lead su GitHub data/leads.json ──────────────────────────────────
  if (GITHUB_TOKEN) {
    try {
      const REPO = 'mariaAI67/auramentis-landing';
      const PATH = 'data/leads.json';
      const ghHeaders = {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      };
      const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, { headers: ghHeaders });
      const fileData = await getRes.json();
      const current = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'));
      current.push({ name: cleanName, email: cleanEmail, guide, date: new Date().toISOString() });
      await fetch(`https://api.github.com/repos/${REPO}/contents/${PATH}`, {
        method: 'PUT', headers: ghHeaders,
        body: JSON.stringify({
          message: `lead: ${cleanEmail} — ${guide}`,
          content: Buffer.from(JSON.stringify(current, null, 2)).toString('base64'),
          sha: fileData.sha, branch: 'main'
        })
      });
    } catch (e) { console.error('GitHub leads error:', e.message); }
  }

  return res.status(200).json({ success: true, message: 'Guida inviata alla tua email!' });
}