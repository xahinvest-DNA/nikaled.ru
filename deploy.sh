#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/var/www/nikaled}"
BRANCH="${BRANCH:-main}"
PM2_APP="${PM2_APP:-nikaled}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env.local}"
FORCE_INSTALL="${FORCE_INSTALL:-0}"
HEALTH_RETRIES="${HEALTH_RETRIES:-10}"
HEALTH_DELAY="${HEALTH_DELAY:-3}"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

require_env_var() {
  local name="$1"
  if grep -Eq "^${name}=.+" "$ENV_FILE"; then
    return 0
  fi
  return 1
}

validate_lead_env() {
  if [[ ! -f "$ENV_FILE" ]]; then
    log "Error: env file '$ENV_FILE' not found."
    return 1
  fi

  local has_telegram="0"
  local has_relay="0"
  local has_email="0"

  if require_env_var "TELEGRAM_BOT_TOKEN" && { require_env_var "TELEGRAM_CHAT_IDS" || require_env_var "TELEGRAM_CHAT_ID"; }; then
    has_telegram="1"
  fi

  if require_env_var "TELEGRAM_RELAY_URL" && require_env_var "TELEGRAM_RELAY_TOKEN"; then
    has_relay="1"
  fi

  if require_env_var "SMTP_HOST" && require_env_var "SMTP_USER" && require_env_var "SMTP_PASS" && require_env_var "SMTP_FROM" && require_env_var "SMTP_TO"; then
    has_email="1"
  fi

  if [[ "$has_telegram" == "0" && "$has_relay" == "0" && "$has_email" == "0" ]]; then
    log "Error: no lead transport configured in '$ENV_FILE'. Fill TELEGRAM_*, TELEGRAM_RELAY_* or SMTP_* variables before deploy."
    return 1
  fi

  log "Lead env check passed: telegram=$has_telegram relay=$has_relay email=$has_email"
}

health_check() {
  local attempt=1

  while (( attempt <= HEALTH_RETRIES )); do
    if curl -fsS -I "$HEALTH_URL" >/dev/null; then
      log "Health check passed on attempt $attempt/$HEALTH_RETRIES."
      return 0
    fi

    log "Health check attempt $attempt/$HEALTH_RETRIES failed. Waiting ${HEALTH_DELAY}s..."
    sleep "$HEALTH_DELAY"
    ((attempt++))
  done

  log "Health check failed after $HEALTH_RETRIES attempts."
  return 1
}

if [[ ! -d "$APP_DIR/.git" ]]; then
  echo "Error: APP_DIR '$APP_DIR' is not a git repository" >&2
  exit 1
fi

cd "$APP_DIR"

log "Deploy started in $APP_DIR (branch: $BRANCH)"
validate_lead_env
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
if ! health_check; then
  log "PM2 status:"
  pm2 status || true
  log "Recent PM2 logs:"
  pm2 logs "$PM2_APP" --lines 40 --nostream || true
  exit 1
fi

log "Deploy completed successfully."
