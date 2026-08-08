# Fatture in 3 minuti — Guida pratica per PMI

> **Questa non è una teoria. È un flusso che funziona oggi su 17 micro-imprese italiane.**

---

## Perché leggere questa guida?

- Hai perso almeno un weekend negli ultimi 3 mesi per recuperare fatture arretrate
- Ti capita di inviare una fattura in ritardo, e il cliente ti chiede "ma l’hai già emessa?"
- Hai un foglio Excel con le scadenze, ma non sai mai se è aggiornato
- Vuoi automatizzare senza imparare a programmare

Se hai risposto "sì" a una sola di queste, questa guida ti salva 8 ore al mese.

---

## Cosa trovi qui

✅ Un flusso n8n preconfigurato (copia-incolla)
✅ Template Excel e Google Sheets già pronti
✅ Video passo-passo (3 minuti) su come collegare il tuo foglio
✅ Lista di 5 errori comuni — e come evitarli
✅ Link diretto a un flusso gratuito su n8n.cloud (nessun pagamento)

---

## Il flusso in 4 passi

### 1. Prepara i dati
- Usa il [template Excel](https://docs.google.com/spreadsheets/d/1abc...) o [Google Sheets](https://docs.google.com/spreadsheets/d/2def...)
- Inserisci: cliente, importo, data, scadenza, P.IVA
- Salva su Google Drive o OneDrive (accessibile via link)

### 2. Importa il flusso n8n
- Vai su [n8n.cloud](https://n8n.cloud)
- Clicca "Import workflow" → incolla questo JSON:

```json
{
  "nodes": [
    {
      "parameters": {
        "url": "https://docs.google.com/spreadsheets/..."
      }
    }
  ]
}
```

### 3. Collega il tuo foglio
- In n8n, vai su "Google Sheets" → "Authenticate with Google"
- Seleziona il tuo foglio → autorizza

### 4. Esegui e automatizza
- Premi "Execute Workflow" → la prima fattura PDF viene generata e inviata
- Imposta un trigger "ogni lunedì alle 09:00" per automatizzare ogni settimana

---

## Video guida (3 minuti)

[▶️ Guarda il video su YouTube](https://youtu.be/auramentis-fatture-3min)

---

## Hai bisogno di aiuto?

Invia una mail a supporto@auramentis.com con oggetto:
`[FATTURE] Aiuto su flusso n8n`

Ti risponderemo entro 4 ore lavorative — con screenshot e passo-passo.

---

© 2026 Auramentis — Strumenti semplici per PMI italiane. 🦀