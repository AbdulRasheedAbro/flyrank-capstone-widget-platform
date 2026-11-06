# AI Usage Log

## Where AI helped
- Scaffolding Express routes, Zod schema, SQL schema, geo fallback chain.

## Where AI was wrong
- Suggested app.use(cors()) globally. Narrowed to /public only.
- Suggested max-age=0 on config. Changed to max-age=60.

## What I changed
- 2500ms timeout per geo provider so a hung provider falls over fast.
- Split delivery and public routes so cors() ordering is deterministic.