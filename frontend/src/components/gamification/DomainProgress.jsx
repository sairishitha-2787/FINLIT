// DomainProgress — routes to the correct gamification component based on domain

import React from 'react';
import GamingProgress   from './GamingProgress';
import FashionProgress  from './FashionProgress';
import SportsProgress   from './SportsProgress';
import MoviesProgress   from './MoviesProgress';
import FoodProgress     from './FoodProgress';
import MusicProgress    from './MusicProgress';

const DOMAIN_MAP = {
  gaming:   GamingProgress,
  fashion:  FashionProgress,
  sports:   SportsProgress,
  movies:   MoviesProgress,
  food:     FoodProgress,
  music:    MusicProgress,
};

// Normalize aliases so 'video games' → gaming, etc.
function normalizeDomain(domain = '') {
  const d = domain.toLowerCase().trim();
  const ALIASES = {
    'video games': 'gaming', 'videogames': 'gaming', 'games': 'gaming',
    'clothes': 'fashion', 'clothing': 'fashion',
    'film': 'movies', 'cinema': 'movies',
    'cooking': 'food', 'cuisine': 'food',
    'exercise': 'sports', 'fitness': 'sports',
    'songs': 'music', 'song': 'music',
  };
  return ALIASES[d] || d;
}

const DomainProgress = ({ domain, completedTopics = [] }) => {
  const key = normalizeDomain(domain);
  const Component = DOMAIN_MAP[key];
  if (!Component) return null;
  return <Component completedTopics={completedTopics} />;
};

export default DomainProgress;
