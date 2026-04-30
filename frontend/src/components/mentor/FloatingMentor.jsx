// FINLIT - Floating Mentor Component (IMPROVED AI + NEO-BRUTAL DESIGN)
// Proactive AI Chat Tutor with STRICT Interest-Based Analogies

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGamification from '../../hooks/useGamification';

const FloatingMentor = ({ currentTopic, userInterest, isVisible = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { awardXP } = useGamification();

  // Randomized openers to avoid repetition
  const getRandomOpener = () => {
    const openers = [
      `Hey! I'm your FINLIT mentor. Questions about "${currentTopic}"? I'll explain it through ${userInterest} - no boring textbook vibes! 🎯`,
      `What's up! Ready to master "${currentTopic}"? I break down finance using ${userInterest} concepts you already know. Let's go! 🚀`,
      `Alright! Finance coach here. Need help with "${currentTopic}"? I translate everything into ${userInterest} terms. Ask away! 💡`,
      `Sup! Got your FINLIT mentor ready. "${currentTopic}" confusing you? I explain finance ONLY through ${userInterest}. Fire when ready! 🔥`,
      `Hey there! Your finance guide is locked in. Questions on "${currentTopic}"? I map every concept to ${userInterest} - way more relatable! ⚡`
    ];
    return openers[Math.floor(Math.random() * openers.length)];
  };

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: getRandomOpener()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Micro-depth helper buttons
  const quickActions = [
    { label: '💡 ELI5', prompt: `Explain ${currentTopic} like I'm 5 years old. Super simple!` },
    { label: `🎮 ${userInterest} Analogy`, prompt: `Give me a ${userInterest} analogy to understand ${currentTopic}. ONLY use ${userInterest} terminology and examples.` },
    { label: '🎓 Why Care?', prompt: `Why should a student care about ${currentTopic}? Give me practical, real reasons.` }
  ];

  const handleSend = async (customMessage = null) => {
    const messageText = customMessage || input.trim();
    if (!messageText || isLoading) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Award XP for using chat
    awardXP.useChat();

    try {
      // STRICT Interest-Based Mentor Prompt
      const mentorPrompt = `You are a sassy, brilliant financial coach for FINLIT.

CRITICAL RULES:
1. You MUST relate EVERYTHING to ${userInterest}
2. Use ${userInterest} terminology, examples, and analogies EXCLUSIVELY
3. No generic explanations - every answer ties back to ${userInterest}
4. Keep responses under 120 words
5. Be confident, slightly cocky, but helpful
6. End with a challenge or actionable tip

Topic: ${currentTopic}
User's Interest: ${userInterest}

User: ${messageText}

RESPOND AS THE MENTOR (remember: ${userInterest} analogies ONLY):`;

      // Fallback response (uses interest-based analogy with varied openers)
      const getRandomResponse = (interestKey) => {
        const responses = {
          'gaming': [
            `Think of ${currentTopic} like XP grinding. Small daily gains compound into massive levels. You wouldn't skip early-game quests and expect to beat the final boss, right? Same with your money - stack those resources early.`,
            `${currentTopic} is basically your financial tech tree. Unlock the right skills first, and later upgrades become easier. Skip the fundamentals? You'll be stuck at Level 1 while everyone else raids endgame content.`,
            `Imagine ${currentTopic} as your in-game economy. Smart players don't blow all their gold on cosmetics - they invest in gear that multiplies their earning potential. Your real money works the same way.`
          ],
          'writing': [
            `${currentTopic} is narrative structure for your finances. You're setting up your money's story arc - exposition (income), rising action (saving), climax (big goals). Skip the setup? Your plot falls apart.`,
            `Picture ${currentTopic} like editing a manuscript. First draft = your raw income. Revisions = budgeting. Final polish = optimized savings. Rush it, and your financial story reads like a mess.`,
            `${currentTopic} works like character development. Your money habits are the protagonist's journey. Consistent small decisions create a satisfying arc. Random impulse moves? That's bad writing.`
          ],
          'sports': [
            `${currentTopic} is like training periodization. You don't peak for every single practice - you build base fitness (savings), add intensity (investing), then perform when it matters (goals). Train smart, not random.`,
            `Think ${currentTopic} as your game strategy. You wouldn't burn all your energy in Q1, right? Pace your spending, conserve resources, dominate the 4th quarter when stakes are high.`,
            `${currentTopic} is your financial playbook. Every successful team studies plays before game day. Your money needs the same prep - know the rules, drill the fundamentals, execute under pressure.`
          ],
          'music': [
            `${currentTopic} is like mixing a track. Balance your frequencies - income (bass), expenses (mids), savings (highs). Too much of one thing? Your mix sounds trash. Keep it balanced.`,
            `Picture ${currentTopic} as song structure. Verse = earning, chorus = spending on what matters, bridge = saving for something special. No structure? Just noise.`,
            `${currentTopic} works like mastering audio. You compress dynamics (control spending spikes), add EQ (optimize budget), and output a polished track (financial stability). Skip mastering? Amateur hour.`
          ],
          'fashion': [
            `${currentTopic} is capsule wardrobe thinking for your money. Invest in versatile, quality pieces (emergency fund, retirement) over trendy fast-fashion purchases that drain your wallet.`,
            `Think ${currentTopic} like styling fundamentals. Every outfit needs a foundation - your finances are the same. Build the basics first, then accessorize (fun spending) with what's left.`,
            `${currentTopic} is your financial fit check. Color theory = budget balance. Proportions = income vs expenses. Layering = multiple income streams. Dress sloppy? Your money shows it.`
          ],
          'computer science': [
            `${currentTopic} is basically Big O optimization for your wallet. O(n²) spending habits = exponential debt. O(log n) saving strategy = compound growth that scales. Optimize your money like you optimize code.`,
            `Think of ${currentTopic} like managing technical debt. Ignore it (credit cards, impulse buys), and it compounds until your whole system crashes. Refactor early (save, budget), and your financial codebase stays clean.`,
            `${currentTopic} works like API rate limiting. You have finite resources (income). Exceed your rate limit (budget), and you get throttled (debt). Stay within limits, and your system runs smooth.`,
            `Picture ${currentTopic} as memory management. Memory leaks (subscription creep, lifestyle inflation) drain resources silently. Garbage collect regularly (audit spending), or watch your system slow to a crawl.`,
            `${currentTopic} is like latency vs throughput trade-offs. Low latency spending (instant gratification) tanks your throughput (long-term wealth). Batch your purchases, optimize for sustained gains.`
          ],
          'cse': [ // Alias for computer science
            `${currentTopic} is basically Big O optimization for your wallet. O(n²) spending habits = exponential debt. O(log n) saving strategy = compound growth that scales. Optimize your money like you optimize code.`,
            `Think of ${currentTopic} like managing technical debt. Ignore it (credit cards, impulse buys), and it compounds until your whole system crashes. Refactor early (save, budget), and your financial codebase stays clean.`,
            `${currentTopic} works like API rate limiting. You have finite resources (income). Exceed your rate limit (budget), and you get throttled (debt). Stay within limits, and your system runs smooth.`
          ],
          'default': [
            `${currentTopic} is all about strategic resource allocation through ${userInterest} principles. Master the fundamentals first - advanced moves come later.`,
            `${currentTopic} maps directly to ${userInterest} concepts you already know. Break it down step by step, and it clicks. What specific part is confusing?`,
            `${currentTopic} uses the same logic as ${userInterest}. Pattern recognition, consistent practice, and iterative improvement. You've got this.`
          ]
        };

        const interestResponses = responses[interestKey] || responses['default'];
        return interestResponses[Math.floor(Math.random() * interestResponses.length)];
      };

      const interestKey = userInterest.toLowerCase().replace(/\s+/g, '_');
      const fallbackResponse = getRandomResponse(interestKey);

      const assistantMessage = {
        role: 'assistant',
        content: fallbackResponse
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Mentor chat error:', error);
      const errorMessages = [
        `My neural network just 504'd. Try that question again?`,
        `Brain.exe stopped responding. Reload and ask again!`,
        `Connection timeout. Rephrase and resend?`,
        `System hiccup. Ask me again about ${currentTopic}!`
      ];
      const errorMessage = {
        role: 'assistant',
        content: errorMessages[Math.floor(Math.random() * errorMessages.length)]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (prompt) => {
    handleSend(prompt);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 bg-brutal-blue border-4 border-brutal-black shadow-brutal rounded-none flex items-center justify-center text-3xl cursor-pointer z-50"
          >
            🧠
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window - NEO-BRUTALIST STYLE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-8 right-8 w-96 h-[600px] bg-brutal-white border-4 border-brutal-black shadow-brutal-lg rounded-none flex flex-col z-50"
          >
            {/* Header */}
            <div className="bg-brutal-blue border-b-4 border-brutal-black p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧠</span>
                <div>
                  <h3 className="font-black text-brutal-white text-lg">FINLIT MENTOR</h3>
                  <p className="text-xs text-brutal-white/90">Sassy Finance Coach</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl font-black text-brutal-white hover:scale-110 transition-transform"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-brutal-bg">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 border-4 border-brutal-black shadow-brutal-sm rounded-none ${
                      msg.role === 'user'
                        ? 'bg-brutal-pink'
                        : 'bg-brutal-white'
                    }`}
                  >
                    <p className="text-sm font-bold text-brutal-black leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-brutal-white border-4 border-brutal-black shadow-brutal-sm rounded-none p-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [-2, 2, -2] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                          className="w-2 h-2 bg-brutal-black rounded-none"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="border-t-4 border-brutal-black p-3 bg-brutal-bg">
              <p className="text-xs font-black mb-2 text-brutal-black">QUICK ACTIONS:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.prompt)}
                    disabled={isLoading}
                    className="bg-brutal-green border-2 border-brutal-black shadow-brutal-sm hover:shadow-brutal px-3 py-1 rounded-none text-xs font-black text-brutal-black disabled:opacity-50 transition-all"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="border-t-4 border-brutal-black p-4 bg-brutal-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 border-4 border-brutal-black rounded-none px-3 py-2 focus:outline-none font-bold text-brutal-black placeholder-brutal-black/40 disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="bg-brutal-blue border-4 border-brutal-black shadow-brutal-sm px-4 py-2 rounded-none font-black text-brutal-white disabled:opacity-50"
                >
                  →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingMentor;
