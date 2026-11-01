#!/usr/bin/env bash
cd "$(dirname "$0")"
[ -d .venv ] || ./setup.sh
source .venv/bin/activate
python manage.py migrate --noinput >/dev/null
exec python manage.py runserver 8000
