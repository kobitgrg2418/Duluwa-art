@echo off
if not exist .venv call setup.bat
call .venv\Scripts\activate.bat
python manage.py migrate --noinput
python manage.py runserver 8000
