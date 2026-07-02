# Griffin's Tree Service — Website Redesign Concept

A single-page redesign concept for **Griffin's Tree Service, LLC** — a licensed & insured,
family-run arborist based in St. Amant, LA, serving Ascension, Livingston, and Baton Rouge
parishes since 2006.

This is an **unsolicited concept pitch** — a "here's what your site could look like" demo,
not the business's official website.

## Why a redesign?

The business currently has **no real website** — its only web presence is a Facebook page and
scattered directory listings (Yelp, BBB, Yahoo Local). That means:

- **No home base.** Customers searching "tree removal St. Amant" find a patchwork of profiles,
  not a professional site that closes the sale.
- **No self-serve estimate.** Every lead has to call; there's no online way to request a quote
  with address, job type, and details.
- **Credentials buried.** Being licensed, insured, BBB A+, and in business since 2006 are strong
  trust signals that never get shown off.
- **Photos locked in Facebook.** Real job photos exist but aren't presented anywhere as a portfolio.

This concept fixes all of that: a fast, mobile-first, single-page site with a clear services
breakdown, trust-forward "why us" section, a simple process explainer, a work gallery, real
reviews, and a **"Request a Free Estimate"** form plus one-tap click-to-call.

## Design direction

Rugged, professional arborist: deep pine green + bark browns + a safety-orange accent, strong
condensed display type (Oswald) over a clean humanist body (Source Sans 3). Editorial, varied
section layouts — alternating image/text service rows, a dark feature spread, a numbered process
timeline, a masonry work gallery — rather than a grid of generic icon cards. Polished, tasteful
motion throughout (shrink-on-scroll nav, animated underlines, scroll reveals), all respecting
`prefers-reduced-motion`.

## How to view

- **Locally:** double-click `index.html` (no build step, no dependencies).
- It's fully static — `index.html` + `styles.css` + `script.js` + `assets/`.

## Real photos

Griffin's real job photos live on Facebook and Yelp, which block automated download. The site
ships with tasteful on-brand placeholders and will **automatically swap in real photos** the
moment they're dropped into `assets/photos/` — see `assets/photos/DROP-PHOTOS-HERE.md` for the
exact filenames.

## SEO / base URL

The site includes on-page SEO: a unique `<title>` + meta description, `LocalBusiness`
JSON-LD structured data (real name, phone, address, hours, service area), a canonical link,
complete Open Graph + Twitter Card tags, plus `robots.txt` and `sitemap.xml` at the repo root.

Because the final domain isn't known yet, every absolute URL uses the literal placeholder
`https://REPLACE-WITH-DOMAIN.com/` — in `index.html` (canonical, `og:url`, `og:image`,
`twitter:image`, and the JSON-LD `url`/`image`), `robots.txt`, and `sitemap.xml`. **At deploy,
do a single find-and-replace of `https://REPLACE-WITH-DOMAIN.com/` with the real domain** across
those files.

## Notes on data

Business name, address, phone, license #, ratings, service area, and service list are taken from
public sources (BBB, Yelp, Yahoo Local, the business's Facebook page). Business hours differ
slightly between sources and are marked with a `TODO` to confirm with the owner. Review wording is
representative pending the owner's sign-off on exact quotes/authors.
