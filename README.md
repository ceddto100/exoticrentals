<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Exotic Rentals Monorepo

The project is now split into dedicated **frontend** and **backend** folders so the React UI and Express API can evolve independently and deploy cleanly to services like Render + MongoDB Atlas.

## Project layout
- `frontend/` – Vite + React client experience.
- `backend/` – Express API with MongoDB models, Google OAuth, and admin/fleet/customer/rental endpoints.

## Run locally
### Frontend
1. `cd frontend`
2. `npm install`
3. Create a `.env.local` (see `.env.example`) with `VITE_API_URL` pointing at your backend (defaults to `http://localhost:5000`). Add `GEMINI_API_KEY` only if you use Gemini-powered features.
4. `npm run dev`

### Backend
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in MongoDB + Google OAuth credentials.
4. `npm run dev`

### Env vars (summary)
**Frontend (`frontend/.env.local`, see `.env.example`)**
- `VITE_API_URL` – points the client at the backend (e.g., `http://localhost:5000`)
- `GEMINI_API_KEY` – only needed if you enable Gemini integrations

**Backend (`backend/.env`, see `.env.example`)**
- `PORT` – server port (default `5000`)
- `FRONTEND_URL` – comma-separated allowed origins for CORS (e.g., `http://localhost:3000,http://localhost:5173`)
- `MONGODB_URI`, `MONGODB_DB_NAME`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- `ALLOW_DEMO_AUTH` – optional helper for local testing without Google id tokens

The frontend consumes the backend at `VITE_API_URL`, and the backend exposes health at `/health` plus routes under `/auth`, `/vehicles`, `/schedules`, `/customers`, `/rental-history`, and `/admin`.
