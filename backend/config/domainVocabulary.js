// FINLIT — Domain Vocabulary Banks
// Used by explanationGenerator to enforce consistent domain language

const DOMAIN_VOCABULARY = {

  gaming: {
    coreTerms: ['XP', 'gold', 'grinding', 'leveling', 'inventory', 'buff', 'passive farm', 'endgame'],
    contextualTerms: {
      time:          ['AFK farming', 'passive grind', 'long session', 'accumulate over time'],
      risk:          ['boss battle', 'RNG', 'permadeath run', 'no-checkpoint zone', 'all-in fight'],
      growth:        ['XP multiplier', 'stat boost', 'stacking buffs', 'exponential scaling', 'endgame power'],
      diversify:     ['balanced party', 'skill tree spread', 'multi-class build', 'covering all roles'],
      debt:          ['negative gold', 'debt debuff', 'mana cost you cannot afford', 'handicap mode'],
      income:        ['drops', 'loot', 'passive farm', 'daily quests', 'revenue stream'],
    },
    analogies: {
      compounding:      'XP multipliers that stack — the higher your level, the faster you gain',
      diversification:  'a balanced party: tank absorbs hits, DPS does damage, healer keeps you alive',
      risk:             'a boss fight with no checkpoint — never go in without preparation',
      emergency_fund:   'your respawn lives — burn them wisely, you cannot buy more mid-run',
      budgeting:        'managing your inventory before a raid — know what you have before you need it',
      debt:             'playing on hardcore mode with a permanent debuff draining your gold',
      inflation:        'item prices inflating mid-patch — your gold buys less every season',
    },
    moneyWord:   'gold',
    timeWord:    'grinding',
    growthWord:  'leveling up',
    tone: 'A competitive gamer who knows the meta inside out. Casual but precise. Talks about min-maxing, resource management, and long-term strategy. References RPGs, strategy games, and battle royales. Treats finance like optimizing a character build.',
  },

  fashion: {
    coreTerms: ['wardrobe', 'investment piece', 'capsule collection', 'basics', 'versatile', 'staple', 'cost-per-wear', 'curate'],
    contextualTerms: {
      time:      ['timeless', 'long-term wear', 'seasons of service', 'off-season hold'],
      risk:      ['trend', 'fast fashion', 'impulse buy', 'one-season wonder', 'depreciate'],
      growth:    ['appreciate', 'resale value', 'investment return', 'portfolio of pieces'],
      diversify: ['capsule wardrobe', 'mix and match', 'coordinate', 'versatile across occasions'],
      debt:      ['maxing out on trends', 'fashion debt', 'buying tomorrow\'s regrets today'],
      income:    ['resale', 'rental income', 'styling fees', 'brand partnerships'],
    },
    analogies: {
      compounding:      'investment pieces that appreciate and compound returns — worn 200 times, value grows each wear',
      diversification:  'a capsule wardrobe: every piece coordinates with everything else, no single-use items',
      risk:             'buying a statement piece before building the basics to pair it with',
      emergency_fund:   'a classic black blazer — works for any occasion, always ready, never regretted',
      budgeting:        'planning a seasonal edit before you shop — intentional, not reactive',
      debt:             'fast fashion addiction: feel good today, closet full of regrets tomorrow',
      inflation:        'last season\'s prices versus this season\'s collection',
    },
    moneyWord:   'budget',
    timeWord:    'season',
    growthWord:  'building your collection',
    tone: 'A stylist who treats fashion as a business. Talks about cost-per-wear, investment value, and long-term curation. Knows designer resale, sustainable fashion economics, and the difference between a trend and a timeless piece.',
  },

  sports: {
    coreTerms: ['roster', 'draft pick', 'playbook', 'fundamentals', 'starting lineup', 'championship', 'dynasty', 'depth chart'],
    contextualTerms: {
      time:      ['regular season', 'long game', 'marathon', 'offseason grind', 'multi-year rebuild'],
      risk:      ['all-in play', 'Hail Mary', 'high-variance', 'going for two', 'mortgage the future'],
      growth:    ['dynasty', 'rebuilding phase', 'developing talent', 'stacking wins'],
      diversify: ['balanced roster', 'depth chart coverage', 'no single point of failure', 'versatile players'],
      debt:      ['salary cap nightmare', 'locked into bad contracts', 'no cap flexibility'],
      income:    ['sponsorships', 'multi-year contract', 'ticket revenue', 'endorsements'],
    },
    analogies: {
      compounding:      'building a dynasty — each championship makes recruiting easier, which leads to more championships',
      diversification:  'a complete roster: offense, defense, special teams — weakness in one unit costs championships',
      risk:             'a Hail Mary with 30 seconds left — sometimes necessary, never your base strategy',
      emergency_fund:   'your depth chart — when starters go down, you need trained backups ready',
      budgeting:        'managing salary cap space — every dollar committed is a strategic trade-off',
      debt:             'a salary cap nightmare: locked into bad long-term contracts, cannot improve the team',
      inflation:        'player salaries inflating year over year — today\'s contract is tomorrow\'s bargain or burden',
    },
    moneyWord:   'capital',
    timeWord:    'season',
    growthWord:  'building toward a championship',
    tone: 'A sports analyst who thinks in systems and strategy. Values fundamentals, long-term thinking, and preparation. References both team dynamics and individual performance. Talks about "doing the work" and "paying your dues" like any elite athlete.',
  },

  movies: {
    coreTerms: ['budget', 'production', 'script', 'franchise', 'sequel', 'box office', 'opening weekend', 'residuals'],
    contextualTerms: {
      time:      ['production timeline', 'pre-production', 'legacy franchise', 'long-term IP'],
      risk:      ['blockbuster bet', 'indie gamble', 'production risk', 'flopping on opening weekend'],
      growth:    ['franchise building', 'IP development', 'sequel rights', 'residual income'],
      diversify: ['slate diversification', 'multiple revenue streams', 'international markets', 'ensemble cast'],
      debt:      ['over-budget production', 'development hell', 'financial disaster film'],
      income:    ['box office', 'streaming rights', 'merchandise', 'international distribution', 'residuals'],
    },
    analogies: {
      compounding:      'franchise residuals — every sequel earns more than the last as the IP compounds in value',
      diversification:  'a balanced production slate: not every film is a $200M blockbuster — you need tent poles, mid-budget, and prestige',
      risk:             'a $200M production with no proven IP — maximum reward, catastrophic downside if it flops',
      emergency_fund:   'a production contingency budget — every smart producer sets 10-15% aside for surprises',
      budgeting:        'a production budget: every scene costs something, every dollar is a creative and financial decision',
      debt:             'going over budget mid-production — now you are locked in and bleeding capital daily',
      inflation:        'production costs rising every year — what $10M made in 2000 costs $20M to replicate today',
    },
    moneyWord:   'budget',
    timeWord:    'production',
    growthWord:  'building a franchise',
    tone: 'A film producer who thinks in ROI, risk management, and long-term IP value. References real industry dynamics — how studios greenlight projects, how franchises compound, how residuals work. Cinematic but financially sharp.',
  },

  food: {
    coreTerms: ['pantry', 'recipe', 'mise en place', 'ingredient', 'technique', 'prep', 'seasoning', 'foundation'],
    contextualTerms: {
      time:      ['slow cook', 'marinate', 'ferment', 'develop over time', 'patience in the kitchen'],
      risk:      ['experimental dish', 'untested recipe', 'opening night service', 'high-stakes menu'],
      growth:    ['refine technique', 'signature dish', 'Michelin ambition', 'mastering the craft'],
      diversify: ['balanced menu', 'variety in the pantry', 'diverse flavors', 'not relying on one dish'],
      debt:      ['sourcing above budget', 'borrowing from the pantry with no plan to replace'],
      income:    ['cover charge', 'catering revenue', 'multiple dining concepts', 'licensing the recipe'],
    },
    analogies: {
      compounding:      'a slow-cooked stock — time and patience create depth that shortcuts cannot replicate in any shortcut',
      diversification:  'a balanced menu: every section serves a different need, and the whole is stronger than any single dish',
      risk:             'serving an untested dish on opening night — preparation determines whether you get Michelin stars or one-star Yelp reviews',
      emergency_fund:   'a well-stocked pantry — when something goes wrong mid-service, you reach for what you have',
      budgeting:        'mise en place: everything prepped and in place before service begins — no improvising when it is busy',
      debt:             'sourcing premium ingredients on credit — beautiful dish on the plate, painful bill at month end',
      inflation:        'ingredient costs rising with every season — your recipe costs more to execute than it did last year',
    },
    moneyWord:   'ingredients',
    timeWord:    'prep time',
    growthWord:  'refining your craft',
    tone: 'A chef-mentor who sees parallels between culinary mastery and financial discipline. Systematic, precise, passionate about fundamentals. Believes great food and great finances come from the same place: doing the basics obsessively well.',
  },

  music: {
    coreTerms: ['symphony', 'harmony', 'composition', 'movement', 'tempo', 'orchestrate', 'crescendo', 'arrangement'],
    contextualTerms: {
      time:      ['long performance', 'rehearsal months', 'opus', 'build over movements', 'develop over years'],
      risk:      ['improvisation', 'debut performance', 'exposed solo', 'experimental composition'],
      growth:    ['masterpiece', 'legacy composition', 'opus magnus', 'symphony swelling'],
      diversify: ['full orchestra', 'multiple sections', 'harmonic balance', 'no single instrument dominates'],
      debt:      ['performing beyond your range', 'dissonance compounding', 'off-key choices'],
      income:    ['royalties', 'licensing', 'residuals', 'streaming revenue', 'publishing rights'],
    },
    analogies: {
      compounding:      'a symphony building to a crescendo — each movement amplifies what came before, exponentially',
      diversification:  'a full orchestra: strings carry melody, brass provides power, percussion drives rhythm — remove any section and the performance suffers',
      risk:             'a debut performance with no rehearsal — some risks require preparation before you step on stage',
      emergency_fund:   'a rest measure in your score — silence is not failure, it is intentional space that makes the music breathe',
      budgeting:        'composing a score: every instrument has a role, every note is intentional, nothing is wasted',
      debt:             'playing out of tune — dissonance that compounds with every measure until you stop and resolve it',
      inflation:        'tempo that keeps accelerating — harder to stay in time without the training to keep up',
    },
    moneyWord:   'resources',
    timeWord:    'movement',
    growthWord:  'composing your symphony',
    tone: 'A conductor and composer who sees financial planning as orchestration. Systematic, believes in the interplay between instruments, appreciates how every section contributes to the whole. Patient — great compositions take years, not days.',
  },

};

// Normalize interest strings to a domain key
function normalizeDomain(interest) {
  const d = (interest || '').toLowerCase().trim();
  const aliases = {
    'video games': 'gaming', 'esports': 'gaming', 'games': 'gaming', 'game': 'gaming',
    'clothes': 'fashion', 'style': 'fashion', 'clothing': 'fashion',
    'cooking': 'food', 'chef': 'food', 'culinary': 'food', 'baking': 'food',
    'film': 'movies', 'cinema': 'movies', 'film & tv': 'movies', 'tv': 'movies',
    'exercise': 'sports', 'fitness': 'sports', 'gym': 'sports', 'athletics': 'sports', 'football': 'sports', 'basketball': 'sports', 'soccer': 'sports',
    'song': 'music', 'songs': 'music', 'instruments': 'music', 'band': 'music', 'singing': 'music',
  };
  return aliases[d] || (DOMAIN_VOCABULARY[d] ? d : 'gaming');
}

module.exports = { DOMAIN_VOCABULARY, normalizeDomain };
