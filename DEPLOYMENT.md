# Deployment Guide: MeritSync

Follow these steps to deploy MeritSync to production using free-tier services.

## 1. Supabase (Database & Auth)
1. Create a project at [supabase.com](https://supabase.com).
2. **IMPORTANT**: Select **Mumbai (ap-south-1)** as the region.
3. Run the `supabase.sql` file in the **SQL Editor**.
4. Go to **Settings > API** and copy your `Project URL` and `anon public` key.
5. Enable **LinkedIn** and **GitHub** providers in **Authentication > Providers**.

## 2. Python Microservice (Render)
1. Push the `services/scraper/` directory to a new GitHub repository.
2. Connect the repo to [Render.com](https://render.com).
3. Select **Web Service** and choose **Python**.
4. Set the following **Environment Variables**:
   - `GOOGLE_AI_API_KEY`: Your Gemini API key.
   - `SUPABASE_URL`: Your Supabase Project URL.
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (from API settings).
5. Render will automatically run `pip install` and `playwright install`.

## 3. Frontend App (Netlify)
1. Push the root project to your GitHub repository.
2. Connect the repo to [Netlify](https://app.netlify.com).
3. Netlify will detect the `netlify.toml` and Next.js framework automatically.
4. Set the following **Environment Variables** in **Site Settings > Environment variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
   - `GOOGLE_AI_API_KEY`: Your Gemini API key.
5. Click **Deploy**.

## 4. Environment Checklist
| Key | Service | Purpose |
| :--- | :--- | :--- |
| `GOOGLE_AI_API_KEY` | Netlify & Render | Powers Gemini 1.5 Flash logic. |
| `NEXT_PUBLIC_SUPABASE_URL` | Netlify | Frontend connection to DB. |
| `SUPABASE_SERVICE_ROLE_KEY` | Render | Admin access for scraper ingestion. |

## 5. Go-Live Checklist (Production Readiness)
- [ ] **Supabase RLS**: Verify that `match_scores` and `profiles` have active RLS policies.
- [ ] **Mumbai Region**: Ensure Supabase is in `ap-south-1` and Netlify functions are in `ap-south-1`.
- [ ] **AI Truthfulness**: Verify that the `GATEKEEPER_SYSTEM_PROMPT` in `lib/ai.ts` is active.
- [ ] **Social Ingest**: Ensure the Python service can reach the `/api/v1/jobs/social-ingest` endpoint with a valid session/key.
- [ ] **Audit Trail**: Confirm that `compliance_audit_logs` is correctly logging all AI overrides.
- [ ] **DPDP 2023**: Ensure the "Accept Terms" modal is forced for all new Indian-region users.
