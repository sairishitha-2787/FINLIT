// FINLIT — Fashion Learning & Quiz Page
// Bubblegum Glam theme: glassmorphism cards, Playfair Display headings, DM Sans body
// Stages: loading → explanation (4 sections, prev/next nav) → quiz (5 Qs) → diagnosis (on fail) → complete

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Check, X, Star, Sparkles,
  RotateCcw, Calculator, Heart, Zap, Map as MapIcon,
  RefreshCw, BarChart2,
} from 'lucide-react';
import QuizHistoryModal from '../../components/QuizHistoryModal';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastProvider';
import { useGamification } from '../../hooks/useGamification';
import confetti from 'canvas-confetti';
import { getExplanation, getQuiz, generateScenarioQuiz } from '../../services/api';
import { FASHION_DISTRICTS } from '../../components/fashion/RunwayMap';
import NeoQuizEnvironment from '../../components/quiz/NeoQuizEnvironment';
import ScenarioQuizEnvironment from '../../components/quiz/ScenarioQuizEnvironment';

// ── Design tokens ─────────────────────────────────────────────────────────────
const F = { heading: "'Playfair Display', serif", italic: "'Playfair Display', serif", ui: "'DM Sans', sans-serif" };
// Base colors — pink/midRose are overridden per-character at runtime inside the component
const C_BASE = { bg: '#faf5ec', pink: '#f7a0b8', purple: '#c084fc', deepRose: '#9d1f4a', midRose: '#d4537e', body: '#b0627a', label: '#c98a9e', gold: '#fde68a' };
// Module-level alias so sub-components defined outside the main function can reference C
const C = C_BASE; // eslint-disable-line no-unused-vars
const DEFAULT_GRAD = 'linear-gradient(135deg, #f7a0b8, #c084fc, #fbb6c4)';

function rgb(hex) {
  const h = hex.replace('#', '');
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`;
}

// ── Fashion celebration ───────────────────────────────────────────────────────
function fireFashionCelebration(accent) {
  const a = accent || '#f7a0b8';
  confetti({ particleCount: 120, spread: 70, origin: { x: 0.5, y: 0 },
    colors: [a, '#c084fc', '#fde68a', '#faf5ec', '#fbb6c4'],
    gravity: 0.55, scalar: 1.1, drift: 1.2, ticks: 280 });
  setTimeout(() =>
    confetti({ particleCount: 60, spread: 55, origin: { x: 0.2, y: 0.1 },
      colors: [a, '#fde68a'], gravity: 0.65, scalar: 0.85, drift: -1 }), 220);
  setTimeout(() =>
    confetti({ particleCount: 60, spread: 55, origin: { x: 0.8, y: 0.1 },
      colors: [a, '#c084fc'], gravity: 0.65, scalar: 0.85, drift: 1 }), 380);
}

// ── Cache helpers ─────────────────────────────────────────────────────────────
const exKey  = (t, v) => `finlit_fashion_expl_${t?.replace(/\s+/g,'_')}_v${v}`;
const qzKey  = (t)    => `finlit_fashion_quiz_${t?.replace(/\s+/g,'_')}`;
const getEx  = (t,v)  => { try { const r = sessionStorage.getItem(exKey(t,v)); return r ? JSON.parse(r) : null; } catch { return null; } };
const setEx  = (t,v,d)=> { try { sessionStorage.setItem(exKey(t,v), JSON.stringify(d)); } catch {} };
const getQz  = (t)    => { try { const r = sessionStorage.getItem(qzKey(t)); return r ? JSON.parse(r) : null; } catch { return null; } };
const setQz  = (t,d)  => { try { sessionStorage.setItem(qzKey(t), JSON.stringify(d)); } catch {} };
const clearQz= (t)    => { try { sessionStorage.removeItem(qzKey(t)); } catch {} };

// ── Helpers ───────────────────────────────────────────────────────────────────
function getTopicMeta(topic) {
  for (const d of FASHION_DISTRICTS) {
    const i = d.topics.indexOf(topic);
    if (i >= 0) return { district: d, lookNumber: i + 1 };
  }
  return null;
}

const OPTION_LABELS = ['A','B','C','D'];
const optText = (o) => (o && typeof o === 'object' ? o.text : o);

const SECTIONS = [
  { key: 'analogy',      num: 1, title: 'THE ANALOGY',    Icon: Sparkles   },
  { key: 'math',         num: 2, title: 'THE NUMBERS',    Icon: Calculator },
  { key: 'whyItMatters', num: 3, title: 'WHY IT MATTERS', Icon: Heart      },
  { key: 'nextSteps',    num: 4, title: 'YOUR NEXT LOOK', Icon: Zap        },
];

const PASS_SCORE = 3;

// Static fallback used when the backend is unreachable.
function getStaticExplanation(topic) {
  const t = topic || 'this financial concept';
  return {
    analogy: `Think of ${t} like curating a capsule wardrobe — every piece needs to work together and serve a purpose. You wouldn't buy a couture gown without knowing where you'd wear it; similarly, every financial decision should fit your bigger picture.\n\nJust as a great stylist balances investment pieces with everyday staples, smart money management balances long-term growth with day-to-day needs.`,
    math: `Here's how the numbers typically look for ${t}:\n\nSmall, consistent contributions add up fast:\n• $50/month × 12 months = $600/year\n• $600/year × 5 years (at 5% growth) ≈ $3,400\n• $600/year × 10 years (at 5% growth) ≈ $7,700\n\nFormula: FV = P × [(1 + r)^n - 1] / r\n(P = payment, r = period rate, n = periods)`,
    whyItMatters: `Mastering ${t} is foundational to financial confidence.\n\nPeople who understand concepts like this one tend to save more, invest earlier, and make fewer costly mistakes — the financial equivalent of building a wardrobe you love instead of a closet full of impulse buys.\n\nEven small improvements in how you handle this area can compound into major long-term gains.`,
    nextSteps: `Your action plan for ${t}:\n\n1. Assess your current situation — what's your starting point?\n2. Set one clear, measurable goal related to this topic\n3. Research one account, product, or strategy that applies\n4. Put a monthly calendar reminder to review your progress\n\nEvery style icon started with a single intentional choice. This is yours.`,
  };
}

// Static quiz fallback — 5 questions per topic when backend is unreachable.
const STATIC_QUIZZES = {
  'Budgeting Basics': [
    { question: 'What is a budget?', options: ['A plan for spending and saving money', 'A type of savings account', 'A government tax form', 'A credit score'], correctAnswer: 'A', explanation: 'A budget is a plan that helps you decide how to spend and save your money each month.' },
    { question: 'Which budgeting rule allocates 50% to needs, 30% to wants, and 20% to savings?', options: ['The debt snowball method', 'The 50/30/20 rule', 'The envelope method', 'The zero-based budget'], correctAnswer: 'B', explanation: 'The 50/30/20 rule is a popular budgeting framework that splits after-tax income into needs, wants, and savings.' },
    { question: 'What is a "fixed expense"?', options: ['An expense that changes each month', 'An unexpected cost', 'An expense that stays the same each month', 'A luxury purchase'], correctAnswer: 'C', explanation: 'Fixed expenses like rent or loan payments stay consistent, making them easier to plan for in a budget.' },
    { question: 'If you earn $2,000/month and spend $2,400, you are:', options: ['Living within your means', 'Running a surplus', 'Running a deficit', 'Breaking even'], correctAnswer: 'C', explanation: 'Spending more than you earn creates a deficit, which leads to debt if not addressed.' },
    { question: 'Which of these is a "want" rather than a "need"?', options: ['Groceries', 'Rent', 'Streaming subscription', 'Electricity bill'], correctAnswer: 'C', explanation: 'Wants are non-essential items. A streaming subscription is enjoyable but not required for survival.' },
  ],
  'Emergency Fund': [
    { question: 'How many months of expenses should an emergency fund typically cover?', options: ['1 month', '2 months', '3–6 months', '12 months'], correctAnswer: 'C', explanation: 'Financial experts recommend 3–6 months of living expenses to cover job loss, medical bills, or unexpected costs.' },
    { question: 'Where should you keep your emergency fund?', options: ['Invested in stocks', 'In a high-yield savings account', 'Under your mattress', 'In a retirement account'], correctAnswer: 'B', explanation: 'A high-yield savings account keeps your money accessible and growing with interest, unlike stocks which can drop in value.' },
    { question: 'Which situation is an emergency fund NOT meant for?', options: ['Sudden job loss', 'Medical emergency', 'Vacation you want to take', 'Car repair'], correctAnswer: 'C', explanation: 'An emergency fund covers unexpected, necessary costs — not planned discretionary spending like vacations.' },
    { question: 'If your monthly expenses are $2,000, what is a fully funded 3-month emergency fund?', options: ['$1,000', '$3,000', '$6,000', '$12,000'], correctAnswer: 'C', explanation: '$2,000 × 3 months = $6,000. This gives you a buffer for three months of expenses.' },
    { question: 'What is the FIRST step to building an emergency fund?', options: ['Invest in crypto', 'Pay off all debt first', 'Open a dedicated savings account', 'Apply for a credit card'], correctAnswer: 'C', explanation: 'Opening a separate account for your emergency fund helps prevent you from spending it accidentally.' },
  ],
  'Needs vs Wants': [
    { question: 'Which of these is a financial NEED?', options: ['Designer handbag', 'Gym membership', 'Health insurance', 'Concert tickets'], correctAnswer: 'C', explanation: 'Health insurance is a need — it protects you from potentially devastating medical costs.' },
    { question: 'Why is distinguishing needs from wants important?', options: ['It helps you spend more money', 'It is required by law', 'It helps you prioritize spending and save more', 'It eliminates all fun purchases'], correctAnswer: 'C', explanation: 'Knowing what you truly need vs. want helps you make intentional spending decisions that align with your goals.' },
    { question: 'Your phone plan costs $80/month. Upgrading to $120/month for extra data would be a:', options: ['Need', 'Want', 'Fixed cost', 'Necessity'], correctAnswer: 'B', explanation: 'Basic phone service may be a need, but upgrading for extra features is a want.' },
    { question: 'What does "lifestyle inflation" mean?', options: ['Prices rising over time', 'Spending more as your income grows', 'Reducing expenses', 'Saving more each year'], correctAnswer: 'B', explanation: 'Lifestyle inflation happens when people increase their spending as their income rises, preventing wealth-building.' },
    { question: 'Which strategy helps control spending on wants?', options: ['Ignoring your bank statements', 'The 24-hour rule before non-essential purchases', 'Using credit cards for everything', 'Never saving'], correctAnswer: 'B', explanation: 'Waiting 24 hours before buying something you want helps you decide if the purchase is truly worthwhile.' },
  ],
  'Savings Goals': [
    { question: 'What does "SMART" stand for in goal-setting?', options: ['Save Money And Reach Targets', 'Specific, Measurable, Achievable, Relevant, Time-bound', 'Simple, Motivated, Accurate, Real, Trackable', 'Structured, Managed, Assured, Reasonable, Timed'], correctAnswer: 'B', explanation: 'SMART goals have five key qualities that make them clear and achievable.' },
    { question: 'If you want to save $1,200 in 12 months, how much should you save per month?', options: ['$50', '$100', '$200', '$1,200'], correctAnswer: 'B', explanation: '$1,200 ÷ 12 months = $100/month. Breaking big goals into monthly targets makes them manageable.' },
    { question: 'Which account type is best for a short-term savings goal?', options: ['401(k)', 'High-yield savings account', 'Roth IRA', 'Brokerage account'], correctAnswer: 'B', explanation: 'A high-yield savings account offers better interest than a regular savings account with easy access to funds.' },
    { question: 'Automating savings transfers means:', options: ['Your savings grow on their own without thinking', 'Money moves to savings before you can spend it', 'You never have to budget again', 'Your investments are managed automatically'], correctAnswer: 'B', explanation: 'Automatic transfers happen on payday, making saving consistent and removing the temptation to spend first.' },
    { question: 'Which is the most important reason to have multiple savings goals?', options: ['It looks impressive', 'Different goals have different timelines and accounts', 'Banks require it', 'It earns more interest'], correctAnswer: 'B', explanation: 'Separating goals (vacation fund, emergency fund, etc.) prevents you from accidentally spending one fund on another purpose.' },
  ],
  'Credit Scores': [
    { question: 'What credit score range is generally considered "good"?', options: ['300–499', '500–599', '670–739', '800–850'], correctAnswer: 'C', explanation: 'A score of 670–739 is typically considered "good" by most lenders, qualifying you for competitive interest rates.' },
    { question: 'Which factor has the BIGGEST impact on your credit score?', options: ['Credit mix', 'New credit inquiries', 'Payment history', 'Length of credit history'], correctAnswer: 'C', explanation: 'Payment history accounts for 35% of your FICO score — paying on time is the single most important factor.' },
    { question: 'How often can you get a free credit report?', options: ['Monthly', 'Once a year from each bureau', 'Every 5 years', 'Only when applying for a loan'], correctAnswer: 'B', explanation: 'You can get one free report per year from each of the three major bureaus at AnnualCreditReport.com.' },
    { question: 'Which action HARMS your credit score?', options: ['Paying bills on time', 'Keeping old accounts open', 'Maxing out your credit cards', 'Checking your own credit report'], correctAnswer: 'C', explanation: 'High credit utilization (using most of your available credit) signals financial stress to lenders.' },
    { question: 'What is a "hard inquiry" on your credit?', options: ['Checking your own credit score', 'A lender checking your credit when you apply for a loan', 'A fraud alert', 'A credit limit increase'], correctAnswer: 'B', explanation: 'Hard inquiries happen when lenders check your credit for a loan application and can slightly lower your score.' },
  ],
  'Interest Rates': [
    { question: 'What is APR?', options: ['Annual Percentage Rate — the yearly cost of borrowing money', 'Average Payment Ratio', 'Account Processing Rate', 'Annual Profit Return'], correctAnswer: 'A', explanation: 'APR represents the true yearly cost of a loan, including fees, making it the best comparison tool.' },
    { question: 'If you have a $1,000 debt at 20% APR and only make minimum payments, what happens?', options: ['You pay it off quickly', 'Interest makes the total much more expensive over time', 'The rate drops automatically', 'You save money'], correctAnswer: 'B', explanation: 'At 20% APR, interest compounds and a $1,000 debt can cost you $200+ extra per year if not paid aggressively.' },
    { question: 'Compound interest means:', options: ['Interest on your original deposit only', 'Interest calculated daily', 'Interest earned on both principal AND previously earned interest', 'A fixed interest payment'], correctAnswer: 'C', explanation: 'Compound interest is powerful — it means your earnings generate more earnings over time, accelerating growth.' },
    { question: 'Which loan type typically has the HIGHEST interest rate?', options: ['Mortgage', 'Car loan', 'Student loan', 'Payday loan'], correctAnswer: 'D', explanation: 'Payday loans can have APRs of 300–400%, making them extremely expensive compared to traditional loans.' },
    { question: 'A savings account with a higher interest rate means:', options: ['Your money grows faster', 'You pay more fees', 'Your money is riskier', 'You can withdraw less'], correctAnswer: 'A', explanation: 'Higher interest rates on savings accounts mean your deposits earn more over time.' },
  ],
  'Investing Basics': [
    { question: 'What is a stock?', options: ['A loan to a company', 'Ownership in a company', 'A government bond', 'A savings account'], correctAnswer: 'B', explanation: 'When you buy stock, you own a small piece of that company and benefit from its growth.' },
    { question: 'What does "diversification" mean in investing?', options: ['Putting all money in one great stock', 'Spreading investments across different assets to reduce risk', 'Investing only in bonds', 'Withdrawing money frequently'], correctAnswer: 'B', explanation: 'Diversification reduces risk — if one investment drops, others may hold steady or gain.' },
    { question: 'What is an index fund?', options: ['A fund managed by an expert picking individual stocks', 'A fund that tracks a market index like the S&P 500', 'A government savings bond', 'A high-risk crypto investment'], correctAnswer: 'B', explanation: 'Index funds passively track a market index, offering low fees and broad diversification.' },
    { question: 'What is the general relationship between risk and return?', options: ['Higher risk = lower potential return', 'Lower risk = higher potential return', 'Higher risk = higher potential return', 'Risk and return are unrelated'], correctAnswer: 'C', explanation: 'Investments with higher risk (like stocks) offer higher potential returns. Lower-risk assets like bonds typically earn less.' },
    { question: 'When is the BEST time to start investing?', options: ['After you retire', 'As soon as you have savings and an emergency fund', 'Only when the market is low', 'After age 40'], correctAnswer: 'B', explanation: 'Starting early maximizes compound growth. Time in the market matters more than timing the market.' },
  ],
  'Compound Interest': [
    { question: 'What is compound interest?', options: ['Interest on the original principal only', 'Interest earned on both principal and accumulated interest', 'A penalty fee', 'A fixed monthly payment'], correctAnswer: 'B', explanation: 'Compound interest means you earn interest on your interest, creating exponential growth over time.' },
    { question: 'If you invest $1,000 at 7% annual compound interest, roughly how much do you have after 10 years?', options: ['$700', '$1,700', '$1,967', '$7,000'], correctAnswer: 'C', explanation: 'Using the formula A = P(1+r)^n: $1,000 × (1.07)^10 ≈ $1,967. Your money nearly doubles in 10 years.' },
    { question: 'What is the "Rule of 72"?', options: ['Save 72% of your income', 'Divide 72 by your interest rate to estimate years to double your money', 'Retire at 72', 'Invest $72/month'], correctAnswer: 'B', explanation: 'Rule of 72: 72 ÷ interest rate = years to double. At 8%, money doubles in about 9 years.' },
    { question: 'Which account uses compound interest to WORK AGAINST you?', options: ['Savings account', 'Investment portfolio', 'Credit card debt', 'Money market account'], correctAnswer: 'C', explanation: 'Credit card debt compounds at high rates (often 20%+), meaning unpaid balances grow exponentially.' },
    { question: 'How does compounding frequency affect growth?', options: ['Less frequent compounding grows faster', 'More frequent compounding grows faster', 'Frequency has no effect', 'Annual compounding is always best'], correctAnswer: 'B', explanation: 'Daily compounding generates slightly more than monthly, which generates more than annual compounding.' },
  ],
};

const GENERIC_QUIZ = [
  { question: 'What is the first step to improving your personal finances?', options: ['Invest immediately', 'Track your spending and income', 'Apply for more credit', 'Ignore debt'], correctAnswer: 'B', explanation: 'You can\'t improve what you don\'t measure. Tracking spending reveals where your money actually goes.' },
  { question: 'Which habit has the most impact on long-term financial health?', options: ['Spending on experiences', 'Paying yourself first (saving before spending)', 'Only using credit cards', 'Avoiding all risk'], correctAnswer: 'B', explanation: 'Paying yourself first — automatically saving a portion of income — builds wealth consistently over time.' },
  { question: 'What is "financial literacy"?', options: ['Being good at math', 'Understanding and using financial skills effectively', 'Having a lot of money', 'Working in finance'], correctAnswer: 'B', explanation: 'Financial literacy is the ability to understand and apply financial concepts to make informed money decisions.' },
  { question: 'Which best describes the purpose of an interest rate?', options: ['A penalty for saving', 'The cost of borrowing money or the reward for saving', 'A government tax', 'A type of investment'], correctAnswer: 'B', explanation: 'Interest rates represent either the cost you pay to borrow money or the reward you earn for saving it.' },
  { question: 'What does it mean to "live below your means"?', options: ['Being extremely poor', 'Spending less than you earn', 'Never enjoying money', 'Avoiding all investments'], correctAnswer: 'B', explanation: 'Living below your means — spending less than you earn — creates the surplus needed to save and invest.' },
];

function getStaticQuiz(topic) {
  const questions = STATIC_QUIZZES[topic] || GENERIC_QUIZ;
  return questions.map(q => ({ ...q }));
}

// Normalize a quiz question from any backend source into a consistent shape.
// Handles HuggingFace format (options + correctAnswer letter/text) and
// the fallback template format (brutalHonestFeedback instead of explanation).
function normalizeQuestion(q) {
  // Ensure correctAnswer is always a single uppercase letter (A–D).
  // The HuggingFace model sometimes returns "A) full option text" instead of "A".
  let correctAnswer = String(q.correctAnswer ?? '').trim();
  if (/^[A-D]/i.test(correctAnswer)) {
    correctAnswer = correctAnswer[0].toUpperCase();
  } else if (typeof q.correctIndex === 'number') {
    correctAnswer = OPTION_LABELS[q.correctIndex] || 'A';
  } else {
    correctAnswer = 'A';
  }

  return {
    ...q,
    options: q.options || q.choices || [],
    correctAnswer,
    explanation: q.explanation || q.brutalHonestFeedback || '',
  };
}

// ── Shared UI components ──────────────────────────────────────────────────────

function GlassCard({ children, style = {} }) {
  return (
    <div style={{
      position: 'relative',
      background: 'rgba(255,255,255,0.22)',
      backdropFilter: 'blur(24px) saturate(200%)',
      WebkitBackdropFilter: 'blur(24px) saturate(200%)',
      borderTop:    '1.5px solid rgba(255,255,255,0.65)',
      borderLeft:   '1.5px solid rgba(255,255,255,0.65)',
      borderBottom: '1.5px solid rgba(247,160,184,0.28)',
      borderRight:  '1.5px solid rgba(247,160,184,0.28)',
      borderRadius: 24,
      boxShadow: '0 16px 48px rgba(247,160,184,0.18), 0 6px 20px rgba(192,132,252,0.10)',
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.72), transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 1, background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.52), transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

function GradBtn({ children, onClick, disabled, fullWidth, gradient, style = {} }) {
  const bg = gradient || DEFAULT_GRAD;
  return (
    <motion.button
      whileHover={!disabled ? { y: -1, boxShadow: '0 10px 28px rgba(192,132,252,0.38)' } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onClick} disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '14px 28px', borderRadius: 16, border: 'none',
        background: disabled ? 'rgba(200,160,175,0.25)' : bg,
        color: disabled ? C_BASE.label : '#fff',
        fontFamily: F.ui, fontWeight: 600, fontSize: 14,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        boxShadow: disabled ? 'none' : '0 6px 20px rgba(192,132,252,0.28)',
        transition: 'all 0.18s ease',
        ...style,
      }}
    >{children}</motion.button>
  );
}

function GlassBtn({ children, onClick, style = {} }) {
  return (
    <motion.button
      whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '12px 20px', borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.55)',
        background: 'rgba(255,255,255,0.30)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        color: C.deepRose, fontFamily: F.ui, fontWeight: 500, fontSize: 13,
        cursor: 'pointer', ...style,
      }}
    >{children}</motion.button>
  );
}

function ShimmerBlock({ h = 120 }) {
  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', height: h, background: 'rgba(255,255,255,0.20)', border: '1.5px solid rgba(255,255,255,0.50)' }}>
      <motion.div
        animate={{ x: ['-100%','100%'] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(247,160,184,0.20), transparent)' }}
      />
    </div>
  );
}

function ChibiThumb({ char }) {
  const [loaded, setLoaded] = useState(false);
  if (!char) return null;
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
      background: `radial-gradient(circle at 40% 35%, rgba(${rgb(char.colors.primary)},0.40), rgba(${rgb(char.colors.secondary)},0.20) 70%, transparent)`,
      border: `2px solid rgba(${rgb(char.colors.primary)},0.45)`,
      boxShadow: `0 0 10px ${char.colors.glow}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <img src={char.chibiImage} alt={char.name}
        onLoad={() => setLoaded(true)} onError={e => { e.target.style.display = 'none'; }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', opacity: loaded ? 1 : 0, mixBlendMode: 'screen' }}
      />
    </div>
  );
}

// ── Animated SP counter ───────────────────────────────────────────────────────
function SPCounter({ target }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const step = Math.max(1, Math.ceil(target / 30));
    let cur = 0;
    const iv = setInterval(() => {
      cur = Math.min(cur + step, target);
      setVal(cur);
      if (cur >= target) clearInterval(iv);
    }, 40);
    return () => clearInterval(iv);
  }, [target]);
  return <span>{val}</span>;
}

// ── Explanation section card ───────────────────────────────────────────────────
function SectionCard({ section, content }) {
  const { Icon, title, num } = section;
  const paragraphs = (content || '').split(/\n\n+/).filter(Boolean);

  return (
    <GlassCard>
      <div style={{ padding: '28px 32px' }}>
        {/* Section label row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'rgba(247,160,184,0.12)', border: '1px solid rgba(247,160,184,0.28)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={17} color={C.pink} strokeWidth={1.8} />
          </div>
          <div>
            <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.label }}>
              Section {num} of {SECTIONS.length}
            </div>
            <div style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.deepRose }}>
              {title}
            </div>
          </div>
        </div>

        {/* Body paragraphs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {paragraphs.map((p, i) => {
            const isMath = /\$[\d,]+|[\d]+%|\s=\s[\d]/.test(p);
            return (
              <p key={i} style={{
                fontFamily: isMath ? 'monospace' : F.ui,
                fontSize: isMath ? 13 : 15,
                fontWeight: 400,
                lineHeight: 1.76,
                color: C.body,
                margin: 0,
                padding: isMath ? '12px 16px' : 0,
                background: isMath ? 'rgba(247,160,184,0.06)' : 'transparent',
                borderRadius: isMath ? 10 : 0,
                border: isMath ? '1px solid rgba(247,160,184,0.18)' : 'none',
                whiteSpace: isMath ? 'pre-wrap' : 'normal',
              }}>{p}</p>
            );
          })}
        </div>

        {/* Analogy callout (section 1 only) */}
        {section.key === 'analogy' && (
          <div style={{
            marginTop: 22, padding: '14px 18px', borderRadius: 14,
            background: 'rgba(247,160,184,0.08)', border: '1px solid rgba(247,160,184,0.22)',
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <Sparkles size={15} color={C.pink} strokeWidth={1.8} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontFamily: F.italic, fontStyle: 'italic', fontSize: 13, color: C.midRose, margin: 0, lineHeight: 1.65 }}>
              Think of your financial decisions like curating a capsule wardrobe — every choice should coordinate with everything else you own.
            </p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

// ── Quiz option card ───────────────────────────────────────────────────────────
function OptionCard({ label, option, isSelected, isCorrect, isWrong, submitted, onSelect }) {
  const stateColor = isCorrect ? '#7ec9a0' : isWrong ? '#e87070' : isSelected ? C.pink : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={isWrong
        ? { x: [-4, 4, -3, 3, 0], opacity: 1 }
        : { opacity: 1, x: 0 }
      }
      transition={isWrong ? { duration: 0.35 } : { duration: 0.25 }}
      whileHover={!submitted ? { y: -2, transition: { duration: 0.15 } } : undefined}
      onClick={() => !submitted && onSelect(label)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '15px 18px', borderRadius: 18, minHeight: 52,
        cursor: submitted ? 'default' : 'pointer',
        background: isCorrect
          ? 'rgba(126,201,160,0.13)'
          : isWrong
            ? 'rgba(232,112,112,0.10)'
            : isSelected
              ? 'rgba(247,160,184,0.12)'
              : 'rgba(255,255,255,0.26)',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        borderTop:    '1px solid rgba(255,255,255,0.62)',
        borderLeft:   '1px solid rgba(255,255,255,0.55)',
        borderBottom: stateColor ? `1.5px solid rgba(${rgb(stateColor)},0.50)` : '1px solid rgba(247,160,184,0.18)',
        borderRight:  stateColor ? `1.5px solid rgba(${rgb(stateColor)},0.35)` : '1px solid rgba(247,160,184,0.18)',
        boxShadow: isCorrect
          ? '0 0 18px rgba(126,201,160,0.22)'
          : isSelected && !submitted
            ? `0 0 16px rgba(${rgb(C.pink)},0.18)`
            : 'none',
        transition: 'all 0.20s ease',
      }}
    >
      {/* Letter badge */}
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isCorrect
          ? 'rgba(126,201,160,0.22)'
          : isWrong
            ? 'rgba(232,112,112,0.18)'
            : isSelected
              ? `rgba(${rgb(C.pink)},0.18)`
              : 'rgba(255,255,255,0.38)',
        border: stateColor
          ? `1px solid rgba(${rgb(stateColor)},0.48)`
          : '1px solid rgba(255,255,255,0.58)',
        transition: 'all 0.20s ease',
      }}>
        {isCorrect
          ? <Check size={14} color="#5aaa7a" strokeWidth={2.5} />
          : isWrong
            ? <X size={14} color="#c04040" strokeWidth={2.5} />
            : <span style={{ fontFamily: F.ui, fontWeight: 600, fontSize: 12, color: isSelected ? C.deepRose : C.label }}>{label}</span>
        }
      </div>

      {/* Text */}
      <span style={{
        flex: 1,
        fontFamily: F.ui, fontWeight: 400, fontSize: 14,
        color: isCorrect ? '#4a9a6a' : isWrong ? '#b03030' : isSelected ? C.deepRose : C.body,
        lineHeight: 1.45,
        transition: 'color 0.20s ease',
      }}>
        {optText(option)}
      </span>

      {/* Selected checkmark (pre-submit) */}
      {isSelected && !submitted && (
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          style={{ width: 18, height: 18, borderRadius: '50%', background: C.pink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <Check size={10} strokeWidth={3} color="#fff" />
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function FashionLearning() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const ctx = useOutletContext() || {};
  const { fashionCharacter, fashionColor: charPrimary, fashionSecondary: charSecondary, fashionGlow: charGlow, fashionGradient: charGradient } = ctx;

  // Dynamic accent colors driven by selected character
  const C = { ...C_BASE, pink: charPrimary || C_BASE.pink, midRose: charSecondary || C_BASE.midRose };
  const GRAD = charGradient || 'linear-gradient(135deg,#f7a0b8,#c084fc,#fbb6c4)';
  const { profile, addTopicProgress, completedTopics } = useUser();
  const toast = useToast();
  const { xp, level, awardXP, checkBadgeUnlock, badgeNotification } = useGamification();

  const topic      = location.state?.topic;
  const nextTopic  = location.state?.nextTopic || null;
  const topicMeta  = topic ? getTopicMeta(topic) : null;
  const distLabel = topicMeta
    ? `${topicMeta.district.name.toUpperCase()} · LOOK ${topicMeta.lookNumber}`
    : '';

  // ── Stage: loading | explanation | quiz | complete | error ────────────────
  const [stage,    setStage]    = useState('loading');

  // Fire celebration when stage transitions to 'complete'
  useEffect(() => {
    if (stage === 'complete') {
      const t = setTimeout(() => fireFashionCelebration(C.pink), 400);
      return () => clearTimeout(t);
    }
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps
  const [expl,     setExpl]     = useState(null);
  const [error,    setError]    = useState(null);
  const [variation,setVariation]= useState(0);
  const [regenning,setRegenning]= useState(false);

  // Explanation navigation
  const [secIdx,   setSecIdx]   = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [scenarioQuiz, setScenarioQuiz] = useState(null);
  const [qIdx,     setQIdx]     = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted,setSubmitted]= useState(false);
  const scoreRef                = useRef(0);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [passed,   setPassed]   = useState(false);

  // ── Load explanation ──────────────────────────────────────────────────────
  const loadExpl = useCallback(async (v = 0, isRegen = false) => {
    setError(null);
    if (!isRegen) { setStage('loading'); setSecIdx(0); }
    else setRegenning(true);
    try {
      const cached = getEx(topic, v);
      if (cached && !isRegen) { setExpl(cached); setStage('explanation'); return; }
      const res = await getExplanation(topic, 'fashion', profile?.difficulty || 'beginner', v);
      if (res.success) {
        setExpl(res.explanation);
        setEx(topic, v, res.explanation);
        setStage('explanation');
        const explXpKey = `finlit_expl_xp_${topic?.replace(/\s+/g,'_')}`;
        if (!isRegen && !localStorage.getItem(explXpKey)) {
          setTimeout(() => { awardXP?.readExplanation?.(); try { localStorage.setItem(explXpKey,'1'); } catch {} }, 800);
        }
      } else {
        const fallback = getStaticExplanation(topic);
        setExpl(fallback);
        setEx(topic, v, fallback);
        setStage('explanation');
        setError('Could not reach server — showing curated content.');
      }
    } catch (e) {
      console.error('[FashionLearning]', e);
      const fallback = getStaticExplanation(topic);
      setExpl(fallback);
      setEx(topic, v, fallback);
      setStage('explanation');
      setError('Connection issue — showing curated content.');
    } finally {
      if (isRegen) setRegenning(false);
    }
  }, [topic, profile, awardXP]);

  useEffect(() => {
    if (!topic) { navigate('/fashion/map'); return; }
    loadExpl(0);
  }, [topic]); // eslint-disable-line

  const handleRegen = () => {
    const next = (variation + 1) % 3;
    setVariation(next);
    loadExpl(next, true);
  };

  // ── Load quiz ─────────────────────────────────────────────────────────────
  const startQuiz = async () => {
    setError(null);
    setStage('loading');
    setQIdx(0); setSelected(null); setSubmitted(false);
    setScenarioQuiz(null);
    scoreRef.current = 0; setScoreDisplay(0);

    // 1. Try scenario quiz (3-level: fitting → numbers → grand finale)
    try {
      const scenRes = await generateScenarioQuiz(topic, 'fashion', profile?.difficulty || 'beginner', 0);
      if (scenRes.success && scenRes.questions?.length === 5) {
        setScenarioQuiz({ questions: scenRes.questions, scenarioTitle: scenRes.scenarioTitle, scenarioContext: scenRes.scenarioContext });
        setStage('quiz');
        return;
      }
    } catch (scenErr) {
      console.warn('[FashionLearning] Scenario quiz unavailable, falling back:', scenErr.message);
    }

    // 2. Try standard quiz API
    try {
      const cached = getQz(topic);
      if (cached) {
        setQuestions(cached.map(normalizeQuestion));
        setStage('quiz');
        return;
      }
      const res = await getQuiz(topic, 'fashion', profile?.difficulty || 'beginner');
      if (res.success && res.questions?.length) {
        const normalized = res.questions.map(normalizeQuestion);
        setQuestions(normalized);
        setQz(topic, normalized);
        setStage('quiz');
        return;
      }
    } catch (e) {
      console.warn('[FashionLearning] Standard quiz unavailable, using static fallback:', e.message);
    }

    // 3. Static fallback — always works
    const fallback = getStaticQuiz(topic);
    setQuestions(fallback);
    setQz(topic, fallback);
    setStage('quiz');
  };

  // ── Quiz handlers ─────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    const isCorrect = selected === questions[qIdx]?.correctAnswer;
    if (isCorrect) {
      scoreRef.current += 1;
      setScoreDisplay(scoreRef.current);
    }
  };

  const handleNext = () => {
    if (qIdx < questions.length - 1) {
      setQIdx(i => i + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const finalScore = scoreRef.current;
    const didPass    = finalScore >= PASS_SCORE;
    const alreadyDone = completedTopics.includes(topic);
    setPassed(didPass);
    clearQz(topic);
    if (!alreadyDone) awardXP?.completeQuiz?.(finalScore, questions.length);
    if (didPass) {
      if (!alreadyDone) {
        addTopicProgress({ topic, score: finalScore, totalQuestions: questions.length, difficulty: profile?.difficulty || 'beginner' });
        checkBadgeUnlock('FIRST_LESSON');
        const newCount1 = completedTopics.length + 1;
        if (newCount1 >= 10) checkBadgeUnlock('TOPIC_MASTER', newCount1);
      }
      setStage('complete');

    } else {
      setStage('diagnosis');
    }
  };

  // Called by NeoQuizEnvironment / ScenarioQuizEnvironment when done
  const handleQuizComplete = (score, totalQuestions) => {
    scoreRef.current = score;
    setScoreDisplay(score);
    const pct = Math.round((score / totalQuestions) * 100);
    if (pct >= 70) toast.celebration(`Topic complete! ${pct}%`);
    else           toast.warning(`You scored ${pct}% — aim for 70% to master it.`);
    const didPass = score >= Math.ceil(totalQuestions * 0.6);
    setPassed(didPass);
    clearQz(topic);
    try { sessionStorage.removeItem(`finlit_scenario_prog_${(topic || '').replace(/\s+/g,'_')}`); } catch {}
    try { sessionStorage.removeItem(`finlit_quiz_prog_${(topic || '').replace(/\s+/g,'_')}`); } catch {}
    const alreadyDoneQ = completedTopics.includes(topic);
    if (!alreadyDoneQ) awardXP?.completeQuiz?.(score, totalQuestions);
    if (didPass) {
      if (!alreadyDoneQ) {
        addTopicProgress({ topic, score, totalQuestions, difficulty: profile?.difficulty || 'beginner' });
        checkBadgeUnlock('FIRST_LESSON');
        const newCount = completedTopics.length + 1;
        if (newCount >= 10) checkBadgeUnlock('TOPIC_MASTER', newCount);
      }
      setStage('complete');

    } else {
      setStage('diagnosis');
    }
  };

  const retryQuiz = () => {
    clearQz(topic);
    try { sessionStorage.removeItem(`finlit_scenario_prog_${(topic || '').replace(/\s+/g,'_')}`); } catch {}
    try { sessionStorage.removeItem(`finlit_quiz_prog_${(topic || '').replace(/\s+/g,'_')}`); } catch {}
    setScenarioQuiz(null);
    startQuiz();
  };

  // ── Computed ──────────────────────────────────────────────────────────────
  const currentSection  = SECTIONS[secIdx];
  const isLastSection   = secIdx === SECTIONS.length - 1;
  const currentQ        = questions[qIdx];
  const isLastQ         = qIdx === questions.length - 1;
  const quizTotal       = scenarioQuiz ? scenarioQuiz.questions.length : questions.length;
  const spEarned        = scoreRef.current * 50 + (scoreRef.current === quizTotal && quizTotal > 0 ? 100 : 0);
  // Support both { sections: {...} } (new format) and flat sections object (legacy)
  const sectionData     = expl?.sections || expl || {};

  if (!topic) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: '20px 24px', maxWidth: 720, margin: '0 auto 60px' }}
    >

      {/* ── Top bar (sticky) ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(250,245,236,0.92)',
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(247,160,184,0.22)',
        marginBottom: 20, padding: '10px 0',
        marginLeft: -24, marginRight: -24, paddingLeft: 24, paddingRight: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.button
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}
            onClick={() => navigate('/fashion/map')}
            style={{
              width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(255,255,255,0.35)',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.62)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={18} color={C.deepRose} />
          </motion.button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 9, letterSpacing: '0.20em', textTransform: 'uppercase', color: C.label, marginBottom: 2 }}>
              {distLabel}
            </div>
            <h1 style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 20, letterSpacing: '-0.01em', color: C.deepRose, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {topic}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
              <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.label }}>Lv {level}</span>
              <span style={{
                padding: '2px 8px', borderRadius: 6,
                background: 'rgba(247,160,184,0.15)', border: '1px solid rgba(247,160,184,0.38)',
                fontFamily: F.ui, fontWeight: 700, fontSize: 10, color: C.deepRose,
              }}>{xp} XP</span>
            </div>
          </div>

          {stage === 'explanation' && (
            <motion.button
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={handleRegen} disabled={regenning}
              title="Explain differently"
              style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: 'rgba(255,255,255,0.32)', border: '1px solid rgba(255,255,255,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: regenning ? 'not-allowed' : 'pointer', opacity: regenning ? 0.5 : 1,
              }}
            >
              <RefreshCw size={14} color={C.midRose} style={{ animation: regenning ? 'spin 1s linear infinite' : 'none' }} />
            </motion.button>
          )}

          <ChibiThumb char={fashionCharacter} />
        </div>
      </div>

      {/* ── Badge unlock notification ── */}
      <AnimatePresence>
        {badgeNotification && (
          <motion.div
            key="badge-notif"
            initial={{ opacity: 0, x: 60, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            style={{ position: 'fixed', top: 80, right: 24, zIndex: 9000, pointerEvents: 'none' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 999,
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(247,160,184,0.65)',
              boxShadow: '0 8px 24px rgba(247,160,184,0.32)',
              fontFamily: F.ui, fontWeight: 600, fontSize: 13, color: C.deepRose,
            }}>
              <Star size={14} color={C.pink} fill={C.pink} />
              <span>BADGE UNLOCKED · {badgeNotification.name}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error toast ── */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 12, background: 'rgba(232,112,112,0.10)', border: '1px solid rgba(232,112,112,0.28)', fontFamily: F.ui, fontSize: 13, color: '#b03030' }}>
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* ══ LOADING ══════════════════════════════════════════════════════ */}
        {stage === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p style={{ textAlign: 'center', fontFamily: F.italic, fontStyle: 'italic', fontSize: 18, color: C.midRose, marginBottom: 24 }}>
              Curating your lesson...
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <ShimmerBlock h={52} />
              <ShimmerBlock h={220} />
              <ShimmerBlock h={56} />
            </div>
          </motion.div>
        )}

        {/* ══ EXPLANATION ══════════════════════════════════════════════════ */}
        {stage === 'explanation' && expl && (expl.sections || expl.analogy) && (
          <motion.div key="explanation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>

            {/* Progress bar pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
              {SECTIONS.map((s, i) => {
                const active = i === secIdx;
                const done   = i < secIdx;
                return (
                  <motion.div
                    key={s.key}
                    onClick={() => setSecIdx(i)}
                    whileHover={{ scaleY: 1.5 }}
                    style={{
                      height: 6, flex: 1, borderRadius: 99, cursor: 'pointer',
                      background: done
                        ? C.pink
                        : active
                          ? GRAD
                          : 'rgba(255,255,255,0.35)',
                      border: '1px solid rgba(255,255,255,0.52)',
                      boxShadow: active ? '0 0 8px rgba(247,160,184,0.45)' : 'none',
                      transition: 'background 0.3s, box-shadow 0.3s',
                    }}
                  />
                );
              })}
              <span style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 10, color: C.label, whiteSpace: 'nowrap', marginLeft: 6 }}>
                {secIdx + 1} / {SECTIONS.length}
              </span>
            </div>

            {/* Section card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={secIdx}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.24 }}
                style={{ marginBottom: 22 }}
              >
                <SectionCard section={currentSection} content={sectionData[currentSection?.key]} />
              </motion.div>
            </AnimatePresence>

            {/* Navigation row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <GlassBtn
                onClick={() => secIdx > 0 && setSecIdx(i => i - 1)}
                style={{ opacity: secIdx === 0 ? 0.42 : 1, pointerEvents: secIdx === 0 ? 'none' : 'auto' }}
              >
                <ChevronLeft size={15} /> Previous
              </GlassBtn>

              {isLastSection ? (
                <GradBtn gradient={GRAD} onClick={startQuiz} style={{ flex: 1, maxWidth: 260 }}>
                  Take the Quiz <ChevronRight size={15} />
                </GradBtn>
              ) : (
                <GradBtn gradient={GRAD} onClick={() => setSecIdx(i => i + 1)} style={{ flex: 1, maxWidth: 260 }}>
                  Next Section <ChevronRight size={15} />
                </GradBtn>
              )}
            </div>
          </motion.div>
        )}

        {/* ══ QUIZ ═════════════════════════════════════════════════════════ */}
        {stage === 'quiz' && (scenarioQuiz || questions.length > 0) && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {scenarioQuiz ? (
              <ScenarioQuizEnvironment
                questions={scenarioQuiz.questions}
                topic={topic}
                scenarioTitle={scenarioQuiz.scenarioTitle}
                scenarioContext={scenarioQuiz.scenarioContext}
                onComplete={handleQuizComplete}
                fashionMode
              />
            ) : (
              <NeoQuizEnvironment
                questions={questions}
                topic={topic}
                onComplete={handleQuizComplete}
                fashionMode
              />
            )}
          </motion.div>
        )}

        {/* ══ COMPLETE ═════════════════════════════════════════════════════ */}
        {/* ══ DIAGNOSIS ═══════════════════════════════════════════════════════ */}
        {stage === 'diagnosis' && (
          <motion.div key="diagnosis" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard>
              <div style={{ padding: '40px 32px', textAlign: 'center' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(247,160,184,0.12)', border: '2px solid rgba(247,160,184,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 22px',
                }}>
                  <RotateCcw size={32} color={C.pink} />
                </div>
                <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.label, marginBottom: 10 }}>
                  Style Review
                </div>
                <h2 style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 28, letterSpacing: '-0.02em', color: C.deepRose, margin: '0 0 8px' }}>
                  A Touch-Up is Needed
                </h2>
                <p style={{ fontFamily: F.italic, fontStyle: 'italic', fontSize: 18, color: C.midRose, margin: '0 0 12px' }}>
                  {scoreRef.current} out of {quizTotal} — every icon refines their look.
                </p>
                <p style={{ fontFamily: F.ui, fontSize: 13, color: C.body, lineHeight: 1.7, maxWidth: 380, margin: '0 auto 32px' }}>
                  You need 60% to add this look to your wardrobe. Review the lesson to reinforce the key concepts, then give the quiz another try.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                  <GradBtn gradient={GRAD} onClick={() => { setStage('explanation'); setSecIdx(0); }}>
                    <RefreshCw size={15} /> Review the Lesson
                  </GradBtn>
                  <GlassBtn onClick={retryQuiz}>
                    <RotateCcw size={14} /> Try Again
                  </GlassBtn>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ══ COMPLETE ══════════════════════════════════════════════════════════ */}
        {stage === 'complete' && (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.90 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <GlassCard>
              <div style={{ padding: '40px 32px', textAlign: 'center' }}>

                {/* Star badge (pass only) */}
                {passed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.18, 1] }}
                    transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.15 }}
                    style={{ marginBottom: 22 }}
                  >
                    <motion.div
                      animate={{ boxShadow: ['0 0 18px rgba(253,230,138,0.38)', '0 0 38px rgba(253,230,138,0.65)', '0 0 18px rgba(253,230,138,0.38)'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(253,230,138,0.12)', border: '2px solid rgba(253,230,138,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}
                    >
                      <Star size={34} color="#fde68a" fill="#fde68a" />
                    </motion.div>
                  </motion.div>
                )}

                {/* Section label */}
                <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.label, marginBottom: 10 }}>
                  Quiz Complete
                </div>

                {/* Score */}
                <h2 style={{ fontFamily: F.heading, fontWeight: 600, fontSize: 42, letterSpacing: '-0.02em', color: C.deepRose, margin: '0 0 8px' }}>
                  {scoreRef.current} out of {quizTotal}
                </h2>

                {/* Result line */}
                <p style={{ fontFamily: F.italic, fontStyle: 'italic', fontSize: 20, color: C.midRose, margin: '0 0 32px' }}>
                  {scoreRef.current === quizTotal ? 'Absolutely flawless, darling!'
                    : scoreRef.current >= quizTotal * 0.8 ? 'Stunning work, almost perfect!'
                    : scoreRef.current >= quizTotal * 0.6 ? 'A solid foundation to build on.'
                    : scoreRef.current >= quizTotal * 0.4 ? 'Every icon starts somewhere.'
                    : 'Time for a style refresh, darling.'}
                </p>

                {/* Stats pills */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 12, marginBottom: 32 }}>
                  {[
                    { label: 'Style Points', value: <><SPCounter target={spEarned} /> SP</> },
                    { label: 'Accuracy',     value: `${Math.round((scoreRef.current / (quizTotal || 1)) * 100)}%` },
                    { label: 'Status',       value: passed ? 'Styled ✓' : 'Keep Going' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      padding: '14px 10px', borderRadius: 18, textAlign: 'center',
                      background: 'rgba(255,255,255,0.30)',
                      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.52)',
                    }}>
                      <div style={{ fontFamily: F.ui, fontWeight: 700, fontSize: 20, color: C.deepRose, marginBottom: 4 }}>{value}</div>
                      <div style={{ fontFamily: F.ui, fontWeight: 500, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.label }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'stretch' }}>
                  {passed && nextTopic && (
                    <GradBtn gradient={GRAD} onClick={() => navigate('/fashion/learn', { state: { topic: nextTopic } })} style={{ width: '100%' }}>
                      Next Look: {nextTopic} <ChevronRight size={15} />
                    </GradBtn>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                    <GlassBtn onClick={() => navigate('/fashion/map')}>
                      <MapIcon size={15} /> {passed && nextTopic ? 'Runway Map' : 'Back to Runway Map'}
                    </GlassBtn>
                    {!passed && (
                      <GlassBtn onClick={retryQuiz}>
                        <RotateCcw size={14} /> Retry Quiz
                      </GlassBtn>
                    )}
                    {passed && (
                      <GlassBtn onClick={() => { setStage('explanation'); setSecIdx(0); }}>
                        Review Lesson
                      </GlassBtn>
                    )}
                    <GlassBtn onClick={() => setShowHistory(true)}>
                      <BarChart2 size={14} /> Past Attempts
                    </GlassBtn>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ══ ERROR ════════════════════════════════════════════════════════ */}
        {stage === 'error' && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: '60px 0' }}>
            <GlassCard style={{ maxWidth: 360, margin: '0 auto' }}>
              <div style={{ padding: '40px 32px' }}>
                <p style={{ fontFamily: F.italic, fontStyle: 'italic', fontSize: 18, color: C.midRose, marginBottom: 20 }}>
                  Something went wrong, darling.
                </p>
                <GradBtn gradient={GRAD} onClick={() => loadExpl(0)}>Try Again</GradBtn>
              </div>
            </GlassCard>
          </motion.div>
        )}

      </AnimatePresence>

      <QuizHistoryModal
        open={showHistory}
        onClose={() => setShowHistory(false)}
        topicNames={['Budgeting Basics','Saving Money','Emergency Funds','Simple Interest','Compound Interest','Credit Scores','Investing Basics','Stocks & Bonds','Debt Management','Retirement Accounts','Tax Fundamentals','Portfolio Diversification','Advanced Planning']}
        accent={C.pink}
        theme={{
          surface: 'rgba(255,255,255,0.92)', border: 'rgba(247,160,184,0.4)',
          textPrimary: '#9d1f4a', textMuted: '#b0627a',
          radius: 18, fontHeading: "'Playfair Display', serif", fontBody: "'DM Sans', sans-serif",
        }}
        onRetry={(tp) => { setShowHistory(false); navigate('/fashion/learn', { state: { topic: tp } }); }}
      />
    </motion.div>
  );
}
