# FINLIT — AI-Powered Financial Literacy Platform

> Personalized finance education through interest-based analogies. Learn budgeting through gaming, investing through sports, or credit through fashion — whatever clicks for you.

## Overview

FINLIT makes financial literacy accessible by meeting learners where they are. Instead of dry textbook explanations, every concept is taught using analogies drawn from the user's own interests. A gamer learns about compound interest through XP multipliers. A fashion lover understands diversification through capsule wardrobes.

The platform uses Hugging Face's Mistral-7B model to generate fresh, personalized explanations on demand, a 3-level quiz system with GIF feedback, and a gamification layer (XP, levels, streaks, badges) to keep learners engaged — all persisted to Supabase.

## Features

- **11 interest domains** — Gaming, Music, Sports, Fashion, CSE, Writing, Fitness, Dance, Travel, Food, Film
- **AI-generated explanations** — Hugging Face Mistral-7B creates unique analogies per topic + interest combination
- **3-level quiz system** — Understanding → Application → Boss Fight, with Giphy-powered GIF feedback
- **Gamification** — XP, 10 levels, daily streak tracking, 6 unlockable badges (persisted to Supabase)
- **Supabase backend** — Auth (email/password), user profiles, progress tracking, quiz results
- **Cosmic onboarding** — 5-step flow that personalizes the entire experience
- **Floating AI mentor** — Contextual chatbot available throughout the learning flow

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Tailwind CSS, Framer Motion, React Router |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL + Auth) |
| AI | Hugging Face Inference API (Mistral-7B-Instruct) |
| Media | Giphy API |
| Animations | canvas-confetti, Framer Motion |

## Project Structure

```
FINLIT/
├── backend/
│   ├── config/
│   │   ├── interestDomains.js    # 11 interest domains + 30+ financial topics
│   │   └── supabase.js           # Supabase admin client (service role)
│   ├── routes/
│   │   └── auth.js               # Signup, login, logout, token validation
│   ├── services/
│   │   ├── huggingfaceService.js # AI explanation + quiz generation
│   │   └── giphyService.js       # GIF fetching for quiz feedback
│   ├── server.js                 # Express server + all API endpoints
│   └── test-supabase.js          # Connection health check script
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── dashboard/        # BentoDashboard, TopicSelector
    │   │   ├── learning/         # ExplanationDisplay, JargonFlashcard
    │   │   ├── mentor/           # FloatingMentor chatbot
    │   │   ├── onboarding/       # InterestSelector
    │   │   ├── quiz/             # NeoQuizEnvironment, AnimatedFeedback, QuizCard
    │   │   └── shared/           # Button, LevelUpModal, LoadingAnimation, XPPopup
    │   ├── config/
    │   │   └── supabase.js       # Supabase browser client (anon key)
    │   ├── context/
    │   │   ├── AuthContext.jsx   # Auth state + signup/login/logout methods
    │   │   └── UserContext.jsx   # User profile, progress, onboarding state
    │   ├── hooks/
    │   │   └── useGamification.js # XP, levels, streaks, badges (Supabase-backed)
    │   ├── pages/
    │   │   ├── Landing.jsx       # Entry page with cosmic particle animation
    │   │   ├── Signup.jsx        # Registration with password strength meter
    │   │   ├── Login.jsx         # Login with "forgot password" link
    │   │   ├── ForgotPassword.jsx
    │   │   ├── Onboarding.jsx    # 5-step personalization flow
    │   │   ├── Dashboard.jsx     # Bento grid hub
    │   │   └── Learning.jsx      # Explanation + quiz flow
    │   ├── services/
    │   │   ├── api.js            # Calls to backend (explain, quiz, GIFs)
    │   │   ├── profileService.js # CRUD for user_profiles table
    │   │   └── progressService.js # Saves to progress + quiz_results tables
    │   └── utils/
    │       ├── constants.js
    │       └── storage.js        # localStorage utilities
    ├── tailwind.config.js        # Neo-Brutalist + cosmic design tokens
    └── package.json
```

## Database Schema

Six tables in Supabase (PostgreSQL):

| Table | Purpose |
|---|---|
| `user_profiles` | Name, interest domain, difficulty, goals |
| `user_streaks` | XP total, current level, streak count, last active date |
| `user_badges` | Unlocked badge records per user |
| `progress` | Completed topic records with score |
| `quiz_results` | Quiz completion records per topic |
| `mentor_conversations` | (Reserved for future mentor history) |

Row Level Security is enabled on all tables. The backend uses the service role key; the frontend uses the anon key with RLS policies.

## Environment Variables

**`backend/.env`**
```env
HUGGINGFACE_API_KEY=your_hf_key_here
GIPHY_API_KEY=your_giphy_key_here
PORT=3001
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

**`frontend/.env`**
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

## Setup

### 1. Clone and install dependencies

```bash
git clone https://github.com/sairishitha-2787/FINLIT.git
cd FINLIT

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure environment variables

Copy the env templates above into `backend/.env` and `frontend/.env` and fill in your keys.

**Required API keys:**
- [Hugging Face](https://huggingface.co/settings/tokens) — free, use a read token
- [Giphy](https://developers.giphy.com/) — free tier
- [Supabase](https://supabase.com/) — free tier, create a new project

### 3. Configure Supabase

In your Supabase project:
1. Disable email confirmation: **Authentication → Providers → Email → Disable "Confirm email"**
2. Run the table creation SQL from the project schema
3. Grant table permissions: run `GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;`

### 4. Run the application

```bash
# Terminal 1 — Backend
cd backend && npm start   # http://localhost:3001

# Terminal 2 — Frontend
cd frontend && npm start  # http://localhost:3000
```

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/interests` | All 11 interest domains |
| `GET` | `/api/topics?difficulty=beginner` | Topics by difficulty |
| `POST` | `/api/explain` | Generate personalized explanation |
| `POST` | `/api/quiz` | Generate 5-question quiz |
| `GET` | `/api/gifs/correct` | Celebration GIF |
| `GET` | `/api/gifs/wrong` | Encouragement GIF |
| `GET` | `/api/gifs/celebration` | Quiz completion GIF |
| `POST` | `/api/recommend` | Topic recommendations |
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/auth/user` | Validate token + fetch profile |

## Quiz System

Each topic generates 5 questions across 3 progressive levels:

- **Level 1 — Understanding (2 questions):** Conceptual questions using interest-based analogies
- **Level 2 — Application (2 questions):** Real-world calculations and scenario problems  
- **Level 3 — Boss Fight (1 question):** Complex multi-variable decision-making scenario

Correct answers trigger a celebration GIF + XP award. Wrong answers show an encouragement GIF + explanation.

## Gamification

| Action | XP Earned |
|---|---|
| Read explanation | +10 XP |
| Use mentor chat | +20 XP |
| Complete quiz | +30 XP |
| Perfect quiz score | +50 XP |
| Daily streak bonus | +25 XP |

10 levels with thresholds: 100 → 250 → 500 → 1,000 → 1,750 → 2,750 → 4,000 → 5,500 → 7,500 → 10,000 XP

**Badges:** First Lesson, Perfect Score, 3-Day Streak, Week Warrior, Level 5, Topic Master

## Design System

FINLIT uses two visual themes:

**Neo-Brutalist** (dashboard, learning, quiz)
- Bold 4px black borders everywhere
- Hard box shadows: `8px 8px 0px #000`
- Zero border radius
- High-contrast palette: `#3352FF` blue, `#FF90E8` pink, `#70FFCA` green

**Cosmic** (auth pages, onboarding)
- Deep navy/purple gradients
- Frosted glass cards
- Floating particle animations
- Purple glow effects

## Interest Domains

| Domain | Alias Keywords |
|---|---|
| Gaming | gaming, games, esports |
| Music | music, production |
| Sports | sports, gym, fitness |
| Fashion | fashion, style |
| CSE | cse, cs, programming, coding, tech |
| Writing | writing, books, reading |
| Fitness | fitness, dance |
| Travel | travel |
| Food | food, cooking |
| Film | film, movies |
| General | (default fallback) |
