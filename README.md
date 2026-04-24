# ContractScan

AI-powered contract risk scanner. Paste any contract and get an instant breakdown of risky clauses — non-competes, IP grabs, hidden auto-renewals, unlimited liability, and more — explained in plain English.

**Live site:** https://contract-scanner-8w4nch33q-saketpol10s-projects.vercel.app

---

## Features

- Paste contract text or upload a PDF / TXT file
- AI analysis powered by Llama 3.3 70B via Groq
- Flags clauses by severity: High / Medium / Low
- Plain-English explanations + actionable recommendations
- Lists safe/standard clauses too
- No login, no storage, completely free to use

## What it flags

- Unlimited liability and indemnification
- IP assignment (ownership of your work or ideas)
- Non-compete and non-solicitation clauses
- Auto-renewal and hard-to-cancel terms
- Unilateral modification rights
- Payment traps and late fees
- Termination without cause
- Unfavorable jurisdiction clauses

## Stack

- **Framework:** Next.js 16 (App Router)
- **AI:** Groq API — `llama-3.3-70b-versatile`
- **Styling:** Tailwind CSS
- **PDF parsing:** pdf-parse
- **Deployment:** Vercel

## Running locally

1. Clone the repo

```bash
git clone https://github.com/saketpol10/contract-scanner.git
cd contract-scanner
```

2. Install dependencies

```bash
npm install
```

3. Add your Groq API key — get one free at [console.groq.com](https://console.groq.com)

```bash
echo "GROQ_API_KEY=your_key_here" > .env.local
```

4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Changing the model

Open `app/api/analyze/route.ts` and edit the `MODEL` constant:

```ts
const MODEL = "llama-3.3-70b-versatile"; // change this
```

Available Groq models:

| Model | Speed | Best for |
|---|---|---|
| `llama-3.3-70b-versatile` | Medium | Best quality (default) |
| `llama3-8b-8192` | Very fast | Quick checks |
| `mixtral-8x7b-32768` | Fast | Long contracts |

## Deploying to Vercel

```bash
npm install -g vercel
vercel login
vercel --yes
```

Add `GROQ_API_KEY` in your Vercel project under **Settings → Environment Variables**, then redeploy.

## Disclaimer

ContractScan is for informational purposes only and does not constitute legal advice. For important or high-value contracts, consult a licensed attorney.
