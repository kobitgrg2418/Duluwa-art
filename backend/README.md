# Duluwa Art Gallery - Django Backend
# This file contains the Django project structure for the Duluwa Art Gallery

# Project Structure:
# backend/
# ├── duluwa_backend/          # Django project settings
# │   ├── settings.py
# │   ├── urls.py
# │   ├── wsgi.py
# │   └── asgi.py
# ├── core/                    # Core app (admin views, media, upload)
# ├── users/                   # Users app (auth, profiles)
# ├── artworks/                # Artworks app (artworks, process, testimonials)
# ├── collections/             # Collections app
# ├── orders/                  # Orders app (orders, commissions)
# ├── manage.py
# ├── requirements.txt
# └── .env.example

# To set up the backend:
# 1. cd backend
# 2. python -m venv venv
# 3. source venv/bin/activate (or venv\Scripts\activate on Windows)
# 4. pip install -r requirements.txt
# 5. cp .env.example .env
# 6. Edit .env with your database and email settings
# 7. python manage.py migrate
# 8. python manage.py createsuperuser
# 9. python manage.py runserver

# The API will be available at http://localhost:8000/api/