// FINLIT — Learning Paths Configuration
// 6 domain campaigns × 3 chapters each × 4-5 topics per chapter
// Topics use canonical names matching topics.js

// Chapter 1 topics (same for all domains, different narrative framing)
const CH1_TOPICS = ['Budgeting Basics', 'Saving Money', 'Emergency Fund', 'Credit Scores'];
const CH2_TOPICS = ['Compound Interest', 'Investing Basics', 'Stock Market', 'Risk Management', 'Diversification'];
const CH3_TOPICS = ['Retirement Planning', 'Tax Optimization', 'Real Estate', 'Portfolio Rebalancing'];

const LEARNING_PATHS = {

  gaming: {
    domainName: 'Gaming',
    campaignTitle: 'The Wealth Quest',
    tagline: 'Level up your finances, one quest at a time',
    chapters: [
      {
        id: 'gaming_ch1',
        number: 1,
        title: 'Tutorial Island',
        subtitle: 'Master the basics before the main quest',
        narrative: 'Every legendary player started here. Learn to manage your gold, build your savings vault, and prepare your emergency health potions before the real adventure begins.',
        difficulty: 'beginner',
        topics: CH1_TOPICS,
        topicAliases: {
          'Budgeting Basics': 'Resource Management',
          'Saving Money': 'Gold Vault System',
          'Emergency Fund': 'Health Potion Stash',
          'Credit Scores': 'Reputation Score',
        },
        completionBadge: { id: 'tutorial_complete', name: 'Tutorial Complete', icon: 'GraduationCap' },
        completionXP: 500,
        unlocks: 'gaming_ch2',
      },
      {
        id: 'gaming_ch2',
        number: 2,
        title: 'Main Quest',
        subtitle: 'Level up your wealth-building skills',
        narrative: 'The tutorial is behind you. Now you face compound XP multipliers, skill tree investing, and the trading post of the stock market. Your party needs a balanced composition.',
        difficulty: 'intermediate',
        topics: CH2_TOPICS,
        topicAliases: {
          'Compound Interest': 'XP Multiplier System',
          'Investing Basics': 'Skill Tree Unlock',
          'Stock Market': 'Trading Post',
          'Risk Management': 'Boss Battle Prep',
          'Diversification': 'Party Composition',
        },
        completionBadge: { id: 'wealth_warrior', name: 'Wealth Warrior', icon: 'Target' },
        completionXP: 750,
        unlocks: 'gaming_ch3',
      },
      {
        id: 'gaming_ch3',
        number: 3,
        title: 'Endgame Content',
        subtitle: 'Master legendary wealth strategies',
        narrative: 'You have reached the endgame. Only the most dedicated players make it here. Retirement planning is your final boss. Tax optimization is the legendary gear. Real estate is your kingdom.',
        difficulty: 'advanced',
        topics: CH3_TOPICS,
        topicAliases: {
          'Retirement Planning': 'Final Boss Strategy',
          'Tax Optimization': 'Legendary Gear Crafting',
          'Real Estate': 'Kingdom Building',
          'Portfolio Rebalancing': 'Guild Leadership',
        },
        completionBadge: { id: 'financial_master_gaming', name: 'Financial Master', icon: 'Crown' },
        completionXP: 1000,
        unlocks: null,
      },
    ],
  },

  fashion: {
    domainName: 'Fashion',
    campaignTitle: 'Curate Your Financial Wardrobe',
    tagline: 'Build a timeless financial collection, season by season',
    chapters: [
      {
        id: 'fashion_ch1',
        number: 1,
        title: 'The Basics Collection',
        subtitle: 'Every wardrobe starts with essentials',
        narrative: 'Before statement pieces and designer investments, you need a foundation. Master the financial basics that go with everything — the white tee, black pants, and classic denim of your money life.',
        difficulty: 'beginner',
        topics: CH1_TOPICS,
        topicAliases: {
          'Budgeting Basics': 'The White Tee — Foundation',
          'Saving Money': 'The Classic Staple',
          'Emergency Fund': 'The Versatile Layer',
          'Credit Scores': 'Your Style Reputation',
        },
        completionBadge: { id: 'foundation_builder', name: 'Foundation Builder', icon: 'Star' },
        completionXP: 500,
        unlocks: 'fashion_ch2',
      },
      {
        id: 'fashion_ch2',
        number: 2,
        title: 'Statement Pieces',
        subtitle: 'Add investments that define your portfolio',
        narrative: 'With your basics in place, it is time to add pieces that work harder over time. Compound interest is your timeless watch. Diversification is your capsule collection that coordinates perfectly.',
        difficulty: 'intermediate',
        topics: CH2_TOPICS,
        topicAliases: {
          'Compound Interest': 'The Timeless Watch',
          'Investing Basics': 'The Designer Bag',
          'Stock Market': 'The Tailored Blazer',
          'Risk Management': 'The Bold Accessory',
          'Diversification': 'The Capsule Collection',
        },
        completionBadge: { id: 'style_curator', name: 'Style Curator', icon: 'Zap' },
        completionXP: 750,
        unlocks: 'fashion_ch3',
      },
      {
        id: 'fashion_ch3',
        number: 3,
        title: 'The Luxury Collection',
        subtitle: 'Invest in pieces that appreciate forever',
        narrative: 'This is the level where investment pieces are measured in decades, not seasons. Retirement planning is your evening gown — timelessly valuable. Tax optimization is your limited edition — the one that pays for everything else.',
        difficulty: 'advanced',
        topics: CH3_TOPICS,
        topicAliases: {
          'Retirement Planning': 'The Evening Gown',
          'Tax Optimization': 'The Limited Edition',
          'Real Estate': 'The Investment Piece',
          'Portfolio Rebalancing': 'Your Signature Look',
        },
        completionBadge: { id: 'fashion_icon', name: 'Fashion Icon', icon: 'Crown' },
        completionXP: 1000,
        unlocks: null,
      },
    ],
  },

  sports: {
    domainName: 'Sports',
    campaignTitle: 'Build Your Championship Team',
    tagline: 'Roster-build your finances all the way to the title',
    chapters: [
      {
        id: 'sports_ch1',
        number: 1,
        title: 'Draft Your Starters',
        subtitle: 'Build your core financial lineup',
        narrative: 'Every championship team starts with its core five. Budgeting is your point guard — the player who controls the game flow. Savings is your shooting guard — consistent and reliable. Build your starting five before anything else.',
        difficulty: 'beginner',
        topics: CH1_TOPICS,
        topicAliases: {
          'Budgeting Basics': 'Point Guard — Game Control',
          'Saving Money': 'Shooting Guard — Consistent',
          'Emergency Fund': 'Small Forward — Versatile',
          'Credit Scores': 'Power Forward — Foundation',
        },
        completionBadge: { id: 'starting_five', name: 'Starting Five', icon: 'Target' },
        completionXP: 500,
        unlocks: 'sports_ch2',
      },
      {
        id: 'sports_ch2',
        number: 2,
        title: 'Build the Bench',
        subtitle: 'Championship teams need depth',
        narrative: 'Starters win games. Depth wins championships. Compound interest is your 6th man — the player who changes games off the bench. Risk management is your defensive specialist. Build the depth that takes you to the playoffs.',
        difficulty: 'intermediate',
        topics: CH2_TOPICS,
        topicAliases: {
          'Compound Interest': '6th Man — Impact Off the Bench',
          'Investing Basics': 'Rotation Player',
          'Stock Market': 'Trade Deadline Acquisition',
          'Risk Management': 'Defensive Specialist',
          'Diversification': 'Team Chemistry',
        },
        completionBadge: { id: 'playoff_ready', name: 'Playoff Ready', icon: 'Flame' },
        completionXP: 750,
        unlocks: 'sports_ch3',
      },
      {
        id: 'sports_ch3',
        number: 3,
        title: 'Championship Run',
        subtitle: 'Execute the game plan to win the title',
        narrative: 'Everything you have built leads to this. Retirement planning is dynasty building. Tax optimization is mastering the salary cap. Real estate is your stadium investment. Execute the championship game plan.',
        difficulty: 'advanced',
        topics: CH3_TOPICS,
        topicAliases: {
          'Retirement Planning': 'Dynasty Builder',
          'Tax Optimization': 'Salary Cap Expert',
          'Real Estate': 'Stadium Investment',
          'Portfolio Rebalancing': 'General Manager Mastery',
        },
        completionBadge: { id: 'champion', name: 'Champion', icon: 'Crown' },
        completionXP: 1000,
        unlocks: null,
      },
    ],
  },

  music: {
    domainName: 'Music',
    campaignTitle: 'Compose Your Financial Symphony',
    tagline: 'Build your financial masterpiece, one movement at a time',
    chapters: [
      {
        id: 'music_ch1',
        number: 1,
        title: 'Movement I — Allegro',
        subtitle: 'Establish your foundational financial themes',
        narrative: 'Every symphony begins with the first movement establishing the key themes. Budgeting is your strings section — the backbone that carries the melody. Savings is your woodwinds — steady and indispensable.',
        difficulty: 'beginner',
        topics: CH1_TOPICS,
        topicAliases: {
          'Budgeting Basics': 'Strings — The Backbone',
          'Saving Money': 'Woodwinds — Steady',
          'Emergency Fund': 'Brass — The Reserve',
          'Credit Scores': 'Your Musical Reputation',
        },
        completionBadge: { id: 'musician', name: 'Musician', icon: 'GraduationCap' },
        completionXP: 500,
        unlocks: 'music_ch2',
      },
      {
        id: 'music_ch2',
        number: 2,
        title: 'Movement II — Andante',
        subtitle: 'Develop your financial harmony',
        narrative: 'The second movement develops and transforms the themes from the first. Compound interest is your crescendo — building from quiet to overwhelming. Risk management is your dissonance that resolves into something beautiful.',
        difficulty: 'intermediate',
        topics: CH2_TOPICS,
        topicAliases: {
          'Compound Interest': 'The Crescendo',
          'Investing Basics': 'Chord Progression',
          'Stock Market': 'The Market Rhythm',
          'Risk Management': 'Dissonance and Resolution',
          'Diversification': 'Full Orchestral Balance',
        },
        completionBadge: { id: 'composer', name: 'Composer', icon: 'Flame' },
        completionXP: 750,
        unlocks: 'music_ch3',
      },
      {
        id: 'music_ch3',
        number: 3,
        title: 'Movement III — Finale',
        subtitle: 'Bring it all together in a grand finale',
        narrative: 'The finale is where every theme, every motif, every movement comes together in a crescendo of mastery. Retirement planning is your symphony finale. Portfolio rebalancing is the conductor keeping everything in perfect harmony.',
        difficulty: 'advanced',
        topics: CH3_TOPICS,
        topicAliases: {
          'Retirement Planning': 'Symphony Finale',
          'Tax Optimization': 'Perfect Pitch',
          'Real Estate': 'Concert Hall Investment',
          'Portfolio Rebalancing': 'Conductor Mastery',
        },
        completionBadge: { id: 'maestro', name: 'Maestro', icon: 'Crown' },
        completionXP: 1000,
        unlocks: null,
      },
    ],
  },

};

// Flat lookup: chapterId → chapter object
const CHAPTER_MAP = {};
Object.values(LEARNING_PATHS).forEach(path => {
  path.chapters.forEach(ch => { CHAPTER_MAP[ch.id] = ch; });
});

export { LEARNING_PATHS, CHAPTER_MAP };
