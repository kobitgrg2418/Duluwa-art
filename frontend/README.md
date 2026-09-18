# Duluwa Art Gallery - Next.js Frontend
# This file contains the Next.js project structure for the Duluwa Art Gallery

# Project Structure:
# frontend/
# ├── src/
# │   ├── app/                    # Next.js App Router pages
# │   │   ├── page.tsx           # Home page
# │   │   ├── gallery/           # Gallery page
# │   │   ├── collections/       # Collections page
# │   │   ├── commission/        # Commission page
# │   │   ├── login/             # Login page
# │   │   ├── register/          # Register page
# │   │   ├── profile/           # User profile
# │   │   ├── cart/              # Shopping cart
# │   │   ├── checkout/          # Checkout page
# │   │   └── admin/             # Admin dashboard
# │   ├── components/            # React components
# │   │   ├── ui/               # shadcn/ui style components
# │   │   ├── header.tsx
# │   │   ├── footer.tsx
# │   │   └── ... (feature components)
# │   ├── lib/                   # Utility functions and API client
# │   ├── hooks/                 # Custom React hooks
# │   └── types/                 # TypeScript types
# ├── public/                    # Static assets
# ├── package.json
# ├── next.config.js
# ├── tailwind.config.ts
# ├── tsconfig.json
# └── .env.example

# To set up the frontend:
# 1. cd frontend
# 2. npm install
# 3. cp .env.example .env.local
# 4. Edit .env.local with your API URL
# 5. npm run dev

# The frontend will be available at http://localhost:3000

# UI Libraries Used:
# - shadcn/ui (Radix UI + Tailwind CSS)
# - lucide-react (Icons)
# - sonner (Toasts)
# - framer-motion (Animations)
# - react-hook-form + zod (Forms & Validation)
# - recharts (Charts)
# - clsx + tailwind-merge (Utilities)