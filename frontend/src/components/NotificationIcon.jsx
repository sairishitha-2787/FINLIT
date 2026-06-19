// Maps a notification `type` to a lucide icon (replacing the old emoji icons).
// Driven by type, not the stored emoji string, so existing rows render too.

import React from 'react';
import { Bell, Target, Award, Flame, TrendingUp, Zap } from 'lucide-react';

const TYPE_ICON = {
  quiz_complete:    Target,
  badge_earned:     Award,
  streak_milestone: Flame,
  level_up:         TrendingUp,
  daily_challenge:  Zap,
};

export default function NotificationIcon({ type, size = 16, color = 'currentColor' }) {
  const Icon = TYPE_ICON[type] || Bell;
  return <Icon size={size} color={color} strokeWidth={2} />;
}
