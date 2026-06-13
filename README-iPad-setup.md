# AI Command Center — iPad setup

This package gives you a personal iPad web app / PWA:

- 5-minute inactivity interactive wallpaper.
- Tap/click the screen to return to the dashboard.
- AI news + promo radar section.
- Daily agenda, to-do list, task notes, checkboxes.
- Scratch notes with local autosave.
- Future analytics connection cards for Shopify/social accounts.
- Optional Cloudflare Worker proxy for live news/RSS refreshes.

## Fastest real-app setup on iPad

A Safari Home Screen app needs to be opened from a web URL, not just a random local HTML file. The easiest free path is GitHub Pages.

1. Create a GitHub account if needed.
2. Create a new repo, for example `ai-command-center`.
3. Upload these files and folders:
   - `index.html`
   - `manifest.webmanifest`
   - `sw.js`
   - `icons/`
4. In the repo, open Settings → Pages.
5. Set source to deploy from the `main` branch and root folder.
6. Open the GitHub Pages URL in Safari on your iPad.
7. Tap Share → Add to Home Screen.
8. Turn on “Open as Web App” if iPadOS shows it, then tap Add.

Now it opens like a real app icon on your iPad.

## Live AI news setup

The dashboard works without a backend, but direct RSS/news fetching from a browser often gets blocked by CORS. For reliable live AI news, deploy the included `cloudflare-worker.js` as a free Cloudflare Worker.

1. Go to Cloudflare Workers.
2. Create a Worker.
3. Paste the contents of `cloudflare-worker.js`.
4. Deploy it.
5. Copy the Worker URL.
6. Open the AI Command Center app → Setup → News proxy URL.
7. Paste the Worker URL and save.

The app will refresh while it is open. For closed-app checking, use the hourly ChatGPT task that was created for you.

## Important security note for analytics

Do not put Shopify, TikTok, Instagram, YouTube, X, or Facebook access tokens directly inside this HTML file. Use a proper backend with OAuth for read-only analytics. The app includes placeholder cards so the UI is ready for that later.

## Backup

Use the Export button in Scratch Notes to download a JSON backup of your tasks, notes, and news items.
