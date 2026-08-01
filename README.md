# FINLIT — Gamified Financial Literacy Platform

Learn budgeting, investing, and credit through whatever already holds your attention — gaming, music, fashion, or sports. Same financial concepts, taught through the lens you actually enjoy.

## What it does

FINLIT teaches financial literacy through four themed domains. Pick one and every explanation, quiz, and analogy gets built around it: investing explained through sports strategy, credit explained through a fashion drop. Explanations and scenario quizzes are AI-generated (Groq), so content doesn't go stale, and a gamification layer — XP, levels, streaks, badges — gives people a reason to come back.

Each topic runs through three quiz levels: understanding (multiple choice), application (calculation questions, with a built-in calculator), and a boss fight (open-ended, AI-graded and star-rated). You need 70% to pass and unlock the next topic.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS, Framer Motion, React Router |
| Backend | Node.js, Express |
| Database / Auth | Supabase (Postgres + Auth, row-level security) |
| AI | Groq (Llama 3.3 70B) for explanations, quizzes, and a chat mentor |
| Extras | Giphy for quiz feedback, Sentry for error reporting (optional) |

## Running it locally

You'll need Node 16+, a free Supabase project, and API keys for Groq and Giphy.

```
cd backend && npm install && npm run dev     # localhost:3001
cd frontend && npm install && npm start      # localhost:3000
```

Environment variables go in `backend/.env` and `frontend/.env`; table creation and access-grant SQL live in `supabase/migrations/`.

## Where it stands

The core loop — onboarding, quizzing, earning badges, unlocking the next topic — works end to end, with auto-logout after 3 hours idle and a domain-aware 404 page. A few things aren't wired up yet: boss-defeat and score-threshold badges need extra tracking, and the richer per-domain badge sets are mostly display-only beyond the milestone badges. No mobile app or offline mode planned for now.

MIT licensed.
