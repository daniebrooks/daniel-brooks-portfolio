# Daniel Brooks: portfolio

Personal portfolio site for Daniel Brooks, senior software engineer (AI agents, automation, full-stack and data work).

**Live:** https://daniel-brooks-portfolio-zeta.vercel.app

## What is in it

- One-page site: hero with a particle field, About, Stack (9 groups), Experience (4 roles), Work areas, "Worked on and with" sites, Contact, and a CV download.
- Dark and light themes (follows the OS first, then the visitor's choice) and a six-palette accent picker.
- Contact form at `POST /api/contact`. Each message goes to a Google Sheet through an Apps Script web app and/or to email through Resend. Requests are rate limited per IP, and the form falls back to a plain email link when neither is configured.
- SEO: metadata, Open Graph image, JSON-LD, sitemap and robots.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui primitives, `motion` for animation, Lucide icons. Fonts: Sora, Inter and Geist Mono.

## Run it

```bash
npm install
cp .env.example .env.local   # optional: only needed for the contact form
npm run dev                  # http://localhost:3000
npm run check                # lint + typecheck + production build
```

Requires Node 24 or newer.

## Content

All copy (name, role, stack, experience, work areas, contact details) lives in one file: `src/components/sites/sweandrew/data.ts`. The CV is served from `public/Daniel_Brooks_CV.pdf`.

## Contact form setup

Environment variables are listed in `.env.example`. To save messages to a Google Sheet, follow [docs/google-sheet-setup.md](docs/google-sheet-setup.md). To email them, set `RESEND_API_KEY` (and a verified sender in `CONTACT_FROM_EMAIL`).

## Credits

Started from [ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template) by JCodesMore (MIT, see [LICENSE](LICENSE)). The layout and motion follow the design of [portfolio-sweandrew.vercel.app](https://portfolio-sweandrew.vercel.app); the text, images and data here are Daniel's.
