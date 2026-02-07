# FINLIT Frontend Design Guide

## Neo-Brutalist Design System

FINLIT uses a Neo-Brutalist design aesthetic - bold, stark, and memorable.

## Design Tokens

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `brutal-bg` | #F4F4F0 | Page backgrounds |
| `brutal-blue` | #3352FF | Primary actions, headers |
| `brutal-pink` | #FF90E8 | Accents, highlights |
| `brutal-green` | #70FFCA | Success states, CTAs |
| `brutal-black` | #000000 | Borders, text |
| `brutal-white` | #FFFFFF | Cards, inputs |

### Shadows

| Class | Value | Usage |
|-------|-------|-------|
| `shadow-brutal` | 8px 8px 0px black | Standard elevation |
| `shadow-brutal-sm` | 4px 4px 0px black | Subtle elevation |
| `shadow-brutal-lg` | 12px 12px 0px black | High emphasis |
| `shadow-brutal-hover` | 6px 6px 0px black | Hover states |

### Borders

Always use thick black borders:

```css
border-4 border-brutal-black rounded-none
```

### Typography

- Headers: `font-black` (900 weight)
- Body: `font-bold` (700 weight)
- Small text: `font-medium` (500 weight)

## Component Library

### BentoDashboard

5-block grid layout:

- **Block 1** (2x2): Current Learning Module with START button
- **Block 2** (1x1): XP & Level Progress bar
- **Block 3** (1x1): Streak Counter with pulsing fire emoji
- **Block 4** (2x1): Mentor's Corner preview
- **Block 5** (2x1): Badge Gallery

### TopicSelector Modal

Full-screen modal with:

- Search bar with live filtering
- Category tabs (6 categories)
- Topic cards with category badges
- 30+ finance topics

### FloatingMentor

Bottom-right floating chatbot:

- Brain emoji button (expandable)
- Chat interface with quick actions
- Interest-based responses
- Randomized openers (no repetition)

### NeoQuizEnvironment

3-level quiz progression:

- Level indicator showing all 3 levels
- Current level badge with dynamic colors
- Progress dots for questions
- Canvas-confetti on completion

### Gamification Components

- **XPPopup**: Floating notifications for XP gains
- **LevelUpModal**: Celebration modal with confetti
- **ProgressBar**: Animated XP progress

## Animations

Using Framer Motion:

```jsx
// Standard entrance
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ delay: 0.1 }}

// Button hover
whileHover={{ x: 2, y: 2 }}
whileTap={{ scale: 0.98 }}

// Pulsing element
animate={{ scale: [1, 1.15, 1] }}
transition={{ duration: 1.5, repeat: Infinity }}
```

## Gamification Flow

1. **Read explanation** → +10 XP (popup appears)
2. **Chat with mentor** → +20 XP per message
3. **Complete quiz (3-4/5)** → +30 XP + confetti
4. **Perfect quiz (5/5)** → +50 XP + TRIPLE confetti + Badge
5. **Daily login** → Streak increases, +25 XP bonus

### Level Thresholds

| Level | XP Required |
|-------|-------------|
| 1 | 0 |
| 2 | 100 |
| 3 | 250 |
| 4 | 500 |
| 5 | 1,000 |
| 6 | 2,000 |
| 7 | 3,500 |
| 8 | 5,500 |
| 9 | 8,000 |
| 10 | 10,000 |

## File Structure

```
frontend/src/components/
├── dashboard/
│   ├── BentoDashboard.jsx    # Main dashboard grid
│   └── TopicSelector.jsx     # Topic browser modal
├── learning/
│   ├── ExplanationDisplay.jsx
│   └── JargonFlashcard.jsx   # Flip card for jargon
├── mentor/
│   └── FloatingMentor.jsx    # AI chatbot
├── quiz/
│   ├── NeoQuizEnvironment.jsx # 3-level quiz
│   ├── AnimatedFeedback.jsx   # Answer feedback
│   ├── QuizCard.jsx
│   └── Question.jsx
├── onboarding/
│   └── InterestSelector.jsx
└── shared/
    ├── Button.jsx
    ├── LevelUpModal.jsx      # Level-up celebration
    ├── LoadingAnimation.jsx
    ├── ProgressBar.jsx
    └── XPPopup.jsx           # Floating XP notifications
```

## Dependencies

- `framer-motion` - Animations
- `canvas-confetti` - Celebrations
- `react-router-dom` - Navigation
- `axios` - API calls
- `tailwindcss` - Styling

## Responsive Design

The Bento grid adapts to screen size:

- Desktop: 4-column grid
- Tablet: 2-column grid
- Mobile: Single column stack

## localStorage Keys

- `finlit_gamification` - XP, level, streak, badges
- `finlit_profile` - User profile data
- `finlit_progress` - Completed topics

---

Built with Claude Code by Anthropic
