# Deployment Guide

This project consists of:
- **Frontend**: Next.js application (deployed on Vercel)
- **Backend**: Django REST API (deployed on Render, Railway, or similar)

## Frontend Deployment (Vercel)

### 1. Environment Variables
Set these in Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

### 2. Deploy to Vercel

Option A: Using Vercel CLI
```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import from GitHub
4. Select the `frontend` folder (or configure root directory)
5. Add environment variables
6. Deploy

### 3. Vercel Configuration
The `vercel.json` file is already configured with:
- Build command: `npm run build`
- Output directory: `.next`
- Framework: Next.js

## Backend Deployment Options

### Option 1: Render (Recommended)

1. Create a Render account at [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new "Web Service"
4. Select the `backend` folder
5. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 4`
   - **Python Version**: 3.13
6. Add environment variables (see below)
7. Deploy

### Option 2: Railway

1. Create a Railway account at [railway.app](https://railway.app)
2. Create a new project
3. Add a "Django" service
4. Connect to GitHub
5. Configure environment variables
6. Deploy

### Option 3: Heroku

1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Push code: `git push heroku main`
5. Configure: `heroku config:set DJANGO_SECRET_KEY=your-key`

## Backend Environment Variables

Required for production:

```bash
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=yourdomain.com,vercel-app-url.vercel.app
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-frontend.vercel.app
DJANGO_SSL_REDIRECT=True
```

Optional (for PostgreSQL):

```bash
DATABASE_URL=postgresql://user:password@host:port/dbname
```

## Database Migration

After deploying the backend, run migrations:

```bash
# On Render/Railway, use their console or SSH
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_collections
python manage.py seed_artworks
```

## Post-Deployment Steps

1. **Update Frontend API URL**:
   - Set `NEXT_PUBLIC_API_URL` to your deployed backend URL
   - Redeploy frontend

2. **Configure Site Settings**:
   - Log into Django admin at `https://your-backend.com/admin`
   - Update site settings (wordmark, location, etc.)
   - Add hero layers in Home page section

3. **Test**:
   - Verify frontend connects to backend
   - Test API endpoints
   - Check image loading
   - Test currency display

## Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Troubleshooting

### CORS Errors
- Ensure `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Check backend settings in `config/settings.py`

### Database Issues
- For production, use PostgreSQL instead of SQLite
- Add `DATABASE_URL` environment variable
- Run migrations after deployment

### Images Not Loading
- Backend: Upload artwork images through Django admin
- Frontend: Ensure API returns valid image URLs
- Check that local images are in `public/artworks/` for development

### Currency Display
- Clear browser localStorage if currency shows wrong
- Check store default is set to 'NPR' in `store/useStore.ts`
