#!/usr/bin/env bash
# One-shot setup: venv, dependencies, database, superuser (admin@123 / admin123), 18 paintings + content.
set -e
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
[ -f .env ] || cp .env.example .env
python manage.py migrate
python manage.py create_admin
python manage.py seed_duluwa
echo
echo "Done. Start the server with:  source .venv/bin/activate && python manage.py runserver 8000"
echo "CMS: http://localhost:8000/admin/   (admin@123 / admin123)"
