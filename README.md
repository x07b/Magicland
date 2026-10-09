# Magic Land

A complete French kindergarten homepage built with Next.js App Router, TypeScript, Tailwind CSS, Motion, Lenis, Lucide, Fredoka and DM Sans.

Wheel scrolling is smoothed with Lenis; touch scrolling remains native. Anchor navigation respects the sticky header, and motion preferences disable smoothing and reveal effects. Headings reveal word by word, sections fade in once, and gallery dialogs pause background scrolling. Each section has a distinct editorial purpose. All photographs preserve their original aspect ratio without crop or hover zoom.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. For production: `npm run build` then `npm start`.

## Verification

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm test
```

Browser tests cover 1440, 1280, 1024, 768, 390 and 320 px layouts, image decoding, navigation, accessible modal keyboard behavior, form validation and the unconfigured API response. Screenshots are written to `test-results/`.

Automated axe checks cover WCAG A/AA rules on the page and lightbox; these supplement manual visual inspection. `npm audit --omit=dev` reports no production vulnerabilities. The development-only Next.js ESLint dependency chain currently reports a `braces` advisory with no compatible fixed version; the suggested downgrade would break the current framework/tooling alignment. Recheck the advisory when updating dependencies.

## Before launch

1. Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS origin for canonical and social sharing URLs; rebuild after changing it.
2. Replace the clearly labeled demo photography with approved school photos. Keep illustration notices until real photos are provided. Image paths and descriptions are centralized in `src/lib/site.ts`.
3. Configure the contact endpoint as described below and verify a real delivery before launch. No recipient email was supplied, so the site does not invent one.

The original logo is copied unchanged to `public/brand/magic-land.jpg`. Reference website screenshots are not used as assets. No reviews, credentials, hours, fees or age eligibility have been invented.

## Contact delivery

Until configured, the form validates details and clearly says they were **not sent**, with working phone links. `POST /api/contact` returns HTTP 503 for valid submissions when configuration is missing. The interface never reports a successful delivery in this state.

Set both `CONTACT_WEBHOOK_URL` (HTTPS only) and `CONTACT_WEBHOOK_SECRET`, then rebuild/redeploy. The endpoint sends:

```json
{"name":"Parent name","phone":"25 482 108","email":"parent@example.com","message":"Message"}
```

The receiving service must authenticate `Authorization: Bearer <CONTACT_WEBHOOK_SECRET>`, deliver to the school's confirmed inbox/CRM, and return a 2xx response only when it has accepted responsibility for delivery. A timeout or non-2xx response is shown as failure; the form preserves input for retry. Secrets remain server-only. The endpoint validates inputs, checks the browser origin, limits request text size, includes a honeypot and uses a 10-second upstream timeout. Configure durable rate limiting at your deployment provider/webhook before enabling public delivery. Do not log parent messages unnecessarily.

## Assets and content

All photography is stored locally and optimized through `next/image`. Source: Pexels image IDs 8613089, 8612992, 3933025, 8613312, 8363042, 8613117. See `public/images/SOURCES.md` for exact URLs. These are illustrative stock photographs, **not actual Magic Land children, staff or premises**.

The map is an explicitly labeled illustration; the directions link uses the supplied address, not invented coordinates. Phone numbers and address come from the project brief. Enrollment year is intentionally 2026/2027; footer copyright uses the build year.

## Structure

- `src/app`: page, SEO metadata, styles and contact route
- `src/components`: navigation, section compositions, shared elements, gallery, form and motion
- `src/lib`: editable business/photo data and shared form validation
- `public/brand`: unmodified official identity
- `public/images`: replaceable demo photography
- `tests`: Playwright integration and responsive checks

Build requirements: Node.js 20.9+ and network access to Google Fonts during the build. Fonts are then self-hosted by Next.js. Deploy to a Node-compatible Next.js host; the API route needs a server runtime.
