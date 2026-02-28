# SEO checklist when you launch

When you deploy the app to a real domain, do the following so search and social use the right URLs and image.

## 1. Replace placeholder URL

Search the project for **`your-domain.com`** and replace with your real domain (e.g. `notforgotten.org`).

**Files to update:**
- **index.html** — `og:url`, `og:image`, `twitter:image`, `canonical`, and the JSON-LD `url`
- **public/robots.txt** — `Sitemap:` line
- **public/sitemap.xml** — `<loc>` URL

## 2. Add a social / OG image (optional but recommended)

- Create an image (e.g. 1200×630 px) that represents your app (logo + tagline).
- Save it as **public/og-image.png** (or .jpg).
- In **index.html**, set `og:image` and `twitter:image` to your domain + `/og-image.png`.

If you skip this, remove or comment out the `og:image` and `twitter:image` meta tags so shares don’t point to a missing image.

## 3. After deploy

- Open [Google Search Console](https://search.google.com/search-console) and add your site; submit **sitemap.xml** (e.g. `https://your-domain.com/sitemap.xml`).
- Test sharing: use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and [Twitter Card Validator](https://cards-dev.twitter.com/validator) with your live URL.

## What’s already in place

- **Meta description** and **title** in `index.html` (and per-route titles in the app).
- **Open Graph** and **Twitter Card** meta tags for link previews.
- **Canonical URL** to avoid duplicate-content issues.
- **JSON-LD** `WebApplication` schema for search engines.
- **robots.txt** allowing crawlers and pointing to the sitemap.
- **sitemap.xml** with your main URL (hash routes are client-side; the single entry is correct for this app).
- **Dynamic titles** (and meta description) when users move between pages in the app.
