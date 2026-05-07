# Deployment Guide: MeritSync

Follow these steps to deploy MeritSync to production using free-tier services.

## 1. Supabase (Database & Auth)
1. Create a project at [supabase.com](https://supabase.com).
2. Run the `supabase.sql` file in the **SQL Editor**.
3. Go to **Settings > API** and copy your `Project URL` and `anon public` key.
4. Enable **LinkedIn** and **GitHub** providers in **Authentication > Providers**.

## 2. Python Microservice (Render)
1. Push the `services/scraper/` directory to a new GitHub repository.
2. Connect the repo to [Render.com](https://render.com).
3. Select **Web Service** and choose **Python**.
4. Set the following **Environment Variables**:
   - `GOOGLE_AI_API_KEY`: Your Gemini API key.
   - `SUPABASE_URL`: Your Supabase Project URL.
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (from API settings).
5. Render will automatically run `pip install` and `playwright install`.

## 3. Frontend App (Vercel)
1. Push the root project to a GitHub repository.
2. Connect the repo to [Vercel.com](https://vercel.com).
3. Set the following **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - `GOOGLE_AI_API_KEY`: Your Gemini API key.
4. Click **Deploy**.

## 4. Environment Checklist
| Key | Service | Purpose |
| :--- | :--- | :--- |
| `GOOGLE_AI_API_KEY` | Vercel & Render | Powers Gemini 1.5 Flash logic. |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | Frontend connection to DB. |
| `SUPABASE_SERVICE_ROLE_KEY` | Render | Admin access for scraper ingestion. |

## 5. Go-Live Checklist (Production Readiness)
- [ ] **Supabase RLS**: Verify that `match_scores` and `profiles` have active RLS policies.
- [ ] **Mumbai Region**: Ensure Vercel is set to `bom1` and Supabase is in `ap-south-1`.
- [ ] **AI Truthfulness**: Verify that the `GATEKEEPER_SYSTEM_PROMPT` in `lib/ai.ts` is active.
- [ ] **Social Ingest**: Ensure the Python service can reach the `/api/v1/jobs/social-ingest` endpoint with a valid session/key.
- [ ] **Audit Trail**: Confirm that `compliance_audit_logs` is correctly logging all AI overrides.
- [ ] **DPDP 2023**: Ensure the "Accept Terms" modal is forced for all new Indian-region users.
