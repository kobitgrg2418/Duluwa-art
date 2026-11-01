@echo off
cd /d %~dp0
if not exist backend\.venv ( cd backend && call setup.bat && cd .. )
start "Duluwa backend" cmd /k "cd backend && .venv\Scripts\activate && python manage.py runserver 8000"
cd frontend
if not exist node_modules call npm install
npm run dev
