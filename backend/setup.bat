@echo off
REM Windows one-shot setup for the Duluwa Art backend
python -m venv .venv
call .venv\Scripts\activate.bat
pip install -r requirements.txt
if not exist .env copy .env.example .env
python manage.py migrate
python manage.py create_admin
python manage.py seed_duluwa
echo.
echo Setup done. Run start.bat to launch the server.
