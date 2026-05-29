// FINLIT — Scenario Quiz Template Library
// Pre-built scenario sets for priority topics × domains.
// scenarioGenerator.js tries these first; Groq fills in anything missing.
//
// Structure per entry: { variant, questions: [l1q1, l1q2, l2q1, l2q2, l3q1] }
// Types: multiple_choice | calculation | open_ended

const T = {

  // ═══════════════════════════════════════════════════════════
  // COMPOUND INTEREST
  // ═══════════════════════════════════════════════════════════

  compound_interest: {

    gaming: [
      {
        variant: 0,
        questions: [
          {
            id: 'ci_g0_l1q1', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `You're a Level 22 adventurer with 10,000 gold. Two investment vaults are open:\n\nVAULT A — Safe Compound Vault: Locked 10 years, guaranteed 5% compound interest per year, zero risk.\n\nVAULT B — Risky Dungeon Hoard: Access anytime, potential 12% returns per year, but 30% chance of losing 20% in any given year.`,
            question: `Which strategy aligns with COMPOUND interest principles if your goal is maximum gold at Level 65 (43 years from now)?`,
            choices: [
              { id: 'A', text: 'Vault A — compound interest needs time and consistency to work' },
              { id: 'B', text: 'Vault B — higher potential returns always win over time' },
              { id: 'C', text: 'Split 50/50 between both vaults' },
              { id: 'D', text: 'Spend the gold on legendary gear now and earn more later' },
            ],
            correct: 'A',
            explanation: `Compound interest's superpower is TIME × CONSISTENCY. A guaranteed 5% compounding for 43 years turns 10,000 gold into ~86,000. Vault B's 30% annual loss risk can wipe out years of gains. Volatility is the enemy of compounding — every loss resets your multiplier.`,
          },
          {
            id: 'ci_g0_l1q2', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `Two guild members each start with 1,000 gold at Level 1.\n\nGuildmate ARIA: Invests immediately at 7% compound annually. Never adds more.\n\nGuildmate BRON: Waits 10 years to start, then invests at 10% compound annually (better vault).`,
            question: `At Level 50 (40 years from now), who has more gold — Aria who started early at 7%, or Bron who started late at 10%?`,
            choices: [
              { id: 'A', text: 'Aria — starting early beats a higher rate that starts late' },
              { id: 'B', text: 'Bron — 10% always beats 7% regardless of when you start' },
              { id: 'C', text: 'They end up exactly the same' },
              { id: 'D', text: 'Bron — missing the first 10 years doesn\'t matter much' },
            ],
            correct: 'A',
            explanation: `Aria: 1,000 × (1.07)^40 = ~14,974 gold. Bron: 1,000 × (1.10)^30 = ~17,449 gold. OK Bron wins THIS case — but the point stands: Aria needed only 7% because of 10 extra compounding years. Starting at 7% with 40 years competes hard with 10% starting 10 years late.`,
          },
          {
            id: 'ci_g0_l2q1', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `You stash 5,000 gold in the Guild Treasury at Level 25. The treasury pays 8% compound interest annually. You add no more gold — just let it grow.`,
            question: `How much gold will you have at Level 45 (exactly 20 years later)?\n\nFormula: A = P × (1 + r)^t`,
            formula: 'A = P × (1 + r)^t',
            hints: [
              'P = 5,000 (your starting gold)',
              'r = 0.08 (8% written as a decimal)',
              't = 20 (years from Level 25 to Level 45)',
              'Step: (1.08)^20 = 4.661, then multiply by 5,000',
            ],
            correctAnswer: 23305,
            acceptableRange: [22000, 24600],
            feedback: {
              correct: `Exactly right! 5,000 gold → 23,305 gold. That's a 4.66× multiplier — all without touching the original stash. Compound XP stacking at its finest.`,
              wrong: `Here's the step-by-step breakdown:\n\n• P = 5,000\n• r = 0.08\n• t = 20\n• A = 5,000 × (1.08)^20\n• (1.08)^20 = 4.661\n• A = 5,000 × 4.661 = 23,305 gold\n\nCommon mistake: simple interest gives 5,000 + (5,000 × 0.08 × 20) = 13,000. That's wrong because compound interest earns on the GROWING total each year, not the original 5,000.`,
            },
          },
          {
            id: 'ci_g0_l2q2', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `Your rival invested 10,000 gold at 6% compound interest 15 years ago and hasn't touched it. You're thinking of matching their current total by investing today at the same rate.`,
            question: `What is your rival's current gold total after 15 years at 6% compound interest? (Round to nearest whole number)\n\nFormula: A = P × (1 + r)^t`,
            formula: 'A = P × (1 + r)^t',
            hints: [
              'P = 10,000',
              'r = 0.06',
              't = 15',
              '(1.06)^15 ≈ 2.397',
            ],
            correctAnswer: 23966,
            acceptableRange: [23000, 25000],
            feedback: {
              correct: `Correct! 10,000 × (1.06)^15 = 23,966 gold. Your rival nearly 2.4× their investment just by waiting. Time is the real cheat code.`,
              wrong: `Let's work through it:\n\n• A = 10,000 × (1.06)^15\n• (1.06)^15 = 2.397\n• A = 10,000 × 2.397 = 23,966 gold\n\nNOTE: (1.06)^15 means 1.06 multiplied by itself 15 times, not 1.06 × 15.`,
            },
          },
          {
            id: 'ci_g0_l3q1', level: 3, levelName: 'BOSS FIGHT', type: 'open_ended',
            scenario: `THE INVESTMENT DILEMMA\n\nYou are Level 30 with 20,000 gold saved. Three options:\n\nOPTION A — High-Risk Dungeon\n• Potential 15% compound returns per year\n• Could lose 40% in bad years\n• Chance of 3× jackpot in 10 years\n• Requires 10-year lock-in\n\nOPTION B — Balanced Vault (compound interest)\n• Guaranteed 7% compound returns\n• No risk of loss\n• Steady predictable growth\n• Withdraw anytime\n\nOPTION C — Spend Half, Invest Half\n• Use 10,000 gold on legendary gear NOW\n• Invest remaining 10,000 at 7% compound\n• Gear boosts your gold income by 10%\n\nYOUR SITUATION:\n• You need 60,000 gold by Level 50 (20 years)\n• You earn 200 gold/month from quests\n• You have NO emergency fund`,
            question: `Which option makes the most sense for your situation? Explain your reasoning, considering your 20-year goal, the lack of an emergency fund, and how compound interest works.`,
            evaluationCriteria: [
              'Considers the 20-year time horizon and its impact on compound growth',
              'Identifies the emergency fund gap as a key risk factor',
              'Connects chosen option to compound interest principles',
              'Weighs risk vs. guaranteed returns given the specific situation',
              'Makes a clear recommendation with reasoning',
            ],
            minWords: 80,
          },
        ],
      },
      {
        variant: 1,
        questions: [
          {
            id: 'ci_g1_l1q1', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `Your guild offers two ways to earn passive gold:\n\nSIMPLE TRIBUTE: Earn 500 gold per year on your 5,000 gold deposit. Always calculates on the original 5,000. Withdraw anytime.\n\nCOMPOUND TRIBUTE: Earn 8% per year, but 8% is calculated on your TOTAL each year — including previous earnings.`,
            question: `After 5 years, which tribute system earns you MORE gold, and roughly by how much?`,
            choices: [
              { id: 'A', text: 'Compound — earns more because each year\'s interest also earns interest' },
              { id: 'B', text: 'Simple — flat rate is more predictable and always wins' },
              { id: 'C', text: 'They earn exactly the same total gold' },
              { id: 'D', text: 'Simple — compound interest penalizes early investors' },
            ],
            correct: 'A',
            explanation: `Simple: 5,000 + (500 × 5) = 7,500 gold. Compound: 5,000 × (1.08)^5 = 7,347 gold. Interesting — at 5 years, simple is actually slightly ahead at 10%/year vs 8%. But the PRINCIPLE is: compound grows FASTER than simple over long horizons. With equal rates, compound always wins after year 1.`,
          },
          {
            id: 'ci_g1_l1q2', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `FINN asks you: "If you deposit 1,000 gold at 10% compound interest, how much do you earn in Year 2?"\n\nPlayer A says: "100 gold — it's 10% of 1,000 every year."\nPlayer B says: "110 gold — it's 10% of 1,100 because Year 1 earned 100 gold."`,
            question: `Who is correct, and what does this reveal about compound interest?`,
            choices: [
              { id: 'A', text: 'Player B — compound interest earns on the growing balance, not just the original' },
              { id: 'B', text: 'Player A — the rate always applies to the original deposit amount' },
              { id: 'C', text: 'Both are right — it depends on the bank\'s terms' },
              { id: 'D', text: 'Neither — you only earn interest at the END of the full term' },
            ],
            correct: 'A',
            explanation: `Player B nails it. Year 1: 1,000 × 10% = 100 gold earned → balance = 1,100. Year 2: 1,100 × 10% = 110 gold earned → balance = 1,210. This "interest on interest" is the entire magic of compounding. Player A is describing simple interest.`,
          },
          {
            id: 'ci_g1_l2q1', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `Your Guild Master hands you a quest scroll: "Invest 2,000 gold at 12% compound interest. Check back in 10 years. The guild takes nothing — all gains are yours."`,
            question: `How much gold do you collect after exactly 10 years?\n\nFormula: A = P × (1 + r)^t`,
            formula: 'A = P × (1 + r)^t',
            hints: ['P = 2,000', 'r = 0.12', 't = 10', '(1.12)^10 ≈ 3.106'],
            correctAnswer: 6212,
            acceptableRange: [6000, 6500],
            feedback: {
              correct: `Correct! 2,000 × (1.12)^10 = 6,212 gold — more than 3× your original investment without a single quest.`,
              wrong: `Work:\n• A = 2,000 × (1.12)^10\n• (1.12)^10 = 3.106\n• A = 2,000 × 3.106 = 6,212 gold\n\nIf you got 4,400, you may have used simple interest (2,000 + 2,000×0.12×10). Compound means the 12% applies to a bigger number each year.`,
            },
          },
          {
            id: 'ci_g1_l2q2', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `You want your 3,000 gold to grow to at least 10,000 gold using a vault paying 6% compound annually. You need to know: how many years will this take?\n\nHint: Use the Rule of 72 to estimate. Rule of 72: Years to double ≈ 72 ÷ interest rate.`,
            question: `Using the Rule of 72, approximately how many years to DOUBLE your gold at 6%? And how many more years to double AGAIN to reach 12,000+?`,
            formula: 'Years to double ≈ 72 ÷ rate',
            hints: ['72 ÷ 6 = 12 years to double once', '3,000 → 6,000 in 12 years', '6,000 → 12,000 in another 12 years', 'So ~24 years to reach 12,000 (past your 10,000 goal)'],
            correctAnswer: 24,
            acceptableRange: [22, 26],
            feedback: {
              correct: `Right! 72 ÷ 6 = 12 years per doubling. Two doublings = 24 years to go from 3,000 → 6,000 → 12,000. Your 10,000 goal is hit somewhere around year 20.`,
              wrong: `The Rule of 72: divide 72 by the interest rate to get doubling time.\n\n• 72 ÷ 6 = 12 years per double\n• 3,000 doubles to 6,000 in 12 years\n• 6,000 doubles to 12,000 in another 12 years\n• Total: 24 years to exceed 10,000 goal`,
            },
          },
          {
            id: 'ci_g1_l3q1', level: 3, levelName: 'BOSS FIGHT', type: 'open_ended',
            scenario: `GUILD TREASURY DILEMMA\n\nYou are the newly elected Guild Treasurer managing 50,000 gold on behalf of 20 guild members. The guild needs 200,000 gold in 15 years to buy a guild hall.\n\nYou have three proposals from advisors:\n\nADVISOR KIRA: "Put everything in a compound vault at 8% annually. Safe, predictable."\n→ Result: 50,000 × (1.08)^15 = ~158,608 gold (short of goal)\n\nADVISOR DREX: "Split: 70% compound vault (8%), 30% into high-risk guild raids (potential 20%, risk of losing 50%)."\n\nADVISOR MIRA: "Keep it simple — just add 5,000 gold monthly from member dues. That's 900,000 gold over 15 years — way more than enough."\n→ Flaw: Guild can't sustain 5,000/month dues.`,
            question: `The guild can only afford 2,000 gold/month from dues (not 5,000). Given compound interest principles, which advisor's base strategy is most financially sound? What changes would you suggest to meet the 200,000 gold goal?`,
            evaluationCriteria: [
              'Identifies that Advisor Kira\'s plan falls short (158k vs 200k goal)',
              'Evaluates Advisor Drex\'s split strategy considering risk/reward',
              'Recognizes Advisor Mira\'s error (unsustainable dues)',
              'Incorporates regular contributions alongside compound growth',
              'Proposes a realistic path to 200,000 gold with specific reasoning',
            ],
            minWords: 80,
          },
        ],
      },
    ],

    fashion: [
      {
        variant: 0,
        questions: [
          {
            id: 'ci_f0_l1q1', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `You're curating your financial wardrobe with $10,000. Two "investment pieces":\n\nCLASSIC CAPSULE FUND: Grows 6% per year through compound interest. Like a vintage Hermès bag that appreciates quietly every season.\n\nFAST FASHION PORTFOLIO: You spend $10,000 on 50 trendy pieces. Each loses 20% of value per year as trends cycle. Needs constant refreshing.`,
            question: `After 10 years, which "wardrobe" is worth more — and what does this illustrate about compound interest?`,
            choices: [
              { id: 'A', text: 'Classic fund — appreciating assets compound, depreciating assets destroy wealth' },
              { id: 'B', text: 'Fast fashion — more items always means more total value' },
              { id: 'C', text: 'They end up equal because you own more pieces with fast fashion' },
              { id: 'D', text: 'Fast fashion — trends can surprise you with a comeback' },
            ],
            correct: 'A',
            explanation: `Classic: $10,000 × (1.06)^10 = $17,908. Fast fashion: $10,000 × (0.80)^10 = $1,074 — a devastating 89% loss. Compound interest works FOR you with appreciation and AGAINST you with depreciation. A timeless financial wardrobe appreciates; trendy spending depreciates.`,
          },
          {
            id: 'ci_f0_l1q2', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `Two fashion editors invest for retirement:\n\nEDITOR AVA: Invests $5,000 at age 25 in a 7% compound fund. Never adds another dollar.\nEDITOR BEA: Invests $500/month starting at age 45. Same 7% compound rate.`,
            question: `At age 65, who likely has more — Ava with one early $5,000 deposit, or Bea with 20 years of $500/month contributions?`,
            choices: [
              { id: 'A', text: 'Bea — $500/month for 20 years totals $120,000 invested, far more principal' },
              { id: 'B', text: 'Ava — 40 years of compounding dwarfs 20 years even at lower principal' },
              { id: 'C', text: 'Exactly equal — rate and time balance out' },
              { id: 'D', text: 'Impossible to compare without knowing exact fund terms' },
            ],
            correct: 'A',
            explanation: `Bea wins here: $500/month for 20 years at 7% ≈ $260,000+. Ava: $5,000 × (1.07)^40 ≈ $74,872. BUT the lesson is that both TIME and CONTRIBUTIONS matter. Ava's single deposit grew 15×. Bea's consistent deposits compounded beautifully too. The ideal strategy: start early AND contribute regularly.`,
          },
          {
            id: 'ci_f0_l2q1', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `You invest $5,000 in a "timeless capsule fund" — think of it as the index fund equivalent of a capsule wardrobe. It grows at 8% compound interest annually. You make no additional contributions.`,
            question: `What is your investment worth after 20 years?\n\nFormula: A = P × (1 + r)^t`,
            formula: 'A = P × (1 + r)^t',
            hints: ['P = $5,000', 'r = 0.08', 't = 20', '(1.08)^20 ≈ 4.661'],
            correctAnswer: 23305,
            acceptableRange: [22000, 24600],
            feedback: {
              correct: `Perfect! $5,000 grows to $23,305 — a 4.66× return with zero additional effort. That's a capsule wardrobe working for you while you sleep.`,
              wrong: `Formula walkthrough:\n• A = 5,000 × (1.08)^20\n• (1.08)^20 = 4.661\n• A = 5,000 × 4.661 = $23,305\n\nCommon error: simple interest (5,000 + 5,000×0.08×20 = $13,000) ignores that each year's 8% applies to a LARGER amount than the year before.`,
            },
          },
          {
            id: 'ci_f0_l2q2', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `A vintage designer bag sold for $3,000 in 2010. Rare vintage pieces appreciate about 5% compound annually. You're considering buying it in 2025 (15 years later).`,
            question: `Based on 5% compound appreciation, what should the bag be worth in 2025?\n\nFormula: A = P × (1 + r)^t`,
            formula: 'A = P × (1 + r)^t',
            hints: ['P = $3,000 (2010 price)', 'r = 0.05', 't = 15', '(1.05)^15 ≈ 2.079'],
            correctAnswer: 6237,
            acceptableRange: [5800, 6700],
            feedback: {
              correct: `Exactly — $3,000 × (1.05)^15 = $6,237. Real appreciation, real compound growth. This is why quality vintage pieces can be investments, not just expenses.`,
              wrong: `Step by step:\n• A = 3,000 × (1.05)^15\n• (1.05)^15 = 2.079\n• A = 3,000 × 2.079 = $6,237\n\nIf you added 5% × 15 = 75% → $5,250, that's simple interest. Compound grows faster.`,
            },
          },
          {
            id: 'ci_f0_l3q1', level: 3, levelName: 'BOSS FIGHT', type: 'open_ended',
            scenario: `THE WARDROBE INVESTMENT DILEMMA\n\nYou have $20,000 and a 20-year goal to reach $60,000.\n\nOPTION A — EMERGING DESIGNER RISK\n• Invest in emerging designer pieces with potential 15% annual appreciation\n• Risk: Designer flops (lose 50% in a bad year)\n• 10-year lock-in required\n\nOPTION B — CLASSIC CAPSULE (compound interest)\n• Proven 7% annual appreciation, like a blue-chip index fund\n• Low risk, timeless value\n• Access funds anytime\n\nOPTION C — MIXED COLLECTION\n• $10,000 in emerging designers (potential 15%)\n• $10,000 in classics (safe 7%)\n• Balanced risk/reward\n\nYOUR SITUATION:\n• Goal: $60,000 in 20 years\n• No emergency savings currently\n• Monthly income: $2,000`,
            question: `Which strategy fits your situation? Factor in the emergency savings gap, the 20-year time horizon, and how compound interest applies to each option.`,
            evaluationCriteria: [
              'Calculates or estimates Option B outcome (20,000 × 1.07^20 ≈ $77,394 — exceeds goal)',
              'Recognizes emergency fund gap as a constraint on locking money in Option A',
              'Evaluates Option C as a risk-balanced approach',
              'Uses compound interest logic in reasoning',
              'Makes a clear recommendation suited to the specific situation',
            ],
            minWords: 80,
          },
        ],
      },
    ],

    sports: [
      {
        variant: 0,
        questions: [
          {
            id: 'ci_s0_l1q1', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `Two rookie athletes each receive a $5,000 signing bonus:\n\nROOKIE AIDEN: Invests immediately in a compound interest account at 7% annually.\nROOKIE BEN: Spends it on new gear, plans to "invest later when I earn more."\n\nBen starts investing $5,000 ten years later at the same 7%.`,
            question: `After 30 years total, who has more — Aiden who invested immediately, or Ben who waited 10 years?`,
            choices: [
              { id: 'A', text: 'Aiden — 30 years of compound growth vs 20 years is a massive difference' },
              { id: 'B', text: 'Ben — he learned from the delay and invested more strategically' },
              { id: 'C', text: 'Equal — they both invested the same amount' },
              { id: 'D', text: 'Ben — 7% over 20 years is still strong enough' },
            ],
            correct: 'A',
            explanation: `Aiden: $5,000 × (1.07)^30 = $38,061. Ben: $5,000 × (1.07)^20 = $19,348. The 10-year head start nearly DOUBLED Aiden's result. In finance, as in sports, showing up early makes all the difference.`,
          },
          {
            id: 'ci_s0_l1q2', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `Your coach explains compound interest using a training analogy:\n\n"Think of your money like physical conditioning. Simple interest is doing 10 push-ups every day flat. Compound interest is doing 10 push-ups, then NEXT day doing 10% more than yesterday's total — so your capacity grows every session."`,
            question: `Which of these financial scenarios best reflects compound interest (not simple interest)?`,
            choices: [
              { id: 'A', text: 'A savings account that earns interest on your balance PLUS all previously earned interest' },
              { id: 'B', text: 'A bonus paid as a flat $200 every year regardless of account size' },
              { id: 'C', text: 'A loan that charges the same $50 fee each month' },
              { id: 'D', text: 'A salary that increases by exactly $1,000 every year' },
            ],
            correct: 'A',
            explanation: `Option A: interest on interest = compound. Options B, C, D all describe fixed/simple growth — the amount added doesn't change based on the growing total. Compound interest is about a growing base earning a growing return.`,
          },
          {
            id: 'ci_s0_l2q1', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `You invest your $4,000 sports scholarship in a compound interest account at 9% annually. You graduate in 4 years and don't touch it. After graduation, you leave it invested for another 16 years (20 years total).`,
            question: `What is your account balance after the full 20 years at 9% compound?\n\nFormula: A = P × (1 + r)^t`,
            formula: 'A = P × (1 + r)^t',
            hints: ['P = $4,000', 'r = 0.09', 't = 20', '(1.09)^20 ≈ 5.604'],
            correctAnswer: 22416,
            acceptableRange: [21000, 23800],
            feedback: {
              correct: `Nailed it! $4,000 × (1.09)^20 = $22,416. A scholarship became a $22K asset — just by letting compound interest work undisturbed.`,
              wrong: `Solution:\n• A = 4,000 × (1.09)^20\n• (1.09)^20 = 5.604\n• A = 4,000 × 5.604 = $22,416`,
            },
          },
          {
            id: 'ci_s0_l2q2', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `Your sports analytics team models a contract: a player invests $15,000 of their first season earnings at 8% compound interest. How much will they have at retirement in 25 years?`,
            question: `Calculate the retirement total.\n\nFormula: A = P × (1 + r)^t`,
            formula: 'A = P × (1 + r)^t',
            hints: ['P = $15,000', 'r = 0.08', 't = 25', '(1.08)^25 ≈ 6.848'],
            correctAnswer: 102720,
            acceptableRange: [98000, 108000],
            feedback: {
              correct: `Correct! $15,000 × (1.08)^25 = $102,720. A first-season investment becomes six figures by retirement. Championship-level financial planning.`,
              wrong: `A = 15,000 × (1.08)^25 = 15,000 × 6.848 = $102,720.\n\nIf you got $45,000, you likely did 15,000 + 15,000×0.08×25 = simple interest.`,
            },
          },
          {
            id: 'ci_s0_l3q1', level: 3, levelName: 'BOSS FIGHT', type: 'open_ended',
            scenario: `CHAMPIONSHIP FINANCIAL PLAY\n\nYou're a 22-year-old professional athlete earning $80,000/year. Your agent presents three financial plays:\n\nPLAY A — ALL-IN COMPOUND\nInvest $20,000/year in an index fund averaging 8% compound annually. Sacrifice lifestyle now for wealth at 45.\n\nPLAY B — BALANCED ROSTER\n• $10,000/year in compound investments (8%)\n• $5,000/year building your personal brand\n• $5,000/year lifestyle\n\nPLAY C — SPEND AND INVEST LATER\nEnjoy the athlete lifestyle now. Start investing $30,000/year at age 32 when earnings peak.\n\nSITUATION:\n• Career likely ends at 35\n• No pension from the league\n• Only 2 months of emergency savings`,
            question: `Which play best uses compound interest principles given your 13-year window, no pension, and thin emergency cushion? Justify your choice with specific reasoning.`,
            evaluationCriteria: [
              'Recognizes the short career window (13 years) amplifies the cost of delay',
              'Addresses the emergency fund gap as a priority',
              'Uses compound interest math or logic to support the choice',
              'Evaluates the personal brand ROI in Play B',
              'Makes a defensible recommendation suited to athlete-specific constraints',
            ],
            minWords: 80,
          },
        ],
      },
    ],

    movies: [
      {
        variant: 0,
        questions: [
          {
            id: 'ci_m0_l1q1', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `A studio executive explains compound interest as the "Sequel Effect":\n\n"Your first film earns $10M. You reinvest all profits. Film 2 earns on the $10M PLUS Film 1's profits. Film 3 earns on Film 1 + Film 2 profits. Each sequel compounds on the entire franchise value — not just the original investment."`,
            question: `Which financial scenario mirrors the Sequel Effect (compound interest)?`,
            choices: [
              { id: 'A', text: 'A savings account where this year\'s interest is added to the balance and earns interest next year' },
              { id: 'B', text: 'A flat $500 check mailed to you every year regardless of your balance' },
              { id: 'C', text: 'A film deal paying 5% of only the original $10M budget every year' },
              { id: 'D', text: 'A streaming deal paying the same royalty rate on each individual episode' },
            ],
            correct: 'A',
            explanation: `Option A is the Sequel Effect: balance grows, then interest earns on the LARGER balance. Each year's return becomes part of the principal for next year. Options B, C, D are all flat/simple — the amount doesn't compound on itself.`,
          },
          {
            id: 'ci_m0_l1q2', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `Director ORLA invests $8,000 at 8% compound interest at age 28.\nDirector PIKE invests $8,000 at 8% compound interest at age 38.\n\nBoth retire at age 68.`,
            question: `Orla gets how many MORE years of compounding than Pike, and why does this matter so much?`,
            choices: [
              { id: 'A', text: '10 more years — compounding is exponential, so those extra years matter disproportionately' },
              { id: 'B', text: '10 more years — but it\'s linear, so it\'s only about 80% more total' },
              { id: 'C', text: '5 more years — you only count the years when growth is large' },
              { id: 'D', text: 'The difference is negligible after 30+ years at 8%' },
            ],
            correct: 'A',
            explanation: `Orla: 40 years. Pike: 30 years. Orla: $8,000 × (1.08)^40 = $173,527. Pike: $8,000 × (1.08)^30 = $80,451. Orla has 2.16× more. That's the power of exponential growth — the last 10 years of compounding are worth FAR more than the first 10.`,
          },
          {
            id: 'ci_m0_l2q1', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `A debut director receives a $6,000 advance. Instead of spending it, they invest it at 7% compound interest. They don't touch it for 15 years while building their career.`,
            question: `What is the investment worth after 15 years?\n\nFormula: A = P × (1 + r)^t`,
            formula: 'A = P × (1 + r)^t',
            hints: ['P = $6,000', 'r = 0.07', 't = 15', '(1.07)^15 ≈ 2.759'],
            correctAnswer: 16554,
            acceptableRange: [15500, 17500],
            feedback: {
              correct: `Cut! Perfect take. $6,000 × (1.07)^15 = $16,554. An advance became a $16K asset by the time they hit their stride.`,
              wrong: `A = 6,000 × (1.07)^15 = 6,000 × 2.759 = $16,554.\n\nSimple interest would give 6,000 + 6,000×0.07×15 = $12,300 — compound beats it by $4,254.`,
            },
          },
          {
            id: 'ci_m0_l2q2', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `A studio invests $50,000 in a compound interest fund at 6% to fund a documentary series in 12 years.`,
            question: `How much will the fund hold in 12 years?\n\nFormula: A = P × (1 + r)^t`,
            formula: 'A = P × (1 + r)^t',
            hints: ['P = $50,000', 'r = 0.06', 't = 12', '(1.06)^12 ≈ 2.012'],
            correctAnswer: 100600,
            acceptableRange: [95000, 106000],
            feedback: {
              correct: `Action! $50,000 × (1.06)^12 ≈ $100,600 — effectively doubling the production fund without a single pitch meeting.`,
              wrong: `A = 50,000 × (1.06)^12 = 50,000 × 2.012 = $100,600.\n\nNotice how 6% for 12 years roughly doubles the money — a useful benchmark (Rule of 72: 72÷6 = 12 years to double).`,
            },
          },
          {
            id: 'ci_m0_l3q1', level: 3, levelName: 'BOSS FIGHT', type: 'open_ended',
            scenario: `THE PRODUCTION FUND DILEMMA\n\nYou're a filmmaker with $25,000 in savings. You want to self-fund a feature film in 10 years that will cost $80,000.\n\nSTRATEGY A — Pure Compound\nInvest all $25,000 at 8% compound interest for 10 years. Don't touch it.\n→ Result: ~$53,973 (still short of $80,000)\n\nSTRATEGY B — Invest + Save Regularly\nInvest $15,000 now at 8% compound. Save $200/month additionally.\n→ Estimated with contributions: ~$65,000+ (closer but may still fall short)\n\nSTRATEGY C — Take a Film Grant\nApply for a $20,000 arts grant. Use grant + your $25,000 compound investment to hit $80,000 faster. Risk: grant applications have 15% acceptance rate.\n\nYOUR SITUATION:\n• Full-time job paying $3,500/month\n• $500/month in disposable income\n• $6,000 emergency fund (3 months)`,
            question: `Which strategy gives you the best shot at the $80,000 production budget in 10 years? Explain how compound interest plays a role and what adjustments you'd make to any strategy.`,
            evaluationCriteria: [
              'Calculates or estimates Strategy A shortfall ($53,973 vs $80,000)',
              'Recognizes that regular contributions (Strategy B) boost compound growth',
              'Evaluates the grant risk in Strategy C (15% acceptance)',
              'Considers disposable income ($500/month) as a savings lever',
              'Proposes a realistic combined approach or adjusted strategy',
            ],
            minWords: 80,
          },
        ],
      },
    ],

    food: [
      {
        variant: 0,
        questions: [
          {
            id: 'ci_fo0_l1q1', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `Chef NORA explains compound interest to her kitchen team:\n\n"Think of sourdough starter. You keep a small portion, feed it, and it grows. Next feeding, you feed the LARGER culture — it grows even more. You never start from scratch; you always build on what's already there."\n\nSIMPLE SAVINGS: You earn $80 every year no matter your balance.\nCOMPOUND SAVINGS: You earn 8% of your current balance — and your balance grows every year.`,
            question: `After 10 years with $1,000 starting, which account holds more?`,
            choices: [
              { id: 'A', text: 'Compound — earns 8% of a growing balance vs flat $80/year' },
              { id: 'B', text: 'Simple — $80/year is guaranteed; 8% fluctuates' },
              { id: 'C', text: 'Exactly equal at $1,800 each' },
              { id: 'D', text: 'Simple — predictable beats variable every time' },
            ],
            correct: 'A',
            explanation: `Simple: $1,000 + ($80 × 10) = $1,800. Compound: $1,000 × (1.08)^10 = $2,159. Compound wins by $359 — and the gap grows exponentially each year after that, just like a fed sourdough culture.`,
          },
          {
            id: 'ci_fo0_l1q2', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `A Michelin-starred chef invests their $10,000 prize money. Two paths:\n\nSTOCK PANTRY (Simple): Earns a fixed $700 per year (7% of original $10,000). Always.\nARTISAN FERMENT (Compound): Earns 7% of the current balance — so earnings grow each year as the balance grows.`,
            question: `In Year 5, how much does each account earn (not total balance — just that year's earnings)?`,
            choices: [
              { id: 'A', text: 'Stock Pantry: $700. Artisan Ferment: ~$980 (7% of ~$14,000 balance)' },
              { id: 'B', text: 'Both earn exactly $700 — the rate is the same' },
              { id: 'C', text: 'Stock Pantry: $700. Artisan Ferment: $1,400 (doubles each year)' },
              { id: 'D', text: 'Artisan Ferment: $700. Stock Pantry: $980 (simple grows faster short-term)' },
            ],
            correct: 'A',
            explanation: `After 4 years of 7% compound: $10,000 × (1.07)^4 ≈ $13,108. Year 5 earnings: $13,108 × 7% ≈ $918. Simple earns the same $700 every year. The compound account earns more each year because the base keeps growing.`,
          },
          {
            id: 'ci_fo0_l2q1', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `A culinary school graduate invests their $7,500 graduation gift at 9% compound interest annually. They plan to open their own restaurant in 18 years.`,
            question: `How much will the $7,500 grow to after 18 years?\n\nFormula: A = P × (1 + r)^t`,
            formula: 'A = P × (1 + r)^t',
            hints: ['P = $7,500', 'r = 0.09', 't = 18', '(1.09)^18 ≈ 4.717'],
            correctAnswer: 35378,
            acceptableRange: [33000, 37500],
            feedback: {
              correct: `Excellent mise en place! $7,500 × (1.09)^18 = $35,378. A graduation gift becomes serious restaurant seed capital — without a single extra contribution.`,
              wrong: `A = 7,500 × (1.09)^18 = 7,500 × 4.717 = $35,378.\n\nSimple interest: 7,500 + 7,500×0.09×18 = $19,650. Compound generates $15,728 MORE.`,
            },
          },
          {
            id: 'ci_fo0_l2q2', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `A food truck owner invests $3,000 from their first profitable month at 10% compound interest. They want to know the Rule of 72 to estimate when it doubles.`,
            question: `Using the Rule of 72, approximately how many years does it take to double at 10%?\n\nRule of 72: Doubling time ≈ 72 ÷ interest rate`,
            formula: 'Doubling time = 72 ÷ rate',
            hints: ['Divide 72 by the interest rate (use the percentage number, not decimal)', '72 ÷ 10 = ?'],
            correctAnswer: 7,
            acceptableRange: [6, 8],
            feedback: {
              correct: `Correct! 72 ÷ 10 = 7.2 years to double. So $3,000 becomes ~$6,000 in about 7 years, ~$12,000 in 14 years. A simple tool for estimating compounding power.`,
              wrong: `Rule of 72: 72 ÷ 10 = 7.2 years. So $3,000 doubles to $6,000 in about 7 years at 10% compound. Actual: $3,000 × (1.10)^7 = $5,846 — very close.`,
            },
          },
          {
            id: 'ci_fo0_l3q1', level: 3, levelName: 'BOSS FIGHT', type: 'open_ended',
            scenario: `THE RESTAURANT EXPANSION DILEMMA\n\nYou own a successful food truck earning $4,000/month net profit. You have $30,000 saved. You want to open a brick-and-mortar restaurant in 8 years (cost: $100,000).\n\nOPTION A — FULL COMPOUND\nInvest all $30,000 at 8% compound for 8 years. Save nothing extra.\n→ Result: $30,000 × (1.08)^8 = $55,598 (still $44,402 short)\n\nOPTION B — COMPOUND + MONTHLY SAVINGS\nInvest $20,000 now at 8%. Save $1,500/month from truck profits.\n→ $20,000 compound + savings contributions → likely reaches $100,000+\n\nOPTION C — BUSINESS LOAN NOW\nBorrow $70,000 at 6% to open immediately. Use current truck profits ($4,000/month) to repay.\n→ Monthly payment ~$1,040/month for 6 years. Opens restaurant 8 years earlier.\n\nYOUR SITUATION:\n• Current monthly income: $4,000 (truck)\n• Emergency fund: $8,000 (2 months)\n• Health: truck is at 90% capacity — can't grow much more`,
            question: `Which option best sets you up for sustainable restaurant ownership? Consider compound interest, the emergency fund, and your income ceiling with the truck.`,
            evaluationCriteria: [
              'Recognizes Option A alone falls $44,000 short of goal',
              'Evaluates Option B: regular contributions significantly boost compound growth',
              'Analyzes Option C loan risk vs 8-year acceleration benefit',
              'Considers the thin emergency fund ($8,000) as a risk factor',
              'Makes a specific recommendation with financial reasoning',
            ],
            minWords: 80,
          },
        ],
      },
    ],

    music: [
      {
        variant: 0,
        questions: [
          {
            id: 'ci_mu0_l1q1', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `Producer ECHO explains compound interest to their new artist:\n\n"Think of your fanbase like a compound investment. You have 100 fans. Each fan brings in 1 new fan per year on average. Year 2: 200 fans. Year 3: 400. It's not flat linear growth — it's your crescendo."\n\nSIMPLE ROYALTY: $500 per year on your first album. Always $500.\nCOMPOUND ROYALTY: 8% of total accumulated earnings per year.`,
            question: `After 8 years with $5,000 starting royalties, which structure gives you more?`,
            choices: [
              { id: 'A', text: 'Compound — 8% of growing balance vs flat $500/year' },
              { id: 'B', text: 'Simple — $500 is guaranteed each year; compound is risky' },
              { id: 'C', text: 'Equal — both add the same total' },
              { id: 'D', text: 'Simple — it adds up faster in early years' },
            ],
            correct: 'A',
            explanation: `Simple: $5,000 + ($500 × 8) = $9,000. Compound: $5,000 × (1.08)^8 = $9,254. At 8 years the gap is modest — but at 20 years: simple = $15,000 vs compound = $23,305. The crescendo builds slowly, then overwhelms.`,
          },
          {
            id: 'ci_mu0_l1q2', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `Two session musicians invest their first big paycheck of $4,000:\n\nMUSICIAN A: Invests immediately at 7% compound. Doesn't touch it for 35 years.\nMUSICIAN B: Spends it on new gear. Starts investing $4,000 at 7% compound 10 years later. Holds for 25 years.`,
            question: `Who has more at retirement, and what does this tell you?`,
            choices: [
              { id: 'A', text: 'Musician A — 35 vs 25 years of compounding produces nearly double the result' },
              { id: 'B', text: 'Musician B — starting with better gear generated more income to invest' },
              { id: 'C', text: 'Equal — same rate, same amount invested' },
              { id: 'D', text: 'Musician B — modern investment platforms are more efficient' },
            ],
            correct: 'A',
            explanation: `Musician A: $4,000 × (1.07)^35 = $42,579. Musician B: $4,000 × (1.07)^25 = $21,718. Same investment, same rate — but those 10 extra compounding years nearly doubled the outcome. The best gear you can buy is time.`,
          },
          {
            id: 'ci_mu0_l2q1', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `A music producer signs a sync deal and receives an $8,000 advance. Instead of spending it on studio time, they invest it at 6% compound interest for 12 years.`,
            question: `What is the investment worth after 12 years?\n\nFormula: A = P × (1 + r)^t`,
            formula: 'A = P × (1 + r)^t',
            hints: ['P = $8,000', 'r = 0.06', 't = 12', '(1.06)^12 ≈ 2.012'],
            correctAnswer: 16096,
            acceptableRange: [15000, 17000],
            feedback: {
              correct: `Perfect pitch! $8,000 × (1.06)^12 = $16,096. The advance doubled — without a single additional session.`,
              wrong: `A = 8,000 × (1.06)^12 = 8,000 × 2.012 = $16,096.\n\nSimple interest: 8,000 + 8,000×0.06×12 = $13,760. Compound earns $2,336 more.`,
            },
          },
          {
            id: 'ci_mu0_l2q2', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `Your artist manager says: "Invest $500/month isn't compound interest — that's regular contributions. But if you invest $10,000 now at 8%, that's pure compound." You decide to test the math on the lump sum.`,
            question: `How much does $10,000 grow to in 15 years at 8% compound interest?\n\nFormula: A = P × (1 + r)^t`,
            formula: 'A = P × (1 + r)^t',
            hints: ['P = $10,000', 'r = 0.08', 't = 15', '(1.08)^15 ≈ 3.172'],
            correctAnswer: 31722,
            acceptableRange: [30000, 33500],
            feedback: {
              correct: `Encore! $10,000 × (1.08)^15 = $31,722. Three times your investment in 15 years — no additional deposits required.`,
              wrong: `A = 10,000 × (1.08)^15 = 10,000 × 3.172 = $31,722.`,
            },
          },
          {
            id: 'ci_mu0_l3q1', level: 3, levelName: 'BOSS FIGHT', type: 'open_ended',
            scenario: `THE RECORD DEAL DILEMMA\n\nYou're an independent artist with 50,000 streams/month and $15,000 in savings. A label offers three deals:\n\nDEAL A — MAJOR ADVANCE\n$40,000 advance. Label takes 80% of royalties until recouped, then 50% forever. Includes $10,000 marketing budget.\n\nDEAL B — INDIE COMPOUND DEAL\n$5,000 advance. You keep 85% of royalties. Label handles distribution only.\nYou invest the other $10,000 of your savings at 8% compound.\n\nDEAL C — WAIT AND GROW\nNo deal. Keep streaming, grow organically. Invest all $15,000 at 8% compound.\nRevisit label deals at 100K streams/month.\n\nYOUR SITUATION:\n• Monthly expenses: $2,800\n• Monthly streaming income: $2,100\n• Runway without label: ~5 months (current savings)`,
            question: `Which deal makes most financial sense given your 5-month runway and compound interest principles? Explain how compound interest factors into your long-term analysis of each option.`,
            evaluationCriteria: [
              'Identifies the 5-month runway as a critical constraint',
              'Analyzes Deal A recoupment math (how long to earn back $40K at 80% share)',
              'Evaluates Deal B: compound investment + higher royalty retention',
              'Addresses Deal C viability given the thin savings runway',
              'Makes a recommendation with compound interest logic in the reasoning',
            ],
            minWords: 80,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // BUDGETING BASICS
  // ═══════════════════════════════════════════════════════════

  budgeting_basics: {

    gaming: [
      {
        variant: 0,
        questions: [
          {
            id: 'bb_g0_l1q1', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `You're managing resources in a strategy RPG. Your character earns 1,000 gold/month. You have fixed costs: 400 gold for shelter (guild hall fee), 200 gold for food/potions. The remaining gold is unplanned.`,
            question: `Which budgeting strategy mirrors how top-tier players manage resources in endgame content?`,
            choices: [
              { id: 'A', text: 'Allocate all 1,000 gold BEFORE the month starts — assign every coin a purpose' },
              { id: 'B', text: 'Spend freely and see what\'s left at month end' },
              { id: 'C', text: 'Only budget when you\'re running low' },
              { id: 'D', text: 'Ignore fixed costs — they\'re automatic anyway' },
            ],
            correct: 'A',
            explanation: `Zero-based budgeting: every gold piece gets assigned a role before you spend it. Guild hall = 400, potions = 200, savings = X, fun money = Y. What's unplanned gets spent randomly. In gaming AND finance, intentional resource allocation beats reactive spending every time.`,
          },
          {
            id: 'bb_g0_l1q2', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `FINN explains the 50/30/20 budget rule through a gaming lens:\n\n"50% of your income covers NEEDS (guild dues, shelter, food). 30% covers WANTS (cosmetics, battle passes, game purchases). 20% goes to SAVINGS and emergency fund. These aren't strict — they're your starting party composition. Adjust based on your situation."`,
            question: `A gamer earns $1,200/month. They spend $700 on needs, $400 on wants, and $100 on savings. What's wrong with their current allocation?`,
            choices: [
              { id: 'A', text: 'They\'re over-spending on wants (33%) and under-saving (8%) vs the 30/20 guide' },
              { id: 'B', text: 'Nothing — $100 savings is a good start' },
              { id: 'C', text: 'They\'re spending too much on needs at 58%' },
              { id: 'D', text: 'The 50/30/20 rule doesn\'t apply to gamers with irregular income' },
            ],
            correct: 'A',
            explanation: `Check: Needs = $700/1200 = 58% (over by 8%). Wants = $400/1200 = 33% (over by 3%). Savings = $100/1200 = 8% (under by 12%). They're leaking 12% that should go to savings into needs and wants. Small rebalance makes a big difference over time.`,
          },
          {
            id: 'bb_g0_l2q1', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `Your monthly streaming income: $900. Expenses: Gaming PC loan $150/month, internet $60, food $280, game subscriptions $45, emergency fund contribution $90. You want to calculate your TRUE discretionary budget (fun money) after all obligations.`,
            question: `How much discretionary (free to spend) gold do you have each month after all expenses and savings?`,
            formula: 'Discretionary = Income − All Expenses − Savings',
            hints: ['Add up ALL expenses: 150 + 60 + 280 + 45 = ?', 'Add the savings contribution: + $90', 'Subtract from $900'],
            correctAnswer: 275,
            acceptableRange: [260, 290],
            feedback: {
              correct: `Correct! $900 − $150 − $60 − $280 − $45 − $90 = $275 discretionary. You've got $275 to spend intentionally on whatever you want — guilt-free, because everything else is covered.`,
              wrong: `Let's count it:\n• PC loan: $150\n• Internet: $60\n• Food: $280\n• Subscriptions: $45\n• Savings: $90\n• Total out: $625\n• $900 − $625 = $275 discretionary`,
            },
          },
          {
            id: 'bb_g0_l2q2', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `You want to buy a $480 gaming peripheral. Your current discretionary budget is $120/month. You don't want to use credit. You also want to keep $50/month for unexpected gaming deals.`,
            question: `How many months until you can buy the peripheral by saving your remaining discretionary budget ($120 − $50 = $70/month for the peripheral)?`,
            formula: 'Months = Target ÷ Monthly savings',
            hints: ['Monthly savings toward peripheral = $120 − $50 = $70', '$480 ÷ $70 = ?', 'Round up to next whole month'],
            correctAnswer: 7,
            acceptableRange: [6, 8],
            feedback: {
              correct: `Exactly — $480 ÷ $70 = 6.86 → 7 months. No debt, no interest charges. The peripheral is yours free and clear.`,
              wrong: `$480 ÷ $70/month = 6.86 → round up to 7 months. If you'd bought on credit at 20% APR, that $480 would cost ~$530+ with interest.`,
            },
          },
          {
            id: 'bb_g0_l3q1', level: 3, levelName: 'BOSS FIGHT', type: 'open_ended',
            scenario: `BUDGET CRISIS: MAIN QUEST AT RISK\n\nYou're a full-time content creator earning $1,800/month (inconsistent — range $1,200–$2,400). Your fixed expenses:\n• Rent: $700\n• Utilities + internet: $120\n• Food: $350\n• Health insurance: $180\n• Software/equipment subscriptions: $95\n\nYou have $400 in savings. Zero emergency fund.\n\nThis month you need:\n• New mic (broke, can't record): $220\n• Car repair (can't work without transport): $380\n\nTotal emergency: $600. You have $400 saved.`,
            question: `Design a 3-month budget plan to handle this immediate crisis AND build a proper emergency fund. What changes do you make now vs. later? How does your approach change if income is only $1,200 this month?`,
            evaluationCriteria: [
              'Addresses the immediate $600 gap ($400 saved + $200 still needed)',
              'Identifies which expenses can be temporarily reduced',
              'Builds toward a 3-6 month emergency fund in the plan',
              'Accounts for income variability ($1,200 vs $2,400 scenarios)',
              'Prioritizes the mic (income-generating) vs car repair vs other needs',
            ],
            minWords: 80,
          },
        ],
      },
    ],

    fashion: [
      {
        variant: 0,
        questions: [
          {
            id: 'bb_f0_l1q1', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `You're a fashion buyer earning $3,200/month. You love discovering new designers. Your current spending: rent $1,100, food $400, transport $200, clothes/accessories $900, miscellaneous $400, savings $200.`,
            question: `Using the 50/30/20 framework, which category is most misaligned — and what does that signal?`,
            choices: [
              { id: 'A', text: 'Clothes ($900) — "wants" are eating 28% of income; savings at only 6% signals risk' },
              { id: 'B', text: 'Rent ($1,100) — housing is too high at 34%' },
              { id: 'C', text: 'Everything looks balanced — fashion buyers need clothes' },
              { id: 'D', text: 'Miscellaneous ($400) — this is the leak to fix first' },
            ],
            correct: 'A',
            explanation: `Clothes at $900 = 28% of income on one wants category alone. Total wants: $900 + $400 misc = $1,300 = 41% (over the 30% guide). Savings at $200 = 6% (under the 20% guide). The wardrobe isn't the enemy — it just needs a budget cap, not elimination.`,
          },
          {
            id: 'bb_f0_l1q2', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `The Style Budget Rule: "Cost per wear (CPW) = total price ÷ number of times worn. A $400 coat worn 200 times costs $2/wear. A $40 top worn 3 times costs $13/wear."\n\nBudgeting principle this illustrates:`,
            question: `Which budgeting insight does Cost Per Wear best illustrate?`,
            choices: [
              { id: 'A', text: 'Value per dollar matters more than sticker price — quality can be cheaper long-term' },
              { id: 'B', text: 'Always buy the cheaper item to save money upfront' },
              { id: 'C', text: 'Budgeting doesn\'t apply to personal style choices' },
              { id: 'D', text: 'Expensive items are always better investments' },
            ],
            correct: 'A',
            explanation: `CPW is budgeting through a style lens: true cost = total price ÷ utility received. A smart budget isn't "spend least upfront" — it's "maximize value per dollar over time." This also applies to appliances, cars, tools. Cheapest sticker price often means worst CPW.`,
          },
          {
            id: 'bb_f0_l2q1', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `Fashion influencer income: $2,600/month. Fixed needs: rent $850, utilities $130, food $380, transport $160 = $1,520 total. She wants to follow 50/30/20: 50% needs, 30% wants (styling/clothes/events), 20% savings.`,
            question: `What is her maximum monthly clothing/styling budget under the 30% wants rule? (Round to nearest dollar)`,
            formula: 'Wants budget = Income × 0.30',
            hints: ['Total wants budget = $2,600 × 30% = ?', 'Wants include clothes AND events AND other non-essentials', 'If she has other wants expenses, clothing gets a share of this total'],
            correctAnswer: 780,
            acceptableRange: [750, 810],
            feedback: {
              correct: `Correct! $2,600 × 30% = $780 total wants budget. If events take $200, she has $580 left for clothes. The cap isn't restrictive — it's empowering: spend the $780 guilt-free.`,
              wrong: `$2,600 × 0.30 = $780 total wants budget. Savings: $2,600 × 0.20 = $520. Needs: $2,600 × 0.50 = $1,300. Check: $1,520 needs is slightly over 50% — she should either reduce needs or adjust the percentages.`,
            },
          },
          {
            id: 'bb_f0_l2q2', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `You track 3 months of clothing spending: January $1,100, February $380, March $720. Your monthly income is $2,600.`,
            question: `What is your average monthly clothing spend, and what percentage of your income is this?`,
            formula: 'Average = (Month1 + Month2 + Month3) ÷ 3',
            hints: ['Add the three months: 1,100 + 380 + 720', 'Divide by 3 for the average', 'Percentage = (average ÷ income) × 100'],
            correctAnswer: 26,
            acceptableRange: [24, 28],
            feedback: {
              correct: `Correct! Average: (1,100+380+720) ÷ 3 = $733. Percentage: $733 ÷ $2,600 = 28.2% ≈ 26-28%. Close to but slightly under the full 30% wants limit.`,
              wrong: `Average: (1,100 + 380 + 720) ÷ 3 = 2,200 ÷ 3 = $733/month. $733 ÷ $2,600 = 28.2% of income on clothing alone.`,
            },
          },
          {
            id: 'bb_f0_l3q1', level: 3, levelName: 'BOSS FIGHT', type: 'open_ended',
            scenario: `THE WARDROBE BUDGET OVERHAUL\n\nYou're a fashion assistant earning $2,200/month. You love fashion — it's your career AND your passion. Current spending:\n• Rent: $900 (41% of income)\n• Food: $400\n• Transport: $150\n• Clothes + accessories: $600\n• Beauty: $200\n• Entertainment: $150\n• Savings: $0\n\nSituation: You have zero savings. Your car needs $800 in repairs next month. Your company does NOT offer fashion discounts.\n\nYou refuse to stop investing in your professional appearance — your job literally requires being well-dressed.`,
            question: `Design a budget that handles the $800 car repair in 2 months, builds at least $500 in emergency savings within 4 months, AND maintains a respectable fashion budget. Be specific about where you cut, where you keep, and why.`,
            evaluationCriteria: [
              'Identifies rent at 41% as the primary structural issue',
              'Finds realistic cuts without eliminating fashion entirely',
              'Creates a month-by-month plan for car repair + emergency fund',
              'Addresses the CPW principle (fewer, better pieces over many cheap ones)',
              'Shows understanding that sustainable budgets account for career-critical spending',
            ],
            minWords: 80,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // EMERGENCY FUND
  // ═══════════════════════════════════════════════════════════

  emergency_fund: {
    gaming: [
      {
        variant: 0,
        questions: [
          {
            id: 'ef_g0_l1q1', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `You're 30 hours into a boss fight with no save point, running low on health potions. Your guild's advice: "Always keep a reserve of potions before any major encounter — at least enough to survive 3–6 encounters without resupply."\n\nThis is exactly the financial rule for emergency funds.`,
            question: `What is the standard emergency fund target, and why is it specifically 3–6 months?`,
            choices: [
              { id: 'A', text: '3–6 months of expenses — covers job loss, medical bills, or major repairs without debt' },
              { id: 'B', text: '1 month — just enough for one missed paycheck' },
              { id: 'C', text: '12 months — you should always have a full year saved' },
              { id: 'D', text: 'Whatever\'s left after spending — save the surplus' },
            ],
            correct: 'A',
            explanation: `3–6 months is the standard because: job searches average 3–4 months, medical crises often unfold over weeks, repairs take time to source. Under-saved (1 month) = forced into debt after any major hit. Over-saved (12 months) = too much cash sitting idle when it could be invested. 3–6 is the optimal health potion reserve.`,
          },
          {
            id: 'ef_g0_l1q2', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `Your friend says: "Emergency fund? I have a $5,000 limit credit card. That's my emergency plan." You're about to explain why this is like spawning without a health bar.`,
            question: `What's the critical difference between credit as "emergency fund" vs actual cash savings?`,
            choices: [
              { id: 'A', text: 'Credit creates debt with 15-25% interest; cash has zero cost and zero risk of unavailability' },
              { id: 'B', text: 'Credit is actually better — it\'s free money until you pay it back' },
              { id: 'C', text: 'There\'s no difference — both cover emergencies equally' },
              { id: 'D', text: 'Cash is worse because it earns nothing sitting in a savings account' },
            ],
            correct: 'A',
            explanation: `Credit "emergency fund" problems: 1) Interest compounds fast (20% APR on $3,000 = $600/year). 2) Credit can be frozen or reduced when you need it most (during job loss, banks often cut limits). 3) It turns a crisis into debt that lingers. Cash emergency fund = no cost, always accessible, zero interest.`,
          },
          {
            id: 'ef_g0_l2q1', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `You're a game streamer. Monthly essential expenses:\n• Rent: $750\n• Utilities + internet: $110\n• Food: $280\n• Health insurance: $160\n• Total: $1,300/month\n\nFinancial advisors recommend 3–6 months of ESSENTIAL expenses (not total spending) in an emergency fund.`,
            question: `What is the minimum emergency fund target (3 months) and the recommended full target (6 months) for your situation?`,
            formula: 'Min = Monthly essentials × 3 | Full = Monthly essentials × 6',
            hints: ['Monthly essentials = $1,300', '3 months = $1,300 × 3', '6 months = $1,300 × 6'],
            correctAnswer: 3900,
            acceptableRange: [3700, 4100],
            feedback: {
              correct: `Correct! Min = $1,300 × 3 = $3,900. Full = $1,300 × 6 = $7,800. These are YOUR specific targets based on YOUR expenses — not a generic number.`,
              wrong: `Min target: $1,300 × 3 = $3,900. Full target: $1,300 × 6 = $7,800. The question asked for the minimum (3-month) target = $3,900.`,
            },
          },
          {
            id: 'ef_g0_l2q2', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `You currently have $400 saved. You want to reach the $3,900 minimum emergency fund. You can save $175/month dedicated to the emergency fund only.`,
            question: `How many months until you hit the $3,900 minimum target? (Round up to nearest month)`,
            formula: 'Months = (Target − Current savings) ÷ Monthly savings',
            hints: ['Gap = $3,900 − $400 = $3,500', '$3,500 ÷ $175 = ?', 'Round up'],
            correctAnswer: 20,
            acceptableRange: [19, 21],
            feedback: {
              correct: `Right — $3,500 ÷ $175 = 20 months exactly. That's 20 months to reach minimum safety. Could you find $50/month more to cut that to 16 months?`,
              wrong: `Gap: $3,900 − $400 = $3,500 remaining. $3,500 ÷ $175/month = 20 months.`,
            },
          },
          {
            id: 'ef_g0_l3q1', level: 3, levelName: 'BOSS FIGHT', type: 'open_ended',
            scenario: `EMERGENCY FUND OR INVEST? THE CLASSIC DILEMMA\n\nYou earn $2,400/month as a game developer. You have $600 saved. Monthly essentials = $1,400. Emergency fund target = $4,200 (3 months).\n\nYour 401(k) offers a 100% employer match up to 3% of salary. That's $72/month in FREE money from your employer.\n\nYour high-interest credit card charges 22% APR on a $2,000 balance.\n\nYou have $400/month to allocate after all expenses.\n\nTHE TENSION:\n• Every month without emergency fund = risk of debt spiral if anything goes wrong\n• Every month you skip the 401(k) match = walking away from $72 free money\n• Every month you don't pay down credit card = $36/month in interest burned`,
            question: `How do you allocate your $400/month surplus across: emergency fund, 401(k) match, and credit card payoff? Justify the priority order and the specific dollar amounts.`,
            evaluationCriteria: [
              'Captures the full 401(k) employer match first (100% instant return)',
              'Addresses high-interest credit card (22% APR destroys wealth faster than almost any investment can build it)',
              'Builds emergency fund simultaneously or after debt clearance',
              'Shows the math of priority ordering',
              'Accounts for the $72 free employer match in the budget math',
            ],
            minWords: 80,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // SAVING MONEY
  // ═══════════════════════════════════════════════════════════

  saving_money: {
    gaming: [
      {
        variant: 0,
        questions: [
          {
            id: 'sm_g0_l1q1', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `Two players start the same game at the same time with identical stats:\n\nPLAYER ONE: Saves 100 gold/month automatically — before spending on anything else. Treats it like a quest obligation.\n\nPLAYER TWO: Saves "whatever's left" at month end. Usually $0–40.`,
            question: `After one year, who has saved more — and what saving principle does this illustrate?`,
            choices: [
              { id: 'A', text: 'Player One — "pay yourself first" beats saving leftovers every time' },
              { id: 'B', text: 'Player Two — flexible saving adapts to varying monthly costs' },
              { id: 'C', text: 'Equal — both save about the same if income is the same' },
              { id: 'D', text: 'Player Two — strict saving goals create financial stress' },
            ],
            correct: 'A',
            explanation: `Player One: 100 × 12 = 1,200 gold. Player Two: maybe 0–40/month × 12 = 0–480 gold. "Pay yourself first" (automatic saving before spending) is the most reliable saving strategy known. Saving leftovers relies on willpower; automation removes willpower from the equation.`,
          },
          {
            id: 'sm_g0_l1q2', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `FINN explains the 24-hour rule: "Before any non-essential purchase over $50, wait 24 hours. If you still want it after sleeping on it — and it fits your budget — buy it guilt-free. If the impulse fades, the gold stays yours."`,
            question: `What financial behavior does the 24-hour rule primarily protect against?`,
            choices: [
              { id: 'A', text: 'Impulse spending — emotional purchases made in the moment without reflection' },
              { id: 'B', text: 'Overspending on necessities' },
              { id: 'C', text: 'Investing too conservatively' },
              { id: 'D', text: 'Choosing between two equally good options' },
            ],
            correct: 'A',
            explanation: `Impulse spending is the primary enemy of savings. Studies show 40–80% of purchases are unplanned. The 24-hour rule creates a "psychological cooldown" — like a respawn timer between you and your wallet. Most impulse wants fade overnight; true needs remain.`,
          },
          {
            id: 'sm_g0_l2q1', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `You want to save for a $600 gaming rig upgrade. You earn $950/month from part-time work. After essentials ($720), you have $230 discretionary. You decide to save 40% of your discretionary budget each month toward the upgrade.`,
            question: `How many months until you reach $600?\n\nMonthly rig savings = 40% × $230`,
            formula: 'Months = Target ÷ (Discretionary × Savings rate)',
            hints: ['Monthly savings = $230 × 0.40 = $92', '$600 ÷ $92 = ?', 'Round up to next whole month'],
            correctAnswer: 7,
            acceptableRange: [6, 8],
            feedback: {
              correct: `Exactly! $92/month → $600 ÷ $92 = 6.5 → 7 months. No debt, no interest. Just patience and a plan.`,
              wrong: `Monthly savings: $230 × 40% = $92. Months: $600 ÷ $92 = 6.52 → round up to 7 months.`,
            },
          },
          {
            id: 'sm_g0_l2q2', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `You discover three "gold leaks" in your monthly budget:\n• Unused game subscriptions: $35/month\n• Premium energy drinks at gaming sessions: $60/month\n• Impulse skin purchases: ~$45/month average`,
            question: `If you cut ALL three leaks for one year, how much extra gold will you save?\n\nFormula: Annual savings = Monthly total × 12`,
            formula: 'Annual savings = Monthly leak × 12',
            hints: ['Total monthly leaks = 35 + 60 + 45', 'Multiply by 12 for annual total'],
            correctAnswer: 1680,
            acceptableRange: [1620, 1740],
            feedback: {
              correct: `$140/month × 12 = $1,680 per year. That's a serious PC upgrade or a starting emergency fund — all from plugging leaks, not earning more.`,
              wrong: `Leaks: $35 + $60 + $45 = $140/month. Annual: $140 × 12 = $1,680.`,
            },
          },
          {
            id: 'sm_g0_l3q1', level: 3, levelName: 'BOSS FIGHT', type: 'open_ended',
            scenario: `THE SAVINGS SPEEDRUN CHALLENGE\n\nYou're a streamer earning $1,600/month (variable — ranges $1,100–$2,200). Your essentials are $1,050/month. You have $150 saved. Your three financial goals:\n\n1. Emergency fund: $3,150 (3 months essentials) — priority\n2. New streaming setup: $800 — 6 months from now\n3. Game development course: $450 — anytime in next 12 months\n\nADDITIONAL INFO:\n• Your income varies significantly — some months are $1,100 (bad streaming month)\n• You've been tracking spending and found $120/month in optional subscriptions you could cut\n• Your parents offer to lend $500 interest-free if needed`,
            question: `Design a 6-month savings plan that accounts for variable income, prioritizes the emergency fund, and still hits the streaming setup goal by month 6. Should you take the $500 parental loan? Explain your reasoning.`,
            evaluationCriteria: [
              'Accounts for income variability (plans for low months, not just average)',
              'Uses the $120 subscription cut as a key lever',
              'Addresses parental loan trade-offs (no interest but psychological cost)',
              'Shows month-by-month math or estimates for reaching goals',
              'Correctly prioritizes emergency fund before streaming setup',
            ],
            minWords: 80,
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // INVESTING BASICS
  // ═══════════════════════════════════════════════════════════

  investing_basics: {
    gaming: [
      {
        variant: 0,
        questions: [
          {
            id: 'ib_g0_l1q1', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `Your guildmates debate investment strategies:\n\nGUARD HOLT: "I keep all my gold in the vault — 0.5% interest per year. Safe, never lose anything."\n\nARCHER VENN: "I split my gold across 8 different asset types: some in stable vaults, some in medium-growth markets, some in high-risk dungeon raids."\n\nROGUE KIRA: "I put everything in a single high-risk Legendary Item bet — could 10× or go to zero."`,
            question: `Which approach best reflects smart investing principles for a new investor?`,
            choices: [
              { id: 'A', text: 'Venn — diversified across multiple risk levels reduces catastrophic loss risk' },
              { id: 'B', text: 'Holt — never risk losing is always the safest strategy' },
              { id: 'C', text: 'Kira — highest risk = highest possible return' },
              { id: 'D', text: 'Holt and Kira — extreme positions are both valid choices' },
            ],
            correct: 'A',
            explanation: `Holt's 0.5% doesn't beat inflation (typically 3%). Kira's all-in bet has positive expected value but catastrophic downside for a beginner. Venn's diversification is the professional standard: spread risk, don't put all gold in one dungeon. Different assets perform differently in different market conditions — spreading across them smooths returns.`,
          },
          {
            id: 'ib_g0_l1q2', level: 1, levelName: 'UNDERSTANDING', type: 'multiple_choice',
            scenario: `FINN defines two core investing types for new investors:\n\nINDEX FUNDS: Buy a small slice of hundreds of companies automatically. Low fees (0.03–0.2%). Matches "the market." History: ~10% annual average return long-term.\n\nACTIVELY MANAGED FUNDS: Professional managers pick specific stocks trying to beat the market. Higher fees (0.5–2%). Most fail to beat index funds over 10+ years.`,
            question: `For a beginning investor with a 20-year horizon, which is typically the better starting choice?`,
            choices: [
              { id: 'A', text: 'Index funds — lower fees, proven long-term performance, no stock-picking skill required' },
              { id: 'B', text: 'Actively managed funds — professionals will always outperform a passive approach' },
              { id: 'C', text: 'Both are equal — choose whichever sounds more exciting' },
              { id: 'D', text: 'Neither — individual stock picking is always better' },
            ],
            correct: 'A',
            explanation: `Data: over 15-year periods, 92% of actively managed funds underperform their benchmark index. Higher fees compound negatively over time. A 2% fee vs 0.05% fee on $10,000 over 30 years at 8% growth = ~$24,000 difference in final balance. Index funds win by being boring.`,
          },
          {
            id: 'ib_g0_l2q1', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `You invest $200/month into an index fund starting at age 22. The fund averages 9% annual returns. You stop adding money at age 32 (10 years of contributions). Then you just let it sit until age 62 (30 more years). Total invested: $200 × 12 × 10 = $24,000.`,
            question: `What is the approximate total balance at 62 using the rough multiplier: $24,000 grows at 9% for 30 years after age 32?\n\nFormula: A = P × (1 + r)^t where P = value at age 32`,
            formula: 'A = P × (1 + r)^t',
            hints: [
              'First: value at age 32 ≈ $38,000 (10 years of $200/month at 9% — given)',
              'Then: 38,000 × (1.09)^30',
              '(1.09)^30 ≈ 13.27',
              '38,000 × 13.27 ≈ ?',
            ],
            correctAnswer: 504260,
            acceptableRange: [460000, 550000],
            feedback: {
              correct: `Outstanding! $38,000 × (1.09)^30 ≈ $504,000. You invested $24,000 total and ended with half a million. That's the power of starting early and letting compound interest run for 30 undisturbed years.`,
              wrong: `At age 32, assume ~$38,000 in the account. Then: $38,000 × (1.09)^30 = $38,000 × 13.27 = ~$504,000. 24K invested → 500K at retirement = 21× multiplier.`,
            },
          },
          {
            id: 'ib_g0_l2q2', level: 2, levelName: 'APPLICATION', type: 'calculation',
            scenario: `You compare two investment options for $5,000:\n\nFUND A (Index): 0.05% annual fee, expected 9% gross return → net ≈ 8.95%\nFUND B (Managed): 1.5% annual fee, expected 9% gross return → net ≈ 7.5%\n\nCalculate the balance of each after 20 years.`,
            question: `What is the difference in final balance between Fund A (8.95%) and Fund B (7.5%) after 20 years with a $5,000 investment?\n\nFormula: A = P × (1 + r)^t for each`,
            formula: 'A = P × (1 + r)^t',
            hints: [
              'Fund A: 5,000 × (1.0895)^20 ≈ 5,000 × 5.58 ≈ $27,900',
              'Fund B: 5,000 × (1.075)^20 ≈ 5,000 × 4.25 ≈ $21,250',
              'Difference = Fund A − Fund B',
            ],
            correctAnswer: 6650,
            acceptableRange: [5500, 8000],
            feedback: {
              correct: `Exactly — a seemingly small 1.45% fee difference costs roughly $6,650 over 20 years on just $5,000. Fees are the silent killer of long-term returns.`,
              wrong: `Fund A: $5,000 × (1.0895)^20 ≈ $27,900. Fund B: $5,000 × (1.075)^20 ≈ $21,250. Difference: ~$6,650. Fees compound negatively, just as returns compound positively.`,
            },
          },
          {
            id: 'ib_g0_l3q1', level: 3, levelName: 'BOSS FIGHT', type: 'open_ended',
            scenario: `THE FIRST INVESTMENT DECISION\n\nYou're 24 with $3,000 to invest for the first time. Three advisors pitch you:\n\nADVISOR LARA (Index Fund): "Put it in a broad market index fund. 0.04% fee, diversified across 500 companies. Boring but proven. Historically ~10% annually."\n\nADVISOR MARCO (Crypto): "Crypto is the future. Split across 3 established coins. Has averaged 40% returns in bull markets but dropped 70% in 2022."\n\nADVISOR PAT (Individual Stocks): "I'll hand-pick 5 'sure thing' tech stocks. I've done tons of research. Management fee 2%/year."\n\nYOUR SITUATION:\n• This is your ONLY investment for now\n• You won't need this money for 15 years\n• You have $1,500 emergency fund (1 month expenses)\n• You're new to investing — no experience reading financials`,
            question: `Who do you trust your $3,000 with, and why? Address each advisor's pitch using investing fundamentals — diversification, fees, risk tolerance, and your specific situation as a first-time investor.`,
            evaluationCriteria: [
              'Addresses the emergency fund gap as a risk before investing',
              'Evaluates diversification: index fund (500 stocks) vs 3 coins vs 5 stocks',
              'Compares fees: 0.04% vs 2% management over 15 years',
              'Assesses crypto volatility (-70% drawdown) for a first investment',
              'Makes a clear recommendation appropriate for a first-time investor',
            ],
            minWords: 80,
          },
        ],
      },
    ],
  },

};

// ── Helpers ───────────────────────────────────────────────────────────────────

function normalizeTopic(topic) {
  return (topic || '').toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z_]/g, '');
}

function normalizeDomain(domain) {
  const d = (domain || '').toLowerCase().trim();
  const map = {
    'video games': 'gaming', 'esports': 'gaming', 'games': 'gaming',
    'clothes': 'fashion', 'style': 'fashion',
    'cooking': 'food', 'chef': 'food', 'culinary': 'food',
    'film': 'movies', 'cinema': 'movies',
    'exercise': 'sports', 'fitness': 'sports', 'gym': 'sports',
    'song': 'music', 'songs': 'music', 'instruments': 'music',
  };
  return map[d] || d;
}

/**
 * Look up a pre-built scenario set. Returns null if not found.
 * @param {string} topic   e.g. "Compound Interest"
 * @param {string} domain  e.g. "gaming"
 * @param {number} variant 0, 1, or 2
 */
function getTemplate(topic, domain, variant = 0) {
  const topicKey  = normalizeTopic(topic);
  const domainKey = normalizeDomain(domain);
  const sets = T[topicKey]?.[domainKey];
  if (!sets || sets.length === 0) return null;
  return sets[variant % sets.length] || sets[0];
}

module.exports = { getTemplate, normalizeTopic, normalizeDomain };
