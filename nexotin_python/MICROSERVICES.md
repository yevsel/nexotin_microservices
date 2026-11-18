# Microservices Plan — Nexotin

Status: planned, not started.

## The decision

Split into **3 services**, maximum allowed in this phase.

1. **Auth**
2. **Vendors**
3. **Marketplace**

## Why

The current `nexotin_python` backend mixes these concerns in one app.

The split follows the real seams in the old code:

- Vendors talk to products, videos, orders, and analytics.
- Marketplace talks to catalog, orders, notifications, buyers.
- Auth is identity and shared by everyone.

## Rough boundaries

| Service | Owns | Notes |
|---|---|---|
| Auth | accounts, tokens, passwords, verification, subscriptions, expo tokens | shared upstream |
| Vendors | vendor accounts, packages, products, videos, orders, verification, analytics | biggest cluster |
| Marketplace | buyers, catalog, search, orders, notifications, media | buyer-side commerce |

## Known wrinkle

Buyers and vendors are both "users" in the old codebase, so Auth owning both is slightly awkward. In a cleaner version, buyer auth lives in Marketplace and vendor auth lives in Vendors.

## Next steps

1. Carve Vendors out first (most coupling).
2. Move notifications behind API calls to the relevant service.
3. Move shared data store per service or keep Postgres single-DB with logical separation.

## Not started yet

This is a plan only. No code changes made from this doc yet.
