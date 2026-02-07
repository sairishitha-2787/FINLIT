# FINLIT - Quick Start Guide

## Step 1: Create Environment Files

Before running the app, create the `.env` files:

### backend/.env

```env
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
GIPHY_API_KEY=your_giphy_api_key_here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### frontend/.env

```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Step 2: Run the App (2 Terminals)

### Terminal 1 - Backend

```bash
cd backend
npm install
npm start
```

Should show: "FINLIT Backend Server" on port 3001

### Terminal 2 - Frontend

```bash
cd frontend
npm install
npm start
```

Should open browser at <http://localhost:3000>

## Step 3: Test the Full Flow

1. **Landing Page** - Click "Start Your Journey"

2. **Onboarding** - Answer 5 questions:
   - Enter your name
   - Select an interest (e.g., Gaming, CSE, Music)
   - Choose your situation
   - Pick your challenge
   - Select knowledge level

3. **Dashboard** - Explore:
   - See your XP and level
   - Check your streak
   - Browse topics with "BROWSE ALL TOPICS" button
   - Click "START" on any topic

4. **Learning** - Read AI-generated explanation with interest-based analogies

5. **Quiz** - Complete 3-level quiz:
   - Level 1: Understanding (2 questions)
   - Level 2: Application (2 questions)
   - Level 3: Boss Fight (1 question)

6. **Results** - See score, earn XP, unlock badges

## Troubleshooting

### Backend won't start

```bash
cd backend
rm -rf node_modules
npm install
npm start
```

### Frontend won't compile

```bash
cd frontend
rm -rf node_modules
npm install
npm start
```

### Hugging Face API not working

The app has comprehensive fallback templates. If the API fails, pre-built quizzes will be used automatically. The demo will work regardless of API status.

### GIFs not loading

- Fallback GIFs will show if Giphy fails
- Check internet connection

## Current Status

Both servers should be running:

- Backend: <http://localhost:3001>
- Frontend: <http://localhost:3000>

## Notes

- Data persists in localStorage (no database needed)
- To reset: Open DevTools → Application → Clear Site Data
- ESLint warnings are non-breaking

## Getting API Keys

### Hugging Face

1. Go to <https://huggingface.co>
2. Create account / Sign in
3. Go to Settings → Access Tokens
4. Create new token with "Read" permission
5. Copy to `backend/.env`

### Giphy

1. Go to <https://developers.giphy.com>
2. Create account / Sign in
3. Create new app
4. Copy API key to `backend/.env`

---

Ready to demo!
