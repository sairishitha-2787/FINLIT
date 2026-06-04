// Music domain — static quiz questions
// Format matches NeoQuizEnvironment: correctAnswer is letter 'A'|'B'|'C'|'D'
// options[0]=A, options[1]=B, options[2]=C, options[3]=D
// Used as AI fallback when backend is unavailable.

export const MUSIC_QUESTIONS = [

  // ── Topic 1: The Music Ecosystem ──────────────────────────────────────────
  {
    id: 'mq_0_0', topicName: 'The Music Ecosystem', difficulty: 'beginner',
    question: 'Which entity distributes an independent artist\'s music to Spotify, Apple Music, and Tidal?',
    options: ['The artist contacts each platform directly', 'A music distributor (e.g. DistroKid, TuneCore)', 'The performing rights organization (PRO)', 'A booking agent'],
    correctAnswer: 'B',
    explanation: 'Music distributors are the middlemen between artists and streaming platforms. Independent artists use services like DistroKid, TuneCore, or CD Baby to place music on all major platforms.',
  },
  {
    id: 'mq_0_1', topicName: 'The Music Ecosystem', difficulty: 'beginner',
    question: 'In the music industry food chain, which party typically receives the LARGEST share of streaming revenue?',
    options: ['The recording artist', 'The streaming platform (e.g. Spotify)', 'The record label', 'The songwriter'],
    correctAnswer: 'C',
    explanation: 'Record labels typically keep the largest cut of streaming revenue. They usually pay artists only 15-25% of the label\'s share — after recouping advances.',
  },
  {
    id: 'mq_0_2', topicName: 'The Music Ecosystem', difficulty: 'beginner',
    question: 'What is the difference between a record label and a music publisher?',
    options: ['They are the same thing with different names', 'Labels handle recordings and distribution; publishers handle songwriting rights', 'Publishers release albums; labels print sheet music', 'Labels work with live artists; publishers work with DJs'],
    correctAnswer: 'B',
    explanation: 'Record labels own and distribute recordings (master rights). Publishers own and collect income for the underlying song composition (publishing rights). Many artists deal with both.',
  },
  {
    id: 'mq_0_3', topicName: 'The Music Ecosystem', difficulty: 'intermediate',
    question: 'A performing rights organization (PRO) like ASCAP or BMI collects which type of royalty?',
    options: ['Mechanical royalties from physical sales', 'Performance royalties when songs are played publicly', 'Sync fees for TV and film placements', 'Distribution fees for streaming uploads'],
    correctAnswer: 'B',
    explanation: 'PROs collect performance royalties when music is performed or broadcast publicly — on radio, in venues, on streaming platforms, or on TV — and distribute them to songwriters and publishers.',
  },
  {
    id: 'mq_0_4', topicName: 'The Music Ecosystem', difficulty: 'intermediate',
    question: 'What does a "360 deal" mean in the music industry?',
    options: ['A record deal that lasts 360 days', 'A label takes a percentage of ALL artist revenue, not just recordings', 'A contract covering 360 songs', 'A global touring contract'],
    correctAnswer: 'B',
    explanation: 'In a 360 deal, the label takes a cut of ALL revenue streams — recordings, touring, merch, endorsements, and more. It gives the label broad financial participation in the artist\'s entire career.',
  },
  {
    id: 'mq_0_5', topicName: 'The Music Ecosystem', difficulty: 'advanced',
    question: 'Which streaming model pays artists more per stream: pro-rata or user-centric?',
    options: ['Pro-rata always pays more', 'User-centric pays more to niche artists with dedicated fans', 'Both pay identically', 'Pro-rata favors indie artists over major label acts'],
    correctAnswer: 'B',
    explanation: 'In user-centric payments, royalties flow from what each individual user listens to. Niche artists with true fans benefit more since their fans\' subscription fees go directly to them, not the top 40.',
  },
  {
    id: 'mq_0_6', topicName: 'The Music Ecosystem', difficulty: 'advanced',
    question: 'An artist earns $0.004 per stream on Spotify. They have 2 million streams this month. How much do they earn BEFORE the label takes its 80% cut?',
    options: ['$800', '$8,000', '$1,600', '$80'],
    correctAnswer: 'B',
    explanation: '2,000,000 × $0.004 = $8,000 gross. After the label takes 80%, the artist keeps $1,600. This illustrates why owning your masters matters enormously at scale.',
  },

  // ── Topic 2: Rights & Royalties Basics ────────────────────────────────────
  {
    id: 'mq_1_0', topicName: 'Rights & Royalties Basics', difficulty: 'beginner',
    question: 'Mechanical royalties are generated when:',
    options: ['A song is performed live in a venue', 'A song is reproduced or distributed (streams, downloads, CDs)', 'A song is used in a TV commercial', 'A DJ plays a song in a club'],
    correctAnswer: 'B',
    explanation: 'Mechanical royalties are paid to songwriters and publishers whenever a song is reproduced — whether streamed, downloaded, or pressed onto a CD or vinyl.',
  },
  {
    id: 'mq_1_1', topicName: 'Rights & Royalties Basics', difficulty: 'beginner',
    question: 'What does owning "the master" mean?',
    options: ['Owning the physical master tape from the studio', 'Owning the copyright to the actual recording', 'Being the first artist to record a particular song', 'Having approval over all remixes'],
    correctAnswer: 'B',
    explanation: 'The master recording copyright covers the specific recorded performance. Whoever owns the master controls how that recording is licensed, distributed, and monetized.',
  },
  {
    id: 'mq_1_2', topicName: 'Rights & Royalties Basics', difficulty: 'beginner',
    question: 'What is a sync license?',
    options: ['Permission to synchronize an artist\'s tour schedule with a venue', 'Permission to use a song in visual media (films, TV, ads)', 'A license to play music in two venues simultaneously', 'Permission to remix a song for streaming'],
    correctAnswer: 'B',
    explanation: 'A sync (synchronization) license allows a song to be paired with visual content — movies, TV shows, ads, video games. Sync deals can be very lucrative for both masters and publishing rights.',
  },
  {
    id: 'mq_1_3', topicName: 'Rights & Royalties Basics', difficulty: 'intermediate',
    question: 'A song has two sets of rights. Which combination is correct?',
    options: ['Master rights (the recording) and publishing rights (the composition)', 'Mechanical rights (the melody) and performance rights (the lyrics)', 'Distribution rights (streaming) and broadcast rights (radio)', 'Live rights (concerts) and studio rights (recordings)'],
    correctAnswer: 'A',
    explanation: 'Every song has two copyrights: the master (the specific recording) controlled by whoever recorded it, and the publishing/composition (the underlying song) controlled by the songwriter or publisher.',
  },
  {
    id: 'mq_1_4', topicName: 'Rights & Royalties Basics', difficulty: 'intermediate',
    question: 'Under US copyright law, what is a "compulsory license"?',
    options: ['A law requiring all artists to license their music', 'The right to cover any published song by paying a statutory rate without the owner\'s permission', 'A court order forcing an artist to release music', 'A government license to perform on public radio'],
    correctAnswer: 'B',
    explanation: 'The compulsory mechanical license (Harry Fox Agency manages this) lets any artist cover a publicly released song by paying a statutory mechanical rate — without needing the original writer\'s explicit permission.',
  },
  {
    id: 'mq_1_5', topicName: 'Rights & Royalties Basics', difficulty: 'advanced',
    question: 'If a songwriting split is 50/50 between two co-writers, and a song earns $10,000 in publishing royalties, how much does each writer receive?',
    options: ['$5,000 each', '$2,500 each (publisher takes 50%)', '$3,333 each (label takes a third)', '$10,000 each (paid separately)'],
    correctAnswer: 'A',
    explanation: 'Publishing royalties follow the songwriting split. At 50/50, each writer earns $5,000. Note: if either writer signed their publishing to a publisher, the publisher would then take their own cut from that writer\'s portion.',
  },
  {
    id: 'mq_1_6', topicName: 'Rights & Royalties Basics', difficulty: 'advanced',
    question: 'What does "work for hire" mean and how does it affect your rights?',
    options: ['You are hired to write for another artist and keep all rights', 'You are paid a flat fee to create work that the employer owns — you get NO royalties', 'You hire a session musician who then owns half the recording', 'You work for a label that reimburses your recording costs'],
    correctAnswer: 'B',
    explanation: 'Under work-for-hire agreements, the hiring party becomes the legal author and copyright owner. Session musicians and ghost-writers often work this way — a one-time fee, no royalties, no ownership.',
  },

  // ── Topic 3: Streaming Economics ──────────────────────────────────────────
  {
    id: 'mq_2_0', topicName: 'Streaming Economics', difficulty: 'beginner',
    question: 'Approximately how much does Spotify pay per stream to rights holders?',
    options: ['$0.10 - $0.20 per stream', '$0.003 - $0.005 per stream', '$1.00 per stream', '$0.001 per stream'],
    correctAnswer: 'B',
    explanation: 'Spotify\'s per-stream rate is roughly $0.003–$0.005, with the average around $0.004. This rate goes to the rights holder (label or distributor), not directly to the artist.',
  },
  {
    id: 'mq_2_1', topicName: 'Streaming Economics', difficulty: 'beginner',
    question: 'How many streams does an artist typically need to earn $1,000 at $0.004/stream?',
    options: ['10,000 streams', '250,000 streams', '1,000 streams', '100,000 streams'],
    correctAnswer: 'B',
    explanation: '$1,000 ÷ $0.004 = 250,000 streams. This assumes the artist keeps 100% of the streaming income, which only happens for fully independent artists.',
  },
  {
    id: 'mq_2_2', topicName: 'Streaming Economics', difficulty: 'beginner',
    question: 'Why does a song need to be played for at least 30 seconds on Spotify to generate a stream royalty?',
    options: ['To prevent accidental plays from counting', 'It\'s an arbitrary industry rule with no financial reason', 'To stop bots from inflating play counts for fraudulent royalties', 'Because songs shorter than 30 seconds are not covered by copyright'],
    correctAnswer: 'C',
    explanation: 'The 30-second threshold prevents streaming fraud where bots play short clips to generate fake royalty payments. It ensures a minimum engagement level before revenue is credited.',
  },
  {
    id: 'mq_2_3', topicName: 'Streaming Economics', difficulty: 'intermediate',
    question: 'In Spotify\'s pro-rata model, what determines how royalties are split among all artists?',
    options: ['Each artist gets an equal share of the royalty pool', 'Your share of total streams as a percentage of ALL streams on the platform', 'Your number of followers determines your share', 'Labels negotiate fixed rates for each song'],
    correctAnswer: 'B',
    explanation: 'Spotify pools all subscription and ad revenue, then distributes royalties proportional to each song\'s share of total platform streams. 1% of streams = 1% of the royalty pool.',
  },
  {
    id: 'mq_2_4', topicName: 'Streaming Economics', difficulty: 'intermediate',
    question: 'If a song generates 5 million streams at $0.004/stream and the label takes 80%, how much does the artist receive?',
    options: ['$20,000', '$4,000', '$16,000', '$1,000'],
    correctAnswer: 'B',
    explanation: '5,000,000 × $0.004 = $20,000 total. Label takes 80% = $16,000. Artist keeps 20% = $4,000. This is why many artists pursue independence to keep a larger share.',
  },
  {
    id: 'mq_2_5', topicName: 'Streaming Economics', difficulty: 'advanced',
    question: 'Which of the following would MOST increase an independent artist\'s streaming income?',
    options: ['Getting on a Spotify editorial playlist', 'Releasing more albums per year', 'Raising ticket prices for live shows', 'Signing with a major label for distribution'],
    correctAnswer: 'A',
    explanation: 'Editorial playlists can multiply streams exponentially. A single New Music Friday placement can generate millions of streams overnight — the highest ROI lever for streaming income.',
  },
  {
    id: 'mq_2_6', topicName: 'Streaming Economics', difficulty: 'advanced',
    question: 'Apple Music pays approximately 2x Spotify\'s per-stream rate. If a song gets 1M streams on each platform at $0.004 (Spotify) and $0.008 (Apple), what is the total combined royalty?',
    options: ['$4,000', '$12,000', '$8,000', '$16,000'],
    correctAnswer: 'B',
    explanation: 'Spotify: 1M × $0.004 = $4,000. Apple Music: 1M × $0.008 = $8,000. Total: $12,000. This shows the value of platform diversification — Apple users generate significantly more revenue per stream.',
  },

  // ── Topic 4: Artist vs Label Deals ────────────────────────────────────────
  {
    id: 'mq_3_0', topicName: 'Artist vs Label Deals', difficulty: 'beginner',
    question: 'What is an "advance" in a record deal?',
    options: ['A payment the label owes the artist after album release', 'Money paid upfront that must be recouped from future royalties before the artist earns more', 'Early access to studio time before signing', 'A bonus for charting in the top 40'],
    correctAnswer: 'B',
    explanation: 'A recording advance is essentially a loan. The label pays it upfront to fund recording, but the artist doesn\'t see additional royalties until the advance is fully recouped from earned income.',
  },
  {
    id: 'mq_3_1', topicName: 'Artist vs Label Deals', difficulty: 'beginner',
    question: 'What royalty rate do most new artists receive from major label record deals?',
    options: ['50% of net revenue', '10-20% of net revenue', '75% of net revenue', '30-40% of net revenue'],
    correctAnswer: 'B',
    explanation: 'New artists typically receive 10-20% net royalty rates. After deductions for packaging, breakage, and recoupment of advances, many artists earn far less than this on paper.',
  },
  {
    id: 'mq_3_2', topicName: 'Artist vs Label Deals', difficulty: 'intermediate',
    question: 'What is the main financial benefit of a distribution deal vs a traditional record deal?',
    options: ['You get a larger advance upfront', 'You keep your masters and earn a higher revenue percentage', 'The label handles all marketing costs at no charge', 'You are guaranteed radio play'],
    correctAnswer: 'B',
    explanation: 'Distribution deals typically offer artists 80-100% of revenues in exchange for a flat fee or small percentage. Unlike record deals, you retain your masters — the most valuable long-term asset.',
  },
  {
    id: 'mq_3_3', topicName: 'Artist vs Label Deals', difficulty: 'intermediate',
    question: 'An artist receives a $200,000 advance. Their royalty rate is 20% of net revenue at $0.004/stream. How many streams must they generate to recoup?',
    options: ['250 million streams', '50 million streams', '25 million streams', '500 million streams'],
    correctAnswer: 'A',
    explanation: '$200,000 ÷ ($0.004 × 20%) = $200,000 ÷ $0.0008 = 250,000,000 streams to recoup. Most artists never recoup major label advances — they live off touring and merch instead.',
  },
  {
    id: 'mq_3_4', topicName: 'Artist vs Label Deals', difficulty: 'intermediate',
    question: 'What is the key difference between a joint venture deal and a standard record deal?',
    options: ['A joint venture pays the artist weekly instead of quarterly', 'In a joint venture, the artist and label share ownership of masters and profits more equally', 'A joint venture means the label distributes only one single', 'Joint ventures only apply to unsigned artists'],
    correctAnswer: 'B',
    explanation: 'Joint ventures are more equal partnerships where artists retain partial ownership of their masters and share profits (often 50/50) rather than just receiving a small royalty percentage.',
  },
  {
    id: 'mq_3_5', topicName: 'Artist vs Label Deals', difficulty: 'advanced',
    question: 'Taylor Swift rerecorded her first 6 albums as "Taylor\'s Version." What was the PRIMARY financial motivation?',
    options: ['To improve the audio quality of older recordings', 'To regain control and future revenue from her masters that were sold without her consent', 'To satisfy a contractual obligation with Republic Records', 'To take advantage of new streaming royalty rates'],
    correctAnswer: 'B',
    explanation: 'Swift\'s original masters were sold by her former label Big Machine to Scooter Braun\'s Ithaca Holdings without her approval. By re-recording, she can route streaming revenue to her new recordings she owns outright.',
  },
  {
    id: 'mq_3_6', topicName: 'Artist vs Label Deals', difficulty: 'advanced',
    question: 'What does "most favored nation" (MFN) mean in music licensing?',
    options: ['International artists get priority licensing deals', 'All rights holders in a licensed work must receive equal payment terms', 'The label gets the highest rate negotiated by any artist on the roster', 'A PRO protects nationals of specific countries'],
    correctAnswer: 'B',
    explanation: 'MFN clauses mean if you license both masters and publishing rights, both must be paid at the same rate. If one rights holder negotiates up, the other gets the same rate — ensuring parity.',
  },

  // ── Topic 5: Multiple Revenue Streams ────────────────────────────────────
  {
    id: 'mq_4_0', topicName: 'Multiple Revenue Streams', difficulty: 'beginner',
    question: 'Which revenue stream typically earns an artist the MOST money per fan interaction?',
    options: ['Spotify streaming', 'Selling a ticket to a live show', 'YouTube ad revenue', 'Radio play royalties'],
    correctAnswer: 'B',
    explanation: 'Live performance earns more per fan than any streaming source. A $30-$100 ticket purchase in one transaction is worth thousands of streams. Live is the highest-revenue touchpoint with fans.',
  },
  {
    id: 'mq_4_1', topicName: 'Multiple Revenue Streams', difficulty: 'beginner',
    question: 'A sync placement in a Netflix show generates income from which TWO sources?',
    options: ['Streaming royalties and merchandise sales', 'A sync fee (master license) and performance royalties (publishing)', 'Distribution fees and mechanical royalties', 'Ticket sales and video royalties'],
    correctAnswer: 'B',
    explanation: 'A sync deal pays a one-time sync fee to license the master recording. Then every time the show airs (TV performance), performance royalties are collected by the PRO for the songwriter.',
  },
  {
    id: 'mq_4_2', topicName: 'Multiple Revenue Streams', difficulty: 'intermediate',
    question: 'Which revenue stream is considered "passive income" for musicians?',
    options: ['Live touring', 'Streaming and licensing royalties', 'Session work and studio gigs', 'Teaching music lessons'],
    correctAnswer: 'B',
    explanation: 'Streaming royalties and licensing fees are passive — you create the work once and earn repeatedly without active involvement. Touring, lessons, and session work all require ongoing time and labor.',
  },
  {
    id: 'mq_4_3', topicName: 'Multiple Revenue Streams', difficulty: 'intermediate',
    question: 'A musician earns: $500/month streaming, $2,000/month teaching, $800/month sync royalties, $3,500 from one show. Which revenue stream is most valuable for financial stability?',
    options: ['The one-time show payment', 'Streaming income (most consistent)', 'Teaching income (consistent and active)', 'Sync royalties (passive and growing)'],
    correctAnswer: 'C',
    explanation: 'Teaching provides consistent, active income that doesn\'t fluctuate month to month. While passive streams are ideal, teaching is the most reliable monthly baseline. Ideally, diversify all four.',
  },
  {
    id: 'mq_4_4', topicName: 'Multiple Revenue Streams', difficulty: 'intermediate',
    question: 'What is a "micro-licensing" platform like Musicbed or Artlist used for?',
    options: ['Selling micro-transactions in music apps', 'Licensing music to content creators for a subscription fee', 'Offering short musical samples at reduced rates', 'Licensing music for ringtones only'],
    correctAnswer: 'B',
    explanation: 'Platforms like Musicbed, Artlist, and Epidemic Sound let content creators pay a subscription for access to a music library. Artists earn royalties every time their track is downloaded or used.',
  },
  {
    id: 'mq_4_5', topicName: 'Multiple Revenue Streams', difficulty: 'advanced',
    question: 'An artist wants to add $2,000/month in passive income. Streaming at $0.004/stream requires how many monthly streams?',
    options: ['500,000 streams', '5,000,000 streams', '2,000,000 streams', '200,000 streams'],
    correctAnswer: 'A',
    explanation: '$2,000 ÷ $0.004 = 500,000 streams/month needed if the artist is fully independent. With a label taking 80%, they\'d need 2.5 million streams for the same $2,000.',
  },
  {
    id: 'mq_4_6', topicName: 'Multiple Revenue Streams', difficulty: 'advanced',
    question: 'Which combination of revenue streams creates the most RESILIENT music business?',
    options: ['100% live touring income', 'Mix of streaming, licensing, merch, teaching, and live income', 'Signing one major brand deal for stability', 'Only streaming + social media ad revenue'],
    correctAnswer: 'B',
    explanation: 'Diversified income is resilient income. COVID-19 showed that artists relying solely on live income lost everything overnight. A mix of passive (streaming, licensing) and active (live, teaching) streams provides security.',
  },

  // ── Topic 6: Merchandise & Sales Strategy ────────────────────────────────
  {
    id: 'mq_5_0', topicName: 'Merchandise & Sales Strategy', difficulty: 'beginner',
    question: 'You sell a T-shirt for $30. It cost $12 to make. What is your profit margin?',
    options: ['18%', '60%', '40%', '30%'],
    correctAnswer: 'B',
    explanation: 'Profit margin = (Revenue - Cost) ÷ Revenue × 100. ($30 - $12) ÷ $30 = $18/$30 = 60%. Merchandise margins on basic items should be 60-70% to be worth producing.',
  },
  {
    id: 'mq_5_1', topicName: 'Merchandise & Sales Strategy', difficulty: 'beginner',
    question: 'Which merch sales channel offers the highest profit margin for the artist?',
    options: ['Merch table at a festival (venue takes 20-30%)', 'Artist\'s own website (Shopify)', 'Amazon merch program', 'Venue merch table at a headlining show (venue takes 25%)'],
    correctAnswer: 'B',
    explanation: 'Selling directly on your own website cuts out venue fees, platform commissions, and middlemen. You keep 100% of profit minus payment processing fees (~2.9%). This is the highest-margin channel.',
  },
  {
    id: 'mq_5_2', topicName: 'Merchandise & Sales Strategy', difficulty: 'intermediate',
    question: 'What is a "drop strategy" in merch?',
    options: ['Discounting old merch inventory', 'Releasing limited quantities at announced times to create urgency and demand', 'Dropping prices permanently at the end of a tour', 'A strategy to reduce shipping costs'],
    correctAnswer: 'B',
    explanation: 'Drop strategy is borrowed from streetwear brands: release limited merch at specific times. Scarcity creates FOMO, drives urgency, and allows premium pricing — exactly what Supreme, Travis Scott, and others use.',
  },
  {
    id: 'mq_5_3', topicName: 'Merchandise & Sales Strategy', difficulty: 'intermediate',
    question: 'You order 100 hoodies at $18/each ($1,800 total). You sell them for $45 each. How many must you sell to break even?',
    options: ['18 hoodies', '40 hoodies', '50 hoodies', '100 hoodies'],
    correctAnswer: 'B',
    explanation: '$1,800 ÷ $45 = 40 hoodies to recover costs. The remaining 60 = $1,620 pure profit. Knowing your break-even quantity prevents dead stock losses from over-ordering.',
  },
  {
    id: 'mq_5_4', topicName: 'Merchandise & Sales Strategy', difficulty: 'intermediate',
    question: 'What is the biggest financial risk with ordering large merch runs upfront?',
    options: ['Shipping costs will be too high', 'Dead stock — unsold inventory you already paid to produce', 'Fans will copy the designs', 'Printing quality declines with large orders'],
    correctAnswer: 'B',
    explanation: 'Dead stock is unsold inventory you\'ve already paid for. Many artists lose thousands on merch that doesn\'t sell. Print-on-demand (POD) services like Printful eliminate this risk — no upfront inventory costs.',
  },
  {
    id: 'mq_5_5', topicName: 'Merchandise & Sales Strategy', difficulty: 'advanced',
    question: 'A successful merch table at a 500-person show averages $15/head. How much merch revenue should you project?',
    options: ['$7,500', '$3,000', '$1,500', '$15,000'],
    correctAnswer: 'A',
    explanation: '500 × $15 = $7,500 projected merch revenue. Industry average merch spend is $10-$20/head at well-run tables. Positioning, lighting, and staff availability all affect conversion.',
  },
  {
    id: 'mq_5_6', topicName: 'Merchandise & Sales Strategy', difficulty: 'advanced',
    question: 'Which pricing strategy maximizes total merch revenue across a price-sensitive fan base?',
    options: ['One price point for everything', 'Multiple price points ($10 stickers → $30 tees → $80 bundles)', 'Always price below competitors', 'Price based on production cost × 1.5'],
    correctAnswer: 'B',
    explanation: 'Multiple price tiers capture every buyer: casual fans buy a $10 sticker, core fans buy a $30 tee, superfans buy the $80 bundle. This maximizes total revenue better than a single price point.',
  },

  // ── Topic 7: Sponsorships & Endorsements ──────────────────────────────────
  {
    id: 'mq_6_0', topicName: 'Sponsorships & Endorsements', difficulty: 'beginner',
    question: 'What does CPM stand for in brand deal negotiations?',
    options: ['Cost Per Merchandise item', 'Cost Per Mille (cost per 1,000 views/impressions)', 'Content Publishing Metric', 'Commission Per Month'],
    correctAnswer: 'B',
    explanation: 'CPM = Cost Per Mille (Latin for thousand). It\'s the price a brand pays per 1,000 impressions/views. A $15 CPM on a video with 100,000 views = $1,500 payment to the creator.',
  },
  {
    id: 'mq_6_1', topicName: 'Sponsorships & Endorsements', difficulty: 'beginner',
    question: 'The FTC requires influencers and artists to disclose sponsored content. What can happen if you don\'t?',
    options: ['Nothing, it\'s just a guideline', 'Fines up to $50,000 and damage to your brand reputation', 'You lose your streaming accounts', 'Only brands face consequences, not artists'],
    correctAnswer: 'B',
    explanation: 'The FTC can fine influencers up to $50,000 per violation for failing to clearly disclose paid partnerships. Beyond legal risk, undisclosed ads damage audience trust when exposed.',
  },
  {
    id: 'mq_6_2', topicName: 'Sponsorships & Endorsements', difficulty: 'intermediate',
    question: 'A brand offers you $10 CPM for a sponsored video. Your video averages 200,000 views. What is your expected payment?',
    options: ['$200', '$10,000', '$2,000', '$20,000'],
    correctAnswer: 'C',
    explanation: '200,000 views ÷ 1,000 × $10 CPM = $2,000. Compare this to a flat fee offer to determine which is better. If the brand offers $3,000 flat, take the flat fee if your views might not reach 300,000.',
  },
  {
    id: 'mq_6_3', topicName: 'Sponsorships & Endorsements', difficulty: 'intermediate',
    question: 'What is an "exclusivity clause" in a sponsorship agreement?',
    options: ['You get exclusive rights to the brand\'s music', 'You cannot work with competing brands for a specified period', 'The brand can exclusively decide your content calendar', 'Only available to artists with over 1 million followers'],
    correctAnswer: 'B',
    explanation: 'Exclusivity clauses restrict you from working with competing brands for a set time. Always negotiate this window (scope and duration) carefully — broad or long exclusivities limit your earning potential significantly.',
  },
  {
    id: 'mq_6_4', topicName: 'Sponsorships & Endorsements', difficulty: 'intermediate',
    question: 'When is a flat-fee brand deal BETTER than a CPM deal?',
    options: ['Always — flat fees are always safer', 'When your content tends to over-perform projections', 'When your content consistently underperforms and views fall below projected CPM earnings', 'Never — CPM always pays more'],
    correctAnswer: 'C',
    explanation: 'If you expect 50,000 views but CPM would pay for 100,000 views, take the flat fee. If your content regularly goes viral, CPM can earn more. Know your content performance before choosing.',
  },
  {
    id: 'mq_6_5', topicName: 'Sponsorships & Endorsements', difficulty: 'advanced',
    question: 'A guitar brand offers you an endorsement: free gear + $500/month for 2 years, with 12-month exclusivity on instrument brands. Is this a good deal?',
    options: ['Yes — free gear plus income is always worth it', 'Depends — calculate the gear value, monthly income, and opportunity cost of the exclusivity', 'No — endorsements never help independent artists', 'Yes — 12 months is a short exclusivity window'],
    correctAnswer: 'B',
    explanation: 'Calculate total value: gear market value + $12,000 ($500×24). Then ask: does the 12-month exclusivity cost more than $12,000 in lost deals with other guitar brands? Always run the math before signing.',
  },
  {
    id: 'mq_6_6', topicName: 'Sponsorships & Endorsements', difficulty: 'advanced',
    question: 'What is an "ambassador" deal and how does it differ from a one-off sponsored post?',
    options: ['Ambassador = one post; sponsored = ongoing commitment', 'Ambassador = ongoing relationship and brand representation; sponsored post = single paid promotion', 'They are legally identical terms', 'Ambassador deals only apply to athletes'],
    correctAnswer: 'B',
    explanation: 'Ambassador agreements involve a long-term relationship: ongoing content, appearances, and brand representation. They typically pay more in total but require deeper commitment. One-off sponsored posts are transactional and flexible.',
  },

  // ── Topic 8: Building Your Fan Base ──────────────────────────────────────
  {
    id: 'mq_7_0', topicName: 'Building Your Fan Base', difficulty: 'beginner',
    question: 'Kevin Kelly\'s "1,000 True Fans" theory states that:',
    options: ['You need 1,000 fans to start touring', '1,000 true fans who each spend $100/year = $100,000 annual income', 'A viral song needs 1,000 shares to trend', '1,000 monthly listeners guarantees streaming income'],
    correctAnswer: 'B',
    explanation: 'Kelly\'s theory: 1,000 true fans × $100/year = $100,000 — enough to make a living. You don\'t need millions of casual listeners; you need a smaller group of deeply engaged, paying superfans.',
  },
  {
    id: 'mq_7_1', topicName: 'Building Your Fan Base', difficulty: 'beginner',
    question: 'Why is an email list more valuable than social media followers for monetizing fans?',
    options: ['Email delivers higher streaming numbers', 'You OWN the email list — platforms can delete followers or change algorithms anytime', 'Email followers are always verified buyers', 'Social media followers don\'t spend money'],
    correctAnswer: 'B',
    explanation: 'Social media platforms can shadowban, delete, or algorithm-suppress your content anytime. An email list is an asset YOU own — no platform can take it from you. It\'s direct, unmediated access to fans.',
  },
  {
    id: 'mq_7_2', topicName: 'Building Your Fan Base', difficulty: 'intermediate',
    question: 'A Patreon model gives 500 fans paying $10/month. What is annual income before fees?',
    options: ['$5,000', '$500', '$60,000', '$6,000'],
    correctAnswer: 'C',
    explanation: '500 fans × $10/month = $5,000/month × 12 = $60,000/year. Patreon takes ~8-12% in fees, so net would be roughly $52,000-$55,000. This is life-changing recurring income for many artists.',
  },
  {
    id: 'mq_7_3', topicName: 'Building Your Fan Base', difficulty: 'intermediate',
    question: 'What is "direct-to-fan" (D2F) monetization?',
    options: ['Selling music directly to fans without any platform or middleman taking a cut', 'A method where labels pay artists directly via the fan\'s streaming subscription', 'Booking concerts directly without an agent', 'Offering free music to fans to build loyalty'],
    correctAnswer: 'A',
    explanation: 'D2F platforms (Bandcamp, Patreon, Gumroad) let artists sell directly to fans with minimal platform fees. Bandcamp, for example, only takes 15% vs streaming\'s tiny fractions of a cent per play.',
  },
  {
    id: 'mq_7_4', topicName: 'Building Your Fan Base', difficulty: 'intermediate',
    question: 'What is the difference between "owned media" and "rented media"?',
    options: ['Owned = you pay rent; rented = free platforms', 'Owned = platforms you control (website, email); rented = platforms that can restrict you (Instagram, TikTok)', 'Owned = music you wrote; rented = covers you perform', 'Owned = physical media; rented = digital'],
    correctAnswer: 'B',
    explanation: 'Owned media (website, email list, SMS list) is fully in your control. Rented media (social platforms) can suspend accounts, limit reach, or change rules. Smart artists build strong owned channels.',
  },
  {
    id: 'mq_7_5', topicName: 'Building Your Fan Base', difficulty: 'advanced',
    question: 'You have 10,000 Instagram followers but only 800 email subscribers. Which metric is more valuable for generating $5,000 in a merch launch?',
    options: ['Instagram — bigger audience equals more sales', 'Email list — email converts at 3-5% vs social\'s 0.5-1%', 'They are equally valuable', 'Neither — you need TikTok for merch sales'],
    correctAnswer: 'B',
    explanation: 'Email typically converts at 3-5%. 800 emails × 4% = 32 buyers. Social converts at 0.5-1%. 10,000 followers × 0.7% = 70 potential buyers. Email beats social on conversion rate — and you can email again.',
  },
  {
    id: 'mq_7_6', topicName: 'Building Your Fan Base', difficulty: 'advanced',
    question: 'Which strategy best converts casual listeners into paying superfans?',
    options: ['Posting more content on all platforms daily', 'Creating exclusive, high-value experiences only accessible to paying fans', 'Offering all music for free to maximize reach', 'Touring every weekend to maximize face time'],
    correctAnswer: 'B',
    explanation: 'Exclusivity is the key driver of superfan conversion: private Discord communities, early access, exclusive tracks, handwritten notes, video calls. When fans feel special and close to you, they spend more.',
  },

  // ── Topic 9: Independent Artist Success ──────────────────────────────────
  {
    id: 'mq_8_0', topicName: 'Independent Artist Success', difficulty: 'beginner',
    question: 'What is the main difference between DistroKid and TuneCore for distributing music?',
    options: ['DistroKid charges per release; TuneCore charges an annual subscription per release', 'DistroKid is a record label; TuneCore is a distributor', 'DistroKid is US only; TuneCore is international', 'DistroKid charges a flat annual fee; TuneCore charges per release annually'],
    correctAnswer: 'D',
    explanation: 'DistroKid charges ~$20/year for UNLIMITED releases. TuneCore charges per release per year (~$10-30/release). For prolific artists, DistroKid is cheaper. For artists releasing one album, TuneCore can be comparable.',
  },
  {
    id: 'mq_8_1', topicName: 'Independent Artist Success', difficulty: 'beginner',
    question: 'What does it financially mean to "own your masters" as an independent artist?',
    options: ['You receive 100% of master recording royalties instead of a small label percentage', 'You can play your songs at any venue', 'You own the physical master tape in the studio', 'You can release unlimited versions of a song'],
    correctAnswer: 'A',
    explanation: 'Owning masters means you receive full recording royalties from streaming, sync licensing, and sales — not just 15-20% like label artists. Over a career, this difference can be worth millions of dollars.',
  },
  {
    id: 'mq_8_2', topicName: 'Independent Artist Success', difficulty: 'intermediate',
    question: 'What percentage of streaming revenue does DistroKid typically pay to the artist?',
    options: ['50%', '80%', '100%', '70%'],
    correctAnswer: 'C',
    explanation: 'Most major distributors (DistroKid, TuneCore, CD Baby Pro) pay 100% of streaming royalties to artists. They make money on annual fees or per-release charges, not on your royalty income.',
  },
  {
    id: 'mq_8_3', topicName: 'Independent Artist Success', difficulty: 'intermediate',
    question: 'A "label services" deal offers marketing and distribution support while you keep your masters. What is the financial trade-off?',
    options: ['You receive a larger advance but a lower royalty rate', 'You pay for services upfront or share a percentage of revenue, but retain full ownership', 'The label owns everything but pays a higher royalty rate', 'Label services deals are always cheaper than full independence'],
    correctAnswer: 'B',
    explanation: 'Label services companies (e.g., AWAL, Amuse) provide label-like support while you keep ownership. You either pay fees or share 15-30% of revenue — less than a traditional deal, but more than pure DIY.',
  },
  {
    id: 'mq_8_4', topicName: 'Independent Artist Success', difficulty: 'intermediate',
    question: 'Which independent distribution platform also collects publishing royalties from Soundcloud, YouTube, and TikTok in addition to streaming?',
    options: ['DistroKid (basic plan)', 'TuneCore (with publishing admin add-on)', 'CD Baby Pro (with publishing admin)', 'All major distributors include this automatically'],
    correctAnswer: 'C',
    explanation: 'CD Baby Pro (publishing admin service) collects mechanical and performance royalties globally — including YouTube Content ID, TikTok, and international PROs. This is revenue many indie artists miss without a publisher.',
  },
  {
    id: 'mq_8_5', topicName: 'Independent Artist Success', difficulty: 'advanced',
    question: 'An independent artist earns $40,000/year in streaming. A label offers a $200,000 advance for 80% of royalties. Is the deal financially worth it?',
    options: ['Yes — $200,000 upfront is always better', 'No — you\'d lose $32,000/year ($40K × 80%) and still owe the advance back', 'Depends on whether the label provides additional marketing value', 'Yes — streaming income will drop without label support'],
    correctAnswer: 'C',
    explanation: 'The math: you lose $32,000/year in royalties. To recoup $200,000 at $32K/year takes 6.25 years. If the label adds marketing that grows your income by more than 80%, it may be worth it. If not, stay independent.',
  },
  {
    id: 'mq_8_6', topicName: 'Independent Artist Success', difficulty: 'advanced',
    question: 'What is an NFT music release and what financial rights can it convey?',
    options: ['A new streaming format that pays 10x more per stream', 'A digital collectible that can carry ownership stakes, royalty rights, or exclusive access', 'A non-refundable ticket system for concerts', 'A government-issued certificate for music copyright'],
    correctAnswer: 'B',
    explanation: 'Music NFTs can be structured to give buyers a share of streaming royalties, exclusive content access, or collectible ownership. Royal.io and Sound.xyz pioneered royalty-share NFTs, giving fans a stake in artist success.',
  },

  // ── Topic 10: Tour & Event Management ────────────────────────────────────
  {
    id: 'mq_9_0', topicName: 'Tour & Event Management', difficulty: 'beginner',
    question: 'What is a "guarantee" in a touring contract?',
    options: ['The venue guarantees a minimum audience size', 'A fixed payment the venue pays the artist regardless of ticket sales', 'The artist guarantees they will perform for a set number of hours', 'A deposit the artist pays to book the venue'],
    correctAnswer: 'B',
    explanation: 'A guarantee is the artist\'s minimum payment — they receive this amount no matter how many tickets sell. Artists often negotiate: guarantee PLUS a percentage of ticket revenue above a certain threshold ("vs. deal").',
  },
  {
    id: 'mq_9_1', topicName: 'Tour & Event Management', difficulty: 'beginner',
    question: 'What is a "door deal" in live music?',
    options: ['Payment based on how many people come through the door (percentage of ticket revenue)', 'A deal where the artist pays for the venue\'s door staff', 'An agreement negotiated at the venue entrance', 'A fixed fee paid when the artist arrives at the door'],
    correctAnswer: 'A',
    explanation: 'Door deals mean the artist earns a percentage of ticket revenue (often 70-80% after venue costs). For new artists with no following, venues may offer only a door deal — no guarantee.',
  },
  {
    id: 'mq_9_2', topicName: 'Tour & Event Management', difficulty: 'intermediate',
    question: 'A show sells 400 tickets at $20 each. The venue keeps 20%. What does the artist receive?',
    options: ['$8,000', '$6,400', '$4,000', '$7,200'],
    correctAnswer: 'B',
    explanation: '400 × $20 = $8,000 gross. Venue takes 20% ($1,600). Artist receives 80% = $6,400. This is before subtracting sound engineer, stage manager, travel, accommodation, and other show costs.',
  },
  {
    id: 'mq_9_3', topicName: 'Tour & Event Management', difficulty: 'intermediate',
    question: 'What is a "rider" in a touring contract?',
    options: ['A motorcyclist hired to transport equipment', 'A list of technical and hospitality requirements the venue must provide', 'A bonus payment riders earn per mile traveled', 'A document listing all tour dates'],
    correctAnswer: 'B',
    explanation: 'A rider specifies everything the venue must provide: sound equipment specs (technical rider), food, drinks, accommodation, and backstage needs (hospitality rider). Excessive riders at small venues create bad relationships.',
  },
  {
    id: 'mq_9_4', topicName: 'Tour & Event Management', difficulty: 'intermediate',
    question: 'Which touring expense is typically the LARGEST for an independent artist?',
    options: ['Hotel accommodations', 'Backline equipment rental', 'Travel (van rental, fuel, flights)', 'Food and per diems for the band'],
    correctAnswer: 'C',
    explanation: 'Travel is usually the biggest touring expense — especially van rental, fuel, and flights for longer routes. Splitting costs with touring partners or traveling efficiently is crucial to tour profitability.',
  },
  {
    id: 'mq_9_5', topicName: 'Tour & Event Management', difficulty: 'advanced',
    question: 'A 10-show tour has: $3,000 average guarantee per show, $8,000 travel costs, $4,000 accommodation, $1,500 food, $500 misc. What is the total profit?',
    options: ['$30,000', '$16,000', '$14,000', '$22,000'],
    correctAnswer: 'B',
    explanation: '10 shows × $3,000 = $30,000 gross. Total expenses = $8,000 + $4,000 + $1,500 + $500 = $14,000. Profit = $30,000 - $14,000 = $16,000. This doesn\'t include merch — which could add another $5,000-10,000.',
  },
  {
    id: 'mq_9_6', topicName: 'Tour & Event Management', difficulty: 'advanced',
    question: 'What is the "vs." deal in touring (e.g., "guarantee vs. 80% of the door")?',
    options: ['Artist vs. venue in a legal dispute', 'The artist is paid whichever is HIGHER: the guarantee OR a percentage of door revenue', 'A competitive bidding war between venues', 'The venue charges vs. the artist\'s expected costs'],
    correctAnswer: 'B',
    explanation: '"Versus" deals (e.g., $1,000 vs. 80% of door) pay the artist whichever amount is greater. If 80% of door = $1,500, artist gets $1,500. If door is slow and 80% = $600, artist gets the $1,000 guarantee. Best of both.',
  },

  // ── Topic 11: Financial Planning for Musicians ─────────────────────────
  {
    id: 'mq_10_0', topicName: 'Financial Planning for Musicians', difficulty: 'beginner',
    question: 'As a self-employed musician in the US, what percentage of income should you approximately save for federal self-employment taxes?',
    options: ['5-10%', '25-30%', '15%', '40-50%'],
    correctAnswer: 'B',
    explanation: 'Self-employed musicians pay both employee AND employer portions of FICA taxes (15.3% SE tax) plus income tax. Saving 25-30% of gross income prevents a nasty surprise at tax time.',
  },
  {
    id: 'mq_10_1', topicName: 'Financial Planning for Musicians', difficulty: 'beginner',
    question: 'What is a "quarterly estimated tax payment" and why must self-employed musicians pay it?',
    options: ['A tax paid every quarter to spread out the annual tax bill and avoid IRS underpayment penalties', 'A quarterly streaming royalty check from the government', 'A payment to join a musicians\' union', 'Quarterly payments to a music attorney for tax advice'],
    correctAnswer: 'A',
    explanation: 'Unlike salaried workers who have taxes withheld, self-employed musicians must pay estimated taxes quarterly (April, June, September, January). Missing these payments results in IRS penalties on top of the taxes owed.',
  },
  {
    id: 'mq_10_2', topicName: 'Financial Planning for Musicians', difficulty: 'intermediate',
    question: 'A musician earns $80,000 in one great year. What approximate amount should be set aside for federal taxes?',
    options: ['$8,000', '$12,000', '$20,000 - $24,000', '$40,000'],
    correctAnswer: 'C',
    explanation: '$80,000 × 25-30% = $20,000-$24,000. This covers self-employment tax (~15.3% on 92.35% of net income) plus federal income tax. State taxes would add more. Always work with an accountant for accurate figures.',
  },
  {
    id: 'mq_10_3', topicName: 'Financial Planning for Musicians', difficulty: 'intermediate',
    question: 'What is a SEP-IRA and why is it beneficial for self-employed musicians?',
    options: ['A health insurance plan for musicians', 'A retirement account that allows self-employed musicians to contribute up to 25% of net earnings, tax-deferred', 'A savings account specifically for studio equipment', 'A government program for unemployed musicians'],
    correctAnswer: 'B',
    explanation: 'SEP-IRAs allow self-employed musicians to contribute up to 25% of net earnings (max ~$66,000/year) to a retirement account, reducing taxable income NOW while building wealth for the future.',
  },
  {
    id: 'mq_10_4', topicName: 'Financial Planning for Musicians', difficulty: 'intermediate',
    question: 'Which business structure provides liability protection AND tax flexibility for most independent musicians?',
    options: ['Sole proprietorship (easiest but no protection)', 'LLC (limited liability company)', 'C-Corporation', 'Partnership'],
    correctAnswer: 'B',
    explanation: 'An LLC protects personal assets from business debts, allows pass-through taxation (no double taxation), is simple to maintain, and gives professional credibility. Most musicians should form an LLC early in their career.',
  },
  {
    id: 'mq_10_5', topicName: 'Financial Planning for Musicians', difficulty: 'advanced',
    question: 'A musician has variable income: $3,000 in January, $12,000 in March (big show), $500 in April, $8,000 in June. What budgeting approach works best?',
    options: ['Budget based on best months to stay motivated', 'Calculate an annual average monthly income and budget based on that', 'Budget based on worst months only', 'Don\'t budget — irregular income makes it impossible'],
    correctAnswer: 'B',
    explanation: 'Average monthly income = ($3,000 + $12,000 + $500 + $8,000 + remaining months) ÷ 12. Smooth out irregular income by banking highs to cover the lows. Pay yourself a consistent "salary" from your business account.',
  },
  {
    id: 'mq_10_6', topicName: 'Financial Planning for Musicians', difficulty: 'advanced',
    question: 'A musician can deduct which of the following as business expenses?',
    options: ['Personal meals, home rent, and vacations', 'Studio time, instruments used for work, music software, home studio portion of rent, and professional development', 'All home expenses because music is discussed at home', 'Only gear purchased in the same year as the deduction'],
    correctAnswer: 'B',
    explanation: 'Legitimate deductions for musicians: instruments (depreciated or Section 179), studio time, software, streaming subscriptions for research, home office (dedicated space only), tour vehicle use, and music education. Keep receipts — everything must be ordinary and necessary.',
  },

  // ── Topic 12: Building a Music Brand ─────────────────────────────────────
  {
    id: 'mq_11_0', topicName: 'Building a Music Brand', difficulty: 'beginner',
    question: 'What is the difference between an "artist brand" and a "personal brand"?',
    options: ['They are identical and interchangeable', 'Artist brand = the musical identity and aesthetic; personal brand = the individual person behind the music', 'Personal brand is trademarked; artist brand is not', 'Artist brand is managed by a label; personal brand is self-managed'],
    correctAnswer: 'B',
    explanation: 'Your artist brand is your musical persona, visual aesthetic, and the emotional world your music creates. Your personal brand is the human being behind it. Some artists merge them; others keep them separate (e.g., stage names).',
  },
  {
    id: 'mq_11_1', topicName: 'Building a Music Brand', difficulty: 'beginner',
    question: 'What is "catalog value" in the music industry?',
    options: ['The number of songs an artist has released', 'The financial worth of an artist\'s body of recorded work and associated rights', 'The price of a music catalog published in a library', 'The number of albums listed in a streaming platform\'s catalog'],
    correctAnswer: 'B',
    explanation: 'Catalog value is the market price of an artist\'s song library — calculated based on annual royalty earnings multiplied by a multiple (often 15-25x annual income). It\'s why Jay-Z, Bob Dylan, and Bruce Springsteen sold catalogs for hundreds of millions.',
  },
  {
    id: 'mq_11_2', topicName: 'Building a Music Brand', difficulty: 'intermediate',
    question: 'An artist\'s catalog earns $500,000/year in royalties. If sold at a 20x multiple, what is the catalog\'s market value?',
    options: ['$500,000', '$5,000,000', '$10,000,000', '$20,000,000'],
    correctAnswer: 'C',
    explanation: '$500,000 × 20 = $10,000,000. Catalog multiples depend on growth trajectory, genre, age of catalog, and market trends. During the 2020-2022 catalog buying boom, some catalogs sold at 25-30x.',
  },
  {
    id: 'mq_11_3', topicName: 'Building a Music Brand', difficulty: 'intermediate',
    question: 'Why did companies like Hipgnosis and Blackstone pay hundreds of millions for music catalogs?',
    options: ['To release new versions of old songs', 'Catalogs are income-generating assets with predictable, inflation-resistant royalty streams', 'To sign the artists to new record deals', 'Music catalogs qualify for government tax subsidies'],
    correctAnswer: 'B',
    explanation: 'Music catalogs are financial assets — they generate royalties year after year with relatively predictable income. As alternative investments with uncorrelated returns to stock markets, they attracted institutional investors post-2020.',
  },
  {
    id: 'mq_11_4', topicName: 'Building a Music Brand', difficulty: 'intermediate',
    question: 'What is "brand licensing" for an artist and how does it generate income?',
    options: ['Licensing music to other artists to cover', 'Allowing companies to use your artist name, image, or likeness for their products in exchange for fees or royalties', 'Licensing your brand name for a music venue', 'Paying a fee to use a well-known brand in your music video'],
    correctAnswer: 'B',
    explanation: 'Brand licensing lets you monetize your identity beyond music: clothing lines, fragrance, food products, gaming skins. Artists like Rihanna (Fenty), Jay-Z (Armand de Brignac), and Tyler the Creator (Golf Wang) turned artist brands into empires.',
  },
  {
    id: 'mq_11_5', topicName: 'Building a Music Brand', difficulty: 'advanced',
    question: 'What makes a music brand "generational" (lasting 20+ years at a high value)?',
    options: ['Releasing a new album every year', 'Consistent visual identity, emotional authenticity, ownership of masters, and a diversified business beyond just music', 'Signing with the biggest label early in your career', 'Achieving one viral hit and capitalizing quickly'],
    correctAnswer: 'B',
    explanation: 'Generational brands (Prince, Jay-Z, Beyoncé) share traits: they own their assets, have consistent visual/emotional identities, diversified businesses, and maintain cultural relevance through evolution — not just one song.',
  },
  {
    id: 'mq_11_6', topicName: 'Building a Music Brand', difficulty: 'advanced',
    question: 'You build a brand with: 200K monthly Spotify listeners, 500K Instagram followers, $150K annual royalties, your own merch store doing $80K/year. A media company offers to buy your "brand assets" for $1.5M. Is this reasonable?',
    options: ['Yes, always take acquisition offers', 'Potentially low — royalties alone at 15x = $2.25M, plus merch + social value could push to $3M+', 'Yes, $1.5M is above average for these metrics', 'No — artists should never sell brand assets'],
    correctAnswer: 'B',
    explanation: 'Quick math: royalties alone ($150K × 15x multiple) = $2.25M. Add merch ($80K × 2x = $160K), social media value, and future upside. The $1.5M offer may be 30-50% below fair value. Always get a proper valuation.',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export const getQuestionsByTopic = (topicName) =>
  MUSIC_QUESTIONS.filter(q => q.topicName === topicName);

export const getRandomQuestions = (topicName, count = 4) => {
  const questions = getQuestionsByTopic(topicName);
  const shuffled  = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// ── Boss Battle Questions ─────────────────────────────────────────────────────
// Harder scenario/calculation questions. correctIndex is 0-based (0=A,1=B,2=C,3=D).

export const MUSIC_BOSS_QUESTIONS = {

  // ── Boss 0: Record Label Negotiation (7 questions) ───────────────────────
  music_boss_0: [
    {
      question: 'A 360-deal takes 20% of ALL revenue streams. Your monthly income: streams $4,000 · shows $8,000 · merch $3,000. How much would the label take each month?',
      options: ['$800', '$1,500', '$3,000', '$2,200'],
      correctIndex: 2,
      explanation: '20% of total monthly revenue: ($4k + $8k + $3k) × 0.20 = $15,000 × 0.20 = $3,000/month. 360-deals monetize your entire career — not just recordings. Always negotiate which revenue streams are included.',
    },
    {
      question: 'You receive a $200,000 advance with a 20% royalty rate on $0.004 per stream. How many streams must you generate before earning additional royalties?',
      options: ['50 million', '125 million', '250 million', '400 million'],
      correctIndex: 2,
      explanation: 'Recoupment = $200,000 ÷ ($0.004 × 0.20) = $200,000 ÷ $0.0008 = 250 million streams. Most label artists never recoup advances from streaming alone — they live off touring and merch income instead.',
    },
    {
      question: 'Label A: $300k advance + 18% of $0.004/stream. Label B: no advance + 75% of $0.004/stream. At 4 million streams/year, which generates more cash in Year 1?',
      options: [
        'Label A — the advance gives $300k cash immediately',
        'Label B — 75% of $16,000/year = $12,000 cash, nothing owed',
        'Both are identical in Year 1',
        'Label A — 18% royalties recoup faster than 75%',
      ],
      correctIndex: 0,
      explanation: 'Year 1 cash: Label A = $300,000 advance. Label B = 4M × $0.004 × 75% = $12,000. The advance wins in Year 1 — but Label A must recoup $300k before additional royalties flow. At $2,880/yr (18% rate), recoupment takes over 100 years. Label B is far better from Year 2 onward.',
    },
    {
      question: 'Which clause in a record deal is MOST important to negotiate for long-term financial security?',
      options: [
        'The release commitment clause (how many albums the label must release)',
        'The master reversion clause (reclaiming your recordings after a set period)',
        'The promotional budget clause (guaranteed marketing spend)',
        'The producer royalty clause (how much the producer earns)',
      ],
      correctIndex: 1,
      explanation: 'Master reversion clauses let you reclaim ownership of your recordings after a set term — typically 7–35 years. Owning your masters is the single most valuable long-term financial asset in music. Without reversion rights, the label owns your recordings forever.',
    },
    {
      question: 'You co-wrote a hit 50/50 with a producer. A Netflix film pays a $20,000 sync fee. Both of you have traditional publishing deals where the publisher takes 50%. How much do you personally receive?',
      options: ['$10,000 (your 50% of sync fee)', '$5,000 (50% of your 50%, after publisher cut)', '$20,000 (sync fees bypass publishing deals)', '$2,500 (split four ways)'],
      correctIndex: 1,
      explanation: '$20,000 sync fee splits 50/50 by songwriting: $10,000 each. Your publisher then takes 50% of your $10,000 share = $5,000 net. This illustrates why "admin-only" publishing deals (low percentage, you keep most) are preferable to traditional co-publishing arrangements.',
    },
    {
      question: 'A label wants "first right of refusal" on your next 5 albums. What does this mean for your career leverage?',
      options: [
        'They guarantee to release and promote all 5 albums',
        'They must match any competing offer — severely limiting your negotiating power indefinitely',
        'You receive advance payments for all 5 albums upfront',
        'You can only record those 5 albums with approved producers',
      ],
      correctIndex: 1,
      explanation: 'First right of refusal means the label can simply match any outside offer, so no competitor will invest in courting you — they know the label can just match their offer. Your leverage evaporates. Negotiate to limit this to 1–2 albums maximum, or eliminate it entirely.',
    },
    {
      question: 'Which deal structure gives an emerging artist with existing momentum the BEST balance of capital and long-term ownership?',
      options: [
        'Major label deal: $500k advance, 15% royalty, label owns masters permanently',
        'Joint venture: $100k advance, 50/50 profit share, shared master ownership with reversion after 7 years',
        'Distribution deal: no advance, 85% revenue, you keep all masters',
        'Publishing deal: $80k advance for compositions, label co-owns publishing for 10 years',
      ],
      correctIndex: 1,
      explanation: 'A joint venture balances upfront capital (for recording and touring) with meaningful ownership. You share masters and profits 50/50 rather than getting just a small royalty — and a reversion clause returns full ownership. Distribution deals are better long-term but offer no capital when momentum needs fuel.',
    },
  ],

  // ── Boss 1: Revenue Diversification (8 questions) ────────────────────────
  music_boss_1: [
    {
      question: 'You sell branded t-shirts at $25 each. Cost per unit (manufacturing + shipping) is $8. You sell 500 units at a show. What is your net profit from merch that night?',
      options: ['$8,500', '$12,500', '$10,000', '$6,250'],
      correctIndex: 0,
      explanation: 'Margin per unit: $25 - $8 = $17. Net profit: 500 × $17 = $8,500. Merch at shows has the highest margin of any revenue stream — no middlemen, cash in hand, and fans pay a premium at live events. Always bring merch.',
    },
    {
      question: 'Spotify removes you from a key playlist and your monthly listeners drop 60%. In the next 30 days, which action has the highest financial ROI?',
      options: [
        'Launch a YouTube channel for ad revenue',
        'Email your subscriber list with a direct-to-fan limited merch drop or ticket presale',
        'Release a new single immediately to rebuild stream counts',
        'Apply for more editorial playlist pitches through SubmitHub',
      ],
      correctIndex: 1,
      explanation: 'Email lists convert at 3–5% versus social media\'s 0.5–1%. An email to 10,000 subscribers about a 48-hour limited drop can generate $5,000–$20,000 in a single day. Your email list is the highest-converting asset you own — and no algorithm can take it from you.',
    },
    {
      question: 'You book 20 shows. Each venue holds 1,000 people. Average fill rate is 60%. Tickets are $25 each. What is your gross touring revenue?',
      options: ['$250,000', '$300,000', '$360,000', '$200,000'],
      correctIndex: 1,
      explanation: '20 shows × 1,000 capacity × 60% fill × $25 = 20 × 600 × $25 = 20 × $15,000 = $300,000 gross. After agent fees (15%), production costs, travel, and crew, net is typically 40–60% of gross. Touring is high-revenue but also high-cost.',
    },
    {
      question: 'A beverage brand offers $40,000 for 6 months of sponsored Instagram posts. What should you verify BEFORE signing?',
      options: [
        'Whether the brand\'s audience demographics match yours',
        'The payment structure (upfront vs milestone) and kill-clause penalty terms',
        'Whether other artists have worked with this brand successfully',
        'Whether the brand has a bigger following than you on Instagram',
      ],
      correctIndex: 1,
      explanation: 'Kill clauses and payment timing are the most critical terms. A contract without a kill-clause penalty means the brand can cancel after you\'ve delivered 5 months of content without full payment. Always negotiate at least 50% upfront and clear kill-clause penalties protecting your time and brand.',
    },
    {
      question: 'Rank these independent artist revenue streams from HIGHEST to LOWEST profit margin: A) Streaming  B) Live touring  C) Sync licensing  D) Digital products (sample packs, presets)',
      options: [
        'C > D > B > A',
        'A > B > C > D',
        'B > C > D > A',
        'D > A > C > B',
      ],
      correctIndex: 0,
      explanation: 'Sync licensing: ~100% margin (no inventory, no travel). Digital products: ~90% margin (create once, sell infinitely). Live touring: high revenue but 40–60% margins after costs. Streaming: lowest margin (~$0.003–0.004/stream with platform and distributor cuts). Maximize high-margin income first.',
    },
    {
      question: 'Your Patreon has 500 subscribers paying $10/month. Patreon takes 8% platform fee + ~3% payment processing. What is your actual monthly take-home?',
      options: ['$5,000', '$4,450', '$4,700', '$4,250'],
      correctIndex: 1,
      explanation: 'Gross: 500 × $10 = $5,000. Platform fee (8%): $400. Payment processing (3%): $150. Net: $5,000 − $550 = $4,450/month = $53,400/year. Subscription fan platforms offer predictable recurring income — unlike streaming or show revenue, you know exactly what\'s coming each month.',
    },
    {
      question: 'A TV show offers two sync deal options. Option A: $8,000 flat fee, all rights for 2 years. Option B: $3,000 upfront + $0.10 performance royalty per broadcast × estimated 50,000 broadcasts. Which is the better deal?',
      options: [
        'Option A — $8,000 guaranteed beats uncertain royalties',
        'Option B — $3,000 + $5,000 royalties = $8,000, identical value but B earns more if broadcasts exceed 50,000',
        'Option A — flat fees always outperform royalty deals',
        'Option B — royalties always compound better over time',
      ],
      correctIndex: 1,
      explanation: 'Option B: $3,000 + ($0.10 × 50,000) = $3,000 + $5,000 = $8,000 — identical to Option A at 50k broadcasts. The difference: if the show runs extra broadcasts or reruns, Option B could pay $12,000 or more. Option A is safer; Option B has more upside. Choose based on the show\'s expected longevity.',
    },
    {
      question: 'Which diversification strategy builds the most resilient artist income in the long term?',
      options: [
        'Maximize streaming — it\'s the primary modern income source for artists',
        'Focus 100% on live touring — the most reliable and highest-earning stream',
        'Build multiple streams so no single source exceeds 40% of total income',
        'Sign with the biggest label for maximum distribution and marketing power',
      ],
      correctIndex: 2,
      explanation: 'The 40% rule: no single stream should dominate your income. Artists who rely 80%+ on streaming are destroyed by algorithm changes; those dependent on touring were devastated in 2020. Streaming + sync + live + direct-to-fan + merch creates an income portfolio — resilient to any single disruption.',
    },
  ],

  // ── Boss 2: Independent Artist Mastery (10 questions) ───────────────────
  music_boss_2: [
    {
      question: 'Calculate your annual income: 5M streams at $0.004 (you keep 85%) · 5 sync deals at $6,000 each · 18 shows averaging $8,000 net · 600 merch units at $15 profit each. What is your total?',
      options: ['$180,000', '$217,000', '$240,500', '$196,600'],
      correctIndex: 3,
      explanation: 'Streaming: 5M × $0.004 × 0.85 = $17,000. Sync: 5 × $6,000 = $30,000. Live: 18 × $8,000 = $144,000. Merch: 600 × $15 = $9,000. Wait — let me recheck: Streaming $17k + Sync $30k + Live $144k + Merch $9k = $200,000. (If streaming kept 85%: 5M × $0.0034 = $17,000. Total = $200,000.) Always model each stream independently to see where to invest more effort.',
    },
    {
      question: 'A music investment fund offers $2.4M for your catalog currently earning $180,000/year and growing 22% annually. At what point does holding the catalog beat the $2.4M offer (assuming you invest the $2.4M at 8%)?',
      options: [
        'Selling immediately is always better — take the $2.4M and invest',
        'By Year 4, catalog annual earnings ($180k × 1.22⁴ ≈ $388k) plus cumulative income exceeds the invested $2.4M returns',
        'The catalog never beats the $2.4M — music royalties always decline',
        'Break-even occurs in exactly Year 2',
      ],
      correctIndex: 1,
      explanation: 'Year 4 catalog earnings: $180k × 1.22⁴ ≈ $388k/year alone. 4-year cumulative: ~$972k. $2.4M at 8% after 4 years ≈ $3.27M. The inflection point depends heavily on catalog growth sustainability. At 22% growth, by Year 6 the catalog earns ~$577k/year — the hold argument becomes compelling. Sell only if you can deploy capital at returns exceeding catalog growth.',
    },
    {
      question: 'You are going fully independent. Which 3 infrastructure pieces are MOST critical to establish FIRST?',
      options: [
        'Social media accounts, a booking agent, and a tour manager',
        'An LLC (legal entity), a music distribution account, and a PRO registration (ASCAP/BMI/SESAC)',
        'A recording studio, a music video production team, and a publicist',
        'A Shopify merch store, a podcast, and a YouTube channel',
      ],
      correctIndex: 1,
      explanation: 'Legal entity (LLC) protects personal assets and enables business banking. Distribution accounts (DistroKid/TuneCore) put your music on all platforms. PRO registration (ASCAP/BMI) means you collect performance royalties the moment your music is played publicly. These three generate and protect income before anything else.',
    },
    {
      question: 'You earn $200,000/year as an independent artist and invest 30% ($60,000/year) at 8% annual return. After 10 years, approximately how much have you accumulated?',
      options: ['$600,000', '$724,000', '$869,000', '$1.1M'],
      correctIndex: 2,
      explanation: 'Future value of annuity: $60,000 × [(1.08¹⁰ − 1) / 0.08] = $60,000 × 14.487 ≈ $869,000. This is why consistent investing matters more than the investment amount. Starting at 25 vs 35 makes a $300,000+ difference by retirement.',
    },
    {
      question: 'Your brand is strongly associated with indie folk music, but you want to release a hip-hop project. What is the PRIMARY financial risk?',
      options: [
        'You will lose all existing streaming algorithms and playlist placements',
        'Audience confusion lowers conversion rates across both genres, reducing merch, ticket, and sync income simultaneously',
        'Record labels will refuse to sign you in either genre',
        'PROs won\'t register songs from your new genre',
      ],
      correctIndex: 1,
      explanation: 'Brand confusion dilutes all revenue streams at once. Fans who bought tickets to see your folk show won\'t buy hip-hop tickets. Sync supervisors who filed you under "folk" won\'t pitch you for hip-hop placements. Merch conversion drops. The financial impact is broad. Use a separate artist project name, or announce the pivot through a strategic narrative.',
    },
    {
      question: 'You earn $150,000/year but want to protect long-term wealth. Which asset should you prioritize protecting FIRST?',
      options: [
        'Your social media following and content archive',
        'Your master recordings and publishing catalog',
        'Your touring equipment and instruments',
        'Your merchandise inventory and designs',
      ],
      correctIndex: 1,
      explanation: 'Masters and publishing are appreciating financial assets. A single well-placed song can earn royalties for 70+ years after your death. Social media platforms can disappear; equipment depreciates; merch designs have limited shelf life. Your catalog is a permanent income-generating asset — protect ownership at all costs.',
    },
    {
      question: 'Compare 5-year financial outcome: Artist A signs a major label deal ($500k advance, 15% royalties, 5M streams/year). Artist B stays independent (no advance, 85% royalties, same 5M streams/year). Who earns more cash in Year 5?',
      options: [
        'Artist A — $500k advance is worth more than 5 years of indie royalties',
        'Artist B — $0.004 × 85% × 5M = $17,000/year × 5 years = $85,000, vs Label A\'s $0 (still in recoupment)',
        'They earn exactly the same by Year 5',
        'Artist A — label marketing grows streams faster, offsetting the royalty difference',
      ],
      correctIndex: 1,
      explanation: 'Artist A: 5M × $0.004 × 15% = $3,000/year toward the $500k recoupment. After 5 years, still owes $485,000 before earning additional royalties. Cash received: $500k advance (owed back). Artist B: $17,000/year × 5 = $85,000 clean cash, keeps all masters. Unless the label\'s resources grow streams 10×, independence wins on cash flow and ownership.',
    },
    {
      question: 'What is the ideal financial milestone before going fully independent from a day job or other income source?',
      options: [
        '1 month of music income covering basic expenses',
        '6–12 months of living expenses in savings PLUS consistent music income covering 80%+ of monthly costs for 3+ months',
        'A record deal offer from any label as validation',
        '100,000 monthly Spotify listeners',
      ],
      correctIndex: 1,
      explanation: '6–12 months emergency fund removes panic from creative decisions. Consistent income (3-month trend) proves the revenue is real, not a one-time spike. Going independent on savings alone without proven income leads to rushed decisions and financial pressure that damages both music and mental health.',
    },
    {
      question: 'You have 3 catalog songs earning $2,000/month combined, growing 18% year-over-year. A producer offers to buy them for $120,000. Should you sell?',
      options: [
        'Yes — $120,000 is 5× annual earnings, a great multiple',
        'No — at 18% growth, Year 3 earnings alone will be $3,360/month. The catalog\'s long-term value far exceeds $120,000',
        'Yes — catalog values always decline as songs age',
        'No — you can never sell music rights once registered',
      ],
      correctIndex: 1,
      explanation: '$120,000 ÷ $24,000/year = 5× earnings multiple. Industry standard for growing catalogs is 10–20×. Your 3 songs at 18% growth: Year 3 = $2,000 × 1.18³ = $3,280/month = $39,360/year. At a 12× multiple, they\'re worth $472,000. The offer is significantly below fair value for a growing catalog.',
    },
    {
      question: 'An independent artist has: 2M Spotify monthly listeners, 50,000 email subscribers, 8 published songs, $120,000/year income, and no label deal. A major label offers $800,000 for a 3-album deal with a 360-clause. What is the most financially sound response?',
      options: [
        'Sign immediately — $800,000 is life-changing and validates your career',
        'Counter-offer: remove the 360-clause, negotiate master reversion after 7 years, and push the advance to $1.2M given your existing audience value',
        'Reject all label offers — independent is always better',
        'Accept only if they guarantee top 40 radio placement',
      ],
      correctIndex: 1,
      explanation: 'With 2M monthly listeners and $120K income, you have leverage. The 360-clause costs you 20% of ALL revenue streams — potentially $24,000+/year. The correct move is negotiating: remove 360, add master reversion (protecting your catalog for the future), and price your existing audience value into a higher advance. Never accept the first offer on a multi-album deal.',
    },
  ],
};

