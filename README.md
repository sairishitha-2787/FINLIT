# FINLIT — Gamified Financial Literacy Platform

Master financial concepts through your interests. Learn budgeting through gaming, investing through sports, or credit through fashion — whatever clicks for you.

## Overview

FINLIT is a gamified financial-literacy platform with 4 interest-based domains (Gaming, Music, Fashion, Sports). Each domain teaches the same financial concepts using domain-specific analogies, characters, and scenarios. AI generates fresh explanations and scenario quizzes; a gamification layer (XP, levels, streaks, badges) keeps learners engaged. Data persists to Supabase.

**Core Features:**
- 🎮 4 interest domains (Gaming, Music, Fashion, Sports) — each fully themed
- 🤖 AI-generated explanations + scenario quizzes (Groq) with Giphy feedback
- 📚 60-term glossary (searchable, organized in 3 sets) + a Daily Glossary card
- 🏆 Mastery gates (70% quiz threshold to unlock the next topic)
- ⭐ Domain-specific milestone badges (awarded on topic completion)
- 🎯 Daily Cipher challenge (per-domain, one per 24 hours) + streaks
- 📈 XP tracking, 10 levels, daily-streak bonuses
- 🧮 In-quiz calculator for calculation questions
- 👾 Star-weighted boss fights (3★=1, 4★=1.5, 5★=2 toward the pass score)
- 🔒 Auto-logout after 3 hours of inactivity
- 📊 Event logging (quiz submissions, badge awards, streak milestones)
- 🔔 In-app notification center + bell
- ⚡ App-wide error boundary + optional Sentry reporting
- 🧠 Floating AI mentor (contextual chatbot)
- 📱 Responsive design (mobile, tablet, desktop)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (CRA), Tailwind CSS, Framer Motion, Lucide icons, React Router v6 |
| Backend | Node.js, Express |
| Database / Auth | Supabase (PostgreSQL + Auth, Row-Level Security) |
| AI | Groq (`llama-3.3-70b-versatile`) — explanations, scenario quizzes, mentor |
| Media | Giphy API (quiz feedback GIFs) |
| Error reporting | Sentry (`@sentry/react`, optional/env-gated) |
| State | React Context (Auth, User, Gamification, Theme, Toast) |

## Project Structure

```text
FINLIT/
├── backend/                       # Express API (AI, auth proxy, GIFs)
│   ├── config/                    # supabase (service role), domain vocab, scenario templates
│   ├── routes/                    # auth, quiz, mentor, chapters, recommendations
│   ├── services/                  # scenarioGenerator, explanationGenerator,
│   │                              #   mentorPromptBuilder, giphyService, cleanupService
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── quiz/              # NeoQuizEnvironment, ScenarioQuizEnvironment,
        │   │                      #   AnimatedFeedback, QuizCard, Calculator
        │   ├── ErrorBoundary.jsx / ErrorFallback.jsx
        │   ├── Toast.jsx / NotificationBell.jsx / NotificationIcon.jsx
        │   ├── DailyGlossaryCard.jsx / DailyChallengeCard.jsx / SuggestedForReview.jsx
        │   ├── achievements/      # AchievementsPage, BadgeCard, BadgeSection
        │   └── mentor/            # FloatingMentor
        ├── context/
        │   ├── AuthContext.jsx    # login/logout + inactivity auto-logout gate
        │   ├── UserContext.jsx    # profile, progress, badge awarding
        │   ├── ThemeContext.jsx   # ThemeProvider + useTheme (domain theming)
        │   └── ToastProvider.jsx  # toast queue + useToast
        ├── contexts/              # Domain/Fashion/Sports/Music character contexts
        ├── hooks/
        │   ├── useGamification.js # GamificationProvider + useGamification (XP/level/badges)
        │   ├── useBadgeTracker.js / useDailyChallenge.js / useMasteryProgress.js
        │   └── useNotifications.js / useSpacedRepetition.js
        ├── layouts/               # GamingLayout, MusicLayout, FashionLayout, SportsLayout
        ├── pages/
        │   ├── Landing / Login / Signup / ForgotPassword
        │   ├── Onboarding.jsx     # questionnaire → mentor → demo quiz (with skip)
        │   ├── gaming|music|fashion|sports/  # Dashboard, Map/Playbook, Learning, Settings, Badges
        │   ├── Glossary.jsx       # 60 global terms, 3 sets, search
        │   ├── NotFound.jsx       # domain-aware 404
        │   └── NotificationCenter.jsx
        ├── services/
        │   ├── api.js             # backend calls (explain, quiz, gifs, mentor)
        │   ├── eventsService.js   # analytics event logging
        │   ├── badgeService.js    # badge persistence (user_badges)
        │   ├── progressService.js / profileService.js / notificationsService.js
        │   └── activityTracker.js # inactivity timeout
        ├── config/
        │   ├── badgesConfig.js    # gaming/fashion/sports badge configs
        │   ├── badgeRules.js      # milestone → badge mapping
        │   └── supabase.js        # browser client (anon key)
        ├── data/                  # glossaryTerms.js (60 terms), musicBadges.js, topics
        └── styles/                # per-domain theme tokens + normalizeTheme.js
```

## Database Schema (Supabase / PostgreSQL)

| Table | Purpose |
|-------|---------|
| `auth.users` | Authentication (managed by Supabase) |
| `user_profiles` | Name, primary interest/domain, difficulty, goals |
| `user_streaks` | XP total, current level, streak count, last active |
| `progress` | Completed-topic records + scores |
| `quiz_results` | Quiz completion records per topic |
| `user_badges` | Earned badges per user |
| `daily_challenges` | Per-user/per-domain Daily Cipher state |
| `defeated_bosses` | Boss-defeat records |
| `events` | Analytics: quiz_submitted, badge_earned, streak_milestone, session_started, … |
| `notifications` | In-app notification queue |
| `mentor_conversations` | Mentor chat history |

Row-Level Security is enabled on all tables (each user only sees their own rows). The backend uses the **service role** key; the frontend uses the **anon** key. Note: tables created via the SQL editor also need API-role grants — see `supabase/migrations/` (`grant_table_access.sql`, `grant_progress_access.sql`, `add_events.sql`).

## Quiz System (3 Levels per Topic)

1. **Level 1 — Understanding** (multiple choice, 2 questions) — concepts via domain analogies.
2. **Level 2 — Application** (calculation, 2 questions) — real-world math, with the in-quiz calculator.
3. **Level 3 — Boss Fight** (open-ended scenario, 1 question) — AI-graded, star-rated.

**Pass threshold: ≥70% (≥3.5 of 5).**
- Regular questions: 1 point each.
- Boss: 3★ = 1, 4★ = 1.5, 5★ = 2 points.
- Total = regular correct + boss weight; ≥3.5 ⇒ pass and the next topic unlocks.

Application/scenario questions show the scenario setup first, then the question.

## Gamification

| XP Action | Reward |
|---|---|
| Read explanation | +10 XP |
| Use mentor chat | +20 XP |
| Complete quiz | +30 XP |
| Perfect quiz score | +50 XP |
| Daily streak bonus | +25 XP |

10 levels: 100 → 250 → 500 → 1,000 → 1,750 → 2,750 → 4,000 → 5,500 → 7,500 → 10,000 XP.

**Milestone badges** are awarded per domain on topic completion (and 100% scores), e.g.:
- 1 topic — First Steps / First Stream / First Look / First Whistle
- 5 topics — Streaming Enthusiast / Week One Warrior / Team Player
- 10 topics — Topic Master / Chart Climber / Iron Will
- 100% score — Perfect Score / Clean Sheet / Perfectionist / Perfect Form

## Domain Theming

Each domain has unique colors, fonts, and UI:

| Domain | Accent | Heading font |
|---|---|---|
| Gaming | Blue/mint | Orbitron |
| Music | Violet (per-cluster) | Bebas Neue / Space Mono / Cormorant |
| Fashion | Pink | Playfair Display |
| Sports | Amber | Bebas Neue |

`ThemeContext` + `normalizeTheme.js` expose a unified theme shape, so shared components (Daily Glossary card, toasts, etc.) auto-adopt the active domain's look.

## Key Features Explained

**Mastery gates (70%)** — a topic unlocks only after the previous one is passed at ≥70%.

**Auto-logout (3h inactivity)** — every logged event stamps `finlit_last_activity`; on load, if >3h have passed the user is signed out (→ `/login` with a "Session expired" notice).

**Error boundary** — render crashes show a friendly fallback with Refresh / Go Home instead of a blank screen; reported to Sentry when a DSN is configured.

**Domain-aware 404** — `/gaming/anything-invalid` → 404 with "Back to Gaming"; `/anything-invalid` → "Go Home".

## Setup

### Prerequisites
- Node.js 16+
- Supabase project (free tier)
- Groq API key, Giphy API key

### Environment variables

**`backend/.env`**
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_key
GIPHY_API_KEY=your_giphy_key
```

**`frontend/.env`**
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
# Optional — error reporting; leave blank to disable
REACT_APP_SENTRY_DSN=
```

### Configure Supabase
1. Disable email confirmation (**Authentication → Providers → Email**).
2. Create the tables listed above.
3. Run the SQL in `supabase/migrations/` (table creation + the GRANT migrations) in the SQL editor.

### Run locally
```bash
# Terminal 1 — backend
cd backend && npm install && npm run dev    # http://localhost:3001

# Terminal 2 — frontend
cd frontend && npm install && npm start     # http://localhost:3000
```

### Deploy
- **Frontend** → Vercel/Netlify (root directory `frontend`, add the `REACT_APP_*` env vars).
- **Backend** → any Node host (Render/Railway/Fly). Point the frontend's `REACT_APP_API_URL` at the deployed backend URL. The app needs the backend running for AI explanations, quiz generation, GIFs, and the mentor.

## Known Limitations & Future Work

**Not yet wired:** boss-defeat / XP-threshold / average-score badges (need extra tracking); the rich per-domain badge sets are largely display-only beyond the milestone badges. Multi-language, native mobile, and offline mode are out of scope.

**Post-launch:** analytics dashboard over the `events` table, in-app feedback form, performance monitoring, content expansion (more glossary terms / topics).

## Pre-ship Checklist
- [ ] Each domain: onboarding → quiz (≥70%) → badge on achievements page → next topic unlocks
- [ ] <70% routes to review; ≥70% passes
- [ ] Calculator opens on calculation questions and copies the result
- [ ] Glossary: 3 sets, search works, related terms clickable
- [ ] Auto-logout after 3h idle; logout from settings works
- [ ] `/anything-invalid` shows the 404
- [ ] `npm run build` passes; no red console errors (lint warnings OK)

## License

MIT — see `LICENSE`.

---

Maintained by [@sairishitha-2787](https://github.com/sairishitha-2787). Built for financial-literacy learners everywhere.
