// FINLIT — Domain Icon & Personality Config (Frontend)
// Maps each domain to its visual identity and FINN personality data.
// Icons are Lucide React components (no emojis).

import {
  Gamepad2, Sparkles, Award, Film, ChefHat, Music,
  Trophy, Target, Star, Crown, Shield, Flame, Utensils,
  Zap, Camera, Heart, TrendingUp, Brain,
} from 'lucide-react';

// ── Icon name → component lookup (for dynamic icon loading) ──────────────────
const ICON_LOOKUP = {
  Gamepad2, Sparkles, Award, Film, ChefHat, Music,
  Trophy, Target, Star, Crown, Shield, Flame, Utensils,
  Zap, Camera, Heart, TrendingUp, Brain,
};

export function getIconComponent(name) {
  return ICON_LOOKUP[name] || Brain;
}

// ── Domain icon sets (string keys for portability) ───────────────────────────
export const domainIcons = {
  gaming: {
    primary: 'Gamepad2',
    success: 'Trophy',
    learning: 'Zap',
    challenge: 'Target',
    progress: 'TrendingUp',
  },
  fashion: {
    primary: 'Sparkles',
    success: 'Crown',
    learning: 'Star',
    challenge: 'Sparkles',
    progress: 'TrendingUp',
  },
  sports: {
    primary: 'Award',
    success: 'Trophy',
    learning: 'Target',
    challenge: 'Shield',
    progress: 'TrendingUp',
  },
  movies: {
    primary: 'Film',
    success: 'Star',
    learning: 'Camera',
    challenge: 'Award',
    progress: 'TrendingUp',
  },
  food: {
    primary: 'ChefHat',
    success: 'Star',
    learning: 'Utensils',
    challenge: 'Flame',
    progress: 'TrendingUp',
  },
  music: {
    primary: 'Music',
    success: 'Award',
    learning: 'Heart',
    challenge: 'Sparkles',
    progress: 'TrendingUp',
  },
};

// ── Full domain personality (UI-facing: icons, colors, greetings, errors) ────
const DOMAIN_PERSONALITY = {
  gaming: {
    primaryIconComponent: Gamepad2,
    animation: 'flash',
    headerBg: 'bg-brutal-green',
    headerText: 'text-brutal-black',
    fabBg: 'bg-brutal-green',
    tagline: 'gaming specialist · your financial buddy',
    greetings: [
      (name) => `Yo ${name}! Ready to grind some financial XP?`,
      (name) => `What's good ${name}! Time to level up your wallet stats.`,
      (name) => `GG being back ${name}! What boss are we taking down?`,
      (name) => `Alright ${name}, let's power up your money game!`,
    ],
    errorMessage: () => "Oof, server lag on my end. Give it a sec and we'll respawn.",
  },
  fashion: {
    primaryIconComponent: Sparkles,
    animation: 'pulse',
    headerBg: 'bg-brutal-pink',
    headerText: 'text-brutal-black',
    fabBg: 'bg-brutal-pink',
    tagline: 'fashion specialist · your style curator',
    greetings: [
      (name) => `Darling ${name}! Ready to curate your financial style?`,
      (name) => `Welcome back ${name}. Let's build something timeless.`,
      (name) => `Lovely timing ${name}! Your financial wardrobe awaits.`,
      (name) => `${name}! Let's elevate your money game today.`,
    ],
    errorMessage: () => "Oh dear, a wardrobe malfunction on my end! Just a moment.",
  },
  sports: {
    primaryIconComponent: Award,
    animation: 'bounce',
    headerBg: 'bg-brutal-blue',
    headerText: 'text-brutal-white',
    fabBg: 'bg-brutal-blue',
    tagline: 'sports specialist · your head coach',
    greetings: [
      (name) => `Coach is in! ${name}, ready to build your championship strategy?`,
      (name) => `Alright ${name}, let's go. What are we working on today?`,
      (name) => `${name}! Championship-level thinking starts now.`,
      (name) => `Film session time ${name}. Let's break down your gameplan.`,
    ],
    errorMessage: () => "Technical timeout! Equipment issue on my end. Back in a second.",
  },
  movies: {
    primaryIconComponent: Film,
    animation: 'wiggle',
    headerBg: 'bg-brutal-black',
    headerText: 'text-brutal-green',
    fabBg: 'bg-brutal-black',
    tagline: 'film specialist · your creative director',
    greetings: [
      (name) => `Action! ${name}, ready to direct your financial story?`,
      (name) => `${name}! Your financial screenplay is waiting.`,
      (name) => `Lights, camera — ${name}! Let's craft your next chapter.`,
      (name) => `The director is in! ${name}, what's today's scene?`,
    ],
    errorMessage: () => "Cut! Technical difficulties on set. Stand by while we reset.",
  },
  food: {
    primaryIconComponent: ChefHat,
    animation: 'flicker',
    headerBg: 'bg-brutal-green',
    headerText: 'text-brutal-black',
    fabBg: 'bg-brutal-green',
    tagline: 'culinary specialist · your head chef',
    greetings: [
      (name) => `Chef ${name}! Ready to master your financial kitchen?`,
      (name) => `Welcome to the kitchen ${name}. What are we perfecting?`,
      (name) => `${name}! Your mise en place is ready. Time to elevate.`,
      (name) => `Good timing ${name}! Let's get the fundamentals dialed in.`,
    ],
    errorMessage: () => "Kitchen incident on my end! Just grabbing a fresh ingredient. One moment.",
  },
  music: {
    primaryIconComponent: Music,
    animation: 'float',
    headerBg: 'bg-brutal-blue',
    headerText: 'text-brutal-white',
    fabBg: 'bg-brutal-blue',
    tagline: 'music specialist · your maestro',
    greetings: [
      (name) => `Maestro ${name}! Ready to compose your financial symphony?`,
      (name) => `${name}! Take your position — your score awaits.`,
      (name) => `The orchestra is assembled ${name}. What are we perfecting?`,
      (name) => `Welcome back ${name}. Let's rehearse and find our rhythm.`,
    ],
    errorMessage: () => "Tuning issue on my end! Give me a moment to adjust and we'll resume.",
  },
};

const DOMAIN_ALIASES = {
  'video games': 'gaming', videogames: 'gaming', games: 'gaming',
  clothes: 'fashion', clothing: 'fashion', style: 'fashion',
  athletics: 'sports', fitness: 'sports',
  cooking: 'food', culinary: 'food',
  film: 'movies', cinema: 'movies',
};

export function normalizeDomain(domain = '') {
  const key = domain.toLowerCase().trim();
  return DOMAIN_ALIASES[key] || (DOMAIN_PERSONALITY[key] ? key : 'gaming');
}

export function getDomainPersonality(domain) {
  return DOMAIN_PERSONALITY[normalizeDomain(domain)] || DOMAIN_PERSONALITY.gaming;
}

export function getDomainGreeting(domain, name, completedCount = 0) {
  const p = getDomainPersonality(domain);
  const idx = (completedCount + new Date().getDate()) % p.greetings.length;
  return p.greetings[idx](name || 'there');
}

export function getDomainError(domain) {
  return getDomainPersonality(domain).errorMessage();
}

export default DOMAIN_PERSONALITY;
