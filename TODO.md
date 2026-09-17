# Aequus Archers — website TODO

Outstanding items for the new site. The site auto-deploys from GitHub via Cloudflare on push to `main`.

## Needs club input / Cloudflare access

- [ ] **Spond link** — set `BOOK_URL` in `src/consts.ts` (currently falls back to `/contact`). Every "Reserve / Join" button uses it.
- [x] **Make the contact form deliver** — delivers to the tawk.to ticket inbox `tickets@aequus-archers.p.tawk.email` (`CONTACT_TO` in `wrangler.json`), same place direct email to `contact@` lands via Cloudflare Email Routing. From `website@aequusarchers.co.uk`, Reply-To the enquirer.
- [ ] **Custom domain** — point Porkbun's nameservers at Cloudflare, then add `aequusarchers.co.uk` to the deployed Worker.
- [ ] **Field location** — add the exact address / parking / a map to the About page (`src/pages/about.astro`, `#location` section).

## Page content to write (currently placeholders)

- [ ] **Committee** — names, roles, short bios (`src/pages/committee.astro`).
- [ ] **Coaches** — names and qualifications (`src/pages/coaches.astro`).
- [ ] **Policies** — the safeguarding policy, privacy policy and club charter documents (`src/pages/policies.astro`; scaffolded with a slot for each).
- [ ] **Events calendar** — embed the Spond/Google calendar, or render from a data file like the sessions page (`src/pages/events.astro`).

## Already done (for reference)

- Homepage, Try archery / sessions (self-cleaning dates), About, FAQ, Contact, Thank-you, 404.
- Archery info page with real handicaps / classifications / badges content.
- Brand palette (red-led, cream, charcoal; blue accent), responsive nav, branded footer, favicon, local logo/hero images.
- Cloudflare-native contact form (email send + best-effort D1 logging, opt-in).
- Astro blog starter and placeholder assets removed.
