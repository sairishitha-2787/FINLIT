# FINLIT - Financial Literacy Made Personal

AI-powered financial literacy platform that teaches finance through personalized interest-based analogies.

## Project Status: COMPLETE

All features implemented and tested:
- Backend API with Hugging Face AI & Giphy integration
- Frontend React app with Neo-Brutalist design
- Complete user flow: Landing → Onboarding → Dashboard → Learning → Quiz
- 3-Level Quiz System (Understanding → Application → Boss Fight)
- Gamification system (XP, Levels, Streaks, Badges)
- Floating AI Mentor chatbot
- 30+ financial topics across 6 categories
- Interest-based learning (Gaming, Music, Sports, CSE, Fashion, Writing)

## Tech Stack

### Backend
- Node.js + Express
- Hugging Face API (Mistral-7B-Instruct) with comprehensive fallbacks
- Giphy API for feedback GIFs
- CORS, dotenv

### Frontend
- React 18
- Tailwind CSS (Neo-Brutalist design system)
- Framer Motion (animations)
- Canvas-Confetti (celebrations)
- React Router
- Axios
- Context API for state management

## Project Structure

```
FINLIT/
├── backend/
│   ├── services/
│   │   ├── huggingfaceService.js  # AI explanation & quiz generation
│   │   └── giphyService.js        # GIF fetching for feedback
│   ├── config/
│   │   └── interestDomains.js     # Interest domains & topics
│   ├── server.js                  # Express server with API endpoints
│   ├── package.json
│   └── .env                       # API keys (create before running)
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── dashboard/         # BentoDashboard, TopicSelector
    │   │   ├── learning/          # ExplanationDisplay, JargonFlashcard
    │   │   ├── quiz/              # NeoQuizEnvironment, AnimatedFeedback
    │   │   ├── mentor/            # FloatingMentor chatbot
    │   │   ├── onboarding/        # InterestSelector
    │   │   └── shared/            # Button, Loading, XPPopup, LevelUpModal
    │   ├── pages/
    │   │   ├── Landing.jsx        # Entry page
    │   │   ├── Onboarding.jsx     # 5-question flow
    │   │   ├── Dashboard.jsx      # Main hub with Bento grid
    │   │   └── Learning.jsx       # Topic learning & quiz
    │   ├── context/
    │   │   └── UserContext.jsx    # Global state
    │   ├── hooks/
    │   │   └── useGamification.js # XP, levels, badges, streaks
    │   ├── services/
    │   │   └── api.js             # Backend API calls
    │   └── utils/
    │       ├── constants.js
    │       └── storage.js         # localStorage utilities
    ├── tailwind.config.js         # Neo-Brutalist design tokens
    └── package.json
```

## Setup Instructions

### 1. Create Environment Files

Create `backend/.env`:
```env
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
GIPHY_API_KEY=your_giphy_api_key_here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend runs on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend runs on http://localhost:3000

## API Endpoints

### Backend (Port 3001)

- `GET /api/health` - Health check
- `GET /api/interests` - Get all interest domains
- `GET /api/topics?difficulty=beginner` - Get topics by difficulty
- `POST /api/explain` - Generate personalized explanation
  ```json
  {
    "topic": "Compound Interest",
    "interest": "gaming",
    "difficulty": "beginner"
  }
  ```
- `POST /api/quiz` - Generate 3-level quiz questions
- `GET /api/gifs/correct` - Get celebration GIF
- `GET /api/gifs/wrong` - Get encouragement GIF
- `GET /api/gifs/celebration` - Get completion GIF
- `POST /api/recommend` - Get topic recommendations

## 3-Level Quiz System

Each quiz contains 5 questions across 3 levels:

### Level 1: UNDERSTANDING (2 questions)
- Conceptual mapping with interest-based analogies
- Tests core principle comprehension

### Level 2: APPLICATION (2 questions)
- Quantitative math problems
- Real-world calculations

### Level 3: BOSS FIGHT (1 question)
- Immersive simulation scenario
- Complex decision-making with multiple variables

## Gamification System

- **XP Points**: Earn XP for reading (+10), chatting (+20), quizzes (+30-50)
- **Levels**: 10 levels with progressive thresholds
- **Streaks**: Daily login streak tracking
- **Badges**: 6 unlockable badges
- **Level-Up Modal**: Celebration with confetti on level up

## Interest Domains

Supported interests with specialized analogies:
- Gaming (XP, resources, boss fights)
- Computer Science / CSE (Big O, tech debt, APIs)
- Music (mixing, production, fanbase)
- Sports (training, game film, contracts)
- Fashion (capsule wardrobe, cost-per-wear)
- Writing (manuscripts, editing, publishing)

Aliases supported: cse, cs, programming, coding, tech, gym, fitness, dance, reading, books, esports

## Neo-Brutalist Design System

### Colors
- Background: `#F4F4F0` (brutal-bg)
- Primary Blue: `#3352FF` (brutal-blue)
- Accent Pink: `#FF90E8` (brutal-pink)
- Success Green: `#70FFCA` (brutal-green)
- Black: `#000000` (brutal-black)
- White: `#FFFFFF` (brutal-white)

### Design Tokens
- Borders: `border-4 border-brutal-black`
- Shadows: `shadow-brutal` (8px 8px 0px black)
- No rounded corners: `rounded-none`
- Typography: `font-black` (900 weight)

## Features

### Core Functionality
- Personalized AI explanations using Hugging Face Mistral-7B
- Interest-based analogies (6+ domains)
- 3-level quiz progression system
- Animated GIF feedback (Giphy API)
- Progress tracking with localStorage
- Topic recommendations based on difficulty

### UI/UX
- Neo-Brutalist design (bold, stark, memorable)
- Bento grid dashboard layout
- Smooth animations with Framer Motion
- Canvas-confetti celebrations
- Floating AI mentor chatbot
- Responsive design (mobile-first)

### Gamification
- XP system with floating popups
- Level progression with modal celebrations
- Daily streak counter
- Badge unlocking system

## Development Notes

### Fallback System
The app includes comprehensive fallback quiz templates for 6 interests when the Hugging Face API is unavailable. This ensures the demo always works.

### localStorage Keys
- `finlit_gamification` - XP, level, streak, badges
- `finlit_profile` - User profile data
- `finlit_progress` - Completed topics

## Credits

Built with Claude Code by Anthropic
- AI-powered financial education
- Interest-based personalization
- Neo-Brutalist design aesthetic

---

**Ready to teach finance!**
