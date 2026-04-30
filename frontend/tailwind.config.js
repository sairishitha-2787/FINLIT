/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neo-Brutalist Palette (Dashboard)
        'brutal-bg': '#F4F4F0',
        'brutal-blue': '#3352FF',
        'brutal-pink': '#FF90E8',
        'brutal-green': '#70FFCA',
        'brutal-black': '#000000',
        'brutal-white': '#FFFFFF',
        // Cosmic palette (Onboarding & Landing)
        'cosmic-navy': '#0a0e27',
        'cosmic-deep': '#0f1135',
        'cosmic-violet': '#1a1050',
        'cosmic-purple': '#6c3ce0',
        'cosmic-indigo': '#4f46e5',
        'cosmic-blue': '#3b82f6',
        'cosmic-cyan': '#22d3ee',
        'cosmic-pink': '#ec4899',
        'cosmic-glow': '#a78bfa',
        'cosmic-white': '#e8e1ff',
        // Legacy
        primary: '#3352FF',
        secondary: '#FF90E8',
        accent: '#70FFCA',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'brutal': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '12px 12px 0px 0px rgba(0,0,0,1)',
        'brutal-hover': '6px 6px 0px 0px rgba(0,0,0,1)',
        'cosmic': '0 0 30px rgba(108, 60, 224, 0.3)',
        'cosmic-lg': '0 0 60px rgba(108, 60, 224, 0.4)',
        'cosmic-glow': '0 0 20px rgba(167, 139, 250, 0.5)',
        'cosmic-pink': '0 0 30px rgba(236, 72, 153, 0.3)',
        'neon': '0 0 5px rgba(167, 139, 250, 0.5), 0 0 20px rgba(167, 139, 250, 0.3), 0 0 40px rgba(167, 139, 250, 0.1)',
      },
      animation: {
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'pop-in': 'popIn 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 1s infinite',
        'pulse-xp': 'pulseXP 0.5s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
      },
      keyframes: {
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseXP: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(167, 139, 250, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(167, 139, 250, 0.6)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
