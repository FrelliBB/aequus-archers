# Aequus Archers

Website for Aequus Archers — a friendly, volunteer-run target archery club in Milford, Derbyshire. Built with [Astro](https://astro.build) and deployed on Cloudflare Pages.

## Commands

All run from the project root:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Start local dev server at `localhost:4321`   |
| `npm run build`   | Build the production site to `./dist/`       |
| `npm run preview` | Build, then preview it locally in workerd    |
| `npm run deploy`  | Deploy to Cloudflare                         |

## Editing content

Club members edit sessions, events, team profiles and policies through [Pages CMS](https://app.pagescms.org), which commits to this repo and triggers a deploy. The editing screens are defined in `.pages.yml`. Invite editors by email from Pages CMS → Collaborators; they do not need a GitHub account.

The data lives in YAML files in `src/data/`:

- **Session dates** — `tasters.yml` and `courses.yml`. Past dates hide automatically and the "next session" banners update.
- **Events** — `events.yml`. Past events hide automatically.
- **Team** — `team.yml`. The name line is hidden until set. A person with a full profile (`bio`) is shown at the top of the page.
- **Policies** — `policies.yml`. Upload the PDF in Pages CMS (it is stored in `public/policies/`). Until a document is set, the page says it is coming soon.

The schemas in `src/content.config.ts` check every file at build time. If a value is wrong (for example an impossible date), the build fails, Cloudflare does not deploy it, and the live site stays on the last good version.

- **Header / footer** — `src/components/Header.astro`, `src/components/Footer.astro`.
- **Theme colours and fonts** — brand tokens are defined at the top of `src/styles/global.css` (`--pine`, `--coral`, `--butter`, `--paper`, etc.). Change them once and the whole site follows. Fonts are Fraunces (headings) and Figtree (body), self-hosted through Fontsource.
- **Layouts** — `src/layouts/Base.astro` (head, header, footer) and `src/layouts/Page.astro` (standard content page with title and intro).
- **Images** — `src/assets/images/` (`logo.png`, `hero.jpg`, `community/`, `team/`). Astro resizes them and serves WebP at build time. To replace a photo, drop the new file in with the same filename.

## TODO (needs club input)

- Set `BOOK_URL` in `src/consts.ts` to your Spond registration/booking link (currently points to the contact page).
- Wire up the contact form (Cloudflare-native — see "Contact form" below).
- Fill in the placeholder pages: committee, coaches, policies (documents), events calendar.
- Add the field's exact address / map / parking to `src/pages/about.astro`.

## Contact form (Cloudflare email)

The contact form posts to `src/pages/api/contact.ts`, which sends the message through Cloudflare's own email binding — no third-party service. To turn it on:

1. In the Cloudflare dashboard, enable **Email Routing** for `aequusarchers.co.uk`.
2. Add and **verify** the destination inbox where enquiries should land (e.g. a club Gmail or a forwarding address).
3. In `wrangler.json`, set `vars.CONTACT_TO` to that verified address. `CONTACT_FROM` is `website@aequusarchers.co.uk` (any address on your domain works as the sender; it's just the "from" on the notification email). The `send_email` binding has no `destination_address`, so it can send to any verified destination — optionally add `"destination_address": "<that address>"` to lock it to one.
4. Deploy. Submissions arrive in that inbox with the sender's address as Reply-To, so you can reply directly. On success the visitor is sent to `/thank-you`.

### Keeping a log (D1)

The contact endpoint will also save each submission to a Cloudflare D1 database, so you keep a record even if an email fails. This is **off by default** (no binding) so the site deploys cleanly; the form works fine without it. To switch it on:

1. Create the database: `npx wrangler d1 create aequus-contact`
2. Add the binding to `wrangler.json`, using the `database_id` from step 1:

   ```jsonc
   "d1_databases": [
     {
       "binding": "DB",
       "database_name": "aequus-contact",
       "database_id": "<id from step 1>"
     }
   ]
   ```

3. Apply the schema: `npx wrangler d1 execute aequus-contact --remote --file=./schema.sql`
4. Deploy. (The endpoint already writes to `DB`; it simply starts logging once the binding exists.)

View recent submissions any time:

```bash
npx wrangler d1 execute aequus-contact --remote \
  --command "SELECT created_at, name, email, message FROM contact_messages ORDER BY created_at DESC LIMIT 20"
```
