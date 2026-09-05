# ECCV 2026 Europe Trip Guide

Traditional Chinese static travel guide for the 2026 Malmö、Copenhagen、Beauvais and Paris trip.

## Website source

The deployable website lives in `site/`:

| Area | Source |
| --- | --- |
| Overview and daily itineraries | `site/index.html`, `site/days/` |
| Places, bookings, packing, and travel tools | `site/places.html`, `site/logistics.html`, `site/packing.html`, `site/tools.html` |
| Shared layout and page rendering | `site/css/`, `site/js/core.js`, `site/js/app.js`, `site/js/pages/` |
| Trip data and local-time schedule | `site/js/data.js`, `site/js/journey.js` |
| Essentials, private tickets, and offline readiness | `site/js/essentials.js`, `site/js/ticket-store.js`, `site/js/tickets.js`, `site/js/offline.js` |

Original PDFs in `pdf/` and encrypted files in `site/assets/tickets/*.enc` stay local and are excluded from Git. Public builds include ticket descriptions and import checksums. Import your own `.enc` files through the Logistics page on each device; the app stores them locally and asks for your password when showing a ticket.

## Local preview

From the repository root:

```bash
python3 -m http.server 8080 --directory site
```

Then open <http://localhost:8080>. Run `npm test` for itinerary timing and privacy checks. With the server running, `npm run test:ui` checks phone and desktop layouts, navigation, imported-ticket storage, offline pages, and restored user state.

After changing site files, run `node scripts/sync-version.cjs YYYYMMDD-NN` with a new version suffix and update `trip.md`. The script synchronizes HTML asset versions, the service worker, and the homepage marker. Re-encrypting tickets with `TICKET_PASSWORD` also updates the import checksums; devices need the newly encrypted files after that change.

## GitHub Pages

The workflow at `.github/workflows/deploy-pages.yml` deploys the `site/` directory whenever `main` is updated. In the repository settings, set **Pages → Source** to **GitHub Actions**.
