# Local Development Guide: MeritSync

This guide covers how to run the full MeritSync suite locally on your machine.

## 1. Prerequisites
- Node.js 18+
- Python 3.10+
- A Supabase Project (for Database & Auth)

## 2. Environment Setup
Create a `.env.local` in the root directory:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GOOGLE_AI_API_KEY=your_gemini_api_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Create a `.env` in `services/scraper/`:
```bash
GOOGLE_AI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 3. Running the Application

### Frontend (Next.js)
```bash
npm install
npm run dev
```

### Scraper (Python)
```bash
cd services/scraper
pip install -r requirements.txt
playwright install
python main.py
```

## 4. Database Schema
Ensure you have run the `supabase.sql` file in your Supabase SQL editor to create the necessary tables and AI logic.
