#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/var/www/nikaled}"
BRANCH="${BRANCH:-main}"
PM2_APP="${PM2_APP:-nikaled}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000}"
FORCE_INSTALL="${FORCE_INSTALL:-0}"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

if [[ ! -d "$APP_DIR/.git" ]]; then
  echo "Error: APP_DIR '$APP_DIR' is not a git repository" >&2
  exit 1
fi

cd "$APP_DIR"

log "Deploy started in $APP_DIR (branch: $BRANCH)"
log "Fetching latest code..."
git fetch origin "$BRANCH"
git checkout "$BRANCH"
PREV_HEAD="$(git rev-parse HEAD)"
git pull --ff-only origin "$BRANCH"
NEW_HEAD="$(git rev-parse HEAD)"

NEEDS_INSTALL="0"
if [[ "$FORCE_INSTALL" == "1" ]]; then
  NEEDS_INSTALL="1"
  log "FORCE_INSTALL=1, dependency install is required."
elif ! git diff --name-only "$PREV_HEAD" "$NEW_HEAD" | grep -Eq '^(package\.json|package-lock\.json)$'; then
  log "Dependencies unchanged, skipping npm ci."
else
  NEEDS_INSTALL="1"
  log "Dependency files changed, install is required."
fi

if [[ "$NEEDS_INSTALL" == "1" ]]; then
  log "Installing dependencies with npm ci..."
  if ! npm ci; then
    log "npm ci failed (often OOM on small VPS). Trying npm install --omit=dev..."
    npm install --omit=dev
  fi
fi

log "Building app..."
npm run build

if pm2 describe "$PM2_APP" >/dev/null 2>&1; then
  log "Restarting PM2 app '$PM2_APP'..."
  pm2 restart "$PM2_APP" --update-env
else
  log "PM2 app '$PM2_APP' not found, starting..."
  pm2 start npm --name "$PM2_APP" -- start
fi

pm2 save >/dev/null

log "Health check: $HEALTH_URL"
curl -fsS -I "$HEALTH_URL" >/dev/null

log "Deploy completed successfully."
