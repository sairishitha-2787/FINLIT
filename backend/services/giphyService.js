// FINLIT - Giphy Service
// Domain-themed GIF queries with finance fallback

const axios = require('axios');

const GIPHY_API_KEY  = process.env.GIPHY_API_KEY;
const GIPHY_BASE_URL = 'https://api.giphy.com/v1/gifs';

// Domain-specific query lists, ordered: preferred → finance fallback
const QUERIES = {
  gaming: {
    correct:   ['video game victory', 'cyberpunk celebration', 'gaming win', 'neon celebration', 'money celebration'],
    incorrect: ['video game retry', 'gaming fail funny', 'try again gamer', 'keep trying', 'financial motivation'],
  },
  fashion: {
    correct:   ['runway celebration', 'fashion victory', 'style icon fabulous', 'fashion show success', 'money celebration'],
    incorrect: ['fashion lesson', 'style advice', 'fashion retry', 'keep going fabulous', 'financial growth'],
  },
  sports: {
    correct:   ['sports celebration victory', 'athlete winning', 'champion celebration', 'sports victory', 'money celebration'],
    incorrect: ['sports motivation comeback', 'athlete training', 'keep pushing sports', 'sports resilience', 'financial resilience'],
  },
  // generic fallback if domain unrecognised
  default: {
    correct:   ['money celebration', 'winning money', 'success celebration', 'cash rain', 'dollar bills'],
    incorrect: ['keep going', 'try again', 'empty wallet', 'broke funny', 'financial comeback'],
  },
};

const FALLBACK_GIFS = {
  correct: {
    url:   'https://media.giphy.com/media/67ThRZlYBvibtdF9JH/giphy.gif',
    title: 'Money Rain',
  },
  wrong: {
    url:   'https://media.giphy.com/media/l2SpZtackEqFmMT3G/giphy.gif',
    title: 'Keep Trying',
  },
};

async function searchGiphy(query) {
  const response = await axios.get(`${GIPHY_BASE_URL}/search`, {
    params: { api_key: GIPHY_API_KEY, q: query, limit: 10, rating: 'g', lang: 'en' },
  });
  const items = response.data?.data;
  if (!items?.length) return null;
  const pick = items[Math.floor(Math.random() * items.length)];
  return {
    url:     pick.images.original.url,
    preview: pick.images.preview_gif?.url,
    title:   pick.title,
    width:   pick.images.original.width,
    height:  pick.images.original.height,
  };
}

async function fetchDomainGif(domain, type) {
  const domainKey = QUERIES[domain] ? domain : 'default';
  const queries   = QUERIES[domainKey][type]; // e.g. ['video game victory', ...]

  for (const query of queries) {
    try {
      const gif = await searchGiphy(query);
      if (gif) return { success: true, gif };
    } catch (_) {
      // try next query
    }
  }

  // All queries failed — return hardcoded fallback
  return { success: true, gif: type === 'correct' ? FALLBACK_GIFS.correct : FALLBACK_GIFS.wrong };
}

async function getCorrectGif(domain = 'default') {
  return fetchDomainGif(domain, 'correct');
}

async function getWrongGif(domain = 'default') {
  return fetchDomainGif(domain, 'incorrect');
}

async function getCelebrationGif() {
  return fetchDomainGif('default', 'correct');
}

module.exports = { getCorrectGif, getWrongGif, getCelebrationGif };
