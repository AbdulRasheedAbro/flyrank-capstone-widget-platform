# Evidence - one proof per Requirements box

## Widget management
- Authenticated CRUD (401 without key; 201 with key): curl transcript here
- Multi-tenant isolation: Tenant A GET /api/widgets returns only A rows
- Snippet generated per widget: curl output here

## Widget delivery
- Config cache: curl -I .../public/widgets/:id/config -> Cache-Control: public, max-age=60
- Versioned bundle: curl -I .../public/widget.js -> Cache-Control: public, max-age=31536000, immutable
- Renders on second origin: http://localhost:5500

## Public submission API
- CORS preflight: curl -i -X OPTIONS ...
- Malformed -> 400; oversized -> 413
- Valid submission stored: 201 output + psql SELECT row

## Abuse protection
- Burst -> 429, then normal 201
- Honeypot blocks spam: POST with _hp -> 400

## Enrichment & safe side-effects
- Provider A down -> B used: GEO_MOCK_MODE=a_down -> 201 enriched:true provider:B
- All down -> stored anyway: GEO_MOCK_MODE=all_down -> 201 enriched:false
- Side-effect failure does not block main path

## Documentation
- README has architecture + setup
- .env.example present