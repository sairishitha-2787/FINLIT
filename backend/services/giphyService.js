// FINLIT - Giphy Service
// Fetches animated GIFs for quiz feedback

const axios = require('axios');

const GIPHY_API_KEY = process.env.GIPHY_API_KEY;
const GIPHY_BASE_URL = 'https://api.giphy.com/v1/gifs';

// Fallback GIFs in case API fails
const fallbackGifs = {
  correct: {
    url: 'https://media.giphy.com/media/67ThRZlYBvibtdF9JH/giphy.gif',
    preview: 'https://media.giphy.com/media/67ThRZlYBvibtdF9JH/200w.gif',
    title: 'Money Rain'
  },
  wrong: {
    url: 'https://media.giphy.com/media/l2SpZtackEqFmMT3G/giphy.gif',
    preview: 'https://media.giphy.com/media/l2SpZtackEqFmMT3G/200w.gif',
    title: 'Keep Trying'
  }
};

// Get random GIF for correct answer
async function getCorrectGif() {
  try {
    const searchTerms = [
      'money celebration',
      'cash rain',
      'winning money',
      'success money',
      'dollar bills',
      'making it rain money',
      'rich success'
    ];

    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

    const response = await axios.get(`${GIPHY_BASE_URL}/search`, {
      params: {
        api_key: GIPHY_API_KEY,
        q: randomTerm,
        limit: 10,
        rating: 'g',
        lang: 'en'
      }
    });

    if (response.data.data && response.data.data.length > 0) {
      // Pick a random GIF from results
      const randomIndex = Math.floor(Math.random() * response.data.data.length);
      const gif = response.data.data[randomIndex];

      return {
        success: true,
        gif: {
          url: gif.images.original.url,
          preview: gif.images.preview_gif.url,
          title: gif.title,
          width: gif.images.original.width,
          height: gif.images.original.height
        }
      };
    }

    // Return fallback if no results
    return {
      success: true,
      gif: fallbackGifs.correct
    };

  } catch (error) {
    console.error('Giphy correct GIF error:', error.message);
    return {
      success: true,
      gif: fallbackGifs.correct
    };
  }
}

// Get random GIF for wrong answer
async function getWrongGif() {
  try {
    const searchTerms = [
      'money falling',
      'broke no money',
      'empty wallet',
      'sad money',
      'poor empty pockets',
      'coins falling'
    ];

    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

    const response = await axios.get(`${GIPHY_BASE_URL}/search`, {
      params: {
        api_key: GIPHY_API_KEY,
        q: randomTerm,
        limit: 10,
        rating: 'g',
        lang: 'en'
      }
    });

    if (response.data.data && response.data.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * response.data.data.length);
      const gif = response.data.data[randomIndex];

      return {
        success: true,
        gif: {
          url: gif.images.original.url,
          preview: gif.images.preview_gif.url,
          title: gif.title,
          width: gif.images.original.width,
          height: gif.images.original.height
        }
      };
    }

    return {
      success: true,
      gif: fallbackGifs.wrong
    };

  } catch (error) {
    console.error('Giphy wrong GIF error:', error.message);
    return {
      success: true,
      gif: fallbackGifs.wrong
    };
  }
}

// Get celebration GIF for quiz completion
async function getCelebrationGif() {
  try {
    const response = await axios.get(`${GIPHY_BASE_URL}/search`, {
      params: {
        api_key: GIPHY_API_KEY,
        q: 'celebration success',
        limit: 10,
        rating: 'g',
        lang: 'en'
      }
    });

    if (response.data.data && response.data.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * response.data.data.length);
      const gif = response.data.data[randomIndex];

      return {
        success: true,
        gif: {
          url: gif.images.original.url,
          preview: gif.images.preview_gif.url,
          title: gif.title
        }
      };
    }

    return {
      success: true,
      gif: fallbackGifs.correct
    };

  } catch (error) {
    console.error('Giphy celebration GIF error:', error.message);
    return {
      success: true,
      gif: fallbackGifs.correct
    };
  }
}

module.exports = {
  getCorrectGif,
  getWrongGif,
  getCelebrationGif
};
