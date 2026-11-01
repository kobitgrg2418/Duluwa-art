#!/usr/bin/env bash
# Starts backend (http://localhost:8000) and frontend (http://localhost:3000). First run installs everything.
set -e
cd "$(dirname "$0")"
[ -d backend/.venv ] || (cd backend && ./setup.sh)
(cd backend && source .venv/bin/activate && python manage.py runserver 8000) &
BACK=$!
trap "kill $BACK 2>/dev/null" EXIT
cd frontend
[ -d node_modules ] || npm install
npm run dev
