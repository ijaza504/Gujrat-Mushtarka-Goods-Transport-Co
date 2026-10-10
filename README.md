# Gujrat Mushtarka Goods Transport Co. website

Plain HTML, CSS and JavaScript. No build step, no framework, no secrets. Files:

- `index.html`: all sections (Home, About, Services, Industries, Fleet, Routes, Quote form, FAQ, Contact)
- `style.css`, `script.js`: design and behaviour. Contact settings and form connection are at the top of `script.js`.
- `images/`: create this folder for your photos (see below)

## 1. Configuration still required

| Item | Where |
|---|---|
| Phone, WhatsApp, email, address, hours, map link | Done: header, Contact section and footer in `index.html` |
| Vehicle payloads, sizes | Fleet cards in `index.html`. Do not add until verified. |
| Real photos | `images/hero-truck.jpg`, `fans.jpg`, `pottery.jpg`, `warehouse.jpg` (the page shows them automatically once files exist; keep under 300 KB each, ideally 1200 px wide) |
| Year established, company story | About section |
| Form connection | Section 4 below |
| Canonical link | Commented line in `<head>`. Enable after you know your final site address. (Structured data is already enabled with your verified details.) |

Other photo ideas: container loading, household moving. Add `<figure class="slot">` blocks like the existing ones. Use only genuine photos as "our fleet"; the site says stock images are not our fleet.

## 2. Publish free on GitHub Pages

1. Create a free account at github.com.
2. Click **New repository**. Name it e.g. `gujrat-transport`. Set it **Public**. Create.
3. Click **uploading an existing file**, drag in `index.html`, `style.css`, `script.js` and the `images` folder, then **Commit changes**.
4. Go to **Settings > Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then Save.
5. After 1-2 minutes the site is live at `https://YOUR-USERNAME.github.io/gujrat-transport/`.
6. To update later: open a file on GitHub, click the pencil icon, edit, and commit.

## 3. Connect a custom domain

1. Buy a domain (e.g. from Namecheap, GoDaddy, or a Pakistani registrar).
2. In **Settings > Pages > Custom domain**, enter `www.yourdomain.com` and Save.
3. At your domain's DNS settings add:
   - `CNAME` record: host `www` pointing to `YOUR-USERNAME.github.io`
   - For the bare domain, four `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (check GitHub's current docs: "Managing a custom domain for GitHub Pages").
4. Wait for DNS (minutes to 24 hours), then tick **Enforce HTTPS**.
5. Uncomment the canonical link in `index.html` and set your domain.

## 4. Configure and test the booking form

Until `formEndpoint` is set, the form validates input but **does not claim success**. It shows the details and a Copy button so the customer can send them by WhatsApp or phone.

**Easiest option: Formspree (free tier, email delivery)**
1. Sign up at formspree.io, create a form, copy its endpoint (`https://formspree.io/f/xxxx`).
2. Paste it into `CONFIG.formEndpoint` in `script.js`. The endpoint is meant to be public; it holds no secret.
3. Enable spam protection in the Formspree dashboard. The form also has a hidden honeypot field.

**Google Sheets option:** create a Google Apps Script web app (Extensions > Apps Script in a sheet) with a `doPost` that appends the posted fields to the sheet, deploy as "Anyone" web app, and use its URL. Apps Script has browser (CORS) quirks; test carefully, and if the site shows an error even though rows arrive, use Formspree instead. Never put private keys or service-account credentials in `script.js`.

**Secure backend option:** any server that accepts a POST of form data. Keep credentials on the server only.

**Test it:**
1. With the endpoint empty: submit empty form (errors appear), then a valid one (you should see the "NOT been sent" notice and Copy button).
2. Set the endpoint, submit a real test. Confirm the message arrives in email/sheet with all fields.
3. Turn off internet and submit: you should see the error message, not success.
4. Submit with a past date and a bad phone number: both should be rejected.

## 5. Testing checklist

**Mobile (real phone, plus browser dev tools):**
- [ ] Menu button opens and closes, links jump to sections
- [ ] No sideways scrolling on any section
- [ ] Hero buttons are easy to tap
- [ ] Form fields use the right keyboard (phone number pad), form is usable
- [ ] Phone and WhatsApp links open the dialer/WhatsApp (after you add numbers)
- [ ] Photos load quickly on mobile data

**Desktop:**
- [ ] Layout looks right at 1920, 1366 and 1024 px widths
- [ ] Navigation, FAQ expanders and all anchor links work
- [ ] Tab key reaches every link and field, focus outline visible
- [ ] Map shows the right listing

**General:**
- [ ] No placeholder text in yellow remains (search for `[Add`)
- [ ] All photos have accurate alt text and no stock photo is called "our fleet"
- [ ] Page title and description look right in Google (Search Console > URL Inspection)
- [ ] Run Lighthouse in Chrome (Accessibility, SEO, Performance)
- [ ] Phone numbers, address and hours match the Google Maps listing
- [ ] Submit test forms on both Android and iPhone

## 6. Notes

- The site is one scrolling page with clean section links (`/#services`). This is good for speed on GitHub Pages. If you later want separate pages (e.g. `/services.html`), copy the header and footer into each file.
- No prices, capacities, delivery times or testimonials are included, on purpose.
- Fonts are system fonts, so there is nothing external to load.
