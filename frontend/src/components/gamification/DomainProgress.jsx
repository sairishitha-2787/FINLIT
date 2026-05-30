// DomainProgress — routes to the correct gamification component based on domain

import React from 'react';
import GamingProgress   from './GamingProgress';
import FashionProgress  from './FashionProgress';
import SportsProgress   from './SportsProgress';
import MusicProgress    from './MusicProgress';

const DOMAIN_MAP = {
  gaming:   GamingProgress,
  fashion:  FashionProgress,
  sports:   SportsProgress,
  music:    MusicProgress,
};

function normalizeDomain(domain = '') {
  const d = domain.toLowerCase().trim();
  const ALIASES = {
    'video games': 'gaming', 'videogames': 'gaming', 'games': 'gaming',
    'clothes': 'fashion', 'clothing': 'fashion',
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
