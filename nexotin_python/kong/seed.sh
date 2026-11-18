#!/bin/sh
# Seeds Kong with the nexotin gateway config. Idempotent: POSTs that fail
# because the entity already exists (409) are ignored.
set -e

ADMIN="http://kong:8001"

echo "Waiting for Kong admin API..."
until curl -sf "$ADMIN/status" >/dev/null 2>&1; do sleep 1; done

echo "Seeding service: nexotin-api"
curl -s -o /dev/null -X POST "$ADMIN/services" \
  -H 'Content-Type: application/json' \
  -d '{"name":"nexotin-api","url":"http://nexotin-api:8000"}' || true

echo "Seeding route: auth-route -> /api/auth"
curl -s -o /dev/null -X POST "$ADMIN/services/nexotin-api/routes" \
  -H 'Content-Type: application/json' \
  -d '{"name":"auth-route","paths":["/api/auth"],"strip_path":false,"preserve_host":false}' || true

echo "Seeding route: vendors-route -> /api/vendors"
curl -s -o /dev/null -X POST "$ADMIN/services/nexotin-api/routes" \
  -H 'Content-Type: application/json' \
  -d '{"name":"vendors-route","paths":["/api/vendors"],"strip_path":false,"preserve_host":false}' || true

echo "Seeding route: marketplace-route -> /api/marketplace"
curl -s -o /dev/null -X POST "$ADMIN/services/nexotin-api/routes" \
  -H 'Content-Type: application/json' \
  -d '{"name":"marketplace-route","paths":["/api/marketplace"],"strip_path":false,"preserve_host":false}' || true

echo "Kong seed done."
