# Design - Embeddable Widget & Lead-Capture Platform

## Problem
Customers create a widget and embed it with one script tag. Visitors submit forms from any origin.
We validate, protect, enrich, store, and show submissions in a dashboard.

## Data model
- tenants(id, email, api_key, created_at)
- widgets(id, tenant_id, type, title, description, fields JSONB, button_text, created_at)
- submissions(id, widget_id, tenant_id, payload JSONB, ip, country, city, created_at)

## API surface
Auth: x-api-key header on admin routes.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /api/tenants | no | signup, returns api_key |
| POST | /api/widgets | yes | create widget |
| GET | /api/widgets | yes | list own widgets |
| GET | /api/widgets/:id | yes | fetch one |
| PATCH | /api/widgets/:id | yes | update |
| DELETE | /api/widgets/:id | yes | delete |
| GET | /api/widgets/:id/snippet | yes | returns script tag |
| GET | /public/widgets/:id/config | no | cached config |
| GET | /public/widget.js | no | versioned bundle |
| POST | /public/submissions | no | CORS + rate-limit + validate + enrich |
| GET | /api/dashboard/submissions | yes | list submissions |
| GET | /api/dashboard/stats | yes | counts |

## Non-goal
No CDN, no domain, no real email. Customer site is local HTML on port 5500.