# auramentis-test — deploy pronto per copia

Questo è un pacchetto completo per il deploy su `auramentis-landing`.

## Cosa contiene
- `pages/guide-fatture/index.html` → articolo completo per `/guide-fatture/`
- `guida/fatture-in-3-minuti.md` → lead magnet (da convertire in PDF con pandoc o online)

## Come deployare (1 comando)

Assumendo che il repo sia clonato in `~/auramentis-landing`:

```bash
rsync -av --delete auramentis-test/ ~/auramentis-landing/
cd ~/auramentis-landing && git add . && git commit -m "feat: guida fatture + articolo (test deploy)" && git push
```

✅ Dopo il push, Vercel rilascia automaticamente:
- https://auramentis.com/guide-fatture/
- https://auramentis.com/guida/fatture-in-3-minuti.md

Per PDF: usa `pandoc guida/fatture-in-3-minuti.md -o guida/fatture-in-3-minuti.pdf` o https://markdowntopdf.com