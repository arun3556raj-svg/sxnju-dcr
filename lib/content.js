// ============================================================
// content.js — Single source of truth for Sxnju DCR portfolio
// Ported verbatim from the legacy static site (no content lost).
// Swap `src` with real reel mp4s when available.
// ============================================================

// Placeholder sample loop (matches legacy). Replace per reel later.
const SAMPLE = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';

export const PROFILE = {
  name: 'Sxnju DCR',
  handle: '@sxnju_dcr',
  role: 'Filmmaker · Digital Creator · Hyderabad',
  tagline:
    'Every frame, cinematic. Car deliveries, housewarmings, weddings, festivals, birthdays & events — shot and cut across Hyderabad.',
  instagram: 'https://www.instagram.com/sxnju_dcr',
  dm: 'https://ig.me/m/sxnju_dcr',
  threads: 'https://www.threads.net/@sxnju_dcr',
  stats: [
    { num: 57, suffix: 'K', label: 'Followers' },
    { num: 634, suffix: '', label: 'Posts' },
    { num: 120, suffix: '+', label: 'Shoots' },
  ],
};

export const REELS = [
  { id: 'r01', code: 'SC ०१', ratio: '9:16', title: 'Latest Reel',    cat: 'Reel',   href: 'https://www.instagram.com/reel/DZxQUAuJqCe/', src: SAMPLE },
  { id: 'r02', code: 'SC ०२', ratio: '9:16', title: 'Car Reveal',     cat: 'Auto',   href: 'https://www.instagram.com/reel/DZnC9wjJBDD/', src: SAMPLE },
  { id: 'r03', code: 'SC ०३', ratio: '4:5',  title: 'Photo Post',     cat: 'Photo',  href: 'https://www.instagram.com/p/DZmzLqtiSim/',     src: SAMPLE },
  { id: 'r04', code: 'SC ०४', ratio: '9:16', title: 'Housewarming',   cat: 'Event',  href: 'https://www.instagram.com/reel/DZgu9CLJ0Yp/', src: SAMPLE },
  { id: 'r05', code: 'SC ०५', ratio: '9:16', title: 'Event Coverage', cat: 'Event',  href: 'https://www.instagram.com/reel/DZfLs4TpldE/', src: SAMPLE },
  { id: 'r06', code: 'SC ०६', ratio: '9:16', title: 'Street Style',   cat: 'Reel',   href: 'https://www.instagram.com/sxnju_dcr/reel/DZcqMctpK5U/', src: SAMPLE },
  { id: 'r07', code: 'SC ०७', ratio: '9:16', title: 'Night Shoot',    cat: 'Reel',   href: 'https://www.instagram.com/sxnju_dcr/reel/DZcOOXrpTKH/', src: SAMPLE },
  { id: 'r08', code: 'SC ०८', ratio: '9:16', title: 'Birthday Film',  cat: 'Event',  href: 'https://www.instagram.com/sxnju_dcr/reel/DZaGVCKp2yi/', src: SAMPLE },
  { id: 'r09', code: 'SC ०९', ratio: '9:16', title: 'Solo Portrait',  cat: 'Solo',   href: 'https://www.instagram.com/sxnju_dcr/reel/DZXjRE4J3Z1/', src: SAMPLE },
  { id: 'r10', code: 'SC १०', ratio: '9:16', title: 'Brand Reel',     cat: 'Brand',  href: 'https://www.instagram.com/sxnju_dcr/reel/DZU8pXVJyEO/', src: SAMPLE },
];

export const BRAND_POINTS = [
  'Instagram reels shot, edited and posted to 57K followers',
  'Product & venue shoots with usage rights on request',
  'Wedding & event coverage with same-week highlight delivery',
  'Festival & cultural films — Diwali, Bonalu, Bathukamma',
  'One point of contact from brief to final cut',
];

export const BRAND_STATS = [
  { num: 57, suffix: 'K', label: 'Engaged Followers' },
  { num: 634, suffix: '', label: 'Posts Published' },
  { text: 'Minutes', label: 'DM Reply Time' },
];

export const SERVICES = [
  { no: '०१', name: 'Car Deliveries',     desc: 'Your new car deserves a launch film. Showroom to street, shot like a commercial.' },
  { no: '०२', name: 'Housewarmings',      desc: 'The first day in your new home, captured warm and cinematic.' },
  { no: '०३', name: 'Weddings',           desc: 'From the haldi to the vidaai — every ritual filmed like a feature.' },
  { no: '०४', name: 'Festivals & Events', desc: 'Diwali, Bonalu, Bathukamma — full coverage with highlight reels included.' },
  { no: '०५', name: 'Birthdays',          desc: "Small parties to big celebrations — moments you'll rewatch for years." },
  { no: '०६', name: 'Solo & Reels',       desc: 'Concept, direction, shoot and edit. Reels built to perform on Instagram.' },
];

export const PACKAGES = [
  {
    cat: 'Reels', name: 'Solo Reel', feat: false,
    blurb: 'A single scroll-stopping reel — concept, shoot and edit, made for the feed.',
    price: 'DM for rates',
    list: ['Concept + direction', 'Up to 2 hrs shoot', '1 finished reel (9:16)', 'Colour grade + music', '1 revision round'],
  },
  {
    cat: 'Events', name: 'Event Coverage', feat: true,
    blurb: 'Full-day coverage of your delivery, housewarming, wedding or birthday with a same-week edit.',
    price: 'DM for rates',
    list: ['Up to 6 hrs on location', 'Highlight reel + teaser', 'Edited photo selects', 'Same-week delivery', 'Story-ready cutdowns'],
  },
  {
    cat: 'Brands', name: 'Paid Promotion', feat: false,
    blurb: 'A branded reel posted to his 57K Hyderabad audience, with a full story set.',
    price: 'DM for rates',
    list: ['Branded reel to 57K', 'Concept built around the brief', 'Story set + mention', 'Usage rights on request', 'Performance recap'],
  },
];

export const MARQUEE = [
  'Car Deliveries', 'Housewarmings', 'Weddings', 'Festivals', 'Birthdays',
  'Events', 'Solo Shoots', 'Reels', 'Paid Promotions',
];
