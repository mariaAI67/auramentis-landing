const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

const contentDir = path.join(__dirname, 'content', 'articoli');
const outputDir = path.join(__dirname, 'guide');

if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Lettura del template dalla index
const templateHTML = `
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{TITLE}} | Auramentis</title>
<meta name="description" content="{{DESCRIPTION}}">
<meta property="og:title" content="{{TITLE}}">
<meta property="og:description" content="{{DESCRIPTION}}">
<meta property="og:type" content="article">
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--green:#2a6041;--green-light:#3a8057;--coral:#e05a3a;--bg:#fafaf8;--card:#fff;--text:#1a1a2e;--muted:#5a5a72;--border:#e4e4e4}
body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
a{color:var(--green)}
nav{background:var(--card);border-bottom:1px solid var(--border);padding:0 24px}
.nav-inner{max-width:860px;margin:0 auto;display:flex;align-items:center;height:56px}
.logo{font-weight:700;font-size:17px;color:var(--text);text-decoration:none;}
.logo span{color:var(--green)}
.hero{background:linear-gradient(135deg,#1a3328,var(--green));color:#fff;padding:56px 24px}
.hero-inner{max-width:700px;margin:0 auto;text-align:center}
.category{display:inline-block;background:rgba(255,255,255,0.2);border-radius:100px;padding:5px 14px;font-size:12px;font-weight:600;letter-spacing:0.5px;margin-bottom:20px;text-transform:uppercase}
.hero h1{font-size:clamp(24px,4.5vw,40px);font-weight:800;line-height:1.2;margin-bottom:16px;letter-spacing:-0.3px}
.hero p{font-size:16px;opacity:0.88;margin-bottom:0}
.content{max-width:860px;margin:0 auto;padding:40px 24px;display:grid;grid-template-columns:1fr 340px;gap:40px;align-items:start}
@media(max-width:700px){.content{grid-template-columns:1fr;padding:32px 20px}}
article h2{font-size:20px;font-weight:700;margin:32px 0 12px;color:var(--green)}
article h2:first-child{margin-top:0}
article p{color:#2a2a3e;font-size:15px;margin-bottom:14px}
article ul{margin:8px 0 16px 20px}
article li{font-size:15px;margin-bottom:6px;color:#2a2a3e}
.form-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:28px;position:sticky;top:80px;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
.form-card h3{font-size:18px;font-weight:700;margin-bottom:6px}
.form-card p{color:var(--muted);font-size:13px;margin-bottom:20px}
label{display:block;font-size:13px;font-weight:600;margin-bottom:5px;color:var(--text)}
input[type=text],input[type=email]{width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;margin-bottom:14px;transition:border-color .15s;background:#fff}
input:focus{outline:none;border-color:var(--green)}
.btn-submit{width:100%;background:var(--green);color:#fff;border:none;padding:13px;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;transition:background .2s;font-family:inherit}
.btn-submit:hover{background:var(--green-light)}
footer{background:#1a1a2e;color:rgba(255,255,255,0.6);padding:28px 24px;text-align:center;font-size:13px;margin-top:40px}
footer a{color:rgba(255,255,255,0.8)}
</style>
</head>
<body>
<nav><div class="nav-inner"><a href="/" class="logo">Aura<span>mentis</span></a></div></nav>

<div class="hero">
  <div class="hero-inner">
    <div class="category">{{CATEGORY}}</div>
    <h1>{{TITLE}}</h1>
    <p>{{DESCRIPTION}}</p>
  </div>
</div>

<div class="content">
  <article>
    {{CONTENT}}
  </article>

  <aside>
    <div class="form-card">
      <h3>Ricevi le nostre guide</h3>
      <p>Iscriviti alla newsletter per ricevere contenuti pratici, senza spam.</p>
      <form id="lead-form">
        <label for="name">Il tuo nome</label>
        <input type="text" id="name" name="name" placeholder="Mario Rossi">
        <label for="email">La tua email *</label>
        <input type="email" id="email" name="email" required>
        <button type="submit" class="btn-submit" id="submit-btn">Iscriviti →</button>
      </form>
    </div>
  </aside>
</div>

<footer>
  <p>© 2026 Auramentis · <a href="/">Torna alla home</a></p>
</footer>
</body>
</html>
`;

// Processa i file markdown
fs.readdirSync(contentDir).forEach(file => {
  if (file.endsWith('.md')) {
    const markdownStr = fs.readFileSync(path.join(contentDir, file), 'utf-8');
    const { data, content } = matter(markdownStr);
    const htmlContent = marked.parse(content);
    
    const title = data.title || file.replace('.md', '').replace(/-/g, ' ');
    const description = data.description || 'Una guida pratica di Auramentis.';
    const category = data.category || 'Guida';

    let finalHTML = templateHTML
      .replace(/{{TITLE}}/g, title)
      .replace(/{{DESCRIPTION}}/g, description)
      .replace(/{{CATEGORY}}/g, category)
      .replace('{{CONTENT}}', htmlContent);

    const filename = file.replace('.md', '.html');
    fs.writeFileSync(path.join(outputDir, filename), finalHTML);
    console.log('Generato: ' + filename);
  }
});
