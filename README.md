# Ollin Website (Vite + React + TypeScript)

Production-ready marketing website for Ollin, built with **Vite**, **React 19**, and **TypeScript**, with a Netlify serverless function for plan-request email delivery.

## Tech Stack

- **Framework/UI:** React + TypeScript
- **Build tool:** Vite
- **Styling:** Tailwind CSS + custom CSS
- **Routing:** React Router
- **Animation/visuals:** Framer Motion, Three.js / OGL
- **Backend integrations:**
  - Supabase (client-side)
  - EmailJS (client-side contact emails)
  - Netlify Functions + Resend (server-side plan request emails)
- **Hosting target:** Netlify (recommended)

## Prerequisites

- **Node.js 20+** (recommended)
- **npm 10+** (recommended)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd ollin-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create local environment file**

   ```bash
   cp .env.example .env.local
   ```

   > If `.env.example` does not exist yet, create `.env.local` manually using the variables listed in [Environment Variables](#environment-variables).

4. **Start development server**

   ```bash
   npm run dev
   ```

   App runs at `http://localhost:3000` by default.

## Available Scripts

- `npm run dev` — start Vite dev server.
- `npm run build` — create production build in `dist/`.
- `npm run preview` — preview production build locally.

## Environment Variables

Create a `.env.local` file in the project root for local development.

### Client-side (`VITE_` prefixed)

These are exposed to the browser and must start with `VITE_`.

- `VITE_SUPABASE_URL` — Supabase project URL.
- `VITE_SUPABASE_ANON_KEY` — Supabase anonymous/public key.
- `VITE_EMAILJS_SERVICE_ID` — EmailJS service ID.
- `VITE_EMAILJS_TEMPLATE_ID` — EmailJS template ID.
- `VITE_EMAILJS_PUBLIC_KEY` — EmailJS public key.

### Server-side (Netlify Function)

- `RESEND_API_KEY` — API key used by `netlify/functions/plan-request.ts` to send transactional emails via Resend.

### Example `.env.local`

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_TEMPLATE_ID=template_xxx
VITE_EMAILJS_PUBLIC_KEY=public_xxx
```

> Do not commit secrets. Keep server secrets (such as `RESEND_API_KEY`) only in your deployment provider's secure environment settings.

## Project Structure

```text
.
├── App.tsx
├── index.tsx
├── index.html
├── components/               # Reusable UI and section components
├── pages/                    # Route-level pages and package configurator modules
├── lib/
│   └── supabase.ts           # Supabase client initialization
├── utils/
│   └── email.ts              # EmailJS helper logic
├── netlify/
│   └── functions/
│       └── plan-request.ts   # Serverless endpoint for plan request emails
├── public/                   # Static assets
├── vite.config.ts            # Vite config + alias + dev server settings
├── tailwind.config.js
├── postcss.config.js
└── netlify.toml              # Netlify functions directory + redirect config
```

## Deployment Notes

### Netlify (recommended)

This project includes `netlify.toml` for function configuration and API redirect:

- Functions directory: `netlify/functions`
- Redirect: `/api/plan-request` → `/.netlify/functions/plan-request`

Suggested Netlify settings:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 20+
- **Environment variables:**
  - Client vars: `VITE_*`
  - Server vars: `RESEND_API_KEY`

### Other static hosts (Vercel, Cloudflare Pages, etc.)

- Front-end build (`dist`) can be deployed to any static host.
- If you do not deploy on Netlify, you must reimplement `netlify/functions/plan-request.ts` in your host's serverless/runtime model and update the API route accordingly.

## Branching & PR Workflow

We use a lightweight Git flow:

- `main` = **production** (always deployable)
- `dev` = **integration** branch
- Feature branches = `feat/*` (for example: `feat/pricing-card-copy-update`)
- **Pull requests are required** for all merges (including feature → `dev`, and `dev` → `main`)

Recommended flow:

1. Branch from `dev`:
   ```bash
   git checkout dev
   git pull
   git checkout -b feat/your-feature-name
   ```
2. Implement changes and push your branch.
3. Open PR to `dev`.
4. After validation/testing, merge to `dev`.
5. Open PR from `dev` to `main` for production release.

## Quality Checklist (before opening a PR)

- Run `npm run build` successfully.
- Verify key pages/routes manually in local preview.
- Confirm environment variables are configured in target environment.
- Ensure no secrets were committed.

## License

Add your license information here (for example, proprietary/internal use or MIT).
