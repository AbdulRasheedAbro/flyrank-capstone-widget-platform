# FlyRank Capstone - Embeddable Widget & Lead-Capture Platform

Customers create a widget, paste one script line, submissions flow back validated,
spam-filtered, geo-enriched, and dashboarded.

## Setup
    docker compose up -d
    npm install
    npm run seed
    npm start

## Customer site (second origin)
    cd customer-site
    python -m http.server 5500

Open http://localhost:5500

## API
Admin (x-api-key: demo-api-key-12345):
- POST /api/tenants
- POST/GET/PATCH/DELETE /api/widgets
- GET /api/widgets/:id/snippet
- GET /api/dashboard/submissions
- GET /api/dashboard/stats

Public:
- GET /public/widgets/:id/config  (max-age=60)
- GET /public/widget.js           (immutable)
- POST /public/submissions        (CORS, rate-limited)

## Limitations
- Email faked (console log)
- Geo fallback proven via GEO_MOCK_MODE
- No real CDN; customer site is local HTML on port 5500