# OfferScan

AI-powered job offer analyzer. Paste any offer letter or employment contract and get an instant plain-English breakdown of non-competes, IP grabs, equity traps, arbitration clauses, and more — before you sign.

**Live site:** https://contract-scanner-six.vercel.app

---

## Features

- Paste offer letter text or upload a PDF / TXT file
- AI analysis powered by Llama 3.3 70B via Groq
- Flags clauses by severity: High / Medium / Low
- Plain-English explanations + what you can negotiate
- Lists safe/standard clauses too
- Rate limited to 5 analyses per hour per IP (via Upstash Redis)
- No login, no storage, completely free

## What it flags

- Non-compete clauses (scope, duration, geography)
- IP assignment (ownership of side projects and personal work)
- Moonlighting and outside work restrictions
- Equity and vesting terms (cliffs, acceleration, clawbacks)
- At-will termination and severance
- Sign-on and performance bonus clawback provisions
- Arbitration clauses (waiving right to sue in court)
- Non-solicitation restrictions
- Relocation clawbacks and reimbursement requirements
- Jurisdiction and governing law

## Stack

- **Framework:** Next.js 16 (App Router)
- **AI:** Groq API — `llama-3.3-70b-versatile`
- **Rate limiting:** Upstash Redis
- **Styling:** Tailwind CSS
- **PDF parsing:** pdf-parse
- **Infrastructure:** Terraform (Vercel provider)
- **Deployment:** Vercel

## Running locally

1. Clone the repo

```bash
git clone https://github.com/saketpol10/offer-scan.git
cd offer-scan
```

2. Install dependencies

```bash
npm install
```

3. Create `.env.local` — copy the example and fill in your keys

```
GROQ_API_KEY=              # console.groq.com — free
UPSTASH_REDIS_REST_URL=    # console.upstash.com — free
UPSTASH_REDIS_REST_TOKEN=
```

4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Changing the AI model

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

## Infrastructure (Terraform)

Vercel project and environment variables are managed as code. See `terraform/terraform.tfvars.example` for required variables.

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars  # fill in your values
terraform init
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

## Deploying to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Add the three env vars (`GROQ_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) in your Vercel project under **Settings → Environment Variables**.

## Disclaimer

OfferScan is for informational purposes only and does not constitute legal advice. For important or high-value contracts, consult a licensed employment attorney.
