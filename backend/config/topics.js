// FINLIT — Topic Metadata
// 30 core financial topics with prerequisites, formulas, and worked examples.
// Used by explanationGenerator to inject real math and context into prompts.

const TOPICS = [

  // ── TIER 1: Foundations ────────────────────────────────────────────────────

  {
    id: 'budgeting',
    name: 'Budgeting Basics',
    difficulty: 'beginner',
    category: 'savings',
    prerequisites: [],
    estimatedMinutes: 8,
    keyFormula: '50/30/20 Rule — 50% needs, 30% wants, 20% savings',
    realWorldExample: 'Monthly salary split: $3,000 → $1,500 needs, $900 wants, $600 savings',
    commonMistakes: [
      'Tracking spending after the month instead of planning before',
      'Making the budget so tight it breaks on the first unexpected cost',
    ],
    mathExample: {
      scenario: '$3,000 monthly take-home — apply the 50/30/20 rule',
      values: { income: 3000, needs: 1500, wants: 900, savings: 600 },
    },
  },

  {
    id: 'saving_money',
    name: 'Saving Money',
    difficulty: 'beginner',
    category: 'savings',
    prerequisites: ['Budgeting Basics'],
    estimatedMinutes: 7,
    keyFormula: 'Pay Yourself First: save before discretionary spending',
    realWorldExample: 'Auto-transfer $200 on payday to a separate savings account',
    commonMistakes: [
      'Saving only what is left over at month end (usually nothing)',
      'Keeping savings in the same account as spending money',
    ],
    mathExample: {
      scenario: '$200/month saved vs $200/month spent on subscriptions over 5 years',
      values: { monthlySavings: 200, year1: 2400, year3: 7200, year5: 12000, spent5yr: 12000 },
    },
  },

  {
    id: 'compound_interest',
    name: 'Compound Interest',
    difficulty: 'intermediate',
    category: 'investing',
    prerequisites: ['Saving Money'],
    estimatedMinutes: 12,
    keyFormula: 'A = P(1 + r)^t  |  A = final amount, P = principal, r = rate, t = years',
    realWorldExample: '$1,000 at 10% per year — nearly 45× in 40 years',
    commonMistakes: [
      'Assuming interest growth is linear — it accelerates exponentially',
      'Waiting until you have a "large enough" amount to start',
    ],
    mathExample: {
      scenario: '$1,000 invested at 10% annually — year by year vs lump sum',
      values: {
        yr1: 1100, yr2: 1210, yr3: 1331,
        yr10: 2594, yr20: 6727, yr30: 17449, yr40: 45259,
        startAt22vs30: { at22_by65: 1200000, at30_by65: 670000, difference: 530000 },
      },
    },
  },

  {
    id: 'emergency_fund',
    name: 'Emergency Fund',
    difficulty: 'beginner',
    category: 'savings',
    prerequisites: ['Budgeting Basics', 'Saving Money'],
    estimatedMinutes: 6,
    keyFormula: 'Target = Monthly Essential Expenses × 3 to 6',
    realWorldExample: 'Job loss buffer: $2,000/month expenses → $6,000–$12,000 goal',
    commonMistakes: [
      'Parking emergency fund in an illiquid account (CDs, retirement)',
      'Raiding it for non-emergencies and not replenishing',
    ],
    mathExample: {
      scenario: 'Building a $6,000 emergency fund saving $600/month',
      values: { monthlyExpenses: 2000, target: 6000, monthlySave: 600, monthsNeeded: 10 },
    },
  },

  {
    id: 'credit_scores',
    name: 'Credit Scores',
    difficulty: 'beginner',
    category: 'debt',
    prerequisites: [],
    estimatedMinutes: 9,
    keyFormula: 'Score = Payment History(35%) + Utilization(30%) + Length(15%) + Mix(10%) + Inquiries(10%)',
    realWorldExample: '760 vs 620 score on a $300K mortgage — $126K difference in total interest',
    commonMistakes: [
      'Closing old credit cards — it shrinks your available credit and hurts length of history',
      'Carrying a balance to "build credit" — utilization over 30% actively hurts your score',
    ],
    mathExample: {
      scenario: '$300,000 mortgage: 760 score (3.5%) vs 620 score (5.5%) over 30 years',
      values: { goodRate: 3.5, badRate: 5.5, goodMonthly: 1347, badMonthly: 1703, difference30yr: 126720 },
    },
  },

  {
    id: 'investing_basics',
    name: 'Investing Basics',
    difficulty: 'beginner',
    category: 'investing',
    prerequisites: ['Saving Money', 'Emergency Fund'],
    estimatedMinutes: 10,
    keyFormula: 'Real Return = Nominal Return − Inflation Rate',
    realWorldExample: '$100/month at 7% over 30 years = $121,997',
    commonMistakes: [
      'Waiting to have a "large enough" amount before investing — time matters more than size',
      'Trying to time the market — time IN the market beats timing the market',
    ],
    mathExample: {
      scenario: '$100/month invested at 7% average annual return',
      values: { monthly: 100, yr10: 17308, yr20: 52093, yr30: 121997, totalContributed30yr: 36000, gains: 85997 },
    },
  },

  {
    id: 'risk_management',
    name: 'Risk Management',
    difficulty: 'intermediate',
    category: 'investing',
    prerequisites: ['Investing Basics'],
    estimatedMinutes: 11,
    keyFormula: 'Sharpe Ratio = (Return − Risk-Free Rate) ÷ Standard Deviation',
    realWorldExample: '100% stocks vs 60/40 portfolio — same 20-year return, very different worst-year experience',
    commonMistakes: [
      'Confusing short-term volatility with permanent loss of capital',
      'Being so conservative at 25 that you miss 40 years of compound growth',
    ],
    mathExample: {
      scenario: '$10,000 invested — 100% stocks vs 60/40 portfolio over 20 years',
      values: { allStocksReturn: 9.8, balancedReturn: 7.2, allStocksWorstYear: -50, balancedWorstYear: -25, allStocksFinal: 65913, balancedFinal: 39066 },
    },
  },

  {
    id: 'retirement_planning',
    name: 'Retirement Planning',
    difficulty: 'intermediate',
    category: 'investing',
    prerequisites: ['Compound Interest', 'Investing Basics'],
    estimatedMinutes: 14,
    keyFormula: 'Retirement Number = Annual Expenses × 25  (the 4% safe withdrawal rule)',
    realWorldExample: '$500/month from age 22 vs $1,000/month from age 32 — both at 7% to age 65',
    commonMistakes: [
      'Not contributing enough to get the full employer 401k match — that is a 50–100% instant return',
      'Cashing out a 401k when switching jobs — taxes plus 10% penalty can cost 30–40% of the balance',
    ],
    mathExample: {
      scenario: 'Starting at 22 vs 32 — the 10-year head start at 7%',
      values: { earlyStart: { monthly: 500, age: 22, by65: 1746503 }, lateStart: { monthly: 1000, age: 32, by65: 1168686 }, difference: 577817 },
    },
  },

  {
    id: 'debt_management',
    name: 'Debt Management',
    difficulty: 'intermediate',
    category: 'debt',
    prerequisites: ['Budgeting Basics', 'Credit Scores'],
    estimatedMinutes: 10,
    keyFormula: 'Avalanche: highest interest first | Snowball: lowest balance first',
    realWorldExample: '$5,000 credit card at 20% APR — minimum payments alone take 7.8 years and cost $4,311 in interest',
    commonMistakes: [
      'Making only minimum payments — you pay mostly interest for years before the balance drops',
      'Taking on new debt while paying off old debt — plugging one hole while opening another',
    ],
    mathExample: {
      scenario: '$5,000 at 20% APR — minimum $100/month vs accelerated $300/month',
      values: {
        minPayment: { monthly: 100, yearsToPayoff: 7.8, totalInterest: 4311 },
        accelerated: { monthly: 300, yearsToPayoff: 1.7, totalInterest: 912, saved: 3399 },
      },
    },
  },

  {
    id: 'tax_basics',
    name: 'Tax Basics',
    difficulty: 'beginner',
    category: 'income',
    prerequisites: [],
    estimatedMinutes: 8,
    keyFormula: 'Effective Tax Rate = Total Tax Paid ÷ Gross Income × 100',
    realWorldExample: '$60,000 income: effective rate is 11.2%, not the 22% marginal bracket',
    commonMistakes: [
      'Confusing marginal rate with effective rate — you do not pay 22% on all income, only on the top slice',
      'Missing free credits: EITC, education credits, and retirement contribution deductions',
    ],
    mathExample: {
      scenario: '$60,000 income — actual federal tax breakdown (2024 brackets)',
      values: { income: 60000, bracket10pct: 1100, bracket12pct: 3654, bracket22pct: 1994, totalTax: 6748, effectiveRate: 11.2, marginalRate: 22 },
    },
  },

  // ── TIER 2: Building ───────────────────────────────────────────────────────

  {
    id: 'stock_market',
    name: 'Stock Market',
    difficulty: 'intermediate',
    category: 'investing',
    prerequisites: ['Investing Basics', 'Risk Management'],
    estimatedMinutes: 12,
    keyFormula: 'P/E Ratio = Stock Price ÷ Earnings Per Share',
    realWorldExample: 'S&P 500: $10,000 invested in January 2000 grew to $72,000 by 2024 despite two 50% crashes',
    commonMistakes: [
      'Selling when the market drops 30% — locking in temporary paper losses as permanent real losses',
      'Checking your portfolio daily and making emotional decisions based on short-term noise',
    ],
    mathExample: {
      scenario: 'S&P 500 long-term vs panic-selling in every crash',
      values: { invested2000: 10000, value2024: 72000, cagr: 7.4, missedBest10days: 26000, missedBest20days: 12000 },
    },
  },

  {
    id: 'index_funds',
    name: 'Index Funds',
    difficulty: 'beginner',
    category: 'investing',
    prerequisites: ['Investing Basics'],
    estimatedMinutes: 9,
    keyFormula: 'Net Fund Return = Market Return − Expense Ratio',
    realWorldExample: 'Vanguard S&P 500 (0.03% fee) vs typical active fund (1%) — $142K difference on $100K over 30 years',
    commonMistakes: [
      'Paying 1%+ expense ratios on active funds that underperform the index 80–90% of the time',
      'Not understanding that fees compound against you the same way returns compound for you',
    ],
    mathExample: {
      scenario: '$100,000 invested over 30 years: 0.03% fee vs 1% fee (7% gross return)',
      values: { lowFee: { expenseRatio: 0.03, finalValue: 574349 }, highFee: { expenseRatio: 1.0, finalValue: 432194 }, feesCost: 142155 },
    },
  },

  {
    id: 'diversification',
    name: 'Diversification',
    difficulty: 'intermediate',
    category: 'investing',
    prerequisites: ['Investing Basics', 'Risk Management'],
    estimatedMinutes: 10,
    keyFormula: 'Portfolio Risk < Sum of Asset Risks when correlation between assets < 1',
    realWorldExample: 'Enron employee with 100% company stock: net worth went to zero in 2001',
    commonMistakes: [
      'Thinking 10 tech stocks is diversification — they all move together in a tech downturn',
      'Not diversifying across asset classes (stocks, bonds, real estate, international)',
    ],
    mathExample: {
      scenario: 'Single stock vs diversified portfolio during a 50% sector crash',
      values: { singleStock: { invested: 10000, afterCrash: 0 }, diversified: { invested: 10000, afterCrash: 6500, reason: '35% of portfolio in crashed sector' } },
    },
  },

  {
    id: 'inflation',
    name: 'Inflation',
    difficulty: 'beginner',
    category: 'investing',
    prerequisites: ['Saving Money'],
    estimatedMinutes: 7,
    keyFormula: 'Real Return = Nominal Return − Inflation Rate',
    realWorldExample: '$100 in 1990 buys what costs $224 today — 2.4× inflation over 34 years',
    commonMistakes: [
      'Keeping all savings in a 0.5% savings account while inflation runs at 3% — losing 2.5% purchasing power per year',
      'Feeling "safe" in cash when cash is slowly losing value every day',
    ],
    mathExample: {
      scenario: '$10,000: savings account (0.5%) vs inflation (3%) over 10 years',
      values: { nominalValue: 10511, realPurchasingPower: 7664, purchasingPowerLost: 2336, inflationRate: 3, savingsRate: 0.5 },
    },
  },

  {
    id: 'net_worth',
    name: 'Net Worth',
    difficulty: 'beginner',
    category: 'savings',
    prerequisites: ['Budgeting Basics'],
    estimatedMinutes: 6,
    keyFormula: 'Net Worth = Total Assets − Total Liabilities',
    realWorldExample: 'High-income earner with $10K in savings and $80K in debt vs moderate-income saver with $60K net worth',
    commonMistakes: [
      'Omitting retirement accounts from asset calculations — they count',
      'Valuing your car at purchase price — it has already depreciated significantly',
    ],
    mathExample: {
      scenario: 'Two people at 30: high income poor saver vs moderate income disciplined saver',
      values: {
        personA: { income: 120000, assets: 15000, debt: 85000, netWorth: -70000 },
        personB: { income: 55000, assets: 90000, debt: 25000, netWorth: 65000 },
      },
    },
  },

  {
    id: 'assets_vs_liabilities',
    name: 'Assets vs Liabilities',
    difficulty: 'beginner',
    category: 'savings',
    prerequisites: ['Net Worth'],
    estimatedMinutes: 7,
    keyFormula: 'Asset puts money INTO your pocket | Liability takes money OUT of your pocket',
    realWorldExample: 'A $30,000 car costs $10,400 in year one: depreciation + insurance + gas + maintenance',
    commonMistakes: [
      'Calling your home an "asset" when it costs you money every month (mortgage + taxes + repairs)',
      'Equating expensive with valuable — a Rolex is not an investment, it is a liability with prestige',
    ],
    mathExample: {
      scenario: '$30,000 car — true year-one cost breakdown',
      values: { purchasePrice: 30000, depreciation: 6000, insurance: 2400, fuel: 2000, maintenance: 800, totalYearOneCost: 11200 },
    },
  },

  {
    id: 'income_streams',
    name: 'Income Streams',
    difficulty: 'intermediate',
    category: 'income',
    prerequisites: ['Investing Basics', 'Budgeting Basics'],
    estimatedMinutes: 11,
    keyFormula: 'Passive Income = Capital Deployed × Yield Rate',
    realWorldExample: 'Building $1,000/month passive income: need $240K at 5% yield or $400K at 3% yield',
    commonMistakes: [
      'Confusing passive income with zero-effort income — the upfront work is substantial',
      'Single income source (one job) is a single point of failure — one event eliminates 100% of income',
    ],
    mathExample: {
      scenario: 'Building $1,000/month in dividend income at different yields',
      values: { monthlyTarget: 1000, annualTarget: 12000, atYield3pct: 400000, atYield5pct: 240000, atYield8pct: 150000 },
    },
  },

  {
    id: 'expense_tracking',
    name: 'Expense Tracking',
    difficulty: 'beginner',
    category: 'savings',
    prerequisites: ['Budgeting Basics'],
    estimatedMinutes: 6,
    keyFormula: 'Savings Rate = (Income − Expenses) ÷ Income × 100',
    realWorldExample: '30-day spending audit revealing $300/month in forgotten subscriptions — $108K over 30 years invested',
    commonMistakes: [
      'Tracking only big purchases and ignoring the $5-$15 daily spending that adds up to hundreds per month',
      'Quitting after one month before seeing the patterns that only emerge over 3+ months',
    ],
    mathExample: {
      scenario: '$300/month found through tracking — what happens if invested instead',
      values: { monthlyFound: 300, annualFound: 3600, invested30yrAt7pct: 339000 },
    },
  },

  {
    id: 'interest_rates',
    name: 'Interest Rates',
    difficulty: 'beginner',
    category: 'debt',
    prerequisites: [],
    estimatedMinutes: 8,
    keyFormula: 'APR = (Interest / Principal) × (365 / Loan Days) × 100',
    realWorldExample: '$10,000 debt: at 5% costs $12,763 total; at 25% costs $33,253 total over 5 years',
    commonMistakes: [
      'Comparing monthly payments instead of total cost — a longer term means more total interest paid',
      'Not shopping around — the same borrower can get rates that vary by 3-5% from different lenders',
    ],
    mathExample: {
      scenario: '$10,000 debt: what different interest rates cost over 5 years',
      values: { at5pct: 12763, at15pct: 14179, at25pct: 17717, at5Monthly: 189, at25Monthly: 296 },
    },
  },

  {
    id: 'loan_types',
    name: 'Loan Types',
    difficulty: 'beginner',
    category: 'debt',
    prerequisites: ['Interest Rates', 'Credit Scores'],
    estimatedMinutes: 9,
    keyFormula: 'Monthly Payment = P[r(1+r)^n] ÷ [(1+r)^n − 1]',
    realWorldExample: '$30,000 auto loan: 3-year term saves $2,548 in interest vs 7-year term',
    commonMistakes: [
      'Extending loan term to lower monthly payment — total interest paid increases dramatically',
      'Variable-rate loans feel cheap at signing but can cost far more if rates rise',
    ],
    mathExample: {
      scenario: '$30,000 auto loan at 7% — comparing loan terms',
      values: {
        threeYear:  { monthly: 926,  totalPaid: 33336, interest: 3336 },
        fiveYear:   { monthly: 594,  totalPaid: 35640, interest: 5640 },
        sevenYear:  { monthly: 451,  totalPaid: 37884, interest: 7884 },
      },
    },
  },

  // ── TIER 3: Advanced ───────────────────────────────────────────────────────

  {
    id: 'options_trading',
    name: 'Options Trading',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['Stock Market', 'Risk Management', 'Diversification'],
    estimatedMinutes: 16,
    keyFormula: 'Options Value = Intrinsic Value + Time Value (Theta decays daily)',
    realWorldExample: 'Covered call: sell the right to buy your 100 shares at $55 for $200 premium — 4.8% annualized return',
    commonMistakes: [
      'Buying far out-of-the-money calls as lottery tickets — theta decay destroys value daily',
      'Selling naked puts without fully understanding your maximum possible loss',
    ],
    mathExample: {
      scenario: 'Covered call on 100 shares at $50 — monthly premium income',
      values: { shares: 100, sharePrice: 50, callPremium: 200, annualizedReturn: 4.8, maxProfit: 700, breakeven: 48 },
    },
  },

  {
    id: 'real_estate',
    name: 'Real Estate',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['Investing Basics', 'Loan Types', 'Net Worth'],
    estimatedMinutes: 15,
    keyFormula: 'Cap Rate = Net Operating Income ÷ Property Value × 100',
    realWorldExample: '$300K rental property: $600/month cash flow after all expenses on a 5.4% cap rate',
    commonMistakes: [
      'Ignoring vacancy rate (budget for 8-10% vacancy), repairs, and property management in cash flow projections',
      'Overleveraging — borrowing maximum possible makes you vulnerable to any rent disruption',
    ],
    mathExample: {
      scenario: '$300,000 rental property — realistic annual cash flow',
      values: { grossRent: 24000, mortgage: 15600, propertyTax: 3600, insurance: 1200, maintenance: 3000, netCashFlow: 600, capRate: 5.4 },
    },
  },

  {
    id: 'crypto_basics',
    name: 'Crypto Basics',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['Risk Management', 'Diversification'],
    estimatedMinutes: 12,
    keyFormula: 'Portfolio Risk Rule: max 5–10% in any single high-volatility asset',
    realWorldExample: '5% vs 20% allocation through a 70% Bitcoin crash: difference of $5,250 in portfolio impact',
    commonMistakes: [
      'Investing money you cannot afford to lose — crypto can drop 80–90% and stay down for years',
      'FOMO buying at cycle peaks — most retail investors buy near the top and sell near the bottom',
    ],
    mathExample: {
      scenario: '$50,000 portfolio — impact of a 70% crypto crash at different allocations',
      values: {
        fivePct:    { cryptoAlloc: 2500,  lossOnCrash: 1750,  portfolioRemaining: 48250 },
        twentyPct:  { cryptoAlloc: 10000, lossOnCrash: 7000,  portfolioRemaining: 43000 },
        fiftyPct:   { cryptoAlloc: 25000, lossOnCrash: 17500, portfolioRemaining: 32500 },
      },
    },
  },

  {
    id: '401k_vs_ira',
    name: '401k vs IRA',
    difficulty: 'intermediate',
    category: 'investing',
    prerequisites: ['Retirement Planning', 'Tax Basics'],
    estimatedMinutes: 11,
    keyFormula: 'Traditional: tax break now, taxed on withdrawal | Roth: taxed now, tax-free forever',
    realWorldExample: '$6,500 into a Roth IRA at 25: grows to $98,358 by 65 — zero tax on withdrawal',
    commonMistakes: [
      'Not contributing even $1 to a 401k when employer matches — that match is an immediate 50–100% return',
      'Defaulting to Traditional when young (lower tax bracket now, higher bracket later = worse deal)',
    ],
    mathExample: {
      scenario: '$6,500 at age 25, 7% growth to age 65 — Roth vs Traditional IRA',
      values: {
        roth:        { contributed: 6500, taxNow: 1430,    value65: 98358, taxOnWithdrawal: 0,     netToYou: 98358 },
        traditional: { contributed: 6500, taxNow: 0,       value65: 98358, taxOnWithdrawal: 21638, netToYou: 76720 },
        rothAdvantage: 21638,
      },
    },
  },

  {
    id: 'tax_optimization',
    name: 'Tax Optimization',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['Tax Basics', '401k vs IRA', 'Investing Basics'],
    estimatedMinutes: 14,
    keyFormula: 'After-Tax Return = Pre-Tax Return × (1 − Tax Rate)',
    realWorldExample: 'Tax-loss harvesting: sell a losing position to offset capital gains — same portfolio, lower tax bill',
    commonMistakes: [
      'Not maxing tax-advantaged accounts (401k, IRA, HSA) before touching taxable brokerage',
      'Triggering short-term capital gains (taxed as income) on assets held less than 12 months',
    ],
    mathExample: {
      scenario: '$10,000 investment over 30 years — taxable vs tax-advantaged account (7% return, 22% tax)',
      values: { taxableAccount: 43219, taxAdvantaged: 76123, difference: 32904 },
    },
  },

  {
    id: 'estate_planning',
    name: 'Estate Planning',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['Net Worth', 'Tax Basics'],
    estimatedMinutes: 13,
    keyFormula: 'Federal estate tax exemption: $13.61M per person (2024)',
    realWorldExample: 'Dying without a will on a $500K estate: 24 months in probate, $25K in legal fees',
    commonMistakes: [
      'Not having a will — intestate succession may distribute assets in ways you would not choose',
      'Forgetting to update beneficiary designations after marriage, divorce, or children',
    ],
    mathExample: {
      scenario: '$500,000 estate — with vs without a will',
      values: {
        noWill:   { monthsToSettle: 24, legalCosts: 25000, familyReceives: 475000 },
        withWill: { monthsToSettle: 6,  legalCosts: 5000,  familyReceives: 495000, saved: 20000 },
      },
    },
  },

  {
    id: 'insurance_types',
    name: 'Insurance Types',
    difficulty: 'intermediate',
    category: 'protection',
    prerequisites: ['Risk Management', 'Emergency Fund'],
    estimatedMinutes: 10,
    keyFormula: 'Insurance Value = (Probability of Event × Magnitude of Loss) − Annual Premium',
    realWorldExample: '$500K term life (20 years): $500/year vs whole life: $5,000/year — $90,000 cost difference',
    commonMistakes: [
      'Buying whole life insurance instead of term — almost always worse value unless in very specific estate situations',
      'Skipping disability insurance — you are 3× more likely to become disabled than to die before 65',
    ],
    mathExample: {
      scenario: '$500,000 life insurance coverage — term vs whole life over 20 years',
      values: { termAnnual: 500, wholeLifeAnnual: 5000, termTotal20yr: 10000, wholeLifeTotal20yr: 100000, difference: 90000 },
    },
  },

  {
    id: 'bond_investing',
    name: 'Bond Investing',
    difficulty: 'intermediate',
    category: 'investing',
    prerequisites: ['Investing Basics', 'Interest Rates', 'Risk Management'],
    estimatedMinutes: 11,
    keyFormula: 'Bond Price ↑ when Interest Rates ↓ | Bond Price ↓ when Interest Rates ↑',
    realWorldExample: '$10,000 Treasury bond at 1.5% in 2021 lost 17% of market value when rates hit 5% in 2023',
    commonMistakes: [
      'Thinking bonds are always "safe" — long-duration bonds lost 30–40% in the 2022 rate-hike cycle',
      'Not considering I-bonds during high-inflation periods when they can yield 7–9%',
    ],
    mathExample: {
      scenario: '$10,000 in 10-year Treasury — bought at 1.5% (2021) vs 5% (2023)',
      values: { lowRateBond: { yield: 150, marketValueIfSelling: 8300, paperLoss: 1700 }, highRateBond: { yield: 500, marketValue: 10000 } },
    },
  },

  {
    id: 'portfolio_rebalancing',
    name: 'Portfolio Rebalancing',
    difficulty: 'advanced',
    category: 'investing',
    prerequisites: ['Diversification', 'Index Funds', 'Tax Optimization'],
    estimatedMinutes: 12,
    keyFormula: 'Drift = Current Allocation % − Target Allocation %  |  Rebalance when drift exceeds 5%',
    realWorldExample: '$100K portfolio drifts from 60/40 to 75/25 after a bull run — rebalancing sells high and buys low',
    commonMistakes: [
      'Rebalancing too frequently (monthly) — unnecessary transaction costs and tax events',
      'Rebalancing in a taxable account and triggering capital gains when you could rebalance in a tax-advantaged account',
    ],
    mathExample: {
      scenario: '$100,000 portfolio after market run — before and after rebalancing',
      values: {
        original:   { stocks: 60000, bonds: 40000 },
        afterRun:   { stocks: 75000, bonds: 40000, total: 115000 },
        rebalanced: { stocks: 69000, bonds: 46000, total: 115000 },
      },
    },
  },

  {
    id: 'financial_independence',
    name: 'Financial Independence',
    difficulty: 'advanced',
    category: 'advanced',
    prerequisites: ['Retirement Planning', 'Income Streams', 'Tax Optimization', 'Index Funds'],
    estimatedMinutes: 15,
    keyFormula: 'FI Number = Annual Expenses × 25  |  Years to FI depends on Savings Rate',
    realWorldExample: 'FIRE timeline: 10% savings rate takes 43 years; 50% savings rate takes 17 years',
    commonMistakes: [
      'Underestimating healthcare costs before Medicare at 65 — could run $10,000–$25,000/year',
      'Not planning for sequence-of-returns risk — retiring into a bear market can derail everything',
    ],
    mathExample: {
      scenario: 'Years to financial independence by savings rate (7% investment return)',
      values: { at10pct: 43, at25pct: 32, at50pct: 17, at75pct: 7, fiNumber40kExpenses: 1000000 },
    },
  },

];

// Build lookup by both id and name
const TOPIC_MAP = {};
TOPICS.forEach(t => {
  TOPIC_MAP[t.id] = t;
  TOPIC_MAP[t.name] = t;
  TOPIC_MAP[t.name.toLowerCase()] = t;
});

module.exports = { TOPICS, TOPIC_MAP };
