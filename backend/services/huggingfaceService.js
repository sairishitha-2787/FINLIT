// FINLIT - Hugging Face Service
// Handles all AI-powered explanations and quiz generation using Hugging Face

const axios = require('axios');

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

// Generate personalized explanation based on user's interest
async function generateExplanation(topic, interest, difficulty = 'beginner') {
  try {
    const prompt = `You are FINLIT, an expert financial educator. Explain "${topic}" to someone who loves ${interest}.

Difficulty level: ${difficulty}

Format your response EXACTLY as shown below with these exact emoji markers:

🎯 THE ANALOGY
[Write a relatable analogy using ${interest} concepts and terminology - 2-3 sentences]

💡 WHAT THIS ACTUALLY MEANS
[Clear explanation of the financial concept in simple terms - 2-3 sentences]

🌍 REAL-LIFE EXAMPLE
[A concrete, practical example they can relate to - 2-3 sentences]

🔑 KEY TAKEAWAY
[One memorable sentence they should remember]

Keep the entire response under 300 words. Use an encouraging and friendly tone.`;

    const response = await axios.post(
      HF_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 600,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    let explanation = '';
    if (Array.isArray(response.data)) {
      explanation = response.data[0].generated_text;
    } else if (response.data.generated_text) {
      explanation = response.data.generated_text;
    } else {
      throw new Error('Unexpected response format');
    }

    // Parse the response into structured format
    const sections = parseExplanation(explanation);

    return {
      success: true,
      explanation: sections,
      rawText: explanation
    };
  } catch (error) {
    console.error('Hugging Face explanation error:', error.message);

    // Return fallback explanation if API fails
    return generateFallbackExplanation(topic, interest, difficulty);
  }
}

// Generate quiz questions based on topic and interest
async function generateQuiz(topic, interest, difficulty = 'beginner') {
  try {
    const prompt = `You are FINLIT quiz master. Create 5 multiple-choice questions about "${topic}" for someone who loves ${interest}.

Difficulty: ${difficulty}

Format each question EXACTLY as:

Q1: [Question using ${interest} context]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
CORRECT: [A/B/C/D]
EXPLANATION: [Why this is correct - encouraging tone]

Q2: [Next question...]
[Continue for all 5 questions]

Make questions practical and relatable.`;

    const response = await axios.post(
      HF_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    let quizText = '';
    if (Array.isArray(response.data)) {
      quizText = response.data[0].generated_text;
    } else if (response.data.generated_text) {
      quizText = response.data.generated_text;
    } else {
      throw new Error('Unexpected response format');
    }

    const questions = parseQuiz(quizText);

    // If parsing failed or got less than 3 questions, use fallback
    if (questions.length < 3) {
      return generateFallbackQuiz(topic, interest, difficulty);
    }

    return {
      success: true,
      questions: questions.slice(0, 5) // Take only first 5
    };
  } catch (error) {
    console.error('Hugging Face quiz error:', error.message);
    return generateFallbackQuiz(topic, interest, difficulty);
  }
}

// Parse explanation into structured sections
function parseExplanation(text) {
  const sections = {
    analogy: '',
    meaning: '',
    example: '',
    takeaway: ''
  };

  try {
    // Extract each section using emoji markers
    const analogyMatch = text.match(/🎯[\s\S]*?\n([\s\S]*?)(?=💡|$)/);
    const meaningMatch = text.match(/💡[\s\S]*?\n([\s\S]*?)(?=🌍|$)/);
    const exampleMatch = text.match(/🌍[\s\S]*?\n([\s\S]*?)(?=🔑|$)/);
    const takeawayMatch = text.match(/🔑[\s\S]*?\n([\s\S]*?)$/);

    sections.analogy = analogyMatch ? analogyMatch[1].trim() : '';
    sections.meaning = meaningMatch ? meaningMatch[1].trim() : '';
    sections.example = exampleMatch ? exampleMatch[1].trim() : '';
    sections.takeaway = takeawayMatch ? takeawayMatch[1].trim() : '';
  } catch (error) {
    console.error('Error parsing explanation:', error);
  }

  return sections;
}

// Parse quiz questions into structured format
function parseQuiz(text) {
  const questions = [];

  try {
    // Split by question numbers
    const questionBlocks = text.split(/Q\d+:/).filter(block => block.trim());

    questionBlocks.forEach((block, index) => {
      const lines = block.split('\n').filter(line => line.trim());

      if (lines.length > 0) {
        const questionText = lines[0].trim();
        const options = [];
        let correctAnswer = '';
        let explanation = '';

        lines.forEach(line => {
          const trimmed = line.trim();

          // Extract options A-D
          if (/^[A-D]\)/.test(trimmed)) {
            options.push(trimmed.substring(2).trim());
          }

          // Extract correct answer
          if (trimmed.startsWith('CORRECT:')) {
            correctAnswer = trimmed.replace('CORRECT:', '').trim();
          }

          // Extract explanation
          if (trimmed.startsWith('EXPLANATION:')) {
            explanation = trimmed.replace('EXPLANATION:', '').trim();
          }
        });

        if (questionText && options.length === 4 && correctAnswer) {
          questions.push({
            id: index + 1,
            question: questionText,
            options: options,
            correctAnswer: correctAnswer,
            explanation: explanation
          });
        }
      }
    });
  } catch (error) {
    console.error('Error parsing quiz:', error);
  }

  return questions;
}

// Fallback explanation when API fails
function generateFallbackExplanation(topic, interest, difficulty) {
  return {
    success: true,
    explanation: {
      analogy: `Think of ${topic} like leveling up in your favorite ${interest} activity. Just as you build skills and progress over time, managing your finances follows similar patterns of growth and strategy.`,
      meaning: `${topic} is a fundamental financial concept that helps you make smarter decisions with your money. It's about understanding how your financial choices today impact your future opportunities.`,
      example: `For instance, if you enjoy ${interest}, you already practice planning and resource management. Apply those same skills to your finances - set goals, track progress, and make strategic decisions.`,
      takeaway: `Master ${topic} to take control of your financial future, just like mastering skills in ${interest}!`
    },
    rawText: 'Fallback explanation used'
  };
}

// Fallback quiz with 3-level structure when API fails
function generateFallbackQuiz(topic, interest, difficulty) {
  // Normalize interest for matching
  const normalizedInterest = interest.toLowerCase().trim();

  const quizTemplates = {
    'writing': {
      level1: [
        {
          id: 1, level: 1, levelName: 'UNDERSTANDING', type: 'conceptual',
          question: `Think of ${topic} like structuring a novel. What's the core principle?`,
          options: ['Plan your chapters (budget) before writing (spending)', 'Write without an outline', 'Only successful authors need structure', 'Skip editing entirely'],
          correctAnswer: 'A',
          brutalHonestFeedback: `📚 PLOT TWIST: ${topic} IS your story outline. Just like you wouldn't publish a first draft, you don't spend without a plan.`
        },
        {
          id: 2, level: 1, levelName: 'UNDERSTANDING', type: 'conceptual',
          question: `How is ${topic} like editing a manuscript?`,
          options: ['Review, cut unnecessary parts, optimize what remains', 'Add more regardless of quality', 'Editing is optional', 'First version is always perfect'],
          correctAnswer: 'A',
          brutalHonestFeedback: `✍️ EDIT YOUR SPENDING: Every manuscript needs revision. Every budget needs review. Cut the fluff, keep what serves your goals.`
        }
      ],
      level2: [
        {
          id: 3, level: 2, levelName: 'APPLICATION', type: 'quantitative',
          question: `You earn $1,200/month freelance writing. Expenses are $800. You want a $300 course. With $200 monthly emergency buffer, how many months to save?`,
          options: ['3 months', '2 months', '4 months', '1 month'],
          correctAnswer: 'A',
          brutalHonestFeedback: `🧮 THE MATH: Surplus = $400. Buffer = $200. Savings = $200/month. $300 ÷ $200 = 1.5 → Round to 2-3 months safely.`
        },
        {
          id: 4, level: 2, levelName: 'APPLICATION', type: 'quantitative',
          question: `Your book advance is $5,000. Agent takes 15%, taxes 25%. What's your net?`,
          options: ['$3,000', '$3,500', '$4,000', '$2,500'],
          correctAnswer: 'A',
          brutalHonestFeedback: `💰 REALITY: $5,000 - $750 (agent) - $1,250 (taxes) = $3,000. Know your REAL numbers!`
        }
      ],
      level3: [
        {
          id: 5, level: 3, levelName: 'BOSS FIGHT', type: 'simulation',
          question: `📝 WRITER'S CROSSROADS 📝\n\nPublisher offers: A) $10K advance for Book 2, B) No advance but 40% royalties, C) $5K advance + 25% royalties.\n\nYou have $3,000 savings. Based on ${topic}, which deal?`,
          options: ['Option C - Balanced security + upside', 'Option A - Safe guaranteed money', 'Option B - Bet on yourself', 'Reject all'],
          correctAnswer: 'A',
          brutalHonestFeedback: `🏆 SMART AUTHOR: With 2 months runway, Option C gives security AND upside. ${topic} = de-risking while maintaining growth potential.`
        }
      ]
    },
    'music': {
      level1: [
        {
          id: 1, level: 1, levelName: 'UNDERSTANDING', type: 'conceptual',
          question: `How is ${topic} like producing a hit track?`,
          options: ['Balance multiple elements into harmony', 'Only focus on the loudest part', 'Mixing is optional', 'More instruments = better'],
          correctAnswer: 'A',
          brutalHonestFeedback: `🎵 MIX MASTER: A great track balances bass (needs), mids (wants), highs (savings). ${topic} is your financial EQ.`
        },
        {
          id: 2, level: 1, levelName: 'UNDERSTANDING', type: 'conceptual',
          question: `What does ${topic} have in common with building a fanbase?`,
          options: ['Consistent small efforts compound into massive results', 'One viral hit is enough', 'Only luck matters', 'Quantity over quality'],
          correctAnswer: 'A',
          brutalHonestFeedback: `🎤 COMPOUND FANS: 100 fans × growth = exponential. Your savings compound the same way.`
        }
      ],
      level2: [
        {
          id: 3, level: 2, levelName: 'APPLICATION', type: 'quantitative',
          question: `Monthly streaming: $600. Studio $200, plugins $50, marketing $100. With 25% savings, what's left for gear?`,
          options: ['$100', '$150', '$200', '$50'],
          correctAnswer: 'A',
          brutalHonestFeedback: `🧮 STUDIO MATH: $600 - $200 - $50 - $100 - $150 (savings) = $100 for gear.`
        },
        {
          id: 4, level: 2, levelName: 'APPLICATION', type: 'quantitative',
          question: `Festival pays $2,000 for 30-min set. Travel $400, gear rental $200. What's your hourly rate for 8 total hours?`,
          options: ['$175/hour', '$250/hour', '$150/hour', '$200/hour'],
          correctAnswer: 'A',
          brutalHonestFeedback: `💰 TRUE RATE: Net = $1,400. Hours = 8. Rate = $175/hr. Know your real earnings!`
        }
      ],
      level3: [
        {
          id: 5, level: 3, levelName: 'BOSS FIGHT', type: 'simulation',
          question: `🎸 RECORD DEAL 🎸\n\nA) $50K advance, label owns masters forever. B) $10K advance, masters revert in 5 years. C) No advance, keep all masters.\n\nYou have $5K savings. Best long-term move?`,
          options: ['Option B - Balance of security + ownership', 'Option A - Take big money now', 'Option C - Own everything', 'Reject all'],
          correctAnswer: 'A',
          brutalHonestFeedback: `🏆 INDUSTRY WISDOM: Masters appreciate over time. Option B = survival money + future ownership. Smart play.`
        }
      ]
    },
    'sports': {
      level1: [
        {
          id: 1, level: 1, levelName: 'UNDERSTANDING', type: 'conceptual',
          question: `How is ${topic} like training for a championship?`,
          options: ['Consistent daily habits lead to peak performance', 'Train only before the game', 'Natural talent beats prep', 'Rest is waste'],
          correctAnswer: 'A',
          brutalHonestFeedback: `🏆 CHAMPION MINDSET: Athletes train daily. ${topic} is your financial training program.`
        },
        {
          id: 2, level: 1, levelName: 'UNDERSTANDING', type: 'conceptual',
          question: `What's the ${topic} equivalent of game film review?`,
          options: ['Reviewing spending to find patterns', 'Ignoring past mistakes', 'Checking bank yearly', 'Trust gut over data'],
          correctAnswer: 'A',
          brutalHonestFeedback: `📊 FILM STUDY: Pros review tape. Financially fit people review spending. Find patterns, fix weaknesses.`
        }
      ],
      level2: [
        {
          id: 3, level: 2, levelName: 'APPLICATION', type: 'quantitative',
          question: `You earn $2,000 coaching. Expenses $900. Saving 20% for a $3,600 certification. How many months?`,
          options: ['9 months', '6 months', '12 months', '3 months'],
          correctAnswer: 'A',
          brutalHonestFeedback: `🧮 TRAINING MATH: Savings = $400/month. $3,600 ÷ $400 = 9 months. Train accordingly.`
        },
        {
          id: 4, level: 2, levelName: 'APPLICATION', type: 'quantitative',
          question: `Tournament: $500 entry, $5,000 prize, 20% win chance. What's expected value?`,
          options: ['$500 break even', '$1,000 profit', '-$500 loss', '$4,500 profit'],
          correctAnswer: 'A',
          brutalHonestFeedback: `📈 EXPECTED VALUE: (0.20 × $5,000) - $500 = $500. Break even on average.`
        }
      ],
      level3: [
        {
          id: 5, level: 3, levelName: 'BOSS FIGHT', type: 'simulation',
          question: `⚽ CONTRACT DECISION ⚽\n\nA) $80K/year, 4-year guaranteed. B) $50K base + up to $150K bonuses.\n\nYou have $10K savings, hit bonus targets 60% of time. Best choice?`,
          options: ['Option A - Guaranteed with limited savings', 'Option B - Higher upside', 'Negotiate both', 'Reject both'],
          correctAnswer: 'A',
          brutalHonestFeedback: `🏆 PRO MOVE: With $10K savings, stability wins. Option A = $320K guaranteed. Build savings THEN take variable contracts.`
        }
      ]
    },
    'computer science': {
      level1: [
        {
          id: 1, level: 1, levelName: 'UNDERSTANDING', type: 'conceptual',
          question: `How is ${topic} like managing technical debt?`,
          options: ['Small shortcuts compound into massive problems', 'Tech debt doesn\'t matter', 'Refactor later for free', 'More features = better'],
          correctAnswer: 'A',
          brutalHonestFeedback: `💻 CODE REVIEW: Credit card debt IS tech debt for your wallet. 20% APR compounds like spaghetti code.`
        },
        {
          id: 2, level: 1, levelName: 'UNDERSTANDING', type: 'conceptual',
          question: `What's the Big O notation of good ${topic}?`,
          options: ['O(log n) - compound growth that scales', 'O(n²) - spending outpaces income', 'O(1) - no growth', 'O(n!) - unpredictable'],
          correctAnswer: 'A',
          brutalHonestFeedback: `🧮 ALGORITHMIC WEALTH: Savings should grow O(log n). Debt should NEVER be O(n²).`
        }
      ],
      level2: [
        {
          id: 3, level: 2, levelName: 'APPLICATION', type: 'quantitative',
          question: `SWE salary $8K/month. Rent $2,500, food $600, subs $200, loans $800. After 25% savings + $1,875 401k, what's left?`,
          options: ['$25 - barely break even', '$500 surplus', '-$500 deficit', '$1,000 surplus'],
          correctAnswer: 'A',
          brutalHonestFeedback: `🧮 STACK OVERFLOW: $8K - $2,500 - $600 - $200 - $800 - $2K - $1,875 = $25. At memory limit!`
        },
        {
          id: 4, level: 2, levelName: 'APPLICATION', type: 'quantitative',
          question: `Bootcamp costs $15K, promises $30K raise. You save $500/month. What's ROI and payback?`,
          options: ['100% ROI, ~30 months', '200% ROI, 12 months', '50% ROI, 60 months', 'Negative ROI'],
          correctAnswer: 'A',
          brutalHonestFeedback: `📊 ROI CALC: ($30K - $15K) / $15K = 100%. Payback via savings = 30 months.`
        }
      ],
      level3: [
        {
          id: 5, level: 3, levelName: 'BOSS FIGHT', type: 'simulation',
          question: `💻 STARTUP VS FAANG 💻\n\nA) FAANG: $180K + $50K stock/year. B) Startup: $120K + 0.5% equity (pre-revenue).\n\nYou have $15K savings, $40K loans at 6%. Best move?`,
          options: ['Option A - Pay debt fast with guaranteed income', 'Option B - Equity could 100x', 'Negotiate remote', 'Freelance instead'],
          correctAnswer: 'A',
          brutalHonestFeedback: `🏆 SYSTEM DESIGN: $40K debt at 6% = $2,400/year interest. FAANG pays it off in 2 years. Solve P0 bugs (debt) before optimizing for P2 features (equity).`
        }
      ]
    },
    'fashion': {
      level1: [
        {
          id: 1, level: 1, levelName: 'UNDERSTANDING', type: 'conceptual',
          question: `How is ${topic} like building a capsule wardrobe?`,
          options: ['Invest in versatile basics that work everywhere', 'Buy every trend', 'Own only one outfit', 'More = better style'],
          correctAnswer: 'A',
          brutalHonestFeedback: `👗 STYLE FINANCE: Capsule wardrobe = quality basics. ${topic} = financial basics that support any situation.`
        },
        {
          id: 2, level: 1, levelName: 'UNDERSTANDING', type: 'conceptual',
          question: `What's the ${topic} equivalent of fast fashion?`,
          options: ['Impulse purchases that lose value immediately', 'Quality investments', 'Waiting for sales', 'Buying secondhand'],
          correctAnswer: 'A',
          brutalHonestFeedback: `🛍️ FAST FASHION TRAP: $20 top worn twice = $10/wear. $200 coat worn 200x = $1/wear. Cost-per-use!`
        }
      ],
      level2: [
        {
          id: 3, level: 2, levelName: 'APPLICATION', type: 'quantitative',
          question: `Income $3,500. Rent $1,200, food $400, transport $200. Can you save 20% AND budget $300 for clothes?`,
          options: ['Yes - $700 remaining after all expenses', 'No - over budget', 'Exactly balanced', 'Way over budget'],
          correctAnswer: 'A',
          brutalHonestFeedback: `🧮 BUDGET RUNWAY: $3,500 - $1,200 - $400 - $200 - $700 (20%) - $300 = $700 left. Works!`
        },
        {
          id: 4, level: 2, levelName: 'APPLICATION', type: 'quantitative',
          question: `Designer bag $2,000 lasts 10 years. Trendy bag $200 replaced yearly. 10-year cost comparison?`,
          options: ['Same ($2,000 total)', 'Designer saves $500', 'Trendy saves $1,000', 'Designer saves $1,000'],
          correctAnswer: 'A',
          brutalHonestFeedback: `💰 COST-PER-YEAR: Both = $200/year. But designer = one purchase, less hassle, potential resale.`
        }
      ],
      level3: [
        {
          id: 5, level: 3, levelName: 'BOSS FIGHT', type: 'simulation',
          question: `👠 CAREER PIVOT 👠\n\nYou're a buyer at $60K. Options: A) Start styling business - $0 for 6 months. B) Corporate role $75K. C) Keep job + weekend side hustle.\n\nYou have $8K savings. Best move?`,
          options: ['Option C - Build side hustle with safety net', 'Option A - Bet on yourself', 'Option B - Take the raise', 'Quit everything'],
          correctAnswer: 'A',
          brutalHonestFeedback: `🏆 STRATEGIC FASHION: With 2 months runway, Option C = best of both. Test the business with income flowing.`
        }
      ]
    },
    'gaming': {
      level1: [
        {
          id: 1,
          level: 1,
          levelName: 'UNDERSTANDING',
          type: 'conceptual',
          question: `In gaming terms, how is ${topic} like managing your in-game resources?`,
          options: [
            'It requires strategic planning and resource allocation',
            'It means spending everything immediately',
            'It only works if you have unlimited money',
            'It has no real-world application'
          ],
          correctAnswer: 'A',
          brutalHonestFeedback: `💯 REAL TALK: ${topic} is your financial strategy guide. Just like you wouldn't waste all your mana on the first enemy, you don't blow all your money on impulse buys. Resource management = financial success.`
        },
        {
          id: 2,
          level: 1,
          levelName: 'UNDERSTANDING',
          type: 'conceptual',
          question: `Think of ${topic} as leveling up. What's the core principle?`,
          options: [
            'Consistent small gains compound over time',
            'Get rich quick schemes always work',
            'Only experts can succeed',
            'Luck is the main factor'
          ],
          correctAnswer: 'A',
          brutalHonestFeedback: `🎮 LEVEL UP LOGIC: In RPGs, you grind to level up. Finance is the same - small, consistent actions create massive results. 1% better every day = 37x better in a year.`
        }
      ],
      level2: [
        {
          id: 3,
          level: 2,
          levelName: 'APPLICATION',
          type: 'quantitative',
          question: `You earn $800/month from streaming. Your gaming setup costs $200/month, food is $300. You want to save 20% of your income. How much is left for fun money?`,
          options: [
            '$140',
            '$160',
            '$180',
            '$200'
          ],
          correctAnswer: 'A',
          brutalHonestFeedback: `🧮 THE MATH: Income ($800) - Setup ($200) - Food ($300) - Savings (20% of $800 = $160) = $140 left. This is ${topic} in action - you're allocating resources BEFORE spending.`
        },
        {
          id: 4,
          level: 2,
          levelName: 'APPLICATION',
          type: 'quantitative',
          question: `Your favorite game has a 30% off sale. It's normally $60. You have $100 saved. Should you buy it now or wait?`,
          options: [
            'Buy now - you save $18 and still have $58 left',
            'Wait - you might need that money for emergencies',
            'Buy 2 copies since it\'s on sale',
            'Never buy games on sale'
          ],
          correctAnswer: 'A',
          brutalHonestFeedback: `💰 CALCULATED MOVE: Sale price = $42. You save $18 AND have $58 cushion. This shows ${topic} isn't about NEVER spending - it's about strategic timing and maintaining reserves.`
        }
      ],
      level3: [
        {
          id: 5,
          level: 3,
          levelName: 'BOSS FIGHT',
          type: 'simulation',
          question: `🎮 FINAL BOSS SCENARIO 🎮\n\nYou're a pro esports player. Your team just disbanded 2 weeks before a major tournament with a $50,000 prize pool. You have 3 months of savings left. Your options:\n\nA) Join a new team immediately (50% prize split, but guaranteed)\nB) Go solo, invest $2,000 in coaching to boost your odds (winner takes all)\nC) Skip the tournament, preserve savings, look for stable streaming income\n\nBased on ${topic} principles, which move maximizes long-term financial stability?`,
          options: [
            'Option A - Guaranteed income beats high risk',
            'Option B - High risk, high reward always wins',
            'Option C - Safety first, always',
            'Flip a coin - it\'s all luck anyway'
          ],
          correctAnswer: 'A',
          brutalHonestFeedback: `🏆 BOSS DEFEATED: Option A applies ${topic} perfectly. You have limited runway (3 months). A 50% split of $50K = $25K guaranteed beats a risky $50K shot that could leave you with $0. This is called RISK-ADJUSTED RETURN. Pro players know: consistent earnings > lottery tickets. You can take bigger risks when you have MORE savings cushion, not less.`
        }
      ]
    },
    'default': {
      level1: [
        {
          id: 1,
          level: 1,
          levelName: 'UNDERSTANDING',
          type: 'conceptual',
          question: `How does ${topic} relate to everyday decision-making through ${interest}?`,
          options: [
            'It provides a framework for strategic planning',
            'It eliminates all financial risks',
            'It only works for wealthy people',
            'It requires complex mathematical skills'
          ],
          correctAnswer: 'A',
          brutalHonestFeedback: `💯 TRUTH BOMB: ${topic} is your financial GPS. It doesn't eliminate obstacles, but it helps you navigate them strategically. Anyone can use it, regardless of income level.`
        },
        {
          id: 2,
          level: 1,
          levelName: 'UNDERSTANDING',
          type: 'conceptual',
          question: `What's the fundamental principle behind ${topic}?`,
          options: [
            'Balance current needs with future goals',
            'Spend everything you earn',
            'Only save, never spend',
            'Wait for luck to change your situation'
          ],
          correctAnswer: 'A',
          brutalHonestFeedback: `⚖️ THE BALANCE: ${topic} is about equilibrium. Spend smart today, secure tomorrow. It's not about deprivation - it's about intentional choices that align with YOUR goals.`
        }
      ],
      level2: [
        {
          id: 3,
          level: 2,
          levelName: 'APPLICATION',
          type: 'quantitative',
          question: `You earn $1,000/month. Rent is $400, food $250, utilities $100. You want to save 15%. How much is left for discretionary spending?`,
          options: [
            '$100',
            '$150',
            '$200',
            '$250'
          ],
          correctAnswer: 'A',
          brutalHonestFeedback: `🧮 NUMBER CRUNCH: $1,000 - $400 - $250 - $100 - $150 (15% savings) = $100. This is ${topic}'s 50/30/20 rule in action: 50% needs, 30% wants, 20% savings. You're doing it right.`
        },
        {
          id: 4,
          level: 2,
          levelName: 'APPLICATION',
          type: 'quantitative',
          question: `An item you want costs $120. You can save $30/month. How many months until you can afford it without debt?`,
          options: [
            '4 months',
            '3 months',
            '5 months',
            '6 months'
          ],
          correctAnswer: 'A',
          brutalHonestFeedback: `📅 DELAYED GRATIFICATION: $120 ÷ $30 = 4 months. This is ${topic}'s superpower - you avoid interest charges (usually 15-25% APR on credit cards). Patience literally saves you money.`
        }
      ],
      level3: [
        {
          id: 5,
          level: 3,
          levelName: 'BOSS FIGHT',
          type: 'simulation',
          question: `💼 CRITICAL DECISION POINT 💼\n\nYou're offered a promotion: +$500/month salary BUT +20 hours/week workload. Your current side hustle (${interest}) earns you $300/month in 10 hours/week and brings you joy.\n\nYou have $2,000 in emergency savings (2 months of expenses).\n\nBased on ${topic} principles, what's the smartest move for long-term wealth AND happiness?`,
          options: [
            'Take promotion, keep side hustle if possible - max income',
            'Decline promotion, grow side hustle - prioritize passion',
            'Take promotion, quit side hustle - focus on career',
            'Quit both, start fresh - YOLO'
          ],
          correctAnswer: 'B',
          brutalHonestFeedback: `🎯 STRATEGIC VICTORY: The math: Promotion = $500 for 20hrs ($25/hr). Side hustle = $300 for 10hrs ($30/hr). Your side hustle has BETTER hourly rate AND potential for exponential growth. ${topic} teaches: optimize for HIGHEST ROI (return on investment), not just highest absolute number. Plus, you have 2-month cushion, so you can afford strategic patience. Build the side hustle to $1,000/month, THEN reassess the promotion.`
        }
      ]
    }
  };

  // Match interest with aliases
  const interestAliases = {
    'cse': 'computer science',
    'cs': 'computer science',
    'programming': 'computer science',
    'coding': 'computer science',
    'tech': 'computer science',
    'gym': 'sports',
    'fitness': 'sports',
    'art': 'fashion',
    'dance': 'music',
    'reading': 'writing',
    'books': 'writing',
    'esports': 'gaming',
    'video games': 'gaming'
  };

  const mappedInterest = interestAliases[normalizedInterest] || normalizedInterest;
  const template = quizTemplates[mappedInterest] || quizTemplates['default'];

  console.log(`Quiz fallback: interest="${interest}" → normalized="${normalizedInterest}" → mapped="${mappedInterest}"`);

  return {
    success: true,
    questions: [
      ...template.level1,
      ...template.level2,
      ...template.level3
    ],
    jargonGuide: generateJargonGuide(topic, interest)
  };
}

// Generate jargon translations for a topic
function generateJargonGuide(topic, interest) {
  const jargonMappings = {
    'Budgeting Basics': [
      {
        jargon: 'Budget',
        analogy: `Like planning your skill points in ${interest} - allocate resources before you need them.`,
        proTip: 'Track first, then plan. You can\'t improve what you don\'t measure.'
      },
      {
        jargon: 'Fixed Expenses',
        analogy: `Your subscription costs in ${interest} - same amount, every month, non-negotiable.`,
        proTip: 'These don\'t change. Optimize them once, benefit forever.'
      },
      {
        jargon: 'Discretionary Spending',
        analogy: `Your "fun money" in ${interest} - want it, but don\'t need it to survive.`,
        proTip: 'This is where lifestyle inflation happens. Guard it.'
      }
    ],
    'Saving Money': [
      {
        jargon: 'Emergency Fund',
        analogy: `Your respawn tokens in ${interest} - insurance against unexpected game-overs.`,
        proTip: 'Aim for 3-6 months of expenses. Sleep better at night.'
      },
      {
        jargon: 'Liquidity',
        analogy: `How fast you can convert ${interest} assets to cash - instant vs. locked up.`,
        proTip: 'High liquidity = easy to access. Savings account > house equity.'
      }
    ],
    'default': [
      {
        jargon: 'ROI (Return on Investment)',
        analogy: `What you gain from ${interest} compared to what you put in - efficiency metric.`,
        proTip: 'Always calculate: (Gain - Cost) ÷ Cost × 100 = ROI%'
      },
      {
        jargon: 'Compound Interest',
        analogy: `XP that earns XP in ${interest} - your money makes money over time.`,
        proTip: 'Einstein called it the 8th wonder. Start early, benefit massively.'
      }
    ]
  };

  return jargonMappings[topic] || jargonMappings['default'];
}

module.exports = {
  generateExplanation,
  generateQuiz
};
