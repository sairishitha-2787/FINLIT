// FINLIT — Collectibles Configuration
// Maps each learning-path topic to a domain-specific collectible
// Used by gamification components to render progress visuals

export const CHAPTER_TOPICS = {
  1: ['Budgeting Basics', 'Saving Money', 'Emergency Fund', 'Credit Scores'],
  2: ['Compound Interest', 'Investing Basics', 'Stock Market', 'Risk Management', 'Diversification'],
  3: ['Retirement Planning', 'Tax Optimization', 'Real Estate', 'Portfolio Rebalancing'],
};

export const ALL_PATH_TOPICS = [
  ...CHAPTER_TOPICS[1],
  ...CHAPTER_TOPICS[2],
  ...CHAPTER_TOPICS[3],
];

export const COLLECTIBLES = {

  gaming: {
    'Budgeting Basics':      { id:'g01', name:'Resource Manager',   icon:'sword',   tier:1, chapter:1, color:'#4ade80', desc:'Control the flow — manage your gold before any raid begins.' },
    'Saving Money':          { id:'g02', name:'Gold Vault',          icon:'shield',  tier:1, chapter:1, color:'#4ade80', desc:'A secure stash that grows passively between sessions.' },
    'Emergency Fund':        { id:'g03', name:'Health Potion',       icon:'potion',  tier:1, chapter:1, color:'#4ade80', desc:'Never enter a boss fight without it in your inventory.' },
    'Credit Scores':         { id:'g04', name:'Reputation Badge',    icon:'badge',   tier:1, chapter:1, color:'#4ade80', desc:'Your standing in the world — affects every trade and alliance.' },
    'Compound Interest':     { id:'g05', name:'XP Multiplier',       icon:'star',    tier:2, chapter:2, color:'#60a5fa', desc:'Stack this buff — the higher your level, the faster you gain.' },
    'Investing Basics':      { id:'g06', name:'Skill Tree Unlock',   icon:'branch',  tier:2, chapter:2, color:'#60a5fa', desc:'New branches open — your build just got more powerful.' },
    'Stock Market':          { id:'g07', name:'Trading Post',        icon:'chart',   tier:2, chapter:2, color:'#60a5fa', desc:'Access the marketplace — buy low, hold long.' },
    'Risk Management':       { id:'g08', name:'Boss Shield',         icon:'tower',   tier:2, chapter:2, color:'#60a5fa', desc:'No boss battle without a plan and full armor equipped.' },
    'Diversification':       { id:'g09', name:'Party Formation',     icon:'group',   tier:2, chapter:2, color:'#60a5fa', desc:'Balanced party wins — tank, DPS, healer all in one portfolio.' },
    'Retirement Planning':   { id:'g10', name:'Final Boss Key',      icon:'crown',   tier:3, chapter:3, color:'#f472b6', desc:'The endgame awaits — your legendary playthrough begins here.' },
    'Tax Optimization':      { id:'g11', name:'Legendary Forge',     icon:'hammer',  tier:3, chapter:3, color:'#f472b6', desc:'Craft legendary gear — every percentage point counts.' },
    'Real Estate':           { id:'g12', name:'Kingdom Builder',     icon:'castle',  tier:3, chapter:3, desc:'Claim your territory — passive income from your entire domain.' },
    'Portfolio Rebalancing': { id:'g13', name:'Guild Commander',     icon:'compass', tier:3, chapter:3, desc:'Lead with precision — guide every asset to its optimal role.' },
  },

  fashion: {
    'Budgeting Basics':      { id:'f01', name:'White Tee',         shape:'tee',     tier:'basics',    chapter:1, color:'#4ade80', desc:'The foundation of every wardrobe — and every great budget.' },
    'Saving Money':          { id:'f02', name:'Black Pants',       shape:'pants',   tier:'basics',    chapter:1, color:'#4ade80', desc:'Classic, versatile, goes with everything — just like saving.' },
    'Emergency Fund':        { id:'f03', name:'Denim Jacket',      shape:'jacket',  tier:'basics',    chapter:1, color:'#4ade80', desc:'The versatile layer — always there when you need it.' },
    'Credit Scores':         { id:'f04', name:'Classic Sneakers',  shape:'sneaker', tier:'basics',    chapter:1, color:'#4ade80', desc:'Street cred — people notice what you walk in with.' },
    'Compound Interest':     { id:'f05', name:'Gold Watch',        shape:'watch',   tier:'statement', chapter:2, color:'#60a5fa', desc:'Timeless — the longer you hold it, the more it appreciates.' },
    'Investing Basics':      { id:'f06', name:'Leather Bag',       shape:'bag',     tier:'statement', chapter:2, color:'#60a5fa', desc:'A working investment — carries everything and grows in value.' },
    'Stock Market':          { id:'f07', name:'Tailored Blazer',   shape:'blazer',  tier:'statement', chapter:2, color:'#60a5fa', desc:'Structure and power — says you mean serious business.' },
    'Risk Management':       { id:'f08', name:'Statement Belt',    shape:'belt',    tier:'statement', chapter:2, color:'#60a5fa', desc:'The bold accent that pulls the whole look together safely.' },
    'Diversification':       { id:'f09', name:'Capsule Set',       shape:'capsule', tier:'statement', chapter:2, color:'#60a5fa', desc:'9 pieces, infinite combinations — always coordinated.' },
    'Retirement Planning':   { id:'f10', name:'Evening Gown',      shape:'gown',    tier:'luxury',    chapter:3, color:'#f472b6', desc:'Made for the most important occasions — decades in the making.' },
    'Tax Optimization':      { id:'f11', name:'Limited Drop',      shape:'limited', tier:'luxury',    chapter:3, color:'#f472b6', desc:'Rare, exclusive — pays for everything else in your wardrobe.' },
    'Real Estate':           { id:'f12', name:'Investment Coat',   shape:'coat',    tier:'luxury',    chapter:3, color:'#f472b6', desc:'The piece that appreciates — bought once, worn for decades.' },
    'Portfolio Rebalancing': { id:'f13', name:'Signature Look',    shape:'full',    tier:'luxury',    chapter:3, color:'#f472b6', desc:'Your complete expression — everything in perfect harmony.' },
  },

  sports: {
    'Budgeting Basics':      { id:'s01', name:'Point Guard',          position:'PG',  number:1,  chapter:1, color:'#4ade80', desc:'Controls game flow — distributes resources and sets the pace.' },
    'Saving Money':          { id:'s02', name:'Shooting Guard',       position:'SG',  number:2,  chapter:1, color:'#4ade80', desc:'Consistent scorer — reliable returns, every single season.' },
    'Emergency Fund':        { id:'s03', name:'Small Forward',        position:'SF',  number:3,  chapter:1, color:'#4ade80', desc:'Versatile insurance — plays any role when the team needs it.' },
    'Credit Scores':         { id:'s04', name:'Power Forward',        position:'PF',  number:4,  chapter:1, color:'#4ade80', desc:'Foundation piece — sets screens and builds the base.' },
    'Compound Interest':     { id:'s05', name:'Center',               position:'C',   number:5,  chapter:2, color:'#60a5fa', desc:'The anchor — dominates the paint and grows every season.' },
    'Investing Basics':      { id:'s06', name:'6th Man',              position:'6',   number:6,  chapter:2, color:'#60a5fa', desc:'Game changer — changes momentum when deployed correctly.' },
    'Stock Market':          { id:'s07', name:'Trade Deadline Pick',  position:'G',   number:7,  chapter:2, color:'#60a5fa', desc:'High ceiling acquisition — volatile but transformative.' },
    'Risk Management':       { id:'s08', name:'Defensive Specialist', position:'D',   number:8,  chapter:2, color:'#60a5fa', desc:'Stops losses cold — the most underrated player on your roster.' },
    'Diversification':       { id:'s09', name:'Team Captain',         position:'TC',  number:9,  chapter:2, color:'#60a5fa', desc:'Chemistry multiplier — binds the roster into a winning team.' },
    'Retirement Planning':   { id:'s10', name:'Head Coach',           position:'HC',  number:10, chapter:3, color:'#f472b6', desc:'Long-term vision — the strategy that wins dynasties.' },
    'Tax Optimization':      { id:'s11', name:'Cap Manager',          position:'CAP', number:11, chapter:3, color:'#f472b6', desc:'Masters the salary cap — keeps the machine running.' },
    'Real Estate':           { id:'s12', name:'Stadium Owner',        position:'OW',  number:12, chapter:3, color:'#f472b6', desc:'Home court advantage — income regardless of the score.' },
    'Portfolio Rebalancing': { id:'s13', name:'General Manager',      position:'GM',  number:13, chapter:3, color:'#f472b6', desc:'Full roster command — every asset in its optimal position.' },
  },

  movies: {
    'Budgeting Basics':      { id:'m01', name:'The Production Brief',  act:1, scene:1,  chapter:1, color:'#4ade80', desc:'Every dollar planned before cameras roll.' },
    'Saving Money':          { id:'m02', name:'Lead Cast Secured',     act:1, scene:2,  chapter:1, color:'#4ade80', desc:'The reliable contract — the constant every production needs.' },
    'Emergency Fund':        { id:'m03', name:'Contingency Reserve',   act:1, scene:3,  chapter:1, color:'#4ade80', desc:'What every producer keeps off-sheet — the safety net.' },
    'Credit Scores':         { id:'m04', name:'Studio Deal Signed',    act:1, scene:4,  chapter:1, color:'#4ade80', desc:'Your studio reputation — the number that opens every door.' },
    'Compound Interest':     { id:'m05', name:'The Sequel Effect',     act:2, scene:5,  chapter:2, color:'#60a5fa', desc:'Each film earns more than the last — returns compound.' },
    'Investing Basics':      { id:'m06', name:'Box Office Strategy',   act:2, scene:6,  chapter:2, color:'#60a5fa', desc:'Calculated release timing — deploy capital when ready.' },
    'Stock Market':          { id:'m07', name:'Hollywood Floor',       act:2, scene:7,  chapter:2, color:'#60a5fa', desc:'High drama, higher stakes — the volatile trading floor.' },
    'Risk Management':       { id:'m08', name:'The Plot Twist',        act:2, scene:8,  chapter:2, color:'#60a5fa', desc:'You saw it coming — because you planned for every scenario.' },
    'Diversification':       { id:'m09', name:'Ensemble Cast',         act:2, scene:9,  chapter:2, color:'#60a5fa', desc:'No single actor carries it — your portfolio performs together.' },
    'Retirement Planning':   { id:'m10', name:'Franchise Vision',      act:3, scene:10, chapter:3, color:'#f472b6', desc:'The decades-long story arc — built scene by scene.' },
    'Tax Optimization':      { id:'m11', name:'Studio Accounting',     act:3, scene:11, chapter:3, color:'#f472b6', desc:'The back-office magic — where real profits are actually made.' },
    'Real Estate':           { id:'m12', name:'Backlot Purchase',      act:3, scene:12, chapter:3, color:'#f472b6', desc:'Your own studio — income streams beyond any single film.' },
    'Portfolio Rebalancing': { id:'m13', name:'Final Cut',             act:3, scene:13, chapter:3, color:'#f472b6', desc:'Every frame perfect — the director\'s cut of your wealth story.' },
  },

  food: {
    'Budgeting Basics':      { id:'fo01', name:'Flour',          shelf:1, slot:1, chapter:1, color:'#4ade80', desc:'The foundation — without this, nothing else can be made.' },
    'Saving Money':          { id:'fo02', name:'Salt',           shelf:1, slot:2, chapter:1, color:'#4ade80', desc:'The essential preservative — makes everything else taste better.' },
    'Emergency Fund':        { id:'fo03', name:'Olive Oil',      shelf:1, slot:3, chapter:1, color:'#4ade80', desc:'Versatile and essential — handles crisis and celebration equally.' },
    'Credit Scores':         { id:'fo04', name:'Butter',         shelf:1, slot:4, chapter:1, color:'#4ade80', desc:'The quality marker every chef is ultimately judged by.' },
    'Compound Interest':     { id:'fo05', name:'Active Yeast',   shelf:2, slot:1, chapter:2, color:'#60a5fa', desc:'Patient and powerful — given time, it multiplies everything.' },
    'Investing Basics':      { id:'fo06', name:'Stock Base',     shelf:2, slot:2, chapter:2, color:'#60a5fa', desc:'Simmered slowly — the depth behind every great dish.' },
    'Stock Market':          { id:'fo07', name:'Fresh Herbs',    shelf:2, slot:3, chapter:2, color:'#60a5fa', desc:'Sourced fresh — quality varies, but the right pick elevates all.' },
    'Risk Management':       { id:'fo08', name:'Spice Blend',    shelf:2, slot:4, chapter:2, color:'#60a5fa', desc:'Used with precision — too much heat ruins the whole dish.' },
    'Diversification':       { id:'fo09', name:'Sauce Set',      shelf:2, slot:5, chapter:2, color:'#60a5fa', desc:'A balanced collection — each sauce unlocks a new category.' },
    'Retirement Planning':   { id:'fo10', name:'Black Truffle',  shelf:3, slot:1, chapter:3, color:'#f472b6', desc:'The most prized ingredient — harvested once, valued forever.' },
    'Tax Optimization':      { id:'fo11', name:'Saffron',        shelf:3, slot:2, chapter:3, color:'#f472b6', desc:'Rare and precise — a little goes a long way when used correctly.' },
    'Real Estate':           { id:'fo12', name:'Aged Wine',      shelf:3, slot:3, chapter:3, color:'#f472b6', desc:'Time transforms it — the longer you hold, the more complex.' },
    'Portfolio Rebalancing': { id:'fo13', name:'Wagyu Cut',      shelf:3, slot:4, chapter:3, color:'#f472b6', desc:'Premium and proportioned — the executive decision ingredient.' },
  },

  music: {
    'Budgeting Basics':      { id:'mu01', name:'First Violin',   section:'strings',    seat:1, chapter:1, color:'#4ade80', desc:'The lead melody — sets the rhythm every other section follows.' },
    'Saving Money':          { id:'mu02', name:'Second Violin',  section:'strings',    seat:2, chapter:1, color:'#4ade80', desc:'Steady harmony — the consistent voice beneath the lead.' },
    'Emergency Fund':        { id:'mu03', name:'Cello',          section:'strings',    seat:3, chapter:1, color:'#4ade80', desc:'The warm reserve — deep and dependable when all else falters.' },
    'Credit Scores':         { id:'mu04', name:'Viola',          section:'strings',    seat:4, chapter:1, color:'#4ade80', desc:'The middle voice — your reputation bridging high and low.' },
    'Compound Interest':     { id:'mu05', name:'Flute',          section:'woodwinds',  seat:1, chapter:2, color:'#60a5fa', desc:'Bright and building — impossible to ignore over time.' },
    'Investing Basics':      { id:'mu06', name:'Clarinet',       section:'woodwinds',  seat:2, chapter:2, color:'#60a5fa', desc:'Full-range expression — from safe harmony to bold solo.' },
    'Stock Market':          { id:'mu07', name:'Oboe',           section:'woodwinds',  seat:3, chapter:2, color:'#60a5fa', desc:'Volatile and distinctive — cuts through everything.' },
    'Risk Management':       { id:'mu08', name:'Trumpet',        section:'brass',      seat:1, chapter:2, color:'#60a5fa', desc:'Powerful and direct — announces key moments with authority.' },
    'Diversification':       { id:'mu09', name:'Trombone',       section:'brass',      seat:2, chapter:2, color:'#60a5fa', desc:'Slides between positions — fills every harmonic gap.' },
    'Retirement Planning':   { id:'mu10', name:'French Horn',    section:'brass',      seat:3, chapter:3, color:'#f472b6', desc:'A sound that resonates through decades of careful planning.' },
    'Tax Optimization':      { id:'mu11', name:'Timpani',        section:'percussion', seat:1, chapter:3, color:'#f472b6', desc:'Precision timing — every beat placed exactly where it matters.' },
    'Real Estate':           { id:'mu12', name:'Snare Drum',     section:'percussion', seat:2, chapter:3, color:'#f472b6', desc:'The steady pulse — dependable income driving the performance.' },
    'Portfolio Rebalancing': { id:'mu13', name:'Conductor',      section:'conductor',  seat:0, chapter:3, color:'#f472b6', desc:'Every instrument in harmony, every asset in its place.' },
  },

};

// Normalize domain name to collectibles key
export function normalizeDomain(domain = '') {
  const d = domain.toLowerCase().trim();
  const MAP = {
    'video games': 'gaming', 'videogames': 'gaming', 'games': 'gaming',
    'clothes': 'fashion', 'clothing': 'fashion',
    'film': 'movies', 'cinema': 'movies',
    'cooking': 'food', 'cuisine': 'food',
    'exercise': 'sports', 'fitness': 'sports',
    'songs': 'music', 'song': 'music',
  };
  return MAP[d] || d;
}

export function getCollectible(domain, topic) {
  const key = normalizeDomain(domain);
  return COLLECTIBLES[key]?.[topic] || null;
}

export function getDomainCollectibles(domain) {
  return COLLECTIBLES[normalizeDomain(domain)] || {};
}
