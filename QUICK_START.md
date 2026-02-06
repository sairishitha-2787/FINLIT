# FINLIT - Quick Start Guide

## 🚨 IMPORTANT: Update Your API Key First!

Before running the app, update the OpenAI API key in `backend/.env`:

```bash
# Open backend/.env and replace with your full key
OPENAI_API_KEY=your_complete_key_here_that_ends_with_SGQA
```

## 🚀 Run the App (2 Terminals)

### Terminal 1 - Backend
```bash
cd backend
npm start
```
✅ Should show: "FINLIT Backend Server" on port 3001

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```
✅ Should open browser at http://localhost:3000

## 🎯 Test the Full Flow

1. **Landing Page** (http://localhost:3000)
   - Click "Start Your Journey"

2. **Onboarding**
   - Enter your name
   - Select an interest (e.g., Gaming 🎮)
   - Choose your situation
   - Pick your challenge
   - Select knowledge level

3. **Dashboard**
   - See recommended topics
   - Click "Start Learning" on any topic

4. **Learning**
   - Read AI-generated explanation
   - Click "Take the Quiz"

5. **Quiz**
   - Answer 5 questions
   - Get instant GIF feedback
   - See your score

6. **Results**
   - Return to dashboard
   - Try another topic!

## 🔧 Troubleshooting

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

### OpenAI API Error
- Check your API key in `backend/.env`
- Make sure you have credits in your OpenAI account
- Verify the key is complete (starts with `sk-`)

### Giphy GIFs not loading
- API key is already set
- Fallback GIFs will show if Giphy fails
- Check internet connection

## 📊 Current Status

Both servers are running:
- ✅ Backend: http://localhost:3001
- ✅ Frontend: http://localhost:3000
- ✅ All components built
- ✅ Full user flow working

## 📝 Notes

- The app uses localStorage (no database needed)
- Data persists between sessions
- To reset: Open DevTools → Application → Clear Site Data
- ESLint warnings are non-breaking and can be ignored

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.js`:
```js
colors: {
  primary: '#6366F1',    // Indigo
  secondary: '#EC4899',  // Pink
  accent: '#10B981',     // Green
}
```

### Add More Topics
Edit `backend/config/interestDomains.js`:
```js
financialTopics: {
  beginner: [...],
  intermediate: [...],
  advanced: [...]
}
```

### Modify Prompts
Edit `backend/services/openaiService.js`:
- `generateExplanation()` - Controls how topics are explained
- `generateQuiz()` - Controls quiz question generation

## 🚀 Ready to Demo!

Your app is fully functional and ready for the hackathon demo. Good luck! 🎉
