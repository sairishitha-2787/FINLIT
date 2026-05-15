import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { getAdaptiveExplanation } from '../../services/api';

const QUICK_PROMPTS = [
  'Explain this simpler',
  'Give me a real-world example',
  'What should I actually remember from this?',
  'How does this connect to my daily life?',
];

const AskFinnAnything = ({ topic, domain, sectionContent, isDark = false }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState(null);

  const submit = async (question) => {
    const q = (question || input).trim();
    if (!q || isLoading) return;
    setInput('');
    setIsLoading(true);
    setAnswer(null);
    setError(null);

    try {
      const res = await getAdaptiveExplanation({
        topic,
        domain,
        confusionPoint: 'concept',
        previousExplanation: sectionContent || '',
        question: q,
      });
      setAnswer(res.reExplanation || 'FINN is thinking — try again!');
    } catch (err) {
      setError('FINN is busy right now — try again in a moment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`mt-4 border-t-2 pt-4 ${isDark ? 'border-brutal-white/20' : 'border-brutal-black/10'}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 text-xs font-black transition-colors ${
          isDark
            ? 'text-brutal-white/40 hover:text-brutal-white'
            : 'text-brutal-black/40 hover:text-brutal-black'
        }`}
      >
        <Brain size={14} strokeWidth={2.5} />
        ASK FINN ANYTHING
        {open
          ? <ChevronUp size={12} strokeWidth={2.5} />
          : <ChevronDown size={12} strokeWidth={2.5} />
        }
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 bg-brutal-black/5 border-2 border-brutal-black/10 p-4">
              {/* Quick prompts */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => submit(p)}
                    disabled={isLoading}
                    className="text-[11px] font-black px-2 py-1 border border-brutal-black/20 bg-brutal-white hover:bg-brutal-blue hover:text-brutal-white hover:border-brutal-blue transition-colors disabled:opacity-40"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Input row */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                  placeholder="Type your question..."
                  disabled={isLoading}
                  className="flex-1 bg-brutal-white border-2 border-brutal-black px-3 py-2 text-sm font-bold text-brutal-black placeholder:text-brutal-black/30 focus:outline-none focus:border-brutal-blue disabled:opacity-40"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => submit()}
                  disabled={!input.trim() || isLoading}
                  className="bg-brutal-black border-2 border-brutal-black px-3 py-2 font-black text-brutal-white flex items-center gap-1 disabled:opacity-40 hover:bg-brutal-blue transition-colors"
                >
                  {isLoading
                    ? <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
                    : <Send size={14} strokeWidth={2.5} />
                  }
                </motion.button>
              </div>

              {/* Answer */}
              <AnimatePresence>
                {(answer || error) && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-3 p-3 border-2 border-brutal-black ${error ? 'bg-brutal-pink' : 'bg-brutal-white'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Brain size={12} strokeWidth={2.5} className="text-brutal-blue shrink-0" />
                      <span className="text-[10px] font-black text-brutal-blue uppercase tracking-wider">FINN</span>
                    </div>
                    <p className="text-sm font-bold text-brutal-black leading-relaxed">
                      {answer || error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AskFinnAnything;
