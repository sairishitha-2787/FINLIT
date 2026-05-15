import React from 'react';
import { glass } from '../../styles/coreTheme';

const GlassCard = ({ children, className = '', large = false }) => (
  <div className={`${large ? glass.cardLg : glass.card} ${className}`}>
    {children}
  </div>
);

export default GlassCard;
